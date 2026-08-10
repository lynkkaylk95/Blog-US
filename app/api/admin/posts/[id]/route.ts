import { NextResponse } from "next/server";
import { deletePost, findPostById, listPosts, moveSeriesPart, updatePost } from "../../../../../db/posts";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../../admin-auth";
import { validatePostInput } from "../../post-input";
import { normalizeSeriesTitle } from "../../../../series";

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
    let data = result.data;
    if (data.seriesTitle) {
      const seriesKey = normalizeSeriesTitle(data.seriesTitle);
      const existingParts = (await listPosts()).filter((post) => post.id !== id && post.seriesTitle && normalizeSeriesTitle(post.seriesTitle) === seriesKey);
      const canonicalTitle = existingParts[0]?.seriesTitle;
      if (canonicalTitle) data = { ...data, seriesTitle: canonicalTitle };
      const sameSeries = Boolean(existing.seriesTitle && normalizeSeriesTitle(existing.seriesTitle) === seriesKey);
      if (sameSeries && existing.partNumber && data.partNumber !== existing.partNumber) {
        const maxPosition = existingParts.length + 1;
        if ((data.partNumber || 0) > maxPosition) return NextResponse.json({ message: `Part number must be between 1 and ${maxPosition}.` }, { status: 400 });
        await moveSeriesPart(id, canonicalTitle || data.seriesTitle || existing.seriesTitle || "", existing.partNumber, data.partNumber || 1);
      } else if (existingParts.some((post) => post.partNumber === data.partNumber)) return NextResponse.json({ message: `Part ${data.partNumber} already exists in this series.` }, { status: 409 });
    }
    const post = await updatePost(id, { ...data, updatedAt: now, publishedAt: data.status === "published" ? existing.publishedAt ?? now : null });
    return NextResponse.json({ post });
  } catch (error) {
    const detail = String(error);
    const message = detail.includes("UNIQUE") ? "This slug already exists." : detail.includes("categories") && detail.includes("column") ? "The database needs the latest category migration before this post can be updated." : "Could not update the post.";
    return NextResponse.json({ message }, { status: 409 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const post = await deletePost(Number((await params).id));
  return post ? NextResponse.json({ ok: true }) : NextResponse.json({ message: "Post not found." }, { status: 404 });
}
