import { env } from "cloudflare:workers";

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params; const key = path.join("/");
  if (!key.startsWith("uploads/") || key.includes("..")) return new Response("Not found", { status: 404 });
  const rangeHeader = request.headers.get("range");
  const object = await (env as unknown as { MEDIA: R2Bucket }).MEDIA.get(key, rangeHeader ? { range: request.headers } : undefined);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("etag", object.httpEtag); headers.set("x-content-type-options", "nosniff");
  if (rangeHeader && "range" in object && object.range) {
    const range = object.range as { offset: number; length: number };
    headers.set("content-range", `bytes ${range.offset}-${range.offset + range.length - 1}/${object.size}`); headers.set("content-length", String(range.length)); headers.set("accept-ranges", "bytes");
    return new Response(object.body, { status: 206, headers });
  }
  headers.set("content-length", String(object.size)); headers.set("accept-ranges", "bytes");
  return new Response(object.body, { headers });
}
