## Context

The app is a client-only Angular 22 SPA with two routes (`/`, `/cart`), no backend. It talks to exactly two external services: the Google Books `volumes` API (`GoogleBooks.search()`) and Google Identity Services (`GoogleAuth.login()`, which uses `window.google.accounts.oauth2` — a global injected by a `<script>` tag in `index.html` — plus a direct `HttpClient` call to Google's `userinfo` endpoint). Neither is reachable deterministically from an automated test: the Books API is rate-limited/live-data-dependent, and Google's real sign-in flow requires a real account and can't be scripted past MFA/consent screens. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Exercise the real app (real routing, real component wiring, real service code) end-to-end, mocking only the two points where the app leaves the browser for a third party.
- Keep the mocking boundary as narrow as possible: mock the network calls and the one browser global, not the app's own services — `GoogleAuth`/`GoogleBooks`/`Cart` all run their real, unmodified code during tests.
- Use only selectors that already exist in the app's templates (CSS classes, `aria-label`s) — no new `data-testid` attributes, keeping this change's Impact honest (no production code touched).

**Non-Goals:**
- No test for the real Google OAuth popup itself — see proposal's Follow-on work.
- No visual regression testing (screenshot diffing) — out of scope for this pass.
- No parallel/sharded CI execution setup — a local `npm run e2e` is the only entry point for now.

## Decisions

**Mock `window.google.accounts.oauth2.initTokenClient` via `page.addInitScript()`, and separately intercept the real `userinfo` HTTP call via `page.route()` — two mocks, not one.**
`GoogleAuth.login()` genuinely calls both: the (real, unmodified) app code calls `window.google.accounts.oauth2.initTokenClient(...).requestAccessToken()`, and on the stub's callback firing, the (real, unmodified) app code makes a real `HttpClient.get()` to Google's userinfo endpoint. Mocking only the browser global and letting the real HTTP call through would fail (no real access token to authenticate with); mocking only the HTTP call wouldn't help since `window.google` itself is undefined outside a real page load of Google's script. Both mocks together let `GoogleAuth`'s actual, unmodified code run in full.
- *Alternative considered*: mock `GoogleAuth` itself (e.g. inject a fake service via Angular's DI from the test). Rejected — that's exactly the pattern already used for unit tests (`add-unit-test-coverage`); an e2e test that replaces the app's own service isn't testing the integration at all, just re-running a unit test in a browser.

**A shared `e2e/support/mock-google-auth.ts` helper takes an `outcome: 'success' | 'cancelled' | 'failed'` parameter and sets up both mocks together in one call**, rather than each test wiring `addInitScript`/`route` by hand.
- `'success'`: the stubbed `requestAccessToken()` synchronously invokes the captured callback with a fake access token; the `userinfo` route returns `{ name }`.
- `'cancelled'`: the stubbed `requestAccessToken()` does nothing (mirrors a user closing the real popup without completing it — `GoogleAuth`'s callback is simply never invoked).
- `'failed'`: the stubbed callback fires with no `access_token` (mirrors `GoogleAuth`'s own "no access_token → stay signed out" branch) — or, for a userinfo-level failure, the route responds with a 500.

**A shared `e2e/support/mock-google-books.ts` helper intercepts `**/books/v1/volumes**` and takes either a `{ items, totalItems }` shape or `'error'`** (returns a 500), used per-test to control found/not-found/many-results/error scenarios deterministically.

**Selectors reuse the app's existing CSS classes and `aria-label`s (e.g. `.search-input`, `.add-to-cart-button`, `.cart`, `.login`, `.pagination-button`, `[aria-label="Remove from cart"]`) rather than introducing `data-testid` attributes.**
These classes are already stable (styled, and already relied on by the unit test suite's DOM assertions), so reusing them costs nothing and keeps this change's Impact section accurate — genuinely zero production file changes.
- *Alternative considered*: add `data-testid` attributes throughout the templates for more resilient selectors (Playwright's own best-practice recommendation). Rejected for this change — real production-code touch, and the existing class names are already specific enough (e.g. `.paypal-button`, `.delete-button` aren't generic utility classes that would collide).

**`playwright.config.ts` uses `webServer: { command: 'npm start', url: 'http://localhost:4200', reuseExistingServer: !process.env.CI }`** — Playwright starts (or reuses) the real `ng serve` dev server rather than testing against a production build.
Matches how this project has always been manually verified throughout its history (every prior change's manual test tasks pointed at `http://localhost:4200`); a production build adds a build step with no benefit for these tests, which don't measure bundle size or production optimizations.

**Chromium only, via `npx playwright install chromium`, not the full `npx playwright install` (all three engines).**
Keeps the initial download small and matches "keep it simple." Firefox/WebKit are explicit proposal Follow-on work — trivial to add later (`playwright.config.ts`'s `projects` array), not a re-architecture.

## Risks / Trade-offs

- [The mocked sign-in tests still require `environment.ts`'s `googleOAuthClientId` to be a non-empty string at build time — `GoogleAuth.login()`'s own guard (`if (!environment.googleOAuthClientId || !window.google) return;`) short-circuits before ever reaching the mocked `window.google`, regardless of mocking, if it's empty] → Accepted as a known local prerequisite, same class of requirement as this project has always had for `googleBooksApiKey` (see `add-google-books-api-key`). The value itself can be any non-empty placeholder string — since `window.google` is fully mocked, the string is never sent to or validated by Google. Documented in tasks.md so it's not silently discovered as "tests failing for no reason" on a fresh checkout.
- [Intercepting real endpoints by URL pattern (`**/books/v1/volumes**`, `**/oauth2/v3/userinfo**`) means a future change to either endpoint URL in the app's own code would silently stop being intercepted, and tests would attempt real network calls] → Accepted; matches the URLs already hardcoded in `google-books.ts`/`google-auth.ts` today, and any such change would already need corresponding updates to the unit tests' `HttpTestingController` matchers, so it isn't a new failure mode introduced by e2e tests specifically.
