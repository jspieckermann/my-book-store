## Why

The cart page currently ends with a lone PayPal-styled button and no summary of what's being paid for — a user has to scroll back up and manually count/add prices to know how many items and how much they'll be charged.

## What Changes

- `cart-page.html`: wrap the existing PayPal button in a new `.payment-section`, placed below the book card list, and add an order summary within that section showing the number of items in the cart and their combined price (e.g. "3 items · 89,47 €"), positioned above the button. The whole section keeps the existing hide-when-empty behavior (nothing shown when the cart has no books).
- `cart.ts`: add a `totalPrice` computed signal (sum of every cart item's `price`), alongside the existing `count` signal.
- `cart-page.ts`/`.css`: format the total as German-locale currency (matching the per-book price format already used on book cards) and style the new section/summary using existing `theming` tokens.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `shopping-cart`: the PayPal button now lives inside a payment section, and a new order-summary requirement (item count + total price) is added.

## Impact

- Affected files: `src/app/cart/cart.ts`, `src/app/cart-page/cart-page.ts`, `src/app/cart-page/cart-page.html`, `src/app/cart-page/cart-page.css`.
- Existing unit tests (`cart.spec.ts`, `cart-page.spec.ts`) and e2e tests (`shopping-cart.spec.ts`) will need review; the `.paypal-button` selector itself doesn't change, but new assertions for the summary text and updated counts/totals as items are added/removed should be added.
