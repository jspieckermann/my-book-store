## Why

Users can search for and see a book, but have no way to express intent to buy it. A minimal "add to cart" affordance — a button on the result card and a running count in the header — is the smallest next step toward an actual purchase flow, without building the cart page itself yet.

## What Changes

- Add a shopping cart icon to the right side of the header, with a badge showing the total number of books added to the cart.
- Add an "Add to cart" button to the found-book result card; activating it adds that book to the cart and increments the header badge's count by one.
- The badge SHALL be hidden when the cart is empty (count is zero) and shown with the count once at least one book has been added.
- **Explicitly out of scope for this change**: there is no way to open, view, edit, or remove items from the cart — the icon is a display-only indicator for now, per the request. Cart contents live only in memory for the current page session; there is no persistence (e.g. across a page reload) in this change.

## Capabilities

### New Capabilities
- `shopping-cart`: Defines the cart's behavior — accepting an added book, tracking a running total count, and displaying that count via a badge on a cart icon in the header. Explicitly excludes any way to view or manage cart contents in this change.

### Modified Capabilities
- `isbn-search`: Adds an "Add to cart" button to the existing found-book result card (via an ADDED delta block — no existing requirement's behavior changes).

## Impact

- **Code**: New shared `CartService` (e.g. `src/app/cart/cart.ts`) tracking an in-memory item count; `src/app/header/header.html`/`.css`/`.ts` (cart icon + badge, injects `CartService`); `src/app/isbn-search/isbn-search.html`/`.css`/`.ts` (adds the "Add to cart" button to the result card, injects `CartService`).
- **Dependencies**: None new.
- **Systems**: Purely client-side, in-memory state — no backend, no new API calls.
- **Follow-on work**: Viewing/editing cart contents, persisting the cart (e.g. across reloads), checkout, and removing items are all explicitly deferred to future changes.
