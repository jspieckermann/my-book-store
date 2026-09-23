## Why

The shopping cart currently has no connection to who's using it — anyone can add books and see the cart badge whether signed in or not, and nothing about a signed-out visitor's session is preserved anyway. Tying the cart to being signed in makes "your cart" mean something (it's tied to the Google account you're using) and avoids leaving stale item counts visible after a sign-out.

## What Changes

- The "Add to cart" button on a book's result card is only shown when a user is signed in; it's hidden entirely (not just disabled) when signed out.
- The shopping cart icon in the header is only shown when a user is signed in; it's hidden entirely when signed out (mirroring how the login/logout controls already swap based on sign-in state).
- Signing out immediately clears the cart's count back to zero, in addition to hiding the cart icon.
- **BREAKING**: reverses `shopping-cart`'s current always-visible cart icon and always-available "Add to cart" control — both now require being signed in.

## Capabilities

### Modified Capabilities
- `shopping-cart`: the cart icon's visibility requirement gains a signed-in precondition; a new requirement is added that clears the cart count on sign-out.
- `book-search`: the "Add to cart button on result card" requirement gains a signed-in precondition.

## Impact

- **Code**: `src/app/cart/cart.ts` (react to `GoogleAuth`'s signed-out state by resetting the count); `src/app/header/header.html` (wrap the `.cart` element in a signed-in check); `src/app/book-search/book-search.ts`/`.html` (inject `GoogleAuth`, gate the "Add to cart" button's rendering on it being signed in).
- **Dependencies**: None new — `Cart` and `BookSearch` both gain a dependency on the existing `GoogleAuth` service from `add-google-login`.
- **Systems**: Purely client-side; no new external calls.
- **Follow-on work**: Per-user cart persistence (a signed-in user's cart surviving a sign-out/sign-back-in or a page reload) is not part of this change — the cart still only exists in memory for the current page load, same as before.
