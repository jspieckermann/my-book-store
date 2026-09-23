## Why

The cart page lets a user review what they've added but gives no visual cue toward checkout. A PayPal-styled button at the bottom of the page previews where payment will eventually go, without building real payment processing yet.

## What Changes

- Add a payment button styled to resemble PayPal's button (its yellow/gold color and "PayPal" wordmark) at the bottom of the cart page, below the book list.
- The button has no function: activating it does nothing — no navigation, no network request, no payment processing. This is a visual placeholder only, per the request.
- The button is shown only when the cart has one or more books (a payment control for an empty cart doesn't make sense); it's not shown on the empty-cart state.
- **Assumption**: the button uses PayPal's actual brand color and wordmark styling rather than this app's `theming` tokens — a deliberate, one-off exception to the app's usual "theme tokens only" convention, since the entire point is that it visually reads as "PayPal," not that it matches the app's dark theme. No PayPal SDK, logo asset, or external script is used — it's a plain styled `<button>`.

## Capabilities

### Modified Capabilities
- `shopping-cart`: gains a new requirement for the inert, PayPal-styled payment button on the cart page.

## Impact

- **Code**: `src/app/cart-page/cart-page.html`/`.css` (add the button markup and its one-off PayPal-styled CSS, shown only when the cart is non-empty).
- **Dependencies**: None new — no PayPal SDK or script.
- **Systems**: Purely client-side, presentational only; the button performs no action.
- **Follow-on work**: Real PayPal (or any) payment integration, checkout flow, and order totals are not part of this change.
