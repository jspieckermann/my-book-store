## Context

The project already has one precedent for build-time-generated, checked-in data consumed later: `scripts/generate-trace-matrix.mjs`, run via `npm run trace`, which writes `openspec/trace-matrix.md`. That file is a human-readable report, not something the Angular app itself reads at runtime. This change needs the opposite: a generated artifact the running app actually renders. `Impressum` (`src/app/impressum/`) is the closest UI precedent for the new page itself — a breadcrumb-backed, language-following content page reached from the footer, with some content (fixed legal/identity data) that explicitly does NOT translate. See proposal.md for motivation.

Production dependency scope is small: `npm ls --all --omit=dev` currently resolves to about 10 unique packages (`@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`, `@angular/router`, `@standard-schema/spec`, `zod`, `rxjs`, `tslib`), versus roughly 1250 lines when devDependencies (ESLint, Playwright, TypeScript, Tailwind, etc.) are included — confirming the production-only scope decided with the user keeps this page short and legally meaningful rather than an overwhelming, mostly-irrelevant list.

## Goals / Non-Goals

**Goals:**
- A deterministic, checked-in data source listing the app's shipped (production) dependencies with name, version, and license, that the Legal page renders with no runtime network calls.
- A regeneration script, consistent with the `npm run trace` precedent, so the data can be refreshed on demand when dependencies change.

**Non-Goals:**
- No display of full license *text* bodies (just the license identifier, e.g. "MIT", "Apache-2.0") — a reasonable, common scope for a dependency-disclosure page; full text per license can be a future enhancement if ever needed.
- No automatic regeneration on every `npm install` or every build — same manually-triggered posture as `npm run trace`, accepted as a trade-off (see Risks).
- No new runtime dependency to fetch/compute this (e.g. no `license-checker` package added to `dependencies`) — the generator script is a dev-time tool only, and the generated output is plain data the app imports like `translations.ts`.

## Decisions

- **Generated TypeScript data file, not a JSON asset fetched at runtime**: `scripts/generate-legal-notices.mjs` resolves the production dependency tree, reads each package's own `package.json` for its `license` field, and writes `src/app/legal/legal-notices-data.ts` exporting a typed `LEGAL_NOTICES: LegalNotice[]` array (`{ name, version, license }`, license `'Unknown'` when a package has no discoverable `license` field). The `Legal` component imports this directly — same pattern as `translations.ts` — avoiding an HTTP round-trip and keeping the page usable offline/in tests without mocking a fetch.
- **Dependency resolution via `npm ls --all --omit=dev --json`**: this reuses npm's own resolved, deduped dependency graph (respecting the installed `package-lock.json`) rather than hand-walking `node_modules`, so it matches exactly what's actually installed for production use.
- **New npm script `npm run legal`**: regenerates `legal-notices-data.ts`, mirroring `npm run trace`'s role for `trace-matrix.md`. Like the trace matrix, it is a manually-run step, not wired into `npm run build`, keeping the build fast and deterministic (no dependency on `node_modules` package.json contents at build time).
- **Sorted alphabetically by package name** for a stable, deterministic diff each time the script runs, and predictable test assertions.
- **Dependencies with no discoverable `license` field are listed as `'Unknown'`, never silently dropped** — per the new "A dependency with an undetermined license is still listed" requirement, since silently omitting a dependency would defeat the page's disclosure purpose.
- **Reuse the `Impressum` page's structure**: breadcrumb at top, `<h1 class="page-title">`, content below; the Legal page's own heading/labels go through `Language.translate()` like Impressum's section headings, while the dependency table's name/version/license values are rendered as-is (not translation keys), the same split Impressum already makes between translatable chrome and fixed factual data.

## Risks / Trade-offs

- [The generated `legal-notices-data.ts` can go stale if dependencies change without someone re-running `npm run legal`] → Accepted, same posture as `openspec/trace-matrix.md`; could be revisited later as a CI check (e.g. fail CI if the generated file differs from a fresh run) but that's out of scope for this change.
- [A package's `package.json` `license` field is sometimes missing or uses a non-SPDX free-text value] → Handled by the "Unknown" fallback for missing fields; free-text non-SPDX values are passed through as-is rather than validated/normalized, since normalizing SPDX expressions is a bigger scope than this change needs for ~10 packages.
