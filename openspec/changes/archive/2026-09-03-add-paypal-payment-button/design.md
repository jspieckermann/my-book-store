## Context

Every other visual capability in this app (`app-header`, `book-search`, `shopping-cart`'s existing requirements, etc.) has an explicit "Theme consistency" requirement restricting colors/fonts to the `theming` capability's tokens — no hardcoded hex/oklch values anywhere else in the codebase. `cart-page.html` currently renders, when `cart.books().length > 0`, a `<ul class="results-list">` of book cards; the payment button is a new element added after that list, inside the same `@if` branch. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Make the button unmistakably read as "a PayPal button" at a glance — that's the entire point of the request — even though this means deliberately not using this app's `theming` tokens for it.
- Keep the button 100% inert: no `(click)` handler, no `routerLink`, no form submission — just a styled `<button type="button">` with nothing wired to it.

**Non-Goals:**
- No PayPal SDK, hosted button script, or logo image asset — per proposal, this is a plain styled HTML button, not a real PayPal integration.
- No accessibility/semantic special-casing beyond what any other button in this app gets (e.g. no `aria-disabled`, since the button is visually active, just non-functional).

## Decisions

**The button's colors (PayPal's yellow/gold, `#FFC439`, with dark navy text `#003087`) are hardcoded in `cart-page.css`, not sourced from `theming` tokens — a deliberate, explicitly-scoped exception to this app's otherwise universal "theme tokens only" rule.**
Every other styled element in this app matches the app's own dark theme; this one button's entire purpose is to be recognizable as PayPal's brand, which has fixed colors independent of any host app's theme (this mirrors how real PayPal integrations render their button unstyled by the host site). Scoping the exception to exactly this one class (e.g. `.paypal-button`) keeps it from being mistaken for a precedent to relax theming elsewhere.
- *Alternative considered*: recolor a PayPal-style button using this app's `--color-accent` token instead of PayPal's actual brand color. Rejected — the proposal explicitly asked for it to "look like a PayPal button," which requires PayPal's actual color, not a reskin.

**No `(click)` binding at all on the button (not even one wired to a no-op method) — the absence of a handler is what "no function" means here.**
Simplest way to guarantee zero behavior; nothing to accidentally wire up later without a deliberate code change.

**The button is placed inside the existing `@if (cart.books().length > 0)` branch in `cart-page.html`, after the `<ul class="results-list">`, so it naturally disappears when the cart is emptied (e.g. via `remove-cart-item`'s delete controls) without any extra conditional logic.**
Reuses the branch that already exists for the book list rather than adding a second, separate `@if` on the same condition.

## Risks / Trade-offs

- [A hardcoded brand color in `cart-page.css` could be copy-pasted elsewhere by a future change, spreading the theming exception] → Mitigated: scoped to a single, clearly-named `.paypal-button` class with no reuse anywhere else in the app; this design doc records why it's an exception.
