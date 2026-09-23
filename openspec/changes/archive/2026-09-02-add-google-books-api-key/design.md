## Context

`GoogleBooks.searchByIsbn()` (in `src/app/isbn-search/google-books.ts`) currently calls `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}` with no `key` parameter. This project has no `src/environments/` directory, no `fileReplacements` configured in `angular.json`, and no CI/deploy pipeline — it's built with Angular's `@angular/build:application` builder using only `development`/`production` serve/build configurations. See proposal.md - Why, and its confirmed decision to keep the key client-side.

## Goals / Non-Goals

**Goals:**
- Keep the real API key value out of version control entirely — not even in a gitignored-but-previously-committed file, and not as a default/fallback value anywhere in tracked source.
- Make local setup obvious: a tracked template file documents exactly what to create and where.
- Preserve today's working (if quota-limited) behavior when no key is configured, so a fresh clone still runs without any required setup step.

**Non-Goals:**
- Not attempting to hide the key from end users of a deployed build — per the proposal's confirmed decision, that protection is the HTTP referrer restriction configured in Google Cloud Console, entirely outside this repository.
- No build-time secret injection pipeline (e.g. reading from a CI secret store) — there is no CI/deploy pipeline in this project yet to hook into.
- No runtime key rotation or multiple-key support — one key, one static configuration slot.

## Decisions

**A plain, gitignored `src/environments/environment.ts` module (not Angular CLI's `fileReplacements` environment-swap pattern).**
Angular's classic `ng generate environments` sets up `environment.ts` + `environment.development.ts` swapped via `fileReplacements` per build configuration — designed for values that differ between dev and prod builds. This project has only one deployment target (no prod-specific key), and introducing `fileReplacements` would touch `angular.json`'s build configuration for a distinction that doesn't exist yet. A single `environment.ts`, entirely gitignored, is simpler: every environment (dev server, build) reads the same local file, and the file's absence/emptiness is exactly the "no key configured" case the spec already requires to degrade gracefully.
- *Alternative considered*: full `fileReplacements`-based dev/prod environment split. Rejected as unnecessary complexity for a single config value with no dev/prod difference; can be introduced later if a real prod deploy needs it.
- *Alternative considered*: an Angular `InjectionToken` populated via `provideAppInitializer` fetching a runtime `config.json` at startup. Rejected as over-engineered for one static string with no need to change without a rebuild.

**Tracked `src/environments/environment.example.ts` as the setup template; real `environment.ts` is gitignored.**
`environment.example.ts` exports the same shape with an empty-string placeholder and is committed, documenting the contract. Local setup is "copy this file to `environment.ts` and fill in your key" — a pattern much of the Angular/Node ecosystem already uses (`.env.example`), so it doesn't need new tooling or documentation format for this project.
- *Alternative considered*: document the required shape only in a README section, with no template file. Rejected — a copyable file is less error-prone than transcribing a shape from prose.

**`GoogleBooks.searchByIsbn()` reads `environment.googleBooksApiKey` directly and adds it to the request params object only when non-empty.**
```ts
const params: Record<string, string> = { q: `isbn:${isbn}` };
if (environment.googleBooksApiKey) {
  params['key'] = environment.googleBooksApiKey;
}
```
This keeps the fallback-to-unauthenticated behavior (spec's second scenario) as simple, local logic in the one place that builds the request — no separate "is configured" service or abstraction needed for a single conditional field.
- *Alternative considered*: always include `key: environment.googleBooksApiKey` even when empty (an empty `key=` query parameter). Rejected — Google's API may treat an empty `key` parameter differently from an absent one (e.g. as an explicitly invalid key rather than "no key"), so omitting it entirely when unset is the safer, more literal match for "unauthenticated request."

**Also removing the debug `console.log(params)` left in `google-books.ts` from earlier troubleshooting, since this change touches that exact line.**
It's dead debug output in a file this change is already editing; leaving it in production code after this change would be needless cruft directly adjacent to the edit. It is not otherwise in scope (no other cleanup of unrelated files) — the `console.log` in `isbn-search.ts` from the same troubleshooting session is untouched here, since this change does not otherwise edit that file.

## Risks / Trade-offs

- [Any value placed in client-side `environment.ts` is visible in the built JS bundle to anyone, regardless of gitignore] → Accepted per proposal's confirmed architecture decision; mitigation is the referrer restriction on the key itself, not secrecy in this codebase.
- [A developer could accidentally commit a real key if they rename their local `environment.ts` or if `.gitignore` is misconfigured] → Mitigated by keeping `environment.ts` (not `environment.example.ts`) as the sole gitignored filename, and verifying the `.gitignore` pattern during implementation (task-level check, not a new tool).
- [No key configured still leaves the app subject to the anonymous quota problem this change exists to fix] → Accepted and explicit in the spec's fallback scenario and proposal's Operational note — provisioning a real key is a manual step for the project owner, not something this change can automate.
