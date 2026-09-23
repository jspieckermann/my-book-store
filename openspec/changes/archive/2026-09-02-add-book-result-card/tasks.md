## 1. Service: extract cover image URL

- [x] 1.1 Add `coverImageUrl?: string` to the `BookSummary` interface and the `VolumesResponse` inner type's `imageLinks?: { smallThumbnail?: string; thumbnail?: string }` in `src/app/isbn-search/google-books.ts` — verify the types compile
- [x] 1.2 In `searchByIsbn()`'s mapping, set `coverImageUrl` from `volumeInfo.imageLinks?.thumbnail ?? volumeInfo.imageLinks?.smallThumbnail`, rewriting a leading `http://` to `https://` when present — verify by inspecting the mapping logic covers: thumbnail present, only smallThumbnail present, neither present (field left `undefined`), and the `http://`→`https://` rewrite

## 2. Card layout and cover image

- [x] 2.1 Wrap the found-book branch in `isbn-search.html` in a card container element — verify by inspecting the template that the existing `<dl>` attribute list is nested inside the new card wrapper
- [x] 2.2 Add an `<img>` for `book.coverImageUrl` inside the card, rendered only when `coverImageUrl` is present (no element, no placeholder, when absent), with `alt` set to the book's title when present and `alt=""` otherwise — verify by inspecting the template's conditional binding and alt-text logic
- [x] 2.3 Style the card container and image using `theming` tokens only (e.g. `--color-surface` or `--color-background`, `--color-border`, spacing via existing `clamp()` conventions) — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added to `isbn-search.css`

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it completes without errors
- [x] 3.2 Run `npm test` and confirm existing tests still pass
- [x] 3.3 Manually search a real ISBN known to have a cover (e.g. `9780143127550`) and confirm the result renders as a card with the cover image visible
- [x] 3.4 Manually search a real ISBN for a book with no cover image in the API response (if one can be found) and confirm the card renders without an image slot or placeholder — otherwise verify this by temporarily inspecting the mapping with a mocked/absent `imageLinks` response
- [x] 3.5 Manually resize the browser viewport from 320px to 1920px and confirm the card (with and without an image) does not overflow, clip, or cause horizontal scrolling
