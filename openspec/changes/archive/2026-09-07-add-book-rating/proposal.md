## Why

Search results and cart cards currently show no signal of how well-received a book is. The Google Books API already returns an average rating and a ratings count for many volumes; surfacing it helps users judge a book at a glance.

## What Changes

- `google-books.ts`: extend `BookSummary` and the API response mapping to include the Google Books API's `averageRating` (number) and `ratingsCount` (number) fields when present.
- `book-card.ts`/`.html`: when a book has a rating, render it as a row of star icons (rounded to the nearest whole star) in the top-right corner of the book card, followed by the ratings count in brackets, e.g. "★★★★☆ (128)". When a book has no rating data, no rating is shown (no placeholder).
- This applies to every book card rendered by the shared `book-card` component — both search result cards and cart page cards — since they share the same markup and the same `BookSummary` data.
- `book-search.css`/`cart-page.css`: give the outer `.book-card` container `position: relative` so the rating can be absolutely positioned within it.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `book-search`: adds a new requirement for displaying a book's average rating and ratings count on its result card (also shown on cart page cards via the shared card component); no existing requirement's behavior changes.

## Impact

- Affected files: `src/app/book-search/google-books.ts`, `src/app/book-card/book-card.ts`, `src/app/book-card/book-card.html`, `src/app/book-card/book-card.css`, `src/app/book-search/book-search.css`, `src/app/cart-page/cart-page.css`.
- Existing unit tests (`google-books.spec.ts`, `book-card.spec.ts`) will need fixtures/assertions added for the new rating fields; e2e mocks (`mock-google-books.ts`) may need an optional rating field.
