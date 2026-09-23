## 1. Header link markup and styling

- [x] 1.1 In `header.html`, wrap the `.logo` `<svg>` and `.title` `<span>` in a new `<a class="brand" routerLink="/">`, keeping both elements' own markup unchanged — verify by inspecting the logo and title are both descendants of the new anchor
- [x] 1.2 In `header.css`, add `.brand { display: flex; align-items: center; gap: <same as .header's gap>; }` so the wrapped logo/title retain their current spacing and alignment, plus the same hover/press feedback pattern used by `a.cart` (`filter` on hover, `filter` + `scale()` on active, reduced-motion override) — verify by inspecting the header's visual layout is unchanged and the new link shows the same feedback pattern as the other header controls

## 2. Update existing tests

- [x] 2.1 Check `header.spec.ts` and `e2e/app-shell.spec.ts` for `.logo`/`.title` assertions still pass now that they're nested inside `.brand` (class-only selectors, no parent-relationship assertions expected to break) — verify `npm test` and `npm run e2e` pass (found and fixed an additional break: `app.spec.ts` had no router provider at all, previously latent since `.cart`'s conditional `routerLink` was rarely instantiated in its default signed-out state — now `.brand`'s unconditional `routerLink` surfaced it; added `provideRouter([])` matching the pattern already used elsewhere)
- [x] 2.2 Add a unit test in `header.spec.ts` asserting `.brand` has `routerLink="/"` (or the equivalent host binding Angular exposes for testing), and an e2e test in `app-shell.spec.ts` (or a new one) asserting clicking the logo/title from the cart page navigates back to the main page — verify both pass

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it completes without errors
- [x] 3.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold
- [x] 3.3 Run `npm run e2e` and confirm the full e2e suite passes
- [x] 3.4 Manually verify in the browser that clicking the logo/title from the cart page returns to the main search page, that the header's visual layout is unchanged, and that hover/press feedback is visible on the new link (verified via a throwaway Playwright script with screenshots: hover/active filter and transform values confirmed distinct at each stage, header layout unchanged before/after, click navigated from cart to search page)
