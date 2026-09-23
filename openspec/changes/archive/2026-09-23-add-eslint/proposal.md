## Why

The project has no static analysis or linting today — only Prettier for formatting and the TypeScript compiler's own strictness flags. Bugs and Angular-specific anti-patterns (unsafe template bindings, accessibility issues, unused code) can only be caught by manual review. `angular-eslint` is the official, free, CLI-runnable successor to the old TSLint-based `ng lint`, and — unlike the IDE-only SonarLint that was tried first — it can actually be invoked and enforced by an agent during implementation, not just observed by a human in the editor.

## What Changes

- Add `angular-eslint` (ESLint + typescript-eslint + Angular-specific rules for both `.ts` files and `.html` templates) via `ng add angular-eslint`, restoring an `ng lint` / `npm run lint` command.
- Add Angular's template accessibility rule set on top of the scaffolded defaults, keeping each rule's own default severity (error or warn) as shipped rather than forcing everything to error.
- Fix any existing lint **errors** the initial run surfaces, so the codebase starts from a clean baseline; existing warnings are left as optional follow-up, not required.
- Update `openspec/config.yaml`'s `operations.apply.guidance` to add linting (`npm run lint` passing with zero errors — warnings are non-blocking) as a required verification step for future `/opsx:apply` runs, alongside the existing unit-test and e2e-test guidance.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
_(none — this is dev tooling and a workflow-configuration change, not a change in the application's observable behavior; `.openspec.yaml` sets `skip_specs: true`)_

## Impact

- Affected files: `package.json`/`package-lock.json` (new `angular-eslint`/`eslint`/`typescript-eslint` devDependencies, new `lint` script), a new `eslint.config.js` (or whatever config file `ng add angular-eslint` generates), `angular.json` (new `lint` target), `openspec/config.yaml` (apply guidance), and potentially any existing source file that trips an error-level rule.
