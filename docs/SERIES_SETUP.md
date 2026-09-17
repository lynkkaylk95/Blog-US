# Create a series from a full story

Open **Admin → Add series**, enter the series title and shared metadata, then paste
the full story into the content editor. Part names and numbers are extracted
automatically from the chapter headings.

Put each chapter heading on its own line, as a heading or a paragraph:

```text
Chapter 1: Arrival
The first chapter's content…

Chapter 2: Discovery
The second chapter's content…
```

Click **Analyze chapters** below the editor. The complete chapter bodies move
into separate parts below; only the intro before Chapter 1 stays in the original
editor. Every part shows its generated URL and character count. Click **Show
content** to expand the full formatted body, and click again to collapse it.
Parts start collapsed and can be opened independently. The character count
includes spaces in the chapter body, with whitespace normalized; it excludes
HTML, the chapter title and the separate intro. Chapters
must be consecutive, starting at 1, with a nonempty title and body.

**Remove intro** is checked by default, so only chapter content is saved. Uncheck
it to prepend the current intro to Part 1; no separate intro page is created.
The intro and this option can be changed after extraction without losing parts.
To edit chapter content, use **Merge back to edit chapters**, edit the full story,
then analyze again. Merging preserves the current intro and part names.

Slugs use only the part title: `Chapter 1: The Return` becomes `/story/the-return`.
They do not include the series title or part number. Part names can be corrected
in the generated list. If two names produce the same slug, or an existing post
already uses it, saving is blocked with a message asking for a different name.
No suffix is added automatically and existing posts are not renamed.

**Save series** creates all parts in one D1 batch transaction. Each part inherits
the author, image, categories, featured setting and draft/published status. The
chapter heading supplies the page title and part number, and is removed from the
body to avoid a duplicate heading. Reading time is calculated per part. Existing
series titles or part URLs are rejected without overwriting existing posts.

The existing dashboard, public series navigation and individual part editor work
with the generated posts. The dashboard's “Insert before Part” action still opens
the individual-part editor using `mode=part`.

## Checks

- `pnpm test:series`: parser, formatting, validation and metadata tests.
- `pnpm test:series:api`: optional integration test against a local running server
  at `SERIES_TEST_URL` (default `http://127.0.0.1:4175`). Supply its session signing
  key in `TEST_ADMIN_SESSION_SECRET`. It creates temporary local posts and
  soft-deletes them afterward; never run it against production.
