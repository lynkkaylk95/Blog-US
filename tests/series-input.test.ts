import assert from "node:assert/strict";
import test from "node:test";
import { analyzeSeries, prepareSeries } from "../app/api/admin/series-input";

test("splits formatted chapters into titles and separate bodies without losing the introduction", () => {
  const parts = analyzeSeries('<p>Introduction.</p><h2><strong>Chapter 1: The &amp; beginning</strong></h2><p>First <em>body</em>.</p><h3>Chapter 2: The return</h3><p>Second body.</p>');
  assert.deepEqual(parts.map(({ partNumber, title }) => ({ partNumber, title })), [{ partNumber: 1, title: "The & beginning" }, { partNumber: 2, title: "The return" }]);
  assert.match(parts[0].contentHtml, /Introduction/);
  assert.match(parts[0].contentHtml, /<em>body<\/em>/);
  assert.doesNotMatch(parts[0].contentHtml, /Second|Chapter 1/);
  assert.doesNotMatch(parts[1].contentHtml, /First|Introduction/);
});

test("preserves nested containers, lists, links and images across chapter boundaries", () => {
  const parts = analyzeSeries('<div><p>Chapter 1: One</p><ul><li>First item</li><li>Second item</li></ul><p><a href="https://example.com">Link</a><img src="https://example.com/image.jpg"></p><div><p>Chapter 2: Two</p><p>Final body.</p></div></div>');
  assert.match(parts[0].contentHtml, /<ul><li>First item<\/li><li>Second item<\/li><\/ul>/);
  assert.match(parts[0].contentHtml, /<img src=/);
  assert.match(parts[0].contentHtml, /noopener noreferrer/);
  assert.equal(parts[1].contentHtml, "<div><div><p>Final body.</p></div></div>");
});

test("handles pasted line breaks, inline formatting, nonbreaking spaces and plain text", () => {
  const parts = analyzeSeries('<p><strong>Chapter&nbsp;1: One<br>First body.<br>Chapter 2: Two</strong><br>Second body.</p>');
  assert.equal(parts.length, 2);
  assert.match(parts[0].contentHtml, /<strong>First body\.<\/strong>/);
  assert.doesNotMatch(parts[0].contentHtml, /Second body/);
  const plain = analyzeSeries("Chapter 1: One\nFirst body.\nChapter 2: Two\nSecond body.");
  assert.equal(plain.length, 2);
  assert.match(plain[1].contentHtml, /Second body/);
});

test("does not split chapter mentions within a paragraph", () => {
  const parts = analyzeSeries('<p>Chapter 1: One</p><p>He opened Chapter 2: A different book.</p>');
  assert.equal(parts.length, 1);
  assert.match(parts[0].contentHtml, /He opened Chapter 2/);
});

test("keeps ordinary source whitespace inside an existing paragraph", () => {
  const parts = analyzeSeries('<h2>Chapter 1: One</h2><p>A long sentence\ncontinued on the next source line.</p>');
  assert.equal(parts[0].contentHtml, '<p>A long sentence\ncontinued on the next source line.</p>');
});

test("rejects missing, duplicate, skipped, out-of-order and empty chapters", () => {
  for (const html of [
    '<p>No headings.</p>',
    '<p>Chapter 1: One</p><p>Body.</p><p>Chapter 1: Duplicate</p><p>Body.</p>',
    '<p>Chapter 2: Two</p><p>Body.</p>',
    '<p>Chapter 1: One</p><p>Body.</p><p>Chapter 3: Three</p><p>Body.</p>',
    '<p>Chapter 1: </p><p>Body.</p>',
    '<p>Introduction.</p><p>Chapter 1: One</p><p>Chapter 2: Two</p><p>Body.</p>',
    '<p>Chapter 1: One</p><p>Body.</p><p>Chapter 2: Two</p><p>&nbsp;</p>',
  ]) assert.throws(() => analyzeSeries(html), Error, html);
});

test("creates ordinary series post inputs, sanitizes content and calculates per-part reading times", () => {
  const parts = prepareSeries({ seriesTitle: "A New Story", categories: ["Life Stories"], author: "A Writer", imageUrl: "https://example.com/cover.jpg", status: "published", featured: true, contentHtml: `<h2>Chapter 1: Beginning</h2><p onclick="bad()">${"word ".repeat(401)}</p><script>alert(1)</script><h2>Chapter 2: End</h2><p>Short ending.</p>` });
  assert.equal(parts.length, 2);
  assert.equal(parts[0].slug, "a-new-story-part-1-beginning");
  assert.equal(parts[1].slug, "a-new-story-part-2-end");
  assert.equal(parts[0].readTime, "3 min read");
  assert.equal(parts[1].readTime, "1 min read");
  for (const part of parts) {
    assert.equal(part.seriesTitle, "A New Story");
    assert.equal(part.author, "A Writer");
    assert.equal(part.status, "published");
    assert.deepEqual(JSON.parse(part.categories), ["Series", "Life Stories"]);
    assert.doesNotMatch(part.contentHtml, /script|onclick|alert/);
  }
});

test("validates shared fields before any writes", () => {
  assert.throws(() => prepareSeries({ seriesTitle: "", contentHtml: '<p>Chapter 1: One</p><p>Body.</p>' }));
  assert.throws(() => prepareSeries({ seriesTitle: "Story", contentHtml: '<p>Chapter 1: One</p><p>Body.</p>', imageUrl: "bad", author: "Writer" }));
});
