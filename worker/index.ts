/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const uploadTypes: Record<string, { extension: string; limit: number; kind: "image" | "video" }> = {
  "image/jpeg": { extension: "jpg", limit: 15 * 1024 * 1024, kind: "image" }, "image/png": { extension: "png", limit: 15 * 1024 * 1024, kind: "image" }, "image/webp": { extension: "webp", limit: 15 * 1024 * 1024, kind: "image" }, "image/gif": { extension: "gif", limit: 15 * 1024 * 1024, kind: "image" }, "image/avif": { extension: "avif", limit: 15 * 1024 * 1024, kind: "image" },
  "video/mp4": { extension: "mp4", limit: 75 * 1024 * 1024, kind: "video" }, "video/webm": { extension: "webm", limit: 75 * 1024 * 1024, kind: "video" }, "video/quicktime": { extension: "mov", limit: 75 * 1024 * 1024, kind: "video" },
};

function base64Url(bytes: Uint8Array) { let value = ""; for (const byte of bytes) value += String.fromCharCode(byte); return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
async function validAdminCookie(request: Request, secret: string | undefined) {
  if (!secret) return false; const cookie = request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith("porchlight_admin="))?.slice("porchlight_admin=".length); if (!cookie) return false;
  const [expires, supplied] = cookie.split("."); if (!expires || !supplied || Number(expires) < Date.now()) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); const signature = base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(expires))));
  return signature === supplied;
}

async function uploadMedia(request: Request, env: Env) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ message: "Invalid request origin." }, { status: 403 });
  if (!await validAdminCookie(request, (env as unknown as { ADMIN_SESSION_SECRET?: string }).ADMIN_SESSION_SECRET)) return Response.json({ message: "Unauthorized." }, { status: 401 });
  const declaredSize = Number(request.headers.get("content-length") || 0); if (declaredSize > 76 * 1024 * 1024) return Response.json({ message: "Upload is too large." }, { status: 413 });
  const data = await request.formData(); const file = data.get("file"); if (!(file instanceof File)) return Response.json({ message: "Choose an image or video file." }, { status: 400 });
  const rule = uploadTypes[file.type]; if (!rule) return Response.json({ message: "Unsupported file type." }, { status: 415 }); if (file.size > rule.limit) return Response.json({ message: `${rule.kind === "image" ? "Images" : "Videos"} must be ${rule.limit / 1024 / 1024} MB or smaller.` }, { status: 413 });
  const date = new Date(); const key = `uploads/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${rule.extension}`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" }, customMetadata: { originalName: file.name.slice(0, 200) } });
  return Response.json({ url: `${new URL(request.url).origin}/media/${key}`, kind: rule.kind });
}

async function serveMedia(request: Request, env: Env, pathname: string) {
  const key = decodeURIComponent(pathname.slice("/media/".length)); if (!key.startsWith("uploads/") || key.includes("..")) return new Response("Not found", { status: 404 });
  const rangeHeader = request.headers.get("range"); const object = await env.MEDIA.get(key, rangeHeader ? { range: request.headers } : undefined); if (!object) return new Response("Not found", { status: 404 }); const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("etag", object.httpEtag); headers.set("x-content-type-options", "nosniff"); headers.set("accept-ranges", "bytes");
  if (rangeHeader && "range" in object && object.range) { const range = object.range as { offset: number; length: number }; headers.set("content-range", `bytes ${range.offset}-${range.offset + range.length - 1}/${object.size}`); headers.set("content-length", String(range.length)); return new Response(object.body, { status: 206, headers }); }
  headers.set("content-length", String(object.size)); return new Response(object.body, { headers });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/admin/upload" && request.method === "POST") return uploadMedia(request, env);
    if (url.pathname.startsWith("/media/") && request.method === "GET") return serveMedia(request, env, url.pathname);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
