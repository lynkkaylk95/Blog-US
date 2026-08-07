# Porchlight publishing guide

Stories live in `content/stories`. Each Markdown file contains JSON-style frontmatter followed by chapters.

## Publish a story

1. Copy `content/templates/story.md` into `content/stories` and give it a lowercase, hyphenated filename.
2. Keep every frontmatter string inside double quotes. Dates must be ISO 8601 with a timezone.
3. Write each chapter under a `## Chapter title` heading. Separate paragraphs with a blank line.
4. Keep `status: "draft"` while editing. Drafts never appear on the website, sitemap, or RSS feed.
5. Run `pnpm run content:check`. Preview the story, update `readTime`, and complete the editorial checklist.
6. Change the status to `"published"`, set `publishedAt`, and deploy. Update `updatedAt` whenever a meaningful published change is made.

## Editorial checklist

- The title and excerpt accurately describe a fictional story without presenting it as news.
- Names, timeline, point of view, and details are consistent.
- The image may be used on the site and has useful alternative text.
- Quotes and factual references have been checked.
- The story has been reviewed for accidental similarity and harmful stereotypes.
- The slug is unique and never changed after publication unless redirects are added.
- `featured: true` is used for only one published story at a time.

The build stops with a readable error when frontmatter is missing, a date is invalid, a slug is duplicated, or a chapter has no paragraphs.
