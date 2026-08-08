import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../admin-auth";

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif", "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" };

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "Choose an image or video file." }, { status: 400 });
  const isImage = imageTypes.has(file.type); const isVideo = videoTypes.has(file.type);
  if (!isImage && !isVideo) return NextResponse.json({ message: "Unsupported file type." }, { status: 415 });
  const limit = isImage ? 15 * 1024 * 1024 : 100 * 1024 * 1024;
  if (file.size > limit) return NextResponse.json({ message: isImage ? "Images must be 15 MB or smaller." : "Videos must be 100 MB or smaller." }, { status: 413 });
  const date = new Date(); const key = `uploads/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${extensions[file.type]}`;
  const bucket = (env as unknown as { MEDIA: R2Bucket }).MEDIA;
  await bucket.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" }, customMetadata: { originalName: file.name.slice(0, 200) } });
  return NextResponse.json({ url: `${new URL(request.url).origin}/media/${key}`, kind: isImage ? "image" : "video" });
}
