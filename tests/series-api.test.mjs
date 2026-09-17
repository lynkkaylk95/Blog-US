import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

const baseUrl = process.env.SERIES_TEST_URL || "http://127.0.0.1:4175";
const secret = process.env.TEST_ADMIN_SESSION_SECRET;

test("series analysis, atomic creation, page navigation, conflicts and access controls", { skip: !secret }, async () => {
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname), "Use a local test server only.");
  const expires = String(Date.now() + 600_000);
  const signature = createHmac("sha256", secret).update(expires).digest("base64url");
  const cookie = `porchlight_admin=${expires}.${signature}`;
  const headers = { "content-type": "application/json", origin: baseUrl, cookie };
  const send = (path, body, overrides = {}) => fetch(`${baseUrl}${path}`, { method: "POST", headers, body: JSON.stringify(body), ...overrides });
  const title = `Series integration ${Date.now()}`;
  const contentHtml = '<p>Introduction to the story.</p><h2>Chapter 1: Arrival</h2><p>First chapter unique text.</p><h2>Chapter 2: Discovery</h2><p>Second chapter unique text.</p><h2>Chapter 3: Home</h2><p>Third chapter unique text.</p>';
  const payload = { seriesTitle: title, contentHtml, author: "Test Writer", categories: ["Life Stories"], imageUrl: "https://example.com/cover.jpg", status: "published" };
  const rows = async () => (await (await fetch(`${baseUrl}/api/admin/posts`, { headers: { cookie } })).json()).posts;
  try {
    for (const path of ["/api/admin/series/analyze", "/api/admin/series"]) {
      assert.equal((await send(path, payload, { headers: { "content-type": "application/json", origin: baseUrl } })).status, 401);
      assert.equal((await send(path, payload, { headers: { ...headers, origin: "https://unrelated.example" } })).status, 403);
    }
    const analysis = await send("/api/admin/series/analyze", { contentHtml });
    assert.equal(analysis.status, 200);
    assert.deepEqual((await analysis.json()).parts.map((part) => part.title), ["Arrival", "Discovery", "Home"]);
    assert.equal((await rows()).filter((post) => post.seriesTitle === title).length, 0);
    const invalid = await send("/api/admin/series", { ...payload, contentHtml: contentHtml.replace("Chapter 2", "Chapter 4") });
    assert.equal(invalid.status, 400);
    assert.equal((await rows()).filter((post) => post.seriesTitle === title).length, 0);

    const created = await send("/api/admin/series", payload);
    const result = await created.json();
    assert.equal(created.status, 201, JSON.stringify(result));
    assert.equal(result.count, 3);
    const saved = (await rows()).filter((post) => post.seriesTitle === title).sort((a, b) => a.partNumber - b.partNumber);
    assert.equal(saved.length, 3);
    for (const [index, part] of saved.entries()) {
      assert.equal(part.partNumber, index + 1);
      assert.equal(part.author, payload.author);
      assert.ok(JSON.parse(part.categories).includes("Series"));
      const page = await fetch(`${baseUrl}/story/${part.slug}`);
      assert.equal(page.status, 200);
      const html = await page.text();
      assert.match(html, new RegExp(`Part ${index + 1}: ${part.title}`));
      for (const sibling of saved) assert.ok(html.includes(sibling.slug), "Series navigation must link all parts.");
    }
    assert.doesNotMatch(saved[0].contentHtml, /Second chapter|Third chapter/);
    assert.match(saved[0].contentHtml, /Introduction/);
    assert.equal((await send("/api/admin/series", payload)).status, 409);
    assert.equal((await rows()).filter((post) => post.seriesTitle === title).length, 3);

    const racePayload = { ...payload, seriesTitle: `${title} concurrent`, status: "draft" };
    const concurrent = await Promise.all([send("/api/admin/series", racePayload), send("/api/admin/series", racePayload)]);
    assert.deepEqual(concurrent.map((response) => response.status).sort(), [201, 409]);
    const drafts = (await rows()).filter((post) => post.seriesTitle === racePayload.seriesTitle);
    assert.equal(drafts.length, 3);
    assert.equal((await fetch(`${baseUrl}/story/${drafts[0].slug}`)).status, 404);
  } finally {
    const testPosts = (await rows()).filter((post) => [title, `${title} concurrent`].includes(post.seriesTitle));
    for (const post of testPosts) {
      const removed = await fetch(`${baseUrl}/api/admin/posts/${post.id}`, { method: "DELETE", headers });
      assert.equal(removed.status, 200);
    }
  }
});
