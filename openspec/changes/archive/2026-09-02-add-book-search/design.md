## Context

`isbn-search` currently has `GoogleBooks.searchByIsbn(isbn: string)` (`src/app/isbn-search/google-books.ts`) build the request as `q: isbn:${isbn}`, and `IsbnSearch` (`src/app/isbn-search/isbn-search.ts`/`.html`/`.css`) owns the input/button/result-card UI, with `app.html` referencing `<app-isbn-search />`. This change renames both the capability and the code that implements it, per the user's confirmed choice (a full rename, not keeping the old names). See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Rename every ISBN-specific identifier this feature owns (folder, component class/selector, file names, service method) to reflect general search, leaving no lingering `Isbn*`/`isbn-*` naming for this feature.
- Keep the ISBN-detection heuristic simple and local to the one place that builds the request — no new validation library or shared utility module for something this small.
- Preserve every other already-working behavior (result card, cover image, add-to-cart, status feedback, responsive layout, theme, API key) exactly as-is; only the input's accepted content and the query-construction logic change.

**Non-Goals:**
- No multi-result list or "did you mean" suggestions — still only the first match is shown, per proposal's explicit confirmation that this doesn't change.
- No client-side ISBN checksum validation (e.g. verifying the ISBN-13 check digit) — the format heuristic only needs to decide *which query style* to send, not to validate correctness; an invalid-but-ISBN-shaped string sent via `isbn:` simply returns no match, which the existing not-found path already handles.
- No renaming of `GoogleBooks`/`google-books.ts` itself — that name was never ISBN-specific (it names the API, not the search mode), so it's unaffected by this rename.

## Decisions

**ISBN-format detection: strip non-alphanumeric characters, then match `^\d{9}[\dX]$` (10-char ISBN-10) or `^\d{13}$` (ISBN-13).**
This is intentionally the minimum needed to route the query, not a correctness validator (see Non-Goals). Hyphens and spaces are common in how people type/paste ISBNs (e.g. "978-0-14-312755-0"), so stripping them before matching handles the realistic input shapes without over-engineering a full ISBN parser.
- *Alternative considered*: a stricter regex also validating hyphen placement per the ISBN standard's group/registrant/publication structure. Rejected — placement varies by publisher/country and getting it wrong would reject valid ISBNs; the loose "strip and count" approach can't false-negative on a real ISBN typed with any conventional hyphenation.

**Route via `isbn:{cleaned}` when the heuristic matches, else send the raw trimmed input as the general `q` value (no field prefix).**
Google's Books API already searches title, author, and other metadata for an unprefixed `q` — this is existing, external behavior this app doesn't need to reimplement. The service's job is only to decide when the *stronger, more precise* `isbn:` prefix is warranted; for everything else, Google's default general search is exactly what "search by author or title" requires.
- *Alternative considered*: always send `q:{intitle:...|inauthor:...|isbn:...}` combined multi-field OR query. Rejected — this app has one freetext field with no way for the user to indicate which field they mean, so a combined OR query doesn't add precision over the API's default general search; it only adds complexity for the non-ISBN path.

**Full rename: `src/app/isbn-search/` → `src/app/book-search/`, `IsbnSearch` → `BookSearch`, `app-isbn-search` → `app-book-search`, `isbn-search.{ts,html,css}` → `book-search.{ts,html,css}`, `searchByIsbn()` → `search()`, the internal `isbn` signal → `query`.**
Per the user's explicit choice in this change's scoping conversation. Angular's file-per-component convention means this is a straightforward rename-and-update-imports operation (`app.ts`'s import and template reference, `google-books.ts`'s method signature and its one caller) — no logic beyond the query-construction change described above.
- *Alternative considered*: keep old names (rejected by the user upfront, included here only for traceability to that decision).

**CSS classes `.isbn-search`, `.isbn-input`, `.status-*` etc. are renamed to drop the `isbn` prefix where it appears (e.g. `.isbn-search` → `.book-search`, `.isbn-input` → `.search-input`), but `.book-card`, `.book-cover`, `.book-summary`, `.book-attribute`, `.add-to-cart-button` are already generically named and unchanged.**
Consistent renaming scope: only identifiers that currently say "isbn" get renamed; identifiers already named for what they display (the book, not the search mode) are untouched.

## Risks / Trade-offs

- [The ISBN-13 heuristic doesn't validate the check digit, so a 13-digit non-ISBN number (e.g. a random barcode) would be routed through `isbn:` and simply return "Book not found" instead of being tried as a general query] → Accepted per Non-Goals; this is an edge case with a graceful (if slightly less helpful) fallback, not a broken state.
- [Renaming touches multiple files (component, template, styles, service method, app.ts/app.html references) in one change, larger diff than a pure behavior change] → Accepted; this is the explicit trade-off of the user's chosen "rename now" option over "keep old names."
