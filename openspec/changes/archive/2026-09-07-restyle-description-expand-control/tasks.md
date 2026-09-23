## 1. Truncation threshold

- [x] 1.1 In `book-card.ts`, change `DESCRIPTION_TRUNCATE_LENGTH` from `250` to `350` (truncation/word-boundary/ellipsis logic itself is unchanged) — verify by inspecting the constant's new value

## 2. Expand control markup and styling

- [x] 2.1 In `book-card.html`, move the expand control out of the description `<dd>`'s inline flow onto its own line below the (truncated or full) description text — keep the `.expand-button` class, `aria-expanded`, and `(click)` binding — verify by inspecting the control renders as a separate block-level element after the `<dd>`
- [x] 2.2 Replace the button's visible content: drop the `aria-label`s (the visible text now serves as the accessible name) and render the text "Read more" when collapsed / "Read less" when expanded, alongside the existing chevron `<svg class="action-icon">` (reused as-is) — verify by inspecting the template swaps the text based on `expanded()`
- [x] 2.3 In `book-card.css`, restyle `.expand-button` from the boxed icon-button chrome to a link-style control matching `.back-link`'s pattern (`color: var(--color-accent)`, no border/background, `text-decoration: underline` on hover), keeping the existing `filter`/`scale` press feedback and reduced-motion override — verify by inspecting the selector no longer has `border`/`background-color`/`padding` box styling and instead matches `.back-link`'s link styling

## 3. Update existing tests

- [x] 3.1 Update `book-card.spec.ts`'s expand/collapse tests to assert the visible "Read more"/"Read less" text (in addition to the existing `aria-expanded` checks) instead of the removed `aria-label`s — verify `npm test` passes
- [x] 3.2 Verify `e2e/book-search.spec.ts`'s long-description fixture (used by both the `.expand-button`-click regression test and the cover-image aspect-ratio regression test) still exceeds 350 characters so both tests remain meaningful under the new threshold, adjusting the fixture if not — verify `npm run e2e` passes (no change needed: fixture is 1040 characters, well over 350; all 35 e2e tests pass)

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold
- [x] 4.3 Run `npm run e2e` and confirm the full e2e suite passes
- [x] 4.4 Manually verify in the browser that a long description truncates at ~350 characters, that the "Read more" chevron link appears on its own line below the text, that activating it reveals the full text and switches to "Read less", and that activating it again re-collapses it — on both a search result card and a cart page card (verified via a throwaway Playwright script with screenshots on both pages: collapsed shows 349 chars + ellipsis with an accent-colored "Read more ⌄" link on its own line, expanded shows the full text with "Read less ⌃", re-collapsing restores the truncated state)
