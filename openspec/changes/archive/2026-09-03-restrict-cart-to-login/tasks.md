## 1. Cart service

- [x] 1.1 Inject `GoogleAuth` into `src/app/cart/cart.ts` and register an `effect()` in the constructor that sets `this._count` to `0` whenever `googleAuth.user()` is `null` — verify by inspecting the effect runs on every `user()` change, including the initial signed-out state
- [x] 1.2 Confirm `add()` is left unchanged (no sign-in guard added) per design.md's decision — verify by inspecting `Cart` still only reads `googleAuth.user()` inside the new effect, not inside `add()`

## 2. Header integration

- [x] 2.1 In `header.html`, wrap the existing `<span class="cart">...</span>` element in `@if (googleAuth.user())` — verify by inspecting the cart icon and badge render only when signed in, with no other markup changes to that block

## 3. Book search integration

- [x] 3.1 Inject `GoogleAuth` into `src/app/book-search/book-search.ts` (alongside the existing `Cart` injection) — verify by inspecting the component follows the same `protected readonly googleAuth = inject(GoogleAuth)` pattern used in `Header`
- [x] 3.2 In `book-search.html`, wrap the `<button type="button" class="add-to-cart-button" ...>` element in `@if (googleAuth.user())` inside the `@for` loop — verify by inspecting the button renders only when signed in, with no other changes to the book card markup

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm existing tests still pass
- [x] 4.3 Manually search for a book while signed out and confirm no "Add to cart" button appears on its result card
- [x] 4.4 Manually confirm the shopping cart icon is not visible in the header while signed out
- [x] 4.5 Manually sign in, add one or more books to the cart, and confirm the cart icon and badge appear with the correct count
- [x] 4.6 Manually sign out while the cart has items and confirm the cart icon disappears immediately
- [x] 4.7 Manually sign back in after 4.6 and confirm the cart badge is gone (count reset to zero), not showing the pre-logout count
