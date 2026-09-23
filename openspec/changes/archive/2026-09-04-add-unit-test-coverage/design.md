## Context

Tests run via Angular's `@angular/build:unit-test` builder (`ng test`), which wraps Vitest and already supports `--coverage`, `--coverage-reporters`, etc. as first-class flags — confirmed via `ng test --help`. Running `npm test -- --coverage` today fails with: *"Code coverage requires either @vitest/coverage-v8 or @vitest/coverage-istanbul is installed."* No coverage package is installed yet. The builder auto-discovers `vitest-base.config.ts` if present (via `runnerConfig`), but none exists in this repo today — everything currently runs off the builder's defaults. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Get real behavioral coverage on every service/component with actual logic, not coverage-for-its-own-sake (e.g. no tests that just instantiate a component and assert nothing).
- Enforce 85% line coverage as a hard gate `npm test` fails under, not just a number reported and ignored.

**Non-Goals:**
- No end-to-end/real-browser testing (Playwright, Cypress) — explicitly deferred per the exploration discussion and proposal.
- No attempt to unit-test `window.google`'s actual OAuth popup behavior — only the app's own logic around it.
- No refactoring of production code to make it "more testable" beyond what's needed to inject test doubles for `HttpClient`/`GoogleAuth`/`Cart` — this change touches zero production files.

## Decisions

**Coverage provider: `@vitest/coverage-v8`, not `@vitest/coverage-istanbul`.**
V8's native coverage is faster (no source instrumentation step) and is Vitest's more commonly used default; nothing about this codebase (no unusual transpilation, no legacy source maps) needs istanbul's more manual instrumentation. Confirmed with the user.

**The 85% line-coverage threshold is configured via Vitest's `coverage.thresholds.lines` option, supplied through a `vitest-base.config.ts` the unit-test builder auto-discovers (per `--runner-config`'s documented default-file lookup), rather than a separate CI script that parses coverage output after the fact.**
Vitest fails the test run itself when a configured threshold isn't met, so `npm test -- --coverage` becomes the single command that both runs tests and enforces the bar — no second tool or script needed to interpret a coverage report.
- *Alternative considered*: leave thresholds unset and add a separate `npm run coverage:check` script that greps the generated `coverage/coverage-summary.json`. Rejected — duplicates logic Vitest already provides natively, and is easy to forget to run.

**`GoogleAuth`'s tests stub `window.google` directly (`(window as any).google = { accounts: { oauth2: { initTokenClient: vi.fn(...) } } }` in test setup/teardown) rather than trying to abstract the global behind an injectable wrapper service.**
Keeps the change test-only per proposal's Impact (no production code changes); introducing a wrapper service purely to ease testing would be a production-code change to a working, already-shipped auth flow for no user-facing benefit.
- *Alternative considered*: extract a thin injectable `GoogleIdentityServices` wrapper around the global, inject it into `GoogleAuth`, and mock that instead. Rejected for this change — real architectural improvement, but out of scope for a test-only change; can be proposed separately if `GoogleAuth`'s tests turn out unwieldy in practice.

**Per-file testing approach:**
- `Cart`, `GoogleAuth`: `TestBed` with `GoogleAuth`/`HttpClient` provided via `HttpClientTestingModule`/`provideHttpClientTesting()`; assert on the exposed signals (`count`, `books`, `user`) after driving inputs.
- `GoogleBooks`: `HttpTestingController` to assert request URL/params (ISBN vs. general query, `startIndex`/`maxResults`, the `key` param's presence/absence) and to flush controlled responses for the mapping logic.
- `BookSearch`, `BookCard`, `CartPage`, `Header`, `Footer`: `TestBed.createComponent` + `fixture.nativeElement` DOM assertions, with `Cart`/`GoogleAuth`/`GoogleBooks` provided as lightweight fakes (plain objects with the signals/methods each component actually uses) rather than deep-mocking the real services — keeps each component's tests focused on its own template logic (conditional rendering, click wiring) rather than re-testing the services' internals.

## Risks / Trade-offs

- [Angular component templates (`.html` files) may not map cleanly to V8's line-coverage instrumentation depending on how the Angular compiler emits sourcemaps, potentially under- or over-reporting a component's "line coverage" relative to what's actually exercised] → Discovered to not be a problem: `.html` templates are instrumented and reported per-line just like `.ts` files once actually rendered via `TestBed.createComponent()` + `fixture.detectChanges()`. The real risk turned out to be the *opposite* direction — a component exercised only through `TestBed.inject()` (no rendering) shows its template at 0%, which `BookSearch`'s tests initially did; fixed by adding rendering-based tests alongside the logic-only ones (see Implementation Notes below).
- [85% is a repo-wide average — a few well-tested files can mask a poorly-tested one] → Mitigated by the per-file task breakdown in tasks.md covering every non-trivial file individually, not just chasing the aggregate number.

## Implementation Notes (discovered while building)

Two things didn't work as originally planned and are recorded here so they aren't re-discovered the hard way later:

- **`runnerConfig` auto-discovery needs `angular.json`, not just the file's presence.** The CLI's `--runner-config` flag is string-typed only — it cannot receive the boolean `true` that triggers Angular's "search for `vitest-base.config.ts`" behavior (confirmed by reading `@angular/build`'s `findVitestBaseConfig` source: search only runs when the option is literally `=== true`, which only a JSON boolean in `angular.json` can express). Fix: added `"runnerConfig": true` under the `test` architect target's `options` in `angular.json`. With that in place, plain `npm test` prints *"Automatically searching for and using Vitest configuration file"* and correctly enforces the threshold.
- **`coverage.include`/`coverage.exclude` in `vitest-base.config.ts` silently zeroed out all real coverage.** Adding explicit include/exclude globs (to scope coverage to `src/app/**/*.ts`) caused every file to report 0% lines despite all tests passing — the override interferes with how `@angular/build`'s coverage plugin remaps V8's raw hit data back to source files. Fix: removed `include`/`exclude` entirely; `vitest-base.config.ts` now only sets `coverage.provider` and `coverage.thresholds.lines`. Angular's own default file selection (only files touched by at least one test) is sufficient here since every non-trivial file has a dedicated spec file per tasks.md.
