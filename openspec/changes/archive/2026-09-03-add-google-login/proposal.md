## Why

Users have no way to identify themselves in the app. Letting them sign in with their existing Google account — with no new password to create — gives the app a lightweight identity signal (their name shown in the header) and lays the groundwork for any future user-specific features, without requiring a backend.

## What Changes

- Add a login icon on the very right side of the header (to the right of the existing shopping cart icon), styled with the app's existing theme tokens to match the other header icons.
- Activating the icon opens Google's OAuth sign-in popup (via Google Identity Services' OAuth2 token client — no backend, consistent with the rest of this client-only app).
- After a successful sign-in, the signed-in user's Google account name replaces the login icon in the header.
- If the sign-in popup is cancelled or the sign-in attempt fails, the header returns to/remains in the signed-out state (login icon shown); no error message is required for this change.
- Uses a configured Google OAuth Client ID, supplied via `environment.ts` following the same gitignored-secret pattern established for the Google Books API key (`environment.example.ts` keeps an empty placeholder).
- **Out of scope for this change**: signing out, persisting the signed-in state across page reloads, and any other account/profile management. Only "log in" and "show the name" are in scope, per the request.

## Capabilities

### New Capabilities
- `google-login`: A login icon in the header that starts Google's OAuth sign-in flow, and displays the signed-in user's name in the header after a successful sign-in.

### Modified Capabilities
(none — the shopping-cart capability set the precedent of a header icon being owned by its own capability spec rather than modifying `app-header`; `google-login` follows the same pattern)

## Impact

- **Code**: `src/app/header/header.ts`/`.html`/`.css` (renders the login icon or the signed-in user's name based on the new auth service's state); a new `src/app/google-auth/google-auth.ts` service (parallel to `Cart` and `GoogleBooks`) wrapping the Google Identity Services OAuth2 token client and exposing the signed-in user's name as a signal; `src/index.html` (loads the Google Identity Services script); `src/environments/environment.ts`/`environment.example.ts` (new `googleOAuthClientId` field, following the existing `googleBooksApiKey` pattern).
- **Dependencies**: Google Identity Services JS library (`https://accounts.google.com/gsi/client`), loaded via script tag — no new npm package. Uses the standard `https://www.googleapis.com/oauth2/v3/userinfo` endpoint to read the signed-in user's name from the access token GIS returns.
- **Systems**: Client-side only; the OAuth popup and userinfo call are the only new external calls. No backend, no session storage.
- **Follow-on work**: Sign-out, persisting the signed-in state across reloads, showing the user's avatar/picture, and any account-specific features (e.g. order history) are not part of this change.
