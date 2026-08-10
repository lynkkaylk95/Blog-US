import { listPostRecords, findPostBySlug, type PostRecord } from "../db/posts";
import { stories as markdownStories, type Story } from "./content";

function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }).format(new Date(value)); }
function fromDatabase(post: PostRecord): Story {
  const publishedAt = post.publishedAt || post.createdAt;
  let categories: string[] = [];
  try { categories = JSON.parse(post.categories) as string[]; } catch { /* Legacy row. */ }
  if (!categories.length) categories = [post.category];
  return { slug: post.slug, category: post.category, categories, title: post.title, excerpt: post.excerpt, image: post.imageUrl, imageAlt: post.imageAlt, readTime: post.readTime, publishedAt, updatedAt: post.updatedAt, status: post.status === "published" ? "published" : "draft", featured: post.featured, chapters: [], date: formatDate(publishedAt), updatedDate: formatDate(post.updatedAt), contentHtml: post.contentHtml, author: post.author, views: post.views, seriesTitle: post.seriesTitle, partNumber: post.partNumber };
}

export async function getPublishedStories() {
  try {
    const records = await listPostRecords();
    if (records.length) return records.filter((post) => post.status === "published").map(fromDatabase).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    return markdownStories;
  } catch { return markdownStories; }
}

export async function getPublishedStory(slug: string) {
  try {
    const post = await findPostBySlug(slug);
    if (post?.status === "published") return fromDatabase(post);
    if (post) return null;
    if ((await listPostRecords()).length) return null;
  }
  catch { /* Fall back to bundled Markdown when D1 is not configured. */ }
  return markdownStories.find((story) => story.slug === slug) ?? null;
}
