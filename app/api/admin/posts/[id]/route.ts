import { NextResponse } from "next/server";
import { deletePost, findPostById, updatePost } from "../../../../../db/posts";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../../admin-auth";
import { validatePostInput } from "../../post-input";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteProps) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  const post = await findPostById(Number((await params).id));
  return post ? NextResponse.json({ post }) : NextResponse.json({ message: "Post not found." }, { status: 404 });
}

export async function PUT(request: Request, { params }: RouteProps) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const id = Number((await params).id);
  const existing = await findPostById(id);
  if (!existing) return NextResponse.json({ message: "Post not found." }, { status: 404 });
  const result = validatePostInput(await request.json().catch(() => null));
  if (!result.data) return NextResponse.json({ message: result.message }, { status: 400 });
  const now = new Date().toISOString();
  try {
    const post = await updatePost(id, { ...result.data, updatedAt: now, publishedAt: result.data.status === "published" ? existing.publishedAt ?? now : null });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ message: String(error).includes("UNIQUE") ? "This slug already exists." : "Could not update the post." }, { status: 409 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const post = await deletePost(Number((await params).id));
  return post ? NextResponse.json({ ok: true }) : NextResponse.json({ message: "Post not found." }, { status: 404 });
}
