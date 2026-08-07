import { NextResponse } from "next/server";
import { createPost, findPostBySlug, listPosts, updatePost } from "../../../../db/posts";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../admin-auth";
import { validatePostInput } from "../post-input";

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
    const deleted = await findPostBySlug(result.data.slug);
    if (deleted && deleted.status !== "deleted") return NextResponse.json({ message: "This slug already exists." }, { status: 409 });
    const values = { ...result.data, author: "Admin", createdAt: now, updatedAt: now, publishedAt: result.data.status === "published" ? now : null };
    const post = deleted ? await updatePost(deleted.id, values) : await createPost(values);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: String(error).includes("UNIQUE") ? "This slug already exists." : "Could not create the post." }, { status: 409 });
  }
}
