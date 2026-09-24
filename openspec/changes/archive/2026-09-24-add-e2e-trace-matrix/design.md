## Context

`openspec/specs/**/spec.md` files follow a consistent structure: `### Requirement: <name>` blocks, each containing one or more `#### Scenario: <name>` blocks (WHEN/THEN). `e2e/**/*.spec.ts` files use Playwright's `test('<description>', async ({ page }) => {...})`, with no existing tagging or annotation convention. There is no `scripts/` directory yet. `openspec/config.yaml`'s `operations.apply.guidance` already lists build/test/e2e/lint expectations that this project's own `/opsx:apply` runs have consistently treated as mandatory (most recently, `add-eslint` added the lint line following the same pattern this change follows for the trace matrix). See proposal.md for motivation.

A direct survey of the current repo (`grep -c` over `openspec/specs/*/spec.md` and `e2e/*.spec.ts`) found:
- 66 requirements and 163 scenarios across 10 capabilities
- 53 e2e tests across 7 spec files
- **Scenario names are not globally unique**: `"Back control returns to the main page"` appears in both `shopping-cart` and `impressum`'s specs (both from the `add-breadcrumb-navigation` change touching two capabilities at once); `"Header renders on load"` appears twice *within the same file* (`app-header`), under two different requirements ("Header content" and "Header not sticky")

That last finding is the one decision this design turns on: a scenario name alone is not a safe lookup key, even scoped to one capability.

## Goals / Non-Goals

**Goals:**
- A generated, human-readable Markdown report showing every scenario, whether it's covered, and by which test — regenerated fresh each time, never hand-edited.
- A reference format precise enough that two identically-named scenarios in different requirements (or different capabilities) never get silently conflated.
- Typos/stale references in `// covers:` comments are caught automatically (the script fails), so the matrix stays trustworthy without needing a human to audit it.
- Incomplete coverage is visible but not a hard failure — consistent with this project's existing "covers most requirements, keep it simple" e2e guidance.

**Non-Goals:**
- No CI wiring (none exists in this repo yet) — `npm run trace` becomes a required agent/human-run step during apply, not an automated PR gate, the same scope boundary `add-eslint` drew for `npm run lint`.
- No attempt to trace unit tests (`*.spec.ts` under `src/`) — e2e tests map far more directly onto user-facing spec scenarios; unit tests verify implementation detail that often has no 1:1 scenario to point at.
- No tracing of in-flight change deltas (`openspec/changes/*/specs/*.md`) — only the synced main specs under `openspec/specs/` are authoritative, current system behavior.

## Decisions

- **Reference format: the full triple, not just the scenario name**: a `// covers: <capability> > <requirement name> > <scenario name>` comment immediately above a `test(...)` call. The capability is the directory name under `openspec/specs/` (e.g. `book-search`), exactly as it appears in the spec's path — this is the only way to disambiguate the two collisions found in Context. A test covering multiple scenarios gets multiple consecutive `// covers:` lines directly above it.
- **Unmatched references are a hard error**: if a `// covers:` triple doesn't resolve to a real requirement+scenario under the named capability, `npm run trace` exits non-zero and reports exactly which file/line and which triple failed to resolve. This is the one thing the script enforces — everything else about coverage is advisory.
- **Uncovered scenarios are reported, not blocked**: the script always succeeds (exit 0) as long as every existing `// covers:` reference is valid, regardless of how many scenarios have zero matching tests. Mirrors `add-eslint`'s "errors are a hard bar, everything else is advisory" split, and matches the pre-existing "most requirements, keep it simple" e2e guidance directly — a trace matrix that started demanding 100% coverage would contradict guidance already in place.
- **Output**: `openspec/trace-matrix.md`, one file for the whole project (not per-change), starting with a summary table (capability, requirement count, scenario count, covered count, coverage %) and a totals row, followed by one section per capability listing every requirement and its scenarios with either the covering test's title + file:line, or a plain "Not covered" marker. Plain text markers, not emoji/checkmarks, to keep the file diff-friendly and consistent with this project's existing avoidance of decorative icons in generated text output.
- **Location choice**: `openspec/` (sibling to `specs/` and `changes/`) rather than the repo root — it's a report *about* the OpenSpec specs, not a top-level project doc like a README.
- **Backfill scope**: annotate the 53 existing e2e tests with `// covers:` wherever a test already, in substance, verifies a real scenario — this is expected to leave a real number of the 163 scenarios uncovered (that's an accurate first snapshot, not a defect to chase down in this same change).

## Risks / Trade-offs

- [The `// covers:` comment can silently go stale if a test's actual behavior changes but its comment isn't updated] → Partially mitigated by the hard-error check (a renamed/removed scenario breaks the build immediately), but a comment that's simply become inaccurate while the scenario name is unchanged has no automatic detection — same class of risk any trace matrix carries, called out here so it isn't assumed solved.
- [Backfilling 53 tests against 163 scenarios by inspection is manual, error-prone work, not a mechanical transformation] → Accepted; there's no way to infer test-to-scenario mapping automatically from existing code, and the hard-error check on the resulting comments catches at least the class of mistake where a triple doesn't exist at all.
- [A capability-directory rename would break every `// covers:` line referencing it] → Accepted as a low-probability, easily-fixed-in-bulk event (a grep/replace across `e2e/`), not worth adding indirection for.
