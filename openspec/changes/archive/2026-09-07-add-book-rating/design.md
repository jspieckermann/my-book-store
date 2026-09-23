## Context

`GoogleBooks.search()` maps the API's `volumeInfo` onto `BookSummary`, currently omitting `averageRating`/`ratingsCount` (both present in the raw Google Books API response for many volumes, absent for others). `book-card.ts`/`.html` is the shared card component rendering both search result cards and cart page cards; `:host { display: contents; }` means the component contributes no box of its own — the actual bordered "card" box is the `<li class="book-card">` defined identically in `book-search.css` and `cart-page.css`. See proposal.md for why the rating is being added.

## Goals / Non-Goals

**Goals:**
- Surface `averageRating`/`ratingsCount` from the Google Books API through to the card, shown only when both are present.
- Star row rounds the average rating to the nearest whole star (0–5 filled stars), with the ratings count in brackets after it, e.g. "★★★★☆ (128)".
- Positioned in the top-right corner of the outer card box, on both search-result and cart-page cards (same shared component).

**Non-Goals:**
- No half-star rendering — whole-star rounding only, matching this app's existing icon set (all icons here are simple filled/outline shapes, no partial-fill icons).
- No user-submitted ratings or rating interaction — display only, sourced entirely from the Google Books API response.
- No change to any other book attribute or existing card behavior (add-to-cart, delete, description truncation).

## Decisions

- **Data model**: add `averageRating?: number; ratingsCount?: number;` to `BookSummary`, and the matching optional fields to the `VolumesResponse` `volumeInfo` type in `google-books.ts`; `toBookSummary()` passes them through unchanged (Google's API already returns `averageRating` as a 1–5 number and `ratingsCount` as an integer).
- **Presence gating**: show the rating only when `averageRating !== undefined && ratingsCount !== undefined` (mirrors the existing "cover image" and "description" patterns of omitting absent attributes rather than showing a placeholder). Google's API always returns both together when a book has been rated, so this is not expected to split a rating across a partial-data case in practice.
- **Star rendering**: `Math.round(averageRating)` (clamped to 0–5) determines how many of 5 star icons render filled (`fill="currentColor"`) vs. outline (`fill="none"`), reusing this app's existing stroke-based inline-SVG icon convention (same `viewBox`, `stroke-width`, etc. as the cart/login/chevron icons already in the codebase). Five star `<svg>` elements are rendered in an `@for` loop over a computed array of booleans (filled/not), keeping the template simple.
- **Layout/positioning**: give `.book-card` (in both `book-search.css` and `cart-page.css`, which currently declare it identically) `position: relative`, and add a `.rating` class in `book-card.css` with `position: absolute; top: ...; right: ...;` sized and spaced using this app's existing `clamp()`-based spacing tokens, colored with `theming` tokens (`--color-accent` or similar for filled stars, `--color-border`/`--color-text-muted` for outline stars, `--color-text-muted` for the count text) rather than new hardcoded colors.
- **Text**: the ratings count in brackets is plain text (e.g. `(128)`), not an interactive control — no button semantics needed.

## Risks / Trade-offs

- [`.book-card` is defined twice (book-search.css, cart-page.css) with identical rules] → Both need the `position: relative` addition; this duplication already exists in the codebase (established precedent, not introduced by this change) so no refactor is in scope here.
- [Existing e2e mock helper (`mock-google-books.ts`) may not currently pass through a rating field] → Extend its mock item shape with optional `averageRating`/`ratingsCount` so e2e tests can exercise both the rated and unrated cases.
- [A very high or very low ratings count, or a fractional average rounding at the .5 boundary] → `Math.round()`'s standard round-half-up behavior is sufficient; no special-casing needed.
