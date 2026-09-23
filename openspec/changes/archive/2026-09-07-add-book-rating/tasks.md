## 1. Data model and API mapping

- [x] 1.1 In `google-books.ts`, add `averageRating?: number; ratingsCount?: number;` to `BookSummary`, add the matching optional fields to `VolumesResponse`'s `volumeInfo` type, and pass them through unchanged in `toBookSummary()` — verify by inspecting the new fields flow from the raw API shape to `BookSummary`
- [x] 1.2 Update `google-books.spec.ts` with a fixture/test asserting `averageRating`/`ratingsCount` are mapped through when present, and omitted (`undefined`) when absent from the API response — verify `npm test` passes

## 2. Rating display

- [x] 2.1 In `book-card.ts`, add a computed array of 5 booleans (filled/not) derived from `Math.round(book().averageRating)` clamped to 0–5, and a computed boolean for whether rating data is present (`averageRating !== undefined && ratingsCount !== undefined`) — verify with manual checks (e.g. 3.4 → 3 filled, 3.6 → 4 filled, undefined → not shown)
- [x] 2.2 In `book-card.html`, render a `.rating` element (only when rating data is present) containing 5 star `<svg>` icons (filled vs. outline based on the computed array, reusing the app's existing stroke-based inline-SVG icon style) followed by the ratings count in brackets, e.g. `(128)` — verify by inspecting the template renders nothing when rating data is absent
- [x] 2.3 In `book-card.css`, add `.rating` styled with `position: absolute; top: ...; right: ...;` inside the card, using `theming` capability tokens for colors (no new hardcoded colors) and this app's existing `clamp()`-based spacing conventions — verify by inspecting the selector uses only token-based colors and absolute positioning

## 3. Positioning context

- [x] 3.1 Add `position: relative;` to `.book-card` in both `book-search.css` and `cart-page.css` so the rating's absolute positioning resolves against the card box in both contexts — verify by inspecting both selectors carry the addition

## 4. Update existing tests and mocks

- [x] 4.1 Add unit tests in `book-card.spec.ts` covering: a book with rating data renders 5 star icons (correct filled/outline split) and the ratings count in brackets; a book without rating data renders no `.rating` element — verify `npm test` passes
- [x] 4.2 Add `averageRating?: number; ratingsCount?: number;` to the `VolumeInfo` interface in `e2e/support/mock-google-books.ts` so e2e tests can supply rating fixtures — verify the file still type-checks
- [x] 4.3 Add an e2e test (e.g. in `book-search.spec.ts`) asserting a rated book shows the star-and-count rating on its result card, and an unrated book shows none — verify `npm run e2e` passes

## 5. Verification

- [x] 5.1 Run `npm run build` and confirm it completes without errors
- [x] 5.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold
- [x] 5.3 Run `npm run e2e` and confirm the full e2e suite passes
- [x] 5.4 Manually verify in the browser that a rated book shows the correct star count and ratings-count in the top-right corner of its card, that an unrated book shows nothing, and that the rating appears consistently on both a search result card and a cart page card (verified via a throwaway Playwright script with screenshots: 3.6 average renders as 4 filled + 1 outline gold stars with "(128)" top-right on both pages; unrated book shows no rating)
