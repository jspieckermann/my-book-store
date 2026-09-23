## Context

`Header` and `IsbnSearch` are sibling standalone components composed directly in `src/app/app.html` (`<app-header />`, `<app-isbn-search />`, `<router-outlet />`, `<app-footer />`) with no parent-child relationship for passing data between them. `GoogleBooks` (`src/app/isbn-search/google-books.ts`) already follows the project's pattern of a `@Service()`-decorated, root-provided singleton injected via `inject()`. The found-book result card (from `add-book-result-card`) already renders in `isbn-search.html`. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Share cart count state between the header and the ISBN search result card via one singleton service, following the same `@Service()` pattern already used for `GoogleBooks`.
- Keep the cart's data model minimal: only what's needed to show a count, per the proposal's explicit "no viewing cart contents" scope.
- Match the header's existing inline-SVG icon convention (the book logo) for the new cart icon, styled via `currentColor` and `theming` tokens.

**Non-Goals:**
- No persistence (localStorage, backend) of cart state — in-memory only, reset on page reload, per proposal's Follow-on work.
- No cart contents list, no way to remove/edit items, no navigation to a cart view — per the spec's explicit "No cart viewing or management" requirement.
- No distinction between adding the same book twice (e.g. no per-book quantity tracking) — the badge only needs a total count, so the service only needs to track a single number.

## Decisions

**A `CartService` (`src/app/cart/cart.ts`) exposing a single `count` signal and an `add()` method, not a list of items.**
Since the spec only requires a running total (no viewing/removing individual items), the simplest model that satisfies it is a single writable signal incremented by one per `add()` call — no item array, no book identity tracking. This is the smallest state shape that can't drift from the "display-only count" requirement, and trivially extends to a real item list later without changing the public shape callers already depend on (`add()` stays a valid call; a future change could have it also push into an item list without breaking the header's `count` read).
- *Alternative considered*: store an array of added `BookSummary` items and derive `count` from its length. Rejected as unnecessary now — it would carry book data the spec explicitly doesn't need yet (no cart-contents view), and can be introduced later exactly when a "view cart" change actually needs the item list.

**`CartService` follows the same `@Service()` (root-provided singleton) pattern as `GoogleBooks`.**
Consistent with this codebase's established service convention; both `Header` and `IsbnSearch` `inject()` the same instance, so an `add()` call in one component is immediately reflected in the other's template via the shared signal.
- *Alternative considered*: pass cart state through `app.ts` as `@Input()`/`@Output()` bindings between siblings. Rejected — Angular has no direct sibling-to-sibling binding without lifting state into the common parent and wiring two-way plumbing through `app.html`; a shared service is simpler and is already this project's precedent for cross-component state.

**Cart icon: a new inline SVG in `header.html`, positioned after the title using `margin-inline-start: auto` (or a flex spacer) to push it to the right side of the header's flex row.**
The header's `.header` container is already `display: flex; align-items: center;` with the logo and title as its only two children; adding the cart icon as a third flex child with automatic left margin achieves "right side of the header" without restructuring the existing layout.
- *Alternative considered*: a separate `<app-cart-icon>` component. Rejected as premature — it's one small template fragment with one injected signal, consistent with how the header's existing logo is inline markup rather than its own component.

**Badge as a small `<span>` overlaid on the icon via `position: relative` on a wrapping element, shown only via `@if (cartService.count() > 0)`.**
Matches the spec's "no badge when count is zero" requirement directly in the template condition, and is a standard, simple CSS pattern (no new dependency) for a notification-count badge.

**"Add to cart" button placed inside `.book-card` (from `add-book-result-card`), below the attribute list, styled like the existing `.search-button` (same token set) but visually secondary (e.g. `--color-surface` background instead of `--color-accent`) so it doesn't compete with the primary search action.**
Reuses established button styling conventions from this same component rather than inventing a new button style, while a slightly different fill keeps it visually distinct as a secondary action within the card.

## Risks / Trade-offs

- [In-memory-only cart state resets on every page reload, which may surprise a user who reloads mid-session] → Accepted per proposal's explicit Follow-on work scope; persistence is a natural next change once this foundation exists.
- [No upper bound on the count (e.g. clicking "Add to cart" rapidly) since there's no real inventory/checkout concept yet] → Accepted; this stage has no business logic beyond incrementing a display counter.
