## 1. Header controls

- [x] 1.1 In `header.css`, add `:hover { filter: brightness(1.1); }`, `:active { filter: brightness(0.9); transform: scale(0.96); }`, a `transition: transform 0.1s ease, filter 0.15s ease;` on the resting rule, and a `@media (prefers-reduced-motion: reduce) { &:active { transform: none; } }` override, to `.login`, `.logout`, and `.cart` (the `<a>` variant only — the non-interactive `<span>` variant when the cart is empty gets no feedback) — verify by inspecting all three selectors carry the same four rules and the `<span>` cart markup is untouched

## 2. Book-search controls

- [x] 2.1 Apply the same four rules (per design.md) to `.search-button` and `.pagination-button` in `book-search.css`, layered on top of the existing `:disabled` rule (disabled buttons keep their current `opacity: 0.5; cursor: not-allowed;` and get no hover/press feedback) — verify by inspecting `:disabled` isn't affected and both selectors carry the new rules

## 3. Book-card controls

- [x] 3.1 Apply the same four rules to `.add-to-cart-button` and `.delete-button` in `book-card.css` — verify by inspecting both selectors carry the new rules

## 4. Cart-page controls

- [x] 4.1 Apply the same four rules to `.back-link` (in addition to its existing `:hover` underline — both apply together) and `.paypal-button` in `cart-page.css`, per design.md's decision to give the PayPal button the same treatment despite its brand-color background — verify by inspecting both selectors carry the new rules and `.back-link`'s existing underline-on-hover still works

## 5. Verification

- [x] 5.1 Run `npm run build` and confirm it completes without errors
- [x] 5.2 Run `npm test` and confirm existing unit tests still pass (pure CSS change, coverage should be unaffected)
- [x] 5.3 Run `npm run e2e` and confirm the existing suite still passes (pure CSS change, no selectors used by existing tests are removed)
- [x] 5.4 Add an e2e test (e.g. in `app-shell.spec.ts` or a new file) that hovers a representative control (`.search-button`) and asserts its computed `filter` differs from the resting state, then presses it (`page.mouse.down()` at its location) and asserts the computed `filter`/`transform` differs again from the hover state — verify the test passes
- [x] 5.5 Add an e2e test that emulates `prefers-reduced-motion: reduce` (`page.emulateMedia({ reducedMotion: 'reduce' })`), presses the same representative control, and asserts its computed `transform` is `none` while its computed `filter` still differs from the resting state — verify the test passes
