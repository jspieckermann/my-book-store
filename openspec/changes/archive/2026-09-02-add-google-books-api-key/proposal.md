## Why

The Google Books API is currently called unauthenticated (no API key), which shares a very low daily quota across all anonymous callers. This was already observed to fail in practice during `add-isbn-search`/`add-isbn-search-results` testing (`429 Quota exceeded`, `quota_limit_value: "0"` for this network). Sending a Google API key raises the request to that key's own (much higher) quota, fixing this.

## What Changes

- Include a Google Books API key in the request to the Google Books `volumes` endpoint when one is configured, instead of always calling it unauthenticated.
- Add a client-side configuration slot for the key (Angular environment file), gitignored so no real key is ever committed to the repository; a tracked placeholder/example file documents the expected shape for local setup.
- If no key is configured (e.g. a fresh checkout before local setup), the app SHALL continue to work exactly as it does today — an unauthenticated request — rather than failing to build or throwing at runtime. The quota problem simply persists for that developer until they configure a key.
- **Decision (confirmed with the user)**: the key stays entirely client-side, sent directly from the browser to `googleapis.com`, matching this project's current pure-SPA architecture (no backend exists). Because any value bundled into client-side JavaScript is inherently visible to anyone loading the app, protection against abuse of the key must come from an **HTTP referrer restriction** configured on the key in the Google Cloud Console — outside this repository and outside this change's scope. This change does not, and cannot, keep the key secret from end users; it only removes it from version control.

## Capabilities

### Modified Capabilities
- `isbn-search`: Adds a new "API key authentication" requirement (via an ADDED delta block — no existing requirement's behavior changes); the request to the Google Books API now includes a configured key when available.

### New Capabilities
(none)

## Impact

- **Code**: `src/app/isbn-search/google-books.ts` (include the key in request params when configured), a new `src/environments/` directory (`environment.ts` gitignored with the real/local key, `environment.example.ts` tracked as a placeholder template), `.gitignore` (exclude the real environment file).
- **Dependencies**: None new.
- **Systems**: Still the same Google Books `volumes` endpoint from `add-isbn-search`; only the request now optionally carries a `key` query parameter.
- **Operational**: The user (project owner) is responsible for provisioning an actual Google Cloud API key with the Books API enabled and an HTTP referrer restriction configured, and placing it in their local (gitignored) environment file — this change ships the mechanism, not a working key.
- **Follow-on work**: Deploy-time key injection for a real hosted build (e.g. CI secret → build-time replacement) is not part of this change; today's build has no CI/deploy pipeline to hook into.
