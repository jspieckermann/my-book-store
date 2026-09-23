## Context

`GoogleBooks.searchByIsbn()` (`src/app/isbn-search/google-books.ts`) already maps `items[0].volumeInfo` into a `BookSummary` (title, authors, publisher, publishedDate, description) and discards everything else in the response, including `volumeInfo.imageLinks`. `isbn-search.html` renders `foundBook()` as a `<dl>` list with no container styling beyond the shared `.isbn-search` background. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Extend the existing `BookSummary` shape and mapping (not a new service/type) with one new optional field for the cover image URL, keeping the "only extract what's displayed" precedent from `add-isbn-search-results`.
- Keep the "omit gracefully when absent" pattern already established for the five text attributes — apply the same rule to the image.
- Style the card entirely from `theming` tokens, matching every other component in this app.

**Non-Goals:**
- No placeholder/fallback cover graphic for books without one, no image loading-error handling (e.g. a valid URL that 404s), no lazy-loading — all per proposal's Follow-on work.
- No change to the "Book not found" or error message presentation — those stay plain text.
- No change to `BookSummary`'s existing five text fields or their omission behavior — untouched by this change.

## Decisions

**Add one optional field, `coverImageUrl?: string`, to `BookSummary`, mapped from `volumeInfo.imageLinks.thumbnail` (falling back to `smallThumbnail` if `thumbnail` is absent).**
Google's Books API nests available cover sizes under `imageLinks` (`smallThumbnail`, `thumbnail`, and sometimes larger sizes); not every volume has any of them. `thumbnail` is the largest size reliably present when a cover exists at all, so it's the natural first choice, with `smallThumbnail` as a fallback for the rare case only that one is populated. Larger sizes (`small`, `medium`, `large`, `extraLarge`) exist inconsistently across volumes and aren't needed for a card-sized image.
- *Alternative considered*: store the whole `imageLinks` object and pick a size in the template. Rejected — matches the same reasoning `add-isbn-search-results` used for the other fields: resolve the "which value do we actually use" decision once in the service, not in the template.

**Rewrite an `http://` image URL to `https://` before use.**
Google's `imageLinks` URLs are frequently returned as `http://books.google.com/...`. This app has no other case of loading a subresource over a possibly-insecure URL; on an HTTPS-served deployment, an `http://` `<img src>` is a mixed-content resource that browsers may block or flag. A simple string replace (`http://` → `https://`) in the service's mapping function is the local, one-line fix, applied at the same point the URL is extracted.
- *Alternative considered*: leave the URL as-is and only fix it if a real bug report surfaces. Rejected — this is a known, well-documented quirk of this exact API, cheap to fix now, and untestable-by-omission (the dev environment serves over `http://localhost`, so the bug wouldn't surface until a real HTTPS deploy).

**Card is a new wrapping element around the existing attribute markup, not a new component.**
The card is a styling/layout change to the existing found-book branch in `isbn-search.html` (wrap the current `<dl>` and add an `<img>`), not a new Angular component — there's no reuse or independent-testing need that would justify extracting one, consistent with how small this template branch already is.
- *Alternative considered*: extract a `BookCard` sub-component. Rejected as premature for a single call site; can be extracted later if a second place ever needs to render a book card.

**Image `alt` text uses the book's title when present, otherwise an empty `alt=""` (decorative).**
Standard accessibility practice: a meaningful `alt` when there's a title to describe the image with, and an empty `alt` (not omitting the attribute) when there's nothing meaningful to say, so screen readers skip it rather than reading the raw image URL.

## Risks / Trade-offs

- [Google's cover image CDN could be slow or briefly unavailable, and this change adds no loading state or error handling for the `<img>` itself] → Accepted per Non-Goals; a broken image in an already-rare no-connectivity edge case degrades to the browser's default broken-image icon, not a crash.
- [`http://`→`https://` rewrite assumes Google always serves the same image at both schemes, which holds for `books.google.com` today but isn't contractually guaranteed by the API] → Accepted; this is a widely-used, long-standing workaround for this specific API and low-risk to revisit if it ever breaks.
