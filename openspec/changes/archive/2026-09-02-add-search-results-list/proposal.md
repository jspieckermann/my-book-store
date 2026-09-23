## Why

The search currently shows only the first matching book, silently discarding every other match. For an author or title search that's often the wrong book — the user has no way to see or reach the one they actually meant. Showing all matches, paginated, lets the user find the right book.

## What Changes

- Replace the single-result display with a vertical list of result cards, one per matching book, each showing the same attributes/cover/add-to-cart as today's single card.
- Fetch and display at most 10 books per page from the Google Books API (using the API's own `startIndex`/`maxResults` pagination, not client-side slicing of a larger fetch).
- Add pagination controls (Previous/Next) below the results list, allowing navigation between pages when there are more matches than fit on one page. Controls are hidden entirely when all matches fit on a single page. Display total number of pages and current page
- Submitting a new search always starts back at the first page.
- **BREAKING**: reverses `book-search`'s existing "Search result display" requirement, which currently states only the first matching result is shown and additional matches are deliberately not indicated — this change makes showing all matches the whole point.

## Capabilities

### Modified Capabilities
- `book-search`: The "Search result display" requirement (single-result-only) is removed; two new requirements are added — a paginated results list showing every match, 10 per page, with pagination controls.

## Impact

- **Code**: `src/app/book-search/google-books.ts` (the `search()` method changes from returning a single `BookSummary | null` to a page of results — a list plus the total match count — and accepts a page number to compute `startIndex`); `src/app/book-search/book-search.ts`/`.html`/`.css` (component state changes from a single found book to a results list + current page + total count, template renders a `@for` loop of cards and pagination controls below it).
- **Dependencies**: None new — still the same Google Books `volumes` endpoint, using its existing `startIndex`/`maxResults` query parameters.
- **Systems**: Purely client-side; no new external calls, just different parameters on the same endpoint.
- **Follow-on work**: Numbered page links (vs. Previous/Next only), a "jump to page" input, and remembering scroll position across page changes are not part of this change.
