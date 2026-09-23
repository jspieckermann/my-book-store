## Why

The cart page currently only lets you look at what you've added, with no way to change your mind about a single book short of signing out (which clears everything). A per-book delete control lets the user remove just the item they no longer want.

## What Changes

- Add a delete control (a small icon) to each book card on the cart page. Activating it removes that specific book from the cart, updating the cart page's list and the header's cart count immediately.
- If the same book was added more than once, deleting one of its cards removes only that one occurrence — the rest stay in the cart.
- Removing the cart's last remaining book returns the cart page to its existing empty-cart message.
- No confirmation prompt before removal — matches the app's existing pattern of immediate, un-confirmed actions (e.g. sign-out).
- **BREAKING**: reverses `shopping-cart`'s "No cart item editing or removal in this stage" requirement's prohibition on removal. Editing (e.g. changing a book's details or quantity) remains unsupported.

## Capabilities

### Modified Capabilities
- `shopping-cart`: the removal prohibition is lifted and replaced with a new "Remove book from cart" requirement; the editing prohibition is retained under its own requirement.

## Impact

- **Code**: `src/app/cart/cart.ts` (add a `remove(book: BookSummary)` method); `src/app/book-card/book-card.ts`/`.html`/`.css` (new `showDelete` input and a delete icon button, following the existing `showAddToCart` pattern); `src/app/cart-page/cart-page.html` (pass `[showDelete]="true"` to each card).
- **Dependencies**: None new.
- **Systems**: Purely client-side; no new external calls.
- **Follow-on work**: Editing an item's details/quantity, undoing a removal, and any confirmation step before deleting are not part of this change.
