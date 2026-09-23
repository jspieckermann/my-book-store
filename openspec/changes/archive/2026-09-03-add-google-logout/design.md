## Context

`GoogleAuth` (`src/app/google-auth/google-auth.ts`) currently only ever writes to its `_user` signal from inside `handleTokenResponse()` (sign-in success/failure); there is no way to clear it once set. `header.html` renders `googleAuth.user()`'s `name` as plain, non-interactive text (`<span class="user-name">`) inside an `@if`/`@else` alongside the login icon button. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Reuse the existing signed-in/signed-out `@if`/`@else` split in `header.html` — signing out just needs `googleAuth.user()` to become `null` again, which already flips the template back to the login icon with no new branching needed.
- Match the login icon's existing pattern of "a single clickable element wired directly to a service method" rather than introducing a menu, dropdown, or confirmation dialog.

**Non-Goals:**
- No Google token revocation (`google.accounts.oauth2.revoke`) — per proposal's Follow-on work.
- No session persistence changes — reload-signs-out-again behavior, already specified, is unaffected by this change.
- No account menu/dropdown, no confirmation dialog before signing out.

## Decisions

**`logout()` on `GoogleAuth` only clears local state (`this._user.set(null)`) — it does not call Google to revoke the access token.**
The service never stores the access token past the momentary `handleTokenResponse()` call that fetches `userinfo` (see `add-google-login`'s design), so there's nothing to revoke without additional state. Since there's no backend and no persistence, "signed out" here means only "this app no longer shows a name" — the user's actual Google session in their browser is untouched either way (as it would be even with revocation, which only revokes this app's grant, not the browser's Google session).
- *Alternative considered*: store the access token and call `google.accounts.oauth2.revoke(token, callback)` on logout. Rejected — adds state (the token) purely to support a revoke call whose practical effect (this app must re-request consent on next login) is a minor UX difference not requested, at the cost of real complexity (token lifetime, revoke failure handling).

**A dedicated logout icon (inline SVG, matching the login icon's visual style) is added next to the signed-in user's name; activating the icon signs the user out. The name itself stays plain, non-interactive text.**
The spec explicitly requires sign-out to be indicated by a logout symbol, not just an activatable name. Reusing the login icon's existing visual language (inline SVG, `currentColor` stroke, `theming`-token sizing) keeps the signed-out and signed-in icon-based controls visually consistent.
- *Alternative considered*: keep the name itself as the sole clickable control, with no separate icon. This was the change's original design — superseded once the spec was revised to explicitly require a visible logout symbol.

**`header.html`'s signed-in branch renders the name as plain text (`<span class="user-name">`) followed by a `<button class="logout" (click)="googleAuth.logout()">` containing an inline logout SVG icon — mirroring the signed-out branch's `<button class="login">` + icon structure.**
No new template branch needed; `googleAuth.user()` returning to `null` after `logout()` still causes the `@else` branch (login icon) to render, exactly as `add-google-login` built it. Only the signed-in branch's content changes (name + new icon button, instead of a clickable name).

## Risks / Trade-offs

- [A second icon in the header's signed-in state adds one more element for users to parse] → Accepted per the spec's explicit requirement for a visible logout symbol; reusing the login icon's visual style keeps the added element legible rather than novel.
