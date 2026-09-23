## 1. GoogleAuth service

- [x] 1.1 Add a `logout(): void` method to `src/app/google-auth/google-auth.ts` that sets `this._user` to `null` — verify by inspecting the method makes no network/Google API calls, only the local state change

## 2. Header integration

- [x] 2.1 In `header.html`, keep the signed-in branch's `<span class="user-name">{{ user.name }}</span>` as plain text, and add a `<button type="button" class="logout" aria-label="Sign out" (click)="googleAuth.logout()">` containing an inline logout SVG icon (mirroring the login icon's structure) immediately after it — verify by inspecting the login-icon `@else` branch is unchanged and the new logout button calls `googleAuth.logout()`
- [x] 2.2 Add `.logout`/`.logout-icon` styles to `header.css` matching `.login`/`.login-icon`'s button-reset and icon sizing/color approach, and revert `.user-name` to plain (non-clickable) text styling — using only `theming` tokens — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it completes without errors
- [x] 3.2 Run `npm test` and confirm existing tests still pass
- [x] 3.3 Manually sign in, then activate the logout icon, and confirm the header immediately reverts to showing the login icon (no name, no logout icon)
- [x] 3.4 Manually confirm no sign-out control is visible while signed out (only the login icon)
- [x] 3.5 Manually sign out, then sign back in, and confirm the flow still works end-to-end (name and logout icon shown again after a fresh sign-in)
