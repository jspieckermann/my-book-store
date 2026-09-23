## 1. Configuration and script loading

- [x] 1.1 Add `googleOAuthClientId: string` to `src/environments/environment.ts` (real value) and `src/environments/environment.example.ts` (empty string placeholder), mirroring the existing `googleBooksApiKey` field — verify by inspecting both files have the new field and `environment.example.ts` contains no real credential
- [x] 1.2 Add a `<script src="https://accounts.google.com/gsi/client" async defer></script>` tag to `src/index.html`'s `<head>` — verify by inspecting the tag is present and `ng build` still succeeds

## 2. GoogleAuth service

- [x] 2.1 Create `src/app/google-auth/google-auth.ts` as a `@Service()`-decorated class exposing `readonly user = signal<{ name: string } | null>(null)` (readonly view) and a `login(): void` method — verify by inspecting the class follows the same shape as `src/app/cart/cart.ts`
- [x] 2.2 In `login()`, lazily construct a `google.accounts.oauth2` token client with `client_id: environment.googleOAuthClientId` and `scope: 'openid email profile'`, then call `requestAccessToken()`; no-op (do not call Google) when `environment.googleOAuthClientId` is empty or `window.google` is not yet available — verify by inspecting both guard conditions are checked before any Google API call
- [x] 2.3 On a successful token response, call `GET https://www.googleapis.com/oauth2/v3/userinfo` with an `Authorization: Bearer <access_token>` header via `HttpClient`, and on success set `user` to `{ name: response.name }` — verify by inspecting the request includes the bearer header and only `name` is read from the response
- [x] 2.4 Treat a cancelled/failed token request and a failed `userinfo` call the same way: leave `user` as `null` (or reset it to `null` if previously set) without throwing — verify by inspecting both failure paths route to the same no-op-on-`user` behavior

## 3. Header integration

- [x] 3.1 Inject `GoogleAuth` into `src/app/header/header.ts` alongside the existing `Cart` injection — verify by inspecting the component follows the same `protected readonly googleAuth = inject(GoogleAuth)` pattern as `cart`
- [x] 3.2 In `header.html`, add a login icon (inline SVG, styled like the existing cart icon) positioned after the `.cart` element, shown via `@if (googleAuth.user() === null)`, that calls `googleAuth.login()` on click — verify by inspecting the icon renders only when signed out and sits to the right of the cart icon in the DOM order
- [x] 3.3 In `header.html`, add an `@else` (or equivalent) branch that displays `googleAuth.user()!.name` as plain text in the same header position when a user is signed in, with no login icon rendered — verify by inspecting exactly one of the icon/name is rendered at a time, never both
- [x] 3.4 Style the login icon and the signed-in name text in `header.css` using only `theming` tokens (matching `.cart-icon`'s sizing/color approach) — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm existing tests still pass
- [x] 4.3 Manually activate the login icon and confirm Google's OAuth sign-in popup opens
- [x] 4.4 Manually complete a sign-in and confirm the signed-in user's name replaces the login icon in the header
- [x] 4.5 Manually close/cancel the Google popup before completing sign-in and confirm the login icon is still shown (no name, no error)
- [x] 4.6 Manually sign in, then reload the page, and confirm the header shows the login icon again (not the previous name)
- [x] 4.7 Manually confirm no sign-out control exists anywhere in the application while signed in
