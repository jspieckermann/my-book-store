## Why

The book card's "Add to cart" control (search results) is a text button while the cart page's delete control is a bare icon with no visible button chrome — the two controls that sit in the same book-card slot look inconsistent. Replacing the "Add to cart" label with a cart icon (matching the header's icon) and giving the delete control the same button styling makes the two controls read as a matched pair.

## What Changes

- `book-card.html`: replace the "Add to cart" button's text label with a shopping-cart icon (same SVG paths as the header's cart icon), keeping an accessible name ("Add to cart") for assistive technology.
- `book-card.css`: unify `.add-to-cart-button` and `.delete-button` so both render as the same icon-only button chrome (size, padding, border, background) — differing only in which icon they contain.
- No behavior change: activating either control still adds/removes the book exactly as before.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `shopping-cart`: the "Add to cart" and delete controls become icon-only buttons that share one consistent visual style.

## Impact

- Affected files: `src/app/book-card/book-card.html`, `src/app/book-card/book-card.css`.
- Existing unit tests (`book-card.spec.ts`) and e2e tests (`book-search.spec.ts`, `shopping-cart.spec.ts`) that assert on button text ("Add to cart") or the presence of these controls will need updating to match the new icon-only markup.
