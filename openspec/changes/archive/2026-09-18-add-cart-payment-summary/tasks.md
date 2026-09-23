## 1. Total price computation

- [x] 1.1 In `cart.ts`, add `readonly totalPrice = computed(() => this._books().reduce((sum, b) => sum + b.price, 0));` alongside the existing `count` computed — verify by inspecting it sums every item's `price`
- [x] 1.2 Add unit tests in `cart.spec.ts` covering: `totalPrice` sums correctly across multiple added books, is `0` for an empty cart, and updates after `remove()` — verify `npm test` passes

## 2. Payment section markup and formatting

- [x] 2.1 In `cart-page.ts`, add computed properties for the singular/plural item-count label (e.g. "1 item" / "3 items") and the formatted total (`cart.totalPrice().toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })`) — verify with manual checks (1 item vs. multiple, a small and a larger total)
- [x] 2.2 In `cart-page.html`, wrap the existing `.paypal-button` in a new `<section class="payment-section">`, adding a `<p class="payment-summary">` above it showing the item-count label and formatted total (e.g. "3 items · 89,47 €"), keeping the whole section inside the existing `@if (cart.books().length > 0)` branch — verify by inspecting the button's class/behavior are unchanged and the section is absent when the cart is empty
- [x] 2.3 In `cart-page.css`, style `.payment-section` and `.payment-summary` using existing `theming` tokens and this app's `clamp()`-based spacing conventions, consistent with the rest of the page — verify by inspecting no new hardcoded colors are introduced

## 3. Update existing tests

- [x] 3.1 Update `cart-page.spec.ts` to assert the order summary text (item count + formatted total) is shown when the cart has books, and that neither the summary nor the button appear when the cart is empty — verify `npm test` passes
- [x] 3.2 Check `e2e/shopping-cart.spec.ts`'s existing PayPal-button tests still pass now that it's nested inside `.payment-section` (selector-only, no nesting assertions expected to break), and add an e2e test asserting the summary text updates correctly as items are added/removed — verify `npm run e2e` passes

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold
- [x] 4.3 Run `npm run e2e` and confirm the full e2e suite passes
- [x] 4.4 Manually verify in the browser that adding/removing books updates the item count and total price shown above the PayPal button, and that the whole payment section disappears when the cart becomes empty (verified via a throwaway Playwright script with screenshots: 2 items summed correctly to "2 items · 73,59 €", removing one updated to "1 item · 40,05 €", removing the last hid the whole payment section)
