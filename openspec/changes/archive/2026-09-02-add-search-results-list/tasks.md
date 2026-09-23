## 1. Service: paginated search

- [x] 1.1 In `google-books.ts`, change `search(query: string)` to `search(query: string, page: number)`, adding `startIndex` (`(page - 1) * 10`) and `maxResults` (`10`) to the request params — verify by inspecting the params logic for page 1 (`startIndex=0`) and page 3 (`startIndex=20`)
- [x] 1.2 Change the method's return type from `Observable<BookSummary | null>` to `Observable<{ books: BookSummary[]; totalItems: number }>`, mapping every item in `response.items` (not just `items[0]`) into a `BookSummary`, and reading `response.totalItems` (defaulting to `0` if absent) — verify the mapping returns `{ books: [], totalItems: 0 }` when `items` is absent, and a `books` array matching `items.length` otherwise

## 2. Component: results list and pagination state

- [x] 2.1 Replace the `found` state case's single `book: BookSummary` with `books: BookSummary[]` and `totalItems: number` in `book-search.ts`'s `SearchState` union, and add a `page = signal(1)` and `activeQuery = signal('')` — verify `ng build` succeeds against the still-old template (expected to fail until task 3 updates it) or update the template in the same pass
- [x] 2.2 Update `search()` to reset `page` to `1`, set `activeQuery` to the trimmed query, and call `googleBooks.search(activeQuery(), 1)`, mapping the result to `{ kind: 'not-found' }` when `books.length === 0` or `{ kind: 'found', books, totalItems }` otherwise — verify by inspecting the logic covers zero, one, and multiple results
- [x] 2.3 Add `goToNextPage()` and `goToPreviousPage()` methods that increment/decrement `page`, call `googleBooks.search(activeQuery(), page())`, and update the `found` state's `books`/`totalItems` in place (without resetting `page`) — verify by inspecting both methods use `activeQuery()` (not the live input `query()`) and the current `page()`
- [x] 2.4 Add computed signals `hasNextPage` (`page() * 10 < totalItems` for the current `found` state, `false` otherwise), `hasPreviousPage` (`page() > 1`), and `totalPages` (`Math.ceil(totalItems / 10)` for the current `found` state, `0` otherwise) — verify by inspecting the computation against boundary values (exactly 10, 11, and 20 total items at page 1)
- [x] 2.5 Handle a next-page fetch that returns zero books (stale `totalItems` estimate) by treating it as the end of results — do not replace the currently-displayed list with an empty one; instead revert to the previous page and disable "Next" — verify by inspecting the `goToNextPage()` logic covers this case

## 3. Template and styling: results list and pagination controls

- [x] 3.1 Replace the single `@if (foundBook(); as book) { <div class="book-card">...</div> }` block in `book-search.html` with a `@for` loop over the current page's `books`, rendering the existing `.book-card` markup (cover, attributes, add-to-cart) for each — verify by inspecting the template that the loop body is otherwise unchanged from the prior single-card markup
- [x] 3.2 Add pagination controls (a "Previous" button, a page indicator showing the current page and total pages e.g. "Page 2 of 5", and a "Next" button) below the results list, shown only when the `found` state's `totalItems` exceeds 10, with each button's `[disabled]` bound to the corresponding `hasPreviousPage`/`hasNextPage` computed signal and the indicator bound to `page()`/`totalPages()` — verify by inspecting the template's conditional rendering, disabled bindings, and total-pages display
- [x] 3.3 Style the results list (vertical stacking with spacing between cards) and the pagination controls using `theming` tokens only, consistent with the existing `.search-button`/`.add-to-cart-button` styling — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added to `book-search.css`

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm existing tests still pass
- [ ] 4.3 Manually search a query known to match many books (e.g. "Harry Potter") and confirm up to 10 result cards render as a vertical list, each with its own attributes/cover/add-to-cart button
- [ ] 4.4 Manually click "Next" and confirm the list updates to a different set of books and "Previous" becomes enabled
- [ ] 4.5 Manually click "Previous" from page 2 and confirm the list returns to the original first-page results
- [ ] 4.6 Manually search a query matching 10 or fewer books (e.g. a specific ISBN) and confirm no pagination controls are shown
- [ ] 4.7 Manually navigate to page 2 of a multi-page search, then submit a different new search, and confirm the new search's results start at page 1 with no pagination controls left over from the prior search's page state
- [ ] 4.8 Manually search something with no matches and confirm "Book not found" still renders correctly with no list or pagination controls
