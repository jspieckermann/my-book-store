## 1. Service: return book data instead of discarding it

- [x] 1.1 Define a minimal `BookSummary` interface (`title?`, `authors?: string[]`, `publisher?`, `publishedDate?`, `description?`, all optional) in `src/app/isbn-search/google-books.ts` — verify the type compiles and matches the fields listed in the spec's "Search result display" requirement
- [x] 1.2 Change `GoogleBooks.searchByIsbn()` to map the Google Books API response's `items[0].volumeInfo` into a `BookSummary` and return `Observable<BookSummary | null>` (`null` when `items` is absent or empty) instead of `Observable<void>` — verify by inspecting the mapping logic covers all five `BookSummary` fields and returns `null` for a response with no `items`

## 2. Component: discriminated result state

- [x] 2.1 Replace the component's `status: 'idle' | 'loading' | 'error'` signal with a discriminated union covering `idle`, `loading`, `error`, `not-found`, and `found` (carrying the `BookSummary` for the `found` case) in `src/app/isbn-search/isbn-search.ts` — verify the type makes it impossible to have book data present alongside an error or not-found state
- [x] 2.2 Update `search()` to set the state to `not-found` when the service returns `null`, and to `found` with the returned `BookSummary` when it returns a book — verify by inspecting the subscribe handler covers all three outcomes (found, not-found, error)

## 3. Results rendering

- [x] 3.1 Add a results area to `isbn-search.html`, below the filter form, that renders exactly one of: nothing (idle), the existing loading indicator, the existing error message, "Book not found" (not-found), or the found book's attributes (found) — verify by inspecting the template that these are mutually exclusive branches
- [x] 3.2 Render the found book's available attributes (title, authors, publisher, published date, description) as plain text, omitting any attribute that is absent from the `BookSummary` with no placeholder text — verify by inspecting the template's conditional bindings for each of the five fields
- [x] 3.3 Style the results area (attribute text and "Book not found" message) using `theming` tokens only, consistent with the existing filter section styling — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added to `isbn-search.css`

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm existing tests still pass
- [x] 4.3 Manually search a real, valid ISBN (e.g. `9780143127550`) and confirm the found book's available attributes are displayed as text below the filter section
- [x] 4.4 Manually search an ISBN with no matching book (e.g. a syntactically valid but nonexistent ISBN) and confirm "Book not found" is displayed in the same results area
- [x] 4.5 Manually trigger an error case (e.g. a genuine request failure) and confirm the existing error message still displays correctly and no stale book data or "Book not found" text is shown alongside it
