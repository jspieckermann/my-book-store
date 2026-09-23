## Why

Users can sign in with Google but have no way back out — the only way to end a session today is a full page reload. A visible sign-out control completes the login/logout lifecycle that `add-google-login` deliberately deferred.

## What Changes

- Add a logout icon shown next to the signed-in user's name whenever a user is signed in. Activating the icon signs the user out.
- Signing out clears the app's local signed-in state, immediately reverting the header to showing the login icon; no Google token revocation call is made (client-only sign-out, consistent with `add-google-login`'s no-backend design).
- Session persistence across page reloads remains unchanged (still not supported) — this change only adds the ability to end the current page's session without reloading.
- **BREAKING**: reverses `google-login`'s existing "No sign-out control or session persistence in this stage" requirement's sign-out prohibition — the persistence prohibition is retained under a new requirement.

## Capabilities

### Modified Capabilities
- `google-login`: the "No sign-out control..." requirement's sign-out prohibition is removed and replaced with a new "Sign-out control" requirement; the persistence prohibition is restated under its own requirement so it isn't lost.

## Impact

- **Code**: `src/app/google-auth/google-auth.ts` (add a `logout(): void` method that clears the `user` signal); `src/app/header/header.html` (add a logout icon button next to the `.user-name` text, wired to `googleAuth.logout()`); `src/app/header/header.css` (style the new logout icon, matching the existing `.login`/`.login-icon` treatment).
- **Dependencies**: None new.
- **Systems**: Purely client-side; no new external calls — sign-out is a local state change only.
- **Follow-on work**: Revoking the Google access token on sign-out (`google.accounts.oauth2.revoke`) and persisting sign-in state across reloads are not part of this change.
