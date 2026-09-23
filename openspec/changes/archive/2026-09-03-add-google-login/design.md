## Context

The app is entirely client-side — no backend, no session store. `Header` (`src/app/header/header.ts`/`.html`/`.css`) already renders the cart icon on the right via `inject(Cart)`, a `@Service()`-decorated singleton (`src/app/cart/cart.ts`) exposing a `signal`. `GoogleBooks` (`src/app/book-search/google-books.ts`) follows the same `@Service()` pattern and reads its API key from `src/environments/environment.ts` (gitignored, real value) with `environment.example.ts` kept as an empty, git-tracked placeholder — the established pattern for any secret/config value in this repo. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Reuse the existing header-icon pattern (`.cart`'s `margin-inline-start: auto` pushes it and everything after it to the far right) so the login icon lands immediately to the right of the cart icon with no new layout mechanism.
- Keep the login icon visually consistent with the existing header icons (inline SVG, `currentColor` stroke, sized via `theming` tokens) rather than using Google's own rendered button, which can't be restyled to match — this was the explicit choice made over Google's stock icon button (see conversation).
- No backend: use Google Identity Services' OAuth2 token client (implicit-flow popup) to get an access token client-side, then call Google's `userinfo` endpoint directly from the browser to read the signed-in user's name.

**Non-Goals:**
- No sign-out control, no persisting sign-in state across reloads (per proposal's Out of scope / the spec's "No sign-out control or session persistence" requirement).
- No ID token verification, no server-side session, no storing any Google profile data beyond the display name held in memory for the current page load.
- No account picker customization beyond what Google's popup provides by default.

## Decisions

**Use `google.accounts.oauth2.initTokenClient(...)` (OAuth2 token client), not `google.accounts.id` (One Tap / ID-token flow) or Google's rendered Sign-In button.**
The token client's `requestAccessToken()` is a direct, popup-based response to a user click — reliable every time, unlike One Tap which Google can silently suppress after repeated dismissals. It also works with a fully custom-styled trigger element (our own SVG icon button), which the rendered Sign-In button and One Tap prompt do not support without Google's own styling.
- *Alternative considered*: Google's rendered `type: "icon"` Sign-In button. Rejected per the user's explicit choice — it can't be restyled with this app's `theming` tokens, breaking visual consistency with the rest of the header.
- *Alternative considered*: One Tap / ID-token flow (`google.accounts.id.prompt()`) triggered from a custom button. Rejected — One Tap's display is not guaranteed on every trigger (cooldown/suppression after dismissal), which would make the login icon sometimes silently do nothing.

**Fetch the user's name via `GET https://www.googleapis.com/oauth2/v3/userinfo` with the access token, rather than decoding a JWT ID token.**
The OAuth2 token client's callback provides an access token, not an ID token — `userinfo` is the standard endpoint for reading profile fields from that grant type. One extra network call after sign-in, made once per sign-in (not per page load, since there's no persistence).
- *Alternative considered*: request both an access token and an ID token, decode the ID token's `name` claim client-side to avoid the extra call. Rejected — added complexity (requesting/handling a second credential type) for no material benefit in a flow that already makes one popup round-trip; the extra `userinfo` call is negligible.

**New `GoogleAuth` service (`src/app/google-auth/google-auth.ts`), `@Service()`-decorated like `Cart` and `GoogleBooks`, exposing `readonly user = signal<{ name: string } | null>(null)` and a `login(): void` method that calls `requestAccessToken()`.**
Matches the existing service pattern exactly; `Header` injects it the same way it injects `Cart` today. The token client is constructed once (lazily, on first `login()` call or in the service's constructor) using the client ID from `environment.googleOAuthClientId`.

**Load the Google Identity Services script (`https://accounts.google.com/gsi/client`) via a `<script>` tag in `src/index.html`, not a dynamically-injected `<script>` element.**
Simplest option; the script is small and this app has no lazy-loading/code-splitting concerns for a single global script needed by one feature. `google.accounts.oauth2` is available on `window` once the script loads, before Angular bootstraps in practice (script tags in `<head>`/before `<app-root>` run first), but `GoogleAuth.login()` still guards against the global being undefined (e.g. slow network) by no-op-ing rather than throwing.
- *Alternative considered*: lazily inject the script tag from `GoogleAuth` on first use. Rejected — adds async-loading complexity (the popup can't open until the script loads) for a script small enough to load unconditionally.

**`environment.googleOAuthClientId: string` added to `environment.ts` (gitignored) and `environment.example.ts` (empty placeholder), mirroring `googleBooksApiKey`.**
Same secret-handling convention already established; no new pattern introduced. If unset (empty string), `login()` no-ops rather than calling Google with an invalid client ID (matches `GoogleBooks`'s existing "no key configured" graceful-fallback precedent, adapted here to "no client ID configured" since, unlike the Books API, there's no unauthenticated fallback for OAuth).

**Header template shows the login icon only when `googleAuth.user() === null`, and the user's name (plain text, no avatar) when it is set — a single `@if`/`@else` in `header.html`, no new child component.**
The login icon is a single, non-repeated UI element (unlike the book-result cards), so there's no reuse pressure that would justify a separate component; matches how the cart icon/badge is inlined directly in `header.html` today.

## Risks / Trade-offs

- [The `userinfo` call could fail after a successful token grant (network error, revoked scope) — an edge case the spec's "failed sign-in" scenario should also cover] → Mitigated: `GoogleAuth` treats a failed `userinfo` call the same as a failed token request — `user` stays `null`, header stays in the signed-out state.
- [Loading the GIS script unconditionally on every page load adds an external network dependency even for users who never sign in] → Accepted; the script is small and this is consistent with this app's existing single-page, all-scripts-eager loading (no lazy-loading infrastructure exists yet).
- [No persistence means every page reload signs the user out, which may feel surprising] → Accepted per proposal's explicit Out of scope; documented as follow-on work.
