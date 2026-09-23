## Why

The app has no test coverage beyond two smoke assertions on the root component — every service and component built across this project's history (search, pagination, cart, sign-in/out, book cards, the cart page) has shipped untested. Adding unit tests now, with a measurable coverage bar, is the first quality-assurance safety net so future changes don't silently break existing behavior.

## What Changes

- Add unit tests (via Angular's existing Vitest-based test builder — no new test runner) for every non-trivial service and component that currently has none: `Cart`, `GoogleAuth`, `GoogleBooks`, `BookSearch`, `BookCard`, `CartPage`, `Header`. `Footer` gets a minimal smoke test; `app.routes.ts`/`app.config.ts` are not unit-tested (they're declarative config, not logic).
- Add `@vitest/coverage-v8` as a dev dependency and enable coverage reporting, with an enforced **85% line coverage** threshold (repo-wide, not per-file) that fails `npm test` when not met.
- `GoogleAuth.login()`'s coverage is necessarily partial: the guard branches (no client ID, no `window.google`) and the `handleTokenResponse`/userinfo-fetch logic are testable with `window.google` mocked; the actual OAuth consent popup is not testable by any unit test and is out of scope.
- No application behavior changes — this is test/tooling-only, so no capability specs are added or modified (`skip_specs: true`).

## Capabilities

### Modified Capabilities
(none — no spec-level behavior changes; see `.openspec.yaml`'s `skip_specs: true`)

## Impact

- **Code**: new `*.spec.ts` files alongside `cart/cart.ts`, `google-auth/google-auth.ts`, `book-search/google-books.ts`, `book-search/book-search.ts`, `book-card/book-card.ts`, `cart-page/cart-page.ts`, `header/header.ts`, `footer/footer.ts`. `package.json` (new `@vitest/coverage-v8` devDependency; `test` script gains a coverage-threshold check). No production code changes.
- **Dependencies**: `@vitest/coverage-v8` (new devDependency, matched to the installed `vitest` major version).
- **Systems**: Local/CI test execution only; no runtime impact.
- **Follow-on work**: End-to-end/real-browser tests (e.g. Playwright) are explicitly out of scope for this change — see the earlier exploration discussion; can be proposed separately if wanted later.
