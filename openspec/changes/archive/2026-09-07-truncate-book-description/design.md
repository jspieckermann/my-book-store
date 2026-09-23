## Context

`book-card.ts`/`.html` is a shared, stateless-ish component (`input.required<BookSummary>()`, no local UI state today) used by both the search results list and the cart page. See proposal.md for why truncation is needed. `add-to-cart-button`/`.delete-button` already established a shared icon-button chrome (equal padding, border, background, border-radius) from `align-book-card-action-buttons` — the expand control should reuse that same chrome for visual consistency.

## Goals / Non-Goals

**Goals:**
- Descriptions over 250 characters are truncated at a word boundary with an ellipsis, with an icon-only button to expand/collapse.
- Expand/collapse state is local to each card instance (per-book, not global), matching a signal-per-component pattern.
- The expand button reuses the existing icon-button chrome (`.add-to-cart-button`/`.delete-button` styling) and icon sizing (`.action-icon`).
- Icon changes between an "expand" and "collapse" state so the control's current action is visually clear.

**Non-Goals:**
- No change to how title, authors, publisher, or published date are rendered.
- No change to add-to-cart/delete control behavior.
- No server-side or API-level truncation — this is purely a display-layer concern in the component.

## Decisions

- **Truncation logic lives in `book-card.ts`** as a `computed()` derived from `book().description`: if length ≤ 250, use the full text and no control; otherwise take the substring up to 250 characters, trim back to the last whitespace boundary, and append `…`. Alternative considered: truncate with pure CSS (`-webkit-line-clamp`) — rejected because the requirement is character-count based (250 chars), not line-count based, and CSS clamping can't drive an accessible expand/collapse toggle cleanly.
- **Expand/collapse state**: a local `signal(false)` (`expanded`) inside `BookCard`, toggled by the button's `(click)`. Each `BookCard` instance already gets its own component instance per book card, so this scopes correctly with no extra keying needed.
- **Icon**: a single chevron SVG (matching the app's existing stroke-based icon style — `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="1.6"`) that points down when collapsed ("show more") and up when expanded ("show less"), toggled via `[class.rotated]` or a conditional path — implementation detail left to task 1, but visually consistent with the rest of the icon set.
- **Button chrome reuse**: apply the existing `.add-to-cart-button`/`.delete-button`/`.action-icon` styling to the new `.expand-button`, so all three icon controls in a card look like a consistent family (same size/padding/border/background).
- **Accessible name**: `aria-label="Show full description"` when collapsed, `aria-label="Show less"` when expanded, plus `aria-expanded` reflecting the toggle state — consistent with the `aria-label` pattern already used on the other book-card buttons.

## Risks / Trade-offs

- [Word-boundary truncation could land the visible cut noticeably short of 250 chars for a description with a long word right at the boundary] → Acceptable: the requirement only specifies "the first 250 characters, broken at the last whole word" — a few characters short is expected and preferable to cutting mid-word.
- [Existing tests may assert on full description text for a long fixture] → Update `book-card.spec.ts` and any e2e fixtures using descriptions longer than 150 characters to assert the truncated text and the expand control instead.
