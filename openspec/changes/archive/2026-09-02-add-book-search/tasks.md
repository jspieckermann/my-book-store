## 1. Rename files and identifiers

- [x] 1.1 Rename the folder `src/app/isbn-search/` to `src/app/book-search/`, and within it rename `isbn-search.ts`/`.html`/`.css` to `book-search.ts`/`.html`/`.css` (keep `google-books.ts` as-is) — verify the new file paths exist and the old `isbn-search.*` files no longer do
- [x] 1.2 Rename the component class `IsbnSearch` to `BookSearch` and its selector `app-isbn-search` to `app-book-search` in `book-search.ts` — verify `ng build` still fails only on the not-yet-updated references (app.ts/app.html), confirming the rename itself is internally consistent
- [x] 1.3 Update `src/app/app.ts` (import path and class name) and `src/app/app.html` (`<app-isbn-search />` → `<app-book-search />`) to reference the renamed component — verify `ng build` succeeds

## 2. Query construction: ISBN detection vs. general search

- [x] 2.1 In `google-books.ts`, rename `searchByIsbn(isbn: string)` to `search(query: string)`, add an ISBN-format check (strip non-alphanumeric characters, match a 10-digit-or-`X` or 13-digit result), and build the request as `isbn:{cleaned}` when it matches or the raw trimmed `query` otherwise — verify by inspecting the logic covers: a hyphenated ISBN-13, a hyphenated ISBN-10 ending in "X", a plain author name, and a plain title, routing the first two through `isbn:` and the latter two as general queries
- [x] 2.2 Update `book-search.ts` to rename its internal `isbn` signal to `query` and call the renamed `search()` method — verify `ng build` succeeds and the component's public behavior (disabled state, loading/error/found/not-found transitions) is otherwise unchanged

## 3. UI text and styling rename

- [x] 3.1 Update the input's placeholder and `aria-label` in `book-search.html` from ISBN-specific text (e.g. "Enter ISBN") to text reflecting ISBN/author/title search — verify by inspecting the template
- [x] 3.2 Rename CSS classes that reference "isbn" (e.g. `.isbn-search` → `.book-search`, `.isbn-input` → `.search-input`) in `book-search.css` and their usages in `book-search.html`; leave already-generic classes (`.book-card`, `.book-cover`, `.book-summary`, `.book-attribute`, `.add-to-cart-button`, `.status*`) unchanged — verify by inspecting the CSS/template for consistent class names with no remaining "isbn" references

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm existing tests still pass
- [x] 4.3 Manually search by a real ISBN (e.g. `9780143127550`, with and without hyphens) and confirm the correct book's result card renders as before
- [x] 4.4 Manually search by an author name (e.g. "Celeste Ng") and confirm a matching book's result card renders
- [x] 4.5 Manually search by a book title (e.g. "Everything I Never Told You") and confirm a matching book's result card renders
- [x] 4.6 Manually search for something with no matches and confirm "Book not found" still renders correctly
- [x] 4.7 Confirm only one result card is ever shown, even for a query likely to match multiple books (e.g. a common author name)
