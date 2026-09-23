## Why

The cart currently only tracks a number — there's no way to see which books were actually added. Letting the user open a dedicated page listing their cart's books is the first step toward checkout, and makes the cart badge's count mean something concrete the user can inspect.

## What Changes

- The shopping cart icon in the header becomes an interactive link to a new cart page, but only when the cart has one or more books; it stays a non-interactive display-only indicator when the cart is empty (unchanged from today).
- A new cart page lists every book in the cart as a book card (same attributes and cover image as a search result card), without an "Add to cart" control on any of them.
- The cart page has a control to navigate back to the main (search) page.
- **BREAKING**: reverses `shopping-cart`'s current "No cart viewing or management in this stage" requirement's prohibition on viewing — viewing is now supported. Editing or removing individual items remains unsupported (restated under a new requirement).
- Adding a book to the cart still increases the header badge's count by one per activation; if the same book is added more than once, it appears as a separate card each time on the cart page (there's no reliable way to identify "the same book" from the Google Books API data this app already stores, so no de-duplication or quantity grouping is attempted).
- **Explicitly out of scope for this change** (per the request): any actual payment/checkout flow, an order total, and removing or editing items from the cart page — only viewing the list and navigating back.

## Capabilities

### Modified Capabilities
- `shopping-cart`: the cart now stores the actual added books (not just a count), the cart icon becomes conditionally interactive, a cart page requirement and a "no editing/removal" requirement are added, and the old blanket "no viewing" prohibition is removed.

## Impact

- **Code**: `src/app/cart/cart.ts` (stores `BookSummary[]` instead of a bare count; `add()` takes the book being added); `src/app/header/header.html` (cart icon becomes a router link when the cart is non-empty); `src/app/app.routes.ts`/`app.html`/`app.ts` (wires up the app's existing, currently-unused Angular Router: the search page and the new cart page each become a route); a new `src/app/cart-page/` component; a new shared `src/app/book-card/` component extracted from `book-search`'s existing card markup so both the search results and the cart page render cards identically without duplicating the template.
- **Dependencies**: None new — `provideRouter`/`RouterOutlet`/`RouterLink` are already part of this Angular project's scaffolding (`app.config.ts`), just not yet used by any route.
- **Systems**: Purely client-side; no new external calls.
- **Follow-on work**: An actual checkout/payment flow, an order total, removing or editing individual cart items, and per-user cart persistence are not part of this change.
