## Context

`header.html` currently renders `.logo` (an `<svg role="img" aria-label="Book logo">`) and `.title` (`<span>My-Book-Store</span>`) as two plain sibling elements, direct children of the `.header` flex row. The header already has a precedent for "icon + content as one link" in `.cart` (`<a class="cart" routerLink="/cart">` wrapping the cart `<svg>` and its badge). See proposal.md for why the logo/title should become clickable.

## Goals / Non-Goals

**Goals:**
- Logo + title become one link to `/` (the main search page), not two separate links.
- Visual layout (sizing, spacing, alignment within the header) is unchanged from today.
- The link gets the same hover/press feedback already used by the header's other controls (`.cart`, `.login`, `.logout`), per the `theming` capability's cross-cutting interactive-feedback requirement.

**Non-Goals:**
- No change to the logo SVG, the title text, or their individual styling.
- No special-casing for "already on the main page" — the link is always present and clickable; navigating to the current route is a harmless no-op.

## Decisions

- **Markup**: wrap the existing `.logo` and `.title` elements in a new `<a class="brand" routerLink="/">`, mirroring the `.cart` link pattern exactly (one anchor, icon + text content, `RouterLink` already imported in `header.ts`).
- **Layout**: `.brand` becomes `display: flex; align-items: center;` with the same `gap` the header itself uses, so `.logo` and `.title` sit exactly as they do today — the wrapping element takes over the flex-row positioning that `.header` previously provided them directly.
- **Accessible name**: no explicit `aria-label` added to `.brand` — its accessible name is computed from its content (the logo's existing `aria-label="Book logo"` plus the visible "My-Book-Store" text), the same approach already used for `.cart` (no own label, relies on child content).
- **Feedback styling**: copy the `a.cart` hover/press block (`filter: brightness()` on hover, `filter` + `scale()` on active, reduced-motion override disabling the scale) onto `.brand`, keeping the token-based, no-new-hardcoded-colors convention already established.

## Risks / Trade-offs

- [Existing `header.spec.ts` / e2e tests may assert `.logo`/`.title` are direct children of `.header`] → Checked: `header.spec.ts` and `app-shell.spec.ts` query `.logo`/`.title` by class only (`querySelector('.logo')`, `page.locator('.title')`), not by parent relationship, so no breakage expected — still worth re-running to confirm.
