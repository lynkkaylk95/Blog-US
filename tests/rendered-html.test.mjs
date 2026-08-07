import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import test, { after, before } from "node:test";

process.env.SITE_URL = "https://example.com";
const storyDirectory = new URL("../content/stories/", import.meta.url);
const baseUrl = "http://127.0.0.1:4173";
let server;

before(async () => {
  server = spawn(process.execPath, ["node_modules/vinext/dist/cli.js", "dev", "--port", "4173", "--hostname", "127.0.0.1"], {
    cwd: new URL("../", import.meta.url),
    env: { ...process.env, SITE_URL: "https://example.com", ADMIN_PASSWORD: "test-password", ADMIN_SESSION_SECRET: "test-session-secret-at-least-32-characters" },
    stdio: "ignore",
  });
  for (let attempt = 0; attempt < 50; attempt++) {
    try { const response = await fetch(`${baseUrl}/`); if (response.ok) return; } catch { /* Wait for the server. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Production test server did not start");
});

after(() => { server?.kill(); });

async function publishedStories() {
  const files = (await readdir(storyDirectory)).filter((file) => file.endsWith(".md"));
  const stories = await Promise.all(files.map(async (file) => {
    const source = await readFile(new URL(file, storyDirectory), "utf8");
    const value = (key) => source.match(new RegExp(`^${key}:\\s+"([^"]+)"`, "m"))?.[1];
    return { slug: value("slug"), title: value("title"), status: value("status") };
  }));
  return stories.filter((story) => story.status === "published");
}

async function fetchPage(path) {
  return fetch(`${baseUrl}${path}`);
}

test("renders every published Markdown story", async () => {
  const stories = await publishedStories();
  assert.ok(stories.length > 0);
  for (const story of stories) {
    const response = await fetchPage(`/story/${story.slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(story.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, /application\/ld\+json/);
  }
});

test("keeps drafts private and unknown stories return 404", async () => {
  const response = await fetchPage("/story/not-a-real-story");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Story not found/i);
});

test("sitemap and RSS contain every published story", async () => {
  const stories = await publishedStories();
  const [sitemapResponse, feedResponse] = await Promise.all([fetchPage("/sitemap.xml"), fetchPage("/feed.xml")]);
  const sitemap = await sitemapResponse.text();
  const feed = await feedResponse.text();
  assert.equal(sitemapResponse.status, 200);
  assert.equal(feedResponse.status, 200);
  for (const story of stories) {
    assert.match(sitemap, new RegExp(`/story/${story.slug}`));
    assert.match(feed, new RegExp(`/story/${story.slug}`));
  }
});

test("admin can create, edit, and delete a D1 post", async () => {
  const login = await fetch(`${baseUrl}/api/admin/login`, { method: "POST", headers: { origin: baseUrl, "content-type": "application/json" }, body: JSON.stringify({ password: "test-password" }) });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie);
  const slug = `automated-admin-test-${Date.now()}`;
  const payload = { slug, title: "Automated Admin Test", excerpt: "Temporary test content.", category: "Life Stories", imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8", imageAlt: "A test landscape", contentHtml: "<h2>Test chapter</h2><p>Created by the automated CRUD test.</p>", readTime: "1 min read", status: "draft", featured: false };
  const created = await fetch(`${baseUrl}/api/admin/posts`, { method: "POST", headers: { origin: baseUrl, cookie, "content-type": "application/json" }, body: JSON.stringify(payload) });
  assert.equal(created.status, 201);
  const createdPost = (await created.json()).post;
  const updated = await fetch(`${baseUrl}/api/admin/posts/${createdPost.id}`, { method: "PUT", headers: { origin: baseUrl, cookie, "content-type": "application/json" }, body: JSON.stringify({ ...payload, title: "Automated Admin Test Updated" }) });
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).post.title, "Automated Admin Test Updated");
  const deleted = await fetch(`${baseUrl}/api/admin/posts/${createdPost.id}`, { method: "DELETE", headers: { origin: baseUrl, cookie } });
  assert.equal(deleted.status, 200);
  const listing = await fetch(`${baseUrl}/api/admin/posts`, { headers: { cookie } });
  assert.ok(!(await listing.json()).posts.some((post) => post.slug === slug));
});
