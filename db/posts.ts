import { desc, eq, ne, sql } from "drizzle-orm";
import { getDb } from "./index";
import { posts } from "./schema";

export type PostRecord = typeof posts.$inferSelect;
export type NewPostRecord = typeof posts.$inferInsert;

export async function listPostRecords() { return getDb().select().from(posts).orderBy(desc(posts.updatedAt)); }
export async function listPosts() { return getDb().select().from(posts).where(ne(posts.status, "deleted")).orderBy(desc(posts.updatedAt)); }
export async function listPublishedPosts() { return getDb().select().from(posts).where(eq(posts.status, "published")).orderBy(desc(posts.publishedAt)); }
export async function findPostById(id: number) { return (await getDb().select().from(posts).where(eq(posts.id, id)).limit(1))[0] ?? null; }
export async function findPostBySlug(slug: string) { return (await getDb().select().from(posts).where(eq(posts.slug, slug)).limit(1))[0] ?? null; }
export async function createPost(value: NewPostRecord) { return (await getDb().insert(posts).values(value).returning())[0]; }
export async function updatePost(id: number, value: Partial<NewPostRecord>) { return (await getDb().update(posts).set(value).where(eq(posts.id, id)).returning())[0] ?? null; }
export async function deletePost(id: number) { return (await getDb().update(posts).set({ status: "deleted", featured: false, updatedAt: new Date().toISOString() }).where(eq(posts.id, id)).returning())[0] ?? null; }
export async function incrementPostViews(slug: string) { return (await getDb().update(posts).set({ views: sql`${posts.views} + 1` }).where(eq(posts.slug, slug)).returning({ views: posts.views }))[0]?.views ?? null; }
export async function shiftSeriesParts(seriesTitle: string, fromPart: number) {
  const affected = (await getDb().select().from(posts).where(eq(posts.seriesTitle, seriesTitle))).filter((post) => (post.partNumber || 0) >= fromPart).sort((a, b) => (b.partNumber || 0) - (a.partNumber || 0));
  for (const post of affected) await getDb().update(posts).set({ partNumber: (post.partNumber || 0) + 1, updatedAt: new Date().toISOString() }).where(eq(posts.id, post.id));
}
export async function moveSeriesPart(id: number, seriesTitle: string, oldPart: number, newPart: number) {
  if (oldPart === newPart) return;
  const db = getDb();
  await db.update(posts).set({ partNumber: null }).where(eq(posts.id, id));
  const siblings = (await db.select().from(posts).where(eq(posts.seriesTitle, seriesTitle))).filter((post) => post.id !== id && post.partNumber !== null);
  const affected = newPart < oldPart
    ? siblings.filter((post) => (post.partNumber || 0) >= newPart && (post.partNumber || 0) < oldPart).sort((a, b) => (b.partNumber || 0) - (a.partNumber || 0))
    : siblings.filter((post) => (post.partNumber || 0) > oldPart && (post.partNumber || 0) <= newPart).sort((a, b) => (a.partNumber || 0) - (b.partNumber || 0));
  for (const post of affected) await db.update(posts).set({ partNumber: (post.partNumber || 0) + (newPart < oldPart ? 1 : -1) }).where(eq(posts.id, post.id));
  await db.update(posts).set({ partNumber: newPart, updatedAt: new Date().toISOString() }).where(eq(posts.id, id));
}
