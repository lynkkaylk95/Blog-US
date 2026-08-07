import { NextResponse } from "next/server";
import { stories } from "../../../content";
import { createPost, findPostBySlug } from "../../../../db/posts";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../admin-auth";

function escapeHtml(value: string) { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

export async function POST() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  let imported = 0;
  for (const story of stories) {
    if (await findPostBySlug(story.slug)) continue;
    const contentHtml = story.chapters.map((chapter) => `<h2>${escapeHtml(chapter.title)}</h2>${chapter.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}`).join("");
    await createPost({ slug: story.slug, title: story.title, excerpt: story.excerpt, category: story.category, imageUrl: story.image, imageAlt: story.imageAlt, contentHtml, readTime: story.readTime, status: "published", featured: story.featured, author: "Porchlight Editors", publishedAt: story.publishedAt, createdAt: story.publishedAt, updatedAt: story.updatedAt });
    imported++;
  }
  return NextResponse.json({ imported });
}
