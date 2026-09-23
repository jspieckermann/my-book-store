## Why

The cart page currently ends at the payment section — there's no way to discover more books once you've added something to the cart. Surfacing books by the same authors as what's already in the cart is a natural, low-effort way to encourage further browsing right where the user already is.

## What Changes

- New "recommendations" section rendered below the cart's book list (above or alongside the payment section), showing books by the same authors as the books currently in the cart.
- One Google Books API request per recommendation fetch, querying all of the cart's unique authors OR-joined together (capped at the first 5 unique authors), rather than one request per author.
- Recommendations exclude any book already in the cart (matched by case-insensitive title).
- A new, minimal book card component — cover image, title, author(s), and an icon-only "add to cart" button — distinct from the existing full `BookCard` (which also shows publisher, date, description, rating, and price).
- The section is a horizontally paginated strip: Previous/Next controls step through fixed-size windows of the fetched recommendations, client-side, with no scrollbar-based scrolling — the same interaction shape as the existing search-results pagination, applied to an in-memory list instead of re-fetching from the API per page.
- Recommendations are refetched only when the cart's *set* of unique authors changes (not on every add/remove).
- The section is not rendered at all when the cart is empty, or when the recommendation query returns no results.
- Adding a recommended book to the cart behaves exactly like adding a search result today — repeat additions are allowed, no "already in cart" state is tracked.

## Capabilities

### New Capabilities
- `book-recommendations`: fetching and displaying same-author book recommendations on the cart page — the query strategy, exclusion rule, minimal card content, paging controls, refetch trigger, and empty-state (invisible) behavior.

### Modified Capabilities
_(none — the cart page gains new content, but no existing `shopping-cart` requirement's behavior changes)_

## Impact

- Affected files: new `src/app/book-recommendations/` (component + template + styles) or similar, new minimal card component (e.g. `src/app/recommendation-card/`), `src/app/book-search/google-books.ts` (new author-query method), `cart-page.html`/`.ts` (renders the new section), `src/app/language/translations.ts` (new section-title and pagination-control keys).
- No changes to `Cart`, `BookCard`, or existing search/pagination behavior.
