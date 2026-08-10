import { NextResponse } from "next/server";
import { createPost, findPostBySlug, listPosts, shiftSeriesParts, updatePost } from "../../../../db/posts";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../admin-auth";
import { validatePostInput } from "../post-input";
import { normalizeSeriesTitle } from "../../../series";

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try { return NextResponse.json({ posts: await listPosts() }); }
  catch { return NextResponse.json({ message: "Database is unavailable. Apply the D1 migration first." }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const result = validatePostInput(await request.json().catch(() => null));
  if (!result.data) return NextResponse.json({ message: result.message }, { status: 400 });
  const now = new Date().toISOString();
  try {
    let data = result.data;
    if (data.seriesTitle) {
      const seriesKey = normalizeSeriesTitle(data.seriesTitle);
      const existingParts = (await listPosts()).filter((post) => post.seriesTitle && normalizeSeriesTitle(post.seriesTitle) === seriesKey);
      const canonicalTitle = existingParts[0]?.seriesTitle;
      if (canonicalTitle) data = { ...data, seriesTitle: canonicalTitle };
      if (existingParts.some((post) => post.partNumber === data.partNumber)) await shiftSeriesParts(canonicalTitle || data.seriesTitle || "", data.partNumber || 1);
    }
    const deleted = await findPostBySlug(data.slug);
    if (deleted && deleted.status !== "deleted") return NextResponse.json({ message: "This slug already exists." }, { status: 409 });
    const values = { ...data, createdAt: now, updatedAt: now, publishedAt: data.status === "published" ? now : null };
    const post = deleted ? await updatePost(deleted.id, values) : await createPost(values);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: String(error).includes("UNIQUE") ? "This slug already exists." : "Could not create the post." }, { status: 409 });
  }
}
