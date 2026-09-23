## Why

Every button and link in the app today looks and behaves identically whether it's idle, hovered, or actively being pressed — there's no tactile feedback confirming a click registered. A small set of consistent hover/press states makes the UI feel responsive and polished ("eye candy") without touching any functionality.

## What Changes

- Every interactive control (buttons and links) across the app gets a visible **hover** state and a visible **pressed/active** state, using only existing `theming` tokens (via `filter: brightness()`/`opacity`, not new hardcoded colors).
- Pressed controls also get a subtle scale-down (tactile "push" feel) via `transform`, with a short `transition` so state changes aren't jarring.
- Controls respect `prefers-reduced-motion: reduce` — motion-based feedback (the scale transform) is disabled for users who've opted out, while a non-motion visual cue (brightness/opacity change) is still shown so pressing never becomes entirely invisible.
- **Scope**: applies to every existing clickable control — header's login/logout buttons and cart link, book-search's search/pagination buttons, book-card's add-to-cart/delete buttons, and the cart page's back link and PayPal-styled button (the PayPal button is inert per `add-paypal-payment-button`, but still gets the same visual treatment for consistency — it already looks like a normal active button). Text inputs (the search field) are out of scope — their existing `:focus` outline is a different interaction, not a "press."
- **Assumption**: this is pure CSS — no template or component logic changes, no new dependencies.
- This is a new, cross-cutting, app-wide visual rule (not specific to one existing feature), so it's captured as a new requirement under the `theming` capability, which already owns global visual-consistency rules (color palette, typography, dark-theme-by-default) — not duplicated across every capability that happens to own a button.

## Capabilities

### Modified Capabilities
- `theming`: gains a new "Interactive control feedback" requirement establishing that every button/link SHALL show a hover state and a pressed state, with reduced-motion handled gracefully.

## Impact

- **Code**: `src/app/header/header.css` (`.login`, `.logout`, `.cart`), `src/app/book-search/book-search.css` (`.search-button`, `.pagination-button`), `src/app/book-card/book-card.css` (`.add-to-cart-button`, `.delete-button`), `src/app/cart-page/cart-page.css` (`.back-link`, `.paypal-button`). No `.html`/`.ts` changes anywhere.
- **Dependencies**: None new.
- **Systems**: Purely visual/client-side; no behavior beyond what's already there changes.
- **Follow-on work**: A shared global utility class (instead of duplicating the same hover/press rules across each component's CSS file) is not part of this change — matches this codebase's existing precedent of accepting some CSS duplication across Angular's per-component encapsulated styles (e.g. `.book-card`/`.results-list` are already duplicated between `book-search.css` and `cart-page.css`) rather than introducing new shared infrastructure.
