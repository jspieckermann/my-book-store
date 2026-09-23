## Context

`GoogleBooks.search(query)` (`src/app/book-search/google-books.ts`) currently maps only `items[0]` into a single `BookSummary`, returning `Observable<BookSummary | null>`. `BookSearch`'s `state` signal (`book-search.ts`) is a discriminated union whose `found` case carries one `book: BookSummary`; `book-search.html` renders that one book inside a single `.book-card`. The Google Books `volumes` endpoint already supports `startIndex` and `maxResults` query parameters for server-side pagination, and its response includes a `totalItems` count (an estimate, per Google's own documentation — not always exact). See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Fetch only the current page's 10 results from the API per request (via `startIndex`/`maxResults`), never fetch-all-then-slice client-side.
- Reuse the exact existing `.book-card` markup for each list item (cover, attributes, add-to-cart) — no new "compact" card variant — since the change only asks for a vertical list of what's already there, not a new visual density.
- Keep the "Add to cart" button on every card wired to the same `Cart.add()` call as today; the shopping-cart capability already only tracks a total count, not item identity, so no changes are needed there.
- Pagination must show the number of total pages and currently displayed page

**Non-Goals:**
- No numbered page links, "jump to page" input, or infinite scroll — Previous/Next only, per proposal's Follow-on work.
- No client-side caching of previously-viewed pages — navigating back to a page already seen re-fetches it. `totalItems` alone doesn't guarantee stable results across requests (Google's index can shift between calls), so re-fetching is also more correct than trusting a stale cache.
- No change to how the search text itself is routed (ISBN vs. general query) — that logic is unchanged; only how many results are requested and how they're rendered changes.

## Decisions

**`GoogleBooks.search(query, page)` returns `Observable<{ books: BookSummary[]; totalItems: number }>` (never `null`) instead of `Observable<BookSummary | null>`.**
With multiple results, "not found" becomes "zero books in the list" rather than a special null case — collapsing that into an always-present `books: []` array is simpler for the caller than continuing to special-case null. `totalItems` is threaded through so the component can compute total pages / whether a next page exists, without a second request.
- *Alternative considered*: keep returning `null` for the empty case and a non-empty array otherwise (`BookSummary[] | null`). Rejected — `[]` already unambiguously means "no results" for a list-shaped value; keeping `null` as well would just be two ways to say the same thing.

**Request params: `startIndex = (page - 1) * 10`, `maxResults = 10`, `page` is 1-based.**
Matches the spec's "10 per page" directly, and 1-based paging matches how the UI will display "page 1", "page 2" without an off-by-one translation at the template layer.

**Page state: a `page = signal(1)` on `BookSearch`, reset to `1` inside `search()` before every new query, incremented/decremented by Previous/Next handlers that re-invoke the same fetch logic with the current `activeQuery` and the new page number — not by re-submitting the form.**
The component needs to remember the *submitted* query text separately from the live input (`query` signal is still being edited by the user while viewing results), so pagination doesn't depend on the input's current, possibly-changed contents. A small `activeQuery = signal('')` set at submit time, read by the pagination handlers, keeps this input/results distinction explicit.
- *Alternative considered*: derive the active query from the input signal at pagination-click time too. Rejected — if the user edits the input after seeing results but before clicking "Next," this would silently search a different query than the one the visible results came from.

**"Has next page" computed as `page * 10 < totalItems`; "Previous" disabled when `page === 1`.**
Straightforward arithmetic on values already in hand (current page, page size, total). Because `totalItems` is an estimate, this can occasionally be off by a little at the boundary (seeing a `page * 10 < totalItems` say "yes" when the next request actually returns zero items) — handled defensively per the Risk below, not by trying to make the estimate exact.

**Results list is a `@for` loop over the existing `.book-card` markup within the same component template — no new sub-component extracted.**
`add-book-result-card`'s design explicitly deferred extracting a `BookCard` component "until a second place needs to render a book card." This change still only has one render site (the loop), so that deferral still holds; a `@for` over the same markup block satisfies it without new indirection.
- *Alternative considered*: extract a `BookResultCard` component now, since there are now multiple card instances on screen simultaneously. Rejected — multiple *instances* of a loop body isn't the same as multiple *call sites*; Angular's `@for` handles repeated markup natively without needing a component boundary.

**Pagination controls: two `<button>` elements ("Previous", "Next") below the results list, each disabled per the state above, with a page indicator (e.g. "Page 2 of 5") between them, where total pages is computed as `Math.ceil(totalItems / 10)`.**
Matches "Add pagination below the list" literally and needs no new dependencies; a page indicator with the total page count gives the user orientation (per the Goals above) without adding numbered-page complexity (explicitly deferred).

## Risks / Trade-offs

- [`totalItems` is a Google-provided estimate, so the "Next" control could occasionally be enabled when no further results actually exist] → Mitigated defensively: if a "next page" fetch returns zero books, the component treats that as having reached the end (e.g. re-disables "Next" without erroring), rather than showing an empty list as if it were a real page.
- [Re-fetching every page navigation (no caching) means clicking Previous after Next re-issues a request rather than reusing the earlier response] → Accepted per Non-Goals; simplicity and correctness (avoiding stale/shifted results) outweigh the minor extra network calls for a personal book-store app at this stage.
- [`Search results list`'s "Missing attributes are omitted gracefully per book" scenario duplicates, per-book, the same behavior the single-card version already had] → Accepted; the original single-item scenario was removed along with "Search result display," so this needs restating under the new requirement to keep the behavior specified at all.
