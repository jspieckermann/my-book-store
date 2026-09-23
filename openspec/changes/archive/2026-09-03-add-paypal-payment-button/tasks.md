## 1. Payment button

- [x] 1.1 In `cart-page.html`, add `<button type="button" class="paypal-button">PayPal</button>` (no `(click)` binding) after the `<ul class="results-list">`, inside the existing `@if (cart.books().length > 0)` branch — verify by inspecting the button has no event bindings and is absent from the empty-cart branch
- [x] 1.2 Style `.paypal-button` in `cart-page.css` with PayPal's brand colors (yellow/gold background `#FFC439`, dark navy text `#003087`, bold "PayPal"-style wordmark, pill-shaped rounded corners) — verify by inspecting the class name and comment (if any) make clear this is a deliberate one-off exception to the app's usual `theming`-token-only convention, per design.md

## 2. Verification

- [x] 2.1 Run `npm run build` and confirm it completes without errors
- [x] 2.2 Run `npm test` and confirm existing tests still pass
- [x] 2.3 Manually add a book to the cart, view the cart page, and confirm the PayPal-styled button is visible at the bottom, below the book list
- [x] 2.4 Manually click the button and confirm nothing happens (no navigation, no visible error, no network request in the browser's dev tools)
- [x] 2.5 Manually remove all books from the cart (or view the cart page while empty) and confirm the payment button is not shown
