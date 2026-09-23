## Context

The project has no linter today (see proposal.md - Why). It's an Angular 22 standalone-component app using signals, the new `@if`/`@for` control-flow syntax, and a hand-rolled i18n layer, with component selectors consistently prefixed `app-` (e.g. `app-recommendation-card`, `app-breadcrumb`). `package.json` has no `lint` script; `angular.json` has no `lint` target. `openspec/config.yaml`'s `operations.apply.guidance` currently lists two verification requirements (unit-test coverage, e2e coverage) that every `/opsx:apply` run in this project has treated as mandatory, not merely advisory.

## Goals / Non-Goals

**Goals:**
- A working `npm run lint` that exits non-zero on any error-level rule violation, runnable by a human or an agent, in both `.ts` files and `.html` templates.
- Rules keep their own default severity (error or warn) as shipped by the enabled configs — only the "error" tier is a hard failure; "warn"-level findings are visible but non-blocking, a softer translation of the original ask ("no Blocker/Critical/Major findings") than collapsing every rule to error.
- `/opsx:apply` treats a clean (zero-error) lint run as a required verification step going forward, the same way build/test/e2e already are; warnings don't block.

**Non-Goals:**
- No type-aware linting (`typescript-eslint`'s `recommendedTypeChecked`) in this pass — it requires wiring `parserOptions.project` and is noticeably slower; the plain (non-type-checked) `recommended` config already covers the bug/anti-pattern/accessibility ground this change is after. Can be layered on later as its own change if wanted.
- No attempt to reproduce Sonar's specific Blocker/Critical/Major/Minor/Info taxonomy — that dropped when SonarLint (IDE-only, unenforceable by an agent) was replaced with ESLint (CLI, enforceable). See proposal.md.
- No CI wiring (no GitHub Actions workflow exists in this repo yet) — `npm run lint` becomes a required local/agent-run check, not yet an automated PR gate.

## Decisions

- **Install via `ng add angular-eslint`**, not a hand-assembled `eslint.config.js` — it's the official Angular-team-endorsed path, auto-wires an `ng lint` target into `angular.json`, generates a flat config, and prompts for the component/directive selector prefix (expected to detect/confirm `app`, matching every existing component in this codebase).
- **Rule sets enabled**: `typescript-eslint` recommended + `angular-eslint` recommended (TS) for `.ts` files; `angular-eslint` template recommended **and** template accessibility for `.html` files. Template accessibility isn't part of the schematic's default scaffold, but this codebase already hand-follows accessibility conventions throughout (`aria-current="page"` on the breadcrumb, `aria-label`s on every pagination/icon-only control, `role="img"` on the rating stars) — enabling it turns those existing conventions into an enforced rule instead of an unenforced habit, and should mostly find nothing since the patterns are already in place.
- **Severity: kept as shipped, only "error" is enforced**. Rules stay at whatever severity the `typescript-eslint`/`angular-eslint` recommended and template-accessibility configs assign them by default — no bumping "warn" rules to "error". `npm run lint` passing means zero errors; any warnings are visible in the output but don't fail the command or block apply. This is a deliberately reduced-strictness translation of the original "no Blocker/Critical/Major findings" ask — errors are the hard bar, warnings are advisory.
- **Wire into apply, not archive**: add a third bullet to `openspec/config.yaml`'s `operations.apply.guidance` (alongside the existing unit-test and e2e-test lines) rather than a new archive-time check, since the goal is to catch issues during implementation, not after the fact.
- **Fix existing errors, leave existing warnings**: whatever the first real `npm run lint` run surfaces as an error against the current codebase gets fixed directly (scoped to what the enabled rules actually flag), not disabled per-rule or per-line. Any warnings the same run surfaces are left as-is — visible, optional follow-up, not required for this change.

## Risks / Trade-offs

- [An initial lint run against ~25 existing components could surface more errors than expected, turning a "add a tool" change into a larger cleanup] → Mitigation: fix only what the configured error-level rules actually flag; this isn't license for a broader refactor pass.
- [Leaving warnings unaddressed means real findings could sit unfixed indefinitely if nothing ever revisits them] → Accepted as the direct trade-off for reduced strictness, matching what was explicitly asked for; warnings remain visible in every `npm run lint` run, so they're not hidden, just not blocking.
- [No CI to actually gate on this — a human or agent has to remember to run `npm run lint`] → Accepted for now; this repo has no CI at all yet (a separate, larger piece of work), and `/opsx:apply`'s guidance is the enforcement mechanism available today.
