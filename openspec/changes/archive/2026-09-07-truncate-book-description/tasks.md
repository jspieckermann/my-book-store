## 1. Truncation logic and expand control

- [x] 1.1 In `book-card.ts`, add an `expanded` signal (default `false`) and a computed `displayDescription` (and a `descriptionTruncated` flag) that: returns the full description with no truncation when its length is ≤250 or `expanded()` is true, otherwise returns the first 250 characters trimmed back to the last whitespace boundary plus `…` — verify with a few manual length checks (249, 250, 251, and a long description with/without a word boundary near 250)
- [x] 1.2 In `book-card.html`, render `displayDescription` in the description `<dd>`, and when `descriptionTruncated()` is true render an icon-only `.expand-button` after it with `aria-expanded="expanded()"` and `aria-label` toggling between "Show full description" / "Show less", wired to toggle the `expanded` signal on click — verify by inspecting the template renders no button when the description is short
- [x] 1.3 Add a chevron SVG icon to the expand button (matching the app's existing stroke-based icon style) that visually differs between collapsed and expanded state — verify by inspecting the markup swaps orientation/path based on `expanded()`

## 2. Styling

- [x] 2.1 In `book-card.css`, style `.expand-button` to reuse the existing `.add-to-cart-button`/`.delete-button` icon-button chrome (same padding, border, background, border-radius) and size its icon via the existing `.action-icon` class, including the same hover/press/reduced-motion rules — verify by inspecting the selector matches the established pattern

## 3. Update existing tests

- [x] 3.1 Add unit tests in `book-card.spec.ts` covering: a description ≤250 chars renders in full with no expand button; a description >250 chars renders truncated with an ellipsis and an expand button; clicking the expand button reveals the full text and toggles `aria-expanded`; clicking it again re-collapses — verify `npm test` passes
- [x] 3.2 Update `e2e/book-search.spec.ts`'s cover-image aspect-ratio regression test (`'preserves the cover image's aspect ratio even next to a long description'`), whose long description will now be truncated by default — click the new expand control before measuring `.book-details`' height so the test still exercises a genuinely tall sibling, or otherwise adjust it to keep verifying the cover image isn't stretched — verify `npm run e2e` passes
- [x] 3.3 Check `e2e/shopping-cart.spec.ts` and `src/app/cart-page/cart-page.spec.ts` for any description-related assertions that might be affected by truncation on cart-page cards, and update if needed — verify `npm test` and `npm run e2e` pass (no change needed: neither file has any description-related assertions)

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold
- [x] 4.3 Run `npm run e2e` and confirm the full e2e suite passes
- [x] 4.4 Manually verify in the browser that a long description truncates at ~250 characters with an ellipsis and expand icon, that clicking it reveals the full text and swaps the icon, and that clicking again re-collapses it, on both a search result card and a cart page card (verified via a throwaway Playwright script with screenshots on both pages: collapsed shows 249 chars + ellipsis + down-chevron, expanded shows full text + up-chevron, re-collapsing restores truncated text)
