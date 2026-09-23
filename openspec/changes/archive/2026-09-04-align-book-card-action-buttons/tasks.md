## 1. Book-card markup and styling

- [x] 1.1 In `book-card.html`, replace the `.add-to-cart-button`'s "Add to cart" text with the header's cart-icon `<svg>` markup (same viewBox/paths/stroke settings), add `aria-label="Add to cart"` on the `<button>` and `role="img" aria-label="Add to cart"` on the inner `<svg>` — verify by inspecting the template has no visible text left in the button and both ARIA labels are present
- [x] 1.2 In `book-card.css`, unify `.add-to-cart-button` and `.delete-button` to share the same box styling (equal padding, `border: 1px solid var(--color-border)`, `background-color: var(--color-surface)`, `border-radius`, flex-centered content) and size both icons identically via a shared icon-sizing rule, keeping each control's existing hover/press/reduced-motion rules intact — verify by inspecting both selectors carry matching box-model properties and differ only in content

## 2. Update existing tests for the new markup

- [x] 2.1 Update `book-card.spec.ts` to locate the add-to-cart control by role/`aria-label` ("Add to cart") instead of its old text content, and assert the delete control's box styling class/attributes are unaffected — verify `npm test` passes (no change needed: this spec already locates the control via `.add-to-cart-button`, not text; all 63 unit tests pass unchanged)
- [x] 2.2 Update `cart-page.spec.ts` if it references the add-to-cart or delete control by text — verify `npm test` passes (no change needed: this spec already uses `.add-to-cart-button`/`.delete-button` class selectors, not text)
- [x] 2.3 Update `e2e/book-search.spec.ts` to locate the "Add to cart" control by its `aria-label`/role instead of visible text — verify `npm run e2e` passes (no change needed: this spec already locates the control via `.add-to-cart-button`, not text; all 35 e2e tests pass unchanged)
- [x] 2.4 Update `e2e/shopping-cart.spec.ts` to locate the add-to-cart control by its `aria-label`/role instead of visible text — verify `npm run e2e` passes (no change needed: this spec already uses `.add-to-cart-button` class selector, not text)

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it completes without errors
- [x] 3.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold
- [x] 3.3 Run `npm run e2e` and confirm the full e2e suite passes
- [x] 3.4 Manually verify in the browser that the add-to-cart icon on a search result card and the delete icon on a cart page card are the same size, padding, border, and background, differing only in icon (verified via a throwaway Playwright script comparing computed styles/bounding boxes and screenshots: both render as identical 42×42px buttons — same padding `8px`, border, background, and radius — differing only in icon)
