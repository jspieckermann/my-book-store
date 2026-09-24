## Why

There's currently no way to see, at a glance, which OpenSpec scenarios actually have an e2e test behind them and which don't — the project has 163 scenarios across 10 capabilities and 53 e2e tests, and that mapping only exists in whoever's head last wrote the tests. A generated traceability matrix makes coverage (and gaps) visible and keeps it current by regenerating it as a normal part of implementing a change, instead of a document someone has to remember to update by hand.

## What Changes

- Add a Node script (`scripts/generate-trace-matrix.mjs`, run via `npm run trace`) that parses every `### Requirement:`/`#### Scenario:` in `openspec/specs/**/spec.md` (the synced main specs, not in-flight change deltas) and every `// covers: <capability> > <requirement> > <scenario>` comment immediately above a `test(...)` call in `e2e/**/*.spec.ts`, and writes a human-readable Markdown report to `openspec/trace-matrix.md`.
- The script fails (non-zero exit) if a `// covers:` comment doesn't resolve to a real (capability, requirement, scenario) triple in the current specs — catching typos and drift. It does NOT fail on scenarios with no covering test; incomplete coverage is reported, not blocked, consistent with this project's existing apply guidance ("e2e tests covering most of the requirements, keep it simple").
- Backfill `// covers:` comments onto the existing 53 e2e tests, wherever they already correspond to a real scenario, so the first generated matrix reflects genuine current coverage rather than starting empty.
- Update `openspec/config.yaml`'s `operations.apply.guidance` so future `/opsx:apply` runs regenerate the matrix (`npm run trace`) as part of finishing a change, the same way lint/build/test/e2e already are.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
_(none — this is dev tooling and a workflow-configuration change, not a change in the application's observable behavior; `.openspec.yaml` sets `skip_specs: true`)_

## Impact

- Affected files: new `scripts/generate-trace-matrix.mjs`; new generated `openspec/trace-matrix.md`; `package.json` (new `trace` script); every `e2e/*.spec.ts` file (new `// covers:` comments above existing tests); `openspec/config.yaml` (apply guidance).
