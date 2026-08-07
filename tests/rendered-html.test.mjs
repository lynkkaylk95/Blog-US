import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

process.env.SITE_URL = "https://example.com";
const storyDirectory = new URL("../content/stories/", import.meta.url);

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
  const workerUrl = new URL(`../dist/server/index.js?test=${process.pid}-${Date.now()}-${Math.random()}`, import.meta.url);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`https://example.com${path}`), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
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
