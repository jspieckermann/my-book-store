## Context

`book-card.html`/`.css` is shared by search results (`.add-to-cart-button`, text label) and the cart page (`.delete-button`, icon-only, no button chrome). See proposal.md for why these should be visually unified. `.add-to-cart-button` and `.delete-button` already carry matching hover/press feedback rules from `add-interactive-feedback`; this change only needs to unify their box styling and swap the add-to-cart label for an icon.

## Goals / Non-Goals

**Goals:**
- Both controls render as identically-sized icon buttons (same padding, border, background, border-radius), differing only in icon.
- "Add to cart" uses the same cart SVG icon (viewBox and paths) as the header's `.cart-icon`, so the icon reads as the same symbol app-wide.
- Both controls keep an accessible name via `aria-label` (and `aria-label`+`role="img"` on the inner `<svg>`, matching the existing `.delete-button` pattern) since visible text is removed.

**Non-Goals:**
- No change to click behavior, event handlers, or the cart/service logic.
- No change to hover/press/reduced-motion feedback rules already in place.
- No change to buttons outside book-card (header, search, pagination, PayPal, back-link).

## Decisions

- **Reuse `.delete-button`'s box model as the shared chrome**: `display: flex; align-items: center; justify-content: center;` with equal padding on all sides (e.g. `0.5rem`) and `border: 1px solid var(--color-border); background-color: var(--color-surface); border-radius: 0.5rem;`, applied to both `.add-to-cart-button` and `.delete-button`. Alternative considered: keep `.add-to-cart-button`'s existing asymmetric text-oriented padding (`0.5rem`/`1.25rem`) — rejected because it would make an icon look off-center and wouldn't match `.delete-button`'s icon sizing.
- **Icon size**: both icons sized via a shared class (e.g. reuse `.delete-icon`'s `clamp(1.25rem, 2.5vw, 1.5rem)` sizing) so the two icons render at the same visual size regardless of which SVG is inside.
- **Cart icon markup**: copy the header's `.cart-icon` `<svg>` (same viewBox, paths, stroke settings) into `book-card.html` for `.add-to-cart-button`, rather than extracting a shared icon component — matches this project's existing convention of duplicating small inline SVGs per template (see header/footer/book-card today).
- **Accessible name**: add `aria-label="Add to cart"` to `.add-to-cart-button` and `role="img" aria-label="Add to cart"` on its inner `<svg>`, mirroring `.delete-button`'s existing `aria-label="Remove from cart"` pattern exactly.

## Risks / Trade-offs

- [Existing tests assert visible "Add to cart" text] → Update `book-card.spec.ts` and the e2e specs (`book-search.spec.ts`, `shopping-cart.spec.ts`) that currently locate the control by its text to instead locate it by role/`aria-label`, alongside this change.
- [Icon-only buttons can be less discoverable than labeled ones] → Mitigated by keeping the icon visually consistent with the header's already-familiar cart icon, plus the `aria-label` for assistive tech and native browser tooltips are unaffected by this change.
