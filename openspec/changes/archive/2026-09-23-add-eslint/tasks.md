## 1. Install angular-eslint

- [x] 1.1 Run `ng add angular-eslint`, accepting the detected `app` selector prefix — verify `package.json` gains `angular-eslint`/`@typescript-eslint`/`eslint` devDependencies, an `eslint.config.js` (or equivalent) is generated, `angular.json` gains a `lint` target, and `package.json` gains a `lint` script (DONE: schematic detected `app` prefix automatically and, in this version, already included `angular.configs.templateAccessibility` in the generated `eslint.config.js` — covers task 2.1 as well)
- [x] 1.2 Run `npm run lint` once as a baseline (expected to fail/list findings at this point) — verify the command runs end-to-end without a configuration error, distinct from rule violations (DONE: ran cleanly, reported exactly 1 real finding: `header.html:24` — `interactive-supports-focus`, an error)

## 2. Configure rule severities

- [x] 2.1 In the generated config, add the Angular template accessibility rule set (`angular.configs.templateAccessibility` or equivalent) to the `.html` file block, alongside the scaffolded template-recommended rules — verify by inspecting the config references it (DONE: already present in the schematic-generated `eslint.config.js` — `extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility]` — no edit needed)
- [x] 2.2 Leave every rule at its shipped default severity from the `typescript-eslint` recommended, `angular-eslint` recommended (TS), `angular-eslint` template recommended, and `angular-eslint` template accessibility configs — no severity overrides — verify by inspecting the project's own rules block adds/removes rules only where needed (e.g. the selector-prefix rule already required by the schematic), not severities (DONE: generated config's own `rules` block only adds the two selector rules the schematic itself requires, both at the schematic's own chosen severity — no severity overrides of any extended config's rules)
- [x] 2.3 Run `npm run lint` and confirm it reports both errors and warnings where the codebase trips them, and that the command's exit code reflects errors only (ESLint's default: warnings alone don't produce a non-zero exit) — verify by inspecting the CLI output and exit code (DONE: 1 error present, exit code 1; confirmed via `@angular-eslint/builder`'s schema that `maxWarnings` defaults to `-1` — warnings alone never trigger a nonzero exit, matching plain ESLint's default and the design decision — no builder options needed to achieve this)

## 3. Fix existing findings

- [x] 3.1 Fix every error `npm run lint` reports against the current codebase, scoped strictly to what the enabled rules flag (no broader refactor); leave any warnings as-is — verify by re-running `npm run lint` until it exits 0 (warnings may still be listed) (DONE: the single finding was `header.html`'s `.language-switcher` div having a `(keydown.escape)` handler with no way to receive focus — added `tabindex="-1"` so it's programmatically focusable without becoming a new stop in the tab order, since the handler only needs to catch events bubbling up from the already-focusable toggle/option buttons inside it. `npm run lint` now reports "All files pass linting", exit code 0, zero warnings too)
- [x] 3.2 Run `npm run build`, `npm test`, and `npm run e2e` after the lint fixes and confirm all three still pass — verify no fix changed observable behavior (DONE: build clean; 134 unit tests passed, coverage 99.11% stmts / 93.44% branches; 53/53 e2e tests passed)

## 4. Wire into the apply workflow

- [x] 4.1 Add a third bullet to `openspec/config.yaml`'s `operations.apply.guidance`, alongside the existing unit-test and e2e-test lines, stating that linting (`npm run lint`) must pass with zero errors — verify by inspecting the file and running `openspec instructions apply --change "<any future change>" --json` (or re-reading the file) to confirm the new guidance line is present (DONE: verified via `openspec instructions apply --change "add-eslint" --json` — the new line appears in `operationGuidance`)

## 5. Verification

- [x] 5.1 Run `npm run lint`, `npm run build`, `npm test`, and `npm run e2e` together and confirm all four pass with a clean working tree (DONE: lint exits 0 "All files pass linting"; build clean; 134 unit tests passed, coverage 99.11% stmts / 93.44% branches; 53/53 e2e tests passed)
