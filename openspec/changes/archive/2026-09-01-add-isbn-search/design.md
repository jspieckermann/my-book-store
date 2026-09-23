## Context

The `app-header`/`app-footer` capabilities established the pattern for shell components: a standalone Angular component under `src/app/<name>/`, styled from `theming`'s tokens, wired into `src/app/app.html`, with fluid `clamp()`-based responsive sizing and no sticky/fixed positioning. This is the app's first feature that calls an external API — Angular's `HttpClient` is not yet provided anywhere (`src/app/app.config.ts` only has `provideBrowserGlobalErrorListeners()` and `provideRouter(routes)`). See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Ship one standalone Angular component (input + button) plus a small injectable service that wraps the Google Books API call, following Angular's service/component separation so the HTTP logic is unit-testable independent of the UI.
- Reuse existing `theming` tokens exclusively for all visual styling, matching `app-header`/`app-footer`'s precedent.
- Keep the component's internal state minimal: the entered ISBN, an `idle | loading | error` status, and nothing that represents "results" (per proposal's explicit scope cut).

**Non-Goals:**
- No results rendering, no ISBN checksum/format validation beyond non-empty/whitespace, no API key configuration, no debounced/live search-as-you-type. All noted in proposal.md's Impact/Follow-on work.
- No caching, retry logic, or request cancellation (e.g. cancelling an in-flight request if the user clicks search again) — the button-disable-while-loading requirement already prevents overlapping requests, so cancellation isn't needed for correctness.

## Decisions

**Standalone Angular component (`src/app/isbn-search/isbn-search.ts` + template), mirroring header/footer's structure.**
Same rationale as prior shell components: keeps `app.html` focused on composition while the filter section's markup/styling/logic stays self-contained.
- *Alternative considered*: inline markup in `app.html`. Rejected for the same reasons as header/footer.

**Separate injectable service (`GoogleBooksService`) for the API call, injected into the component.**
Isolating the `HttpClient` call in a service (rather than calling `HttpClient` directly in the component) follows standard Angular practice, keeps the component focused on UI/form state, and makes the API interaction mockable/testable in isolation from DOM rendering.
- *Alternative considered*: call `HttpClient` directly inside the component. Rejected as unnecessary coupling for a feature that already needs a clean seam for the deferred "add results rendering" follow-on work — that future change will want to reuse this same service.

**`provideHttpClient()` added to `app.config.ts`.**
Angular's `HttpClient` requires this provider; without it, injecting `HttpClient` throws at runtime. This is a one-line addition to the existing `providers` array, no other app-wide HTTP configuration (interceptors, etc.) is needed for this change.
- *Alternative considered*: use the native `fetch` API directly instead of `HttpClient`. Rejected because `HttpClient` is idiomatic Angular, integrates with Angular's testing utilities (`HttpTestingController`), and is what future Angular features in this app will expect.

**Direct, unauthenticated call to `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}`.**
Google's Books API allows a limited volume of unauthenticated requests to this endpoint, which is sufficient for this app's current stage. No API key handling, environment config, or secrets management exists in the project yet, so requiring a key now would add setup scope beyond what was requested.
- *Alternative considered*: add an API key via Angular environment files. Rejected per proposal's explicit "API key configuration is out of scope" — can be layered in later without changing this component's or service's public shape (the query URL construction is centralized in the one service method).

**Status feedback via a simple internal `status: 'idle' | 'loading' | 'error'` signal, not a router/query-param-driven state.**
The filter section's request status is local, ephemeral UI state — it doesn't need to survive navigation or be shareable via URL, so a plain component signal is sufficient and matches Angular 22's signal-based state idiom already used in the (removed) starter template.
- *Alternative considered*: a shared/service-level state store. Rejected as over-engineering for a single component with no other consumers of its status yet.

**No result data stored or logged anywhere, even transiently.**
To satisfy the spec's "SHALL NOT render the returned book data" requirement unambiguously, the service resolves/rejects without the component retaining the parsed response body in any bound template state — only the `loading`/`error` status is kept.
- *Alternative considered*: store the response but simply not bind it in the template. Rejected as a weaker guarantee — an unused-but-retained field is an easy accidental leak into a future template edit; not keeping it at all is a stronger, self-enforcing boundary for the "no results" scope cut.

## Risks / Trade-offs

- [Unauthenticated Google Books API calls are rate-limited; heavy testing/usage could hit that limit] → Acceptable for this app's current stage per proposal's Impact; API key support is explicitly deferred follow-on work.
- [No request cancellation means a slow first request could still resolve and update `status` after the user has already moved on, though the button-disable prevents a second overlapping request] → Acceptable; the resulting status update (loading→error or loading→idle) is harmless since no result data is displayed regardless.
- [Calling a third-party API directly from the browser exposes the request (ISBN query) to the client network tab, but no credentials are involved since the call is unauthenticated] → Acceptable; no sensitive data is sent or received.
