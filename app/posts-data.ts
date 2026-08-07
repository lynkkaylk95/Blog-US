import { listPostRecords, findPostBySlug, type PostRecord } from "../db/posts";
import { stories as markdownStories, type Story } from "./content";

function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }).format(new Date(value)); }
function fromDatabase(post: PostRecord): Story {
  const publishedAt = post.publishedAt || post.createdAt;
  return { slug: post.slug, category: post.category, title: post.title, excerpt: post.excerpt, image: post.imageUrl, imageAlt: post.imageAlt, readTime: post.readTime, publishedAt, updatedAt: post.updatedAt, status: post.status === "published" ? "published" : "draft", featured: post.featured, chapters: [], date: formatDate(publishedAt), updatedDate: formatDate(post.updatedAt), contentHtml: post.contentHtml };
}

export async function getPublishedStories() {
  try {
    const records = await listPostRecords();
    const databaseStories = records.filter((post) => post.status === "published").map(fromDatabase);
    const databaseSlugs = new Set(records.map((story) => story.slug));
    return [...databaseStories, ...markdownStories.filter((story) => !databaseSlugs.has(story.slug))].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  } catch { return markdownStories; }
}

export async function getPublishedStory(slug: string) {
  try { const post = await findPostBySlug(slug); if (post?.status === "published") return fromDatabase(post); if (post) return null; }
  catch { /* Fall back to bundled Markdown when D1 is not configured. */ }
  return markdownStories.find((story) => story.slug === slug) ?? null;
}
