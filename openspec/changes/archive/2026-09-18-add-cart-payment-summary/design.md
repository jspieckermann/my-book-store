## Context

`cart-page.html` currently renders the `.paypal-button` as a bare sibling right after `.results-list`, inside the `@if (cart.books().length > 0)` branch. `Cart` (in `cart.ts`) already exposes a `count` computed signal (`this._books().length`); every `BookSummary` now has a required `price` field (from `add-book-price`), so a total is a simple sum away. See proposal.md for why the summary is being added.

## Goals / Non-Goals

**Goals:**
- Wrap the existing button in a new `.payment-section`, with an order summary (item count + total price) shown above it.
- Total price sums every cart item's `price`, formatted the same way as the per-book price already shown on cards (German-locale currency).
- The whole section (summary + button) keeps the current hide-when-empty behavior — nothing new to gate separately.
- Summary updates reactively as items are added/removed (signals-driven, no manual refresh needed).

**Non-Goals:**
- No change to the PayPal button's own behavior (still a no-op click, still styled the same).
- No real payment/checkout flow — still purely decorative, per the existing `add-paypal-payment-button` precedent.
- No tax, shipping, or discount calculations — the total is a plain sum of item prices.

## Decisions

- **`totalPrice` lives on `Cart`**: `readonly totalPrice = computed(() => this._books().reduce((sum, b) => sum + b.price, 0));`, mirroring the existing `count` computed — keeps the aggregation next to the data it aggregates, reusable by any consumer (not just `CartPage`).
- **Formatting**: `CartPage` formats the total via `cart.totalPrice().toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })`, matching `BookCard`'s existing `formattedPrice` pattern rather than introducing a shared pipe/utility — this app already duplicates this exact one-liner per component rather than extracting a shared formatter (same precedent as the book-card price).
- **Item count wording**: singular/plural aware ("1 item" / "3 items"), computed in `CartPage` from `cart.count()`.
- **Summary layout**: a single line, e.g. "3 items · 89,47 €", inside `.payment-section`, above `.paypal-button` — a compact one-line order summary is enough for this app's scope; no itemized breakdown.
- **Markup structure**: `.payment-section` becomes a `<section>` wrapping a `<p class="payment-summary">` and the existing `<button class="paypal-button">`, placed where the bare button used to sit — the `.paypal-button` class and its behavior are unchanged, so existing selectors/tests that target it directly keep working.

## Risks / Trade-offs

- [Existing tests select `.paypal-button` directly; moving it one level deeper into `.payment-section` could break a test asserting DOM nesting] → Checked: existing tests only use `page.locator('.paypal-button')` / `querySelector('.paypal-button')`, not a nesting-specific selector, so no fallout expected — still worth re-running to confirm.
- [Floating-point sum of many random-decimal prices could show a rounding artifact like "89,470000000001"] → `toLocaleString` with `style: 'currency'` always renders exactly 2 decimal places regardless of the underlying float's precision, so this is a non-issue for display.
