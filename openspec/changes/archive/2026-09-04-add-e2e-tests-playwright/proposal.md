## Why

Unit tests (from `add-unit-test-coverage`) verify components and services in isolation, but nothing today exercises the app as a whole in a real browser — real routing, real DOM rendering, real cross-component wiring (search → add to cart → cart page → remove). End-to-end tests with Playwright close that gap.

## What Changes

- Add Playwright as the e2e test tool: `playwright.config.ts` (Chromium only for now), an `e2e/` test directory, and an `npm run e2e` script. `webServer` auto-starts `ng serve` against the real app.
- Add one representative (golden-path) test per requirement across all 6 existing capabilities — `theming`, `app-header`, `app-footer`, `book-search`, `shopping-cart`, `google-login` — organized into four spec files by user-facing flow rather than one-per-source-file: `book-search.spec.ts`, `shopping-cart.spec.ts`, `google-login.spec.ts`, `app-shell.spec.ts` (header/footer/theming/page-titles).
- Mock both external dependencies the app talks to, so tests are deterministic and don't depend on live services or real credentials:
  - The Google Books API (`page.route()` intercepting the `volumes` endpoint) — lets tests control exactly what "found", "not found", "many results", and "request failed" look like.
  - Google Identity Services (`page.addInitScript()` stubbing `window.google.accounts.oauth2`, plus `page.route()` intercepting the real `userinfo` call `GoogleAuth` makes) — lets tests reach a "signed in" state without a real Google account, while still exercising the app's actual sign-in code path end-to-end.
- No application behavior changes — this only adds tests and test tooling, so no capability specs are added or modified (`skip_specs: true`).

## Capabilities

### Modified Capabilities
(none — no spec-level behavior changes; see `.openspec.yaml`'s `skip_specs: true`)

## Impact

- **Code**: new `playwright.config.ts`; new `e2e/support/mock-google-books.ts` and `e2e/support/mock-google-auth.ts` helpers; new `e2e/book-search.spec.ts`, `e2e/shopping-cart.spec.ts`, `e2e/google-login.spec.ts`, `e2e/app-shell.spec.ts`. `package.json` (new `@playwright/test` devDependency, new `e2e` script). `.gitignore` (Playwright's `playwright-report/`, `test-results/` output directories). No production code changes.
- **Dependencies**: `@playwright/test` (new devDependency) plus its downloaded browser binary (Chromium only, via `npx playwright install chromium`).
- **Systems**: Local/CI test execution only; tests run against a locally-served instance of the app, no real Google Books API or Google account is contacted.
- **Follow-on work** (explicitly out of scope for this change): a test that opens a *real* Google OAuth popup (requires a real, environment-specific `googleOAuthClientId` to be configured — not portable across machines/CI the way the mocked flow is); cross-browser runs (Firefox/WebKit); CI wiring (a workflow that runs `npm run e2e` on push); exact WCAG contrast-ratio verification; pixel-level cover-image aspect-ratio checks; exhaustive coverage of every WHEN/THEN scenario in every spec (this change covers each *requirement* once on its golden path, not every scenario variant).
