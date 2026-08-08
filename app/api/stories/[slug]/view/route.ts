import { NextResponse } from "next/server";
import { findPostBySlug, incrementPostViews } from "../../../../../db/posts";

export async function POST(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await findPostBySlug(slug);
  if (!post || post.status !== "published") return NextResponse.json({ message: "Story not found." }, { status: 404 });
  const views = await incrementPostViews(slug);
  return NextResponse.json({ views }, { headers: { "cache-control": "no-store" } });
}
