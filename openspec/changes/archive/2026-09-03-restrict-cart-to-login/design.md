## Context

`Cart` (`src/app/cart/cart.ts`) and `GoogleAuth` (`src/app/google-auth/google-auth.ts`) are both root `@Service()` singletons with no relationship to each other today. `Header` injects both `cart` and `googleAuth` and already conditionally renders the login/logout controls based on `googleAuth.user()`. `BookSearch` (`src/app/book-search/book-search.ts`) injects `Cart` but not `GoogleAuth`. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Reuse the existing `@if (googleAuth.user(); as user) { ... } @else { ... }` pattern already established in `header.html` for gating UI on sign-in state, applied the same way to the cart icon and the "Add to cart" button.
- Make the cart's zero-on-sign-out behavior automatic and impossible to forget at any future call site that triggers sign-out — not something each caller has to remember to also do.

**Non-Goals:**
- No per-user cart persistence — per proposal's Follow-on work, the cart still resets to empty on every fresh page load regardless of sign-in state, exactly as today.
- No change to `GoogleAuth` itself — it stays unaware that `Cart` exists.

## Decisions

**`Cart` injects `GoogleAuth` and uses an `effect()` (registered in `Cart`'s constructor) that resets `_count` to `0` whenever `googleAuth.user()` is `null`.**
This makes "cart is empty while signed out" a property `Cart` enforces on itself, not something `Header`'s logout button handler (or any other future sign-out trigger) has to separately remember to call. The effect runs on every change to `user()`, including the initial signed-out state (a harmless no-op reset) and the transition when `logout()` is called — no need to specifically detect a "was signed in, now isn't" transition.
- *Alternative considered*: have `Header`'s logout button handler call both `googleAuth.logout()` and `cart.clear()`. Rejected — ties cart-clearing to one specific UI call site; a future second way to sign out (e.g. a token-expiry event) would need to remember the same two-call pattern, whereas the effect-based approach enforces it centrally in `Cart` itself.

**`Cart` does not gate `add()` on `googleAuth.user()` being non-null — the sign-in precondition is enforced entirely by hiding the "Add to cart" button (per the book-search spec delta), not by the service refusing the call.**
The only call site for `Cart.add()` is that button's `(click)` handler; once it's not rendered while signed out, there's no way to invoke `add()` while signed out through the UI. Adding a redundant guard inside `Cart.add()` would duplicate the same rule in two places for no behavioral difference.
- *Alternative considered*: also check `googleAuth.user()` inside `add()` as defense-in-depth. Rejected — the codebase doesn't currently apply that kind of redundant service-level guarding elsewhere (e.g. `BookSearch.search()` doesn't re-check `isSearchDisabled()` internally either), and it would be dead code given the single call site.

**`BookSearch` injects `GoogleAuth` directly (alongside its existing `Cart` injection) and wraps the "Add to cart" button in `@if (googleAuth.user())` inside the existing `@for` loop.**
Matches `Header`'s established pattern of injecting `GoogleAuth` wherever sign-in state needs to gate rendering, rather than threading the signed-in state down as an `@Input`.

**The header's `.cart` element is wrapped in `@if (googleAuth.user())`, matching the login/logout `@if`/`@else` immediately below it.**
No new conditional pattern introduced — `header.html` already branches on the exact same signal for the login/logout controls.

## Risks / Trade-offs

- [The `effect()` in `Cart` runs on every `Header`/`BookSearch` render pass indirectly via `googleAuth.user()` changes, not just explicit logout] → Accepted; this is intentional (see the Decision above) and the reset to `0` is idempotent, so re-running it when already `0` has no observable effect.
