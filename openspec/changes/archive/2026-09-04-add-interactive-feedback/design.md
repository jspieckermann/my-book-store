## Context

Every interactive control's styling lives in its own Angular component's view-encapsulated CSS file — `header.css` (`.login`, `.logout`, `.cart`), `book-search.css` (`.search-button`, `.pagination-button`), `book-card.css` (`.add-to-cart-button`, `.delete-button`), `cart-page.css` (`.back-link`, `.paypal-button`). None currently define `:hover`/`:active` states or `transition`s (aside from `.search-input:focus` and `.back-link:hover`'s underline, which are unrelated to press feedback). All tokens live in `src/styles.css`'s `@theme` block as OKLCH color values — there's no pre-existing "hover" or "active" variant of any color token. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- One small, copy-pasteable CSS pattern applied consistently to every control listed in proposal.md's Scope, so they all feel like the same design system rather than each getting bespoke treatment.
- Zero new color tokens in `styles.css` — the feedback must be expressible as a transform of each control's *existing* token-based color, not a new literal.

**Non-Goals:**
- No shared Angular directive/component wrapping every button (e.g. a `<app-button>` component) — that's a real architectural change for a purely cosmetic request; out of scope here.
- No feedback on the search input itself — per proposal, focus-state and press-state are different interactions and the input already has its own `:focus` treatment.
- No ripple/Material-style animated effects — "subtle" was the brief; a scale + brightness change is enough "eye candy" without a bigger animation system.

## Decisions

**Hover/press feedback uses `filter: brightness(...)` (and `opacity` for the two non-background link-style controls, `.back-link` and the signed-out `.cart`), never a new color literal.**
`filter: brightness()` multiplies whatever the control's current background/text color already is (its theme token), so a `--color-accent`-background button (`.search-button`) and a `--color-surface`-background button (`.add-to-cart-button`, `.login`, etc.) both get consistent-*feeling* (not identical-value) feedback from the exact same one-line rule, with no new token needed. Concretely: `:hover { filter: brightness(1.1); }`, `:active { filter: brightness(0.9); }`.
- *Alternative considered*: define new `--color-*-hover`/`--color-*-active` tokens in `styles.css`'s `@theme` block. Rejected — doubles the token surface for a purely mechanical brightness shift that `filter` already gives "for free" against whatever token is already in use, and every other capability's "Theme consistency" requirement is about not inventing new color literals, which new tokens would technically still be (just named ones).

**Pressed state also gets `transform: scale(0.96)` for a tactile "push" feel, applied via a shared `transition: transform 0.1s ease, filter 0.15s ease;` on each control's resting-state rule.**
Matches the proposal's "subtle scale-down" framing — a quick, small scale reads as a physical press without feeling gimmicky at 4%.

**`@media (prefers-reduced-motion: reduce)` overrides `:active`'s `transform` back to `none` (via a second, more specific rule scoped inside that media query) on every control that has one — the `filter` brightness change is left untouched in both cases.**
Directly satisfies the spec's reduced-motion scenario: motion-based feedback (`transform`) is opt-out-able, but the control is never left with *zero* indication of a press, since `filter` isn't a motion effect and stays active regardless.
- *Alternative considered*: disable `transition` entirely under reduced-motion (so `filter` changes are instant rather than eased). Rejected — an instant color/brightness change is exactly what "no motion, but still a change" should look like; only the animated *movement* (scale) is the accessibility concern per the WCAG "Animation from Interactions" guidance this scenario is modeling.

**The same three rules (`:hover`, `:active`, and the reduced-motion `:active` override) are duplicated per control across the four CSS files, following this codebase's established precedent of accepting per-component CSS duplication (e.g. `.book-card`/`.results-list` already duplicated between `book-search.css` and `cart-page.css`) rather than introducing shared global CSS classes or a new Angular abstraction.**
Keeps this change purely additive CSS with no template changes (no new class names to wire into 8 different `.html` files) and no new component — proportionate to a cosmetic request. See proposal.md's Follow-on work for the alternative if duplication becomes a maintenance problem later.

**The PayPal-styled button (`cart-page.css`'s `.paypal-button`) gets the same treatment as every other button, including using `filter` against its own (deliberately non-token, brand-color) background rather than being exempted.**
`filter: brightness()` works identically regardless of whether the underlying color is a `theming` token or the PayPal brand color underneath it — no special-casing needed. Visually, this keeps the already-established design intent from `add-paypal-payment-button` ("the button is visually active, just non-functional") consistent with every other button now also having press feedback.

## Risks / Trade-offs

- [Six CSS files (well, four) each carry a near-identical 6-8 line block; a future control that forgets to copy it would be inconsistent] → Accepted per the duplication decision above; low risk given there are only ~10 controls total in this app today, and code review would catch an obviously bare new button.
- [`filter: brightness()` on a control whose background is already near-white or near-black could produce a barely-visible change at the extremes] → Not a concern in practice here — every existing control's background is either `--color-surface`, `--color-accent`, `--color-background`, or `#FFC439` (PayPal), none of which sit at the very ends of the brightness range in this dark theme.
