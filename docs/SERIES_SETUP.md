# Create a series from a full story

Open **Admin → Add series**, enter the series title and shared metadata, then paste
the full story into the content editor. There are no part-name or part-number
fields in this workflow.

Put each chapter heading on its own line, as a heading or a paragraph:

```text
Chapter 1: Arrival
The first chapter's content…

Chapter 2: Discovery
The second chapter's content…
```

Click **Analyze chapters** below the editor. The preview shows each part's number,
title, word count, reading time, content excerpt and generated URL. Chapters must
be consecutive, starting at 1, with a nonempty title and body. Content before
Chapter 1 is the intro. **Remove intro** is checked by default, so only chapter
content is saved. Uncheck it to keep the intro at the beginning of Part 1; it
never creates a separate intro page. The full text stays in the editor. Editing
the content or changing this option invalidates the preview; analyze again
before saving. Preview excerpts, word counts and reading times reflect the option.

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
