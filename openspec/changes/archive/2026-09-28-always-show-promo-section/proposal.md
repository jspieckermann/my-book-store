## Why

The promo section currently only appears before a search and after a no-match search, disappearing while a search is loading, has failed, or has found results. That makes it an inconsistent, easy-to-miss presence rather than the persistent "ad space" a parody promotional section should be — and its current position above the results list pushes real search results further down the page whenever it's shown.

## What Changes

- The promo section SHALL always be visible on the search page, in every state (idle, loading, error, not-found, and found) — not just idle/not-found.
- The promo section's position moves from above the results list to below the results list and pagination controls (when present), so it never displaces real search results.
- The existing "Book not found", loading, and error messages continue to be shown exactly as before; only the promo section's own visibility condition and position change.
- **BREAKING** (behavioral, not API): removes the `showPromo` idle/not-found gating — the promo section is no longer conditionally mounted/unmounted based on search state, so its `PromoSection` instance now persists for the page's lifetime instead of being destroyed and recreated each time the triggering state is (re-)entered.
- Bundled follow-up (per a post-proposal request): the promo section's headline switches from garish promotional styling (pink text-stroke outline) to the same plain styling as the page's other headlines (e.g. the "Search" page title), and its text changes from "Deal of the day" to "Best offers." The cards and discount badges keep their existing garish, animated styling — only the headline changes.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
- `promo-section`: the "Promo section shown when there is nothing else to show" requirement changes from conditional (idle/not-found only) to always-visible in every search state, and its position moves to below the results list/pagination. The "Visually distinct, animated promotional styling" requirement's headline clause changes from a prominent/attention-grabbing garish headline to one styled like the page's other headlines.

## Impact

- Affected files: `src/app/book-search/book-search.ts` (remove the `showPromo` computed), `src/app/book-search/book-search.html` (move `<app-promo-section />` below the results-list/pagination block and render it unconditionally), `src/app/book-search/book-search.css` (re-check the promo section's spacing now that it's a bottom element instead of a top one).
- Test impact: `src/app/book-search/book-search.spec.ts` and `e2e/promo-section.spec.ts` have several tests asserting the promo section is hidden during loading/error/found states and shown only for idle/not-found — these need rewriting to assert it's always visible and appears after the results/pagination instead.
