## Context

The `app-header` capability (from `add-app-header`, already archived) established the pattern for shell components: a standalone Angular component under `src/app/<name>/`, styled entirely from the `theming` capability's tokens (`--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--font-sans`, `--text-*`/`--font-weight-*`), wired into `src/app/app.html` alongside `<router-outlet />`, and using normal (non-sticky) document flow with fluid `clamp()`-based responsive sizing. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Ship one standalone Angular component that renders the version text and sits below `<router-outlet />` in normal document flow.
- Make it visually subordinate to the header by construction — smaller font size and the muted text token — not just "smaller" by eyeballing.
- Reuse existing `theming` tokens exclusively; add no new color or font values, matching `app-header`'s precedent.

**Non-Goals:**
- No links (privacy/terms/social), copyright text, or other footer content beyond the version number — not requested and no pages exist yet to link to.
- No dynamic version resolution (e.g. reading from `package.json` at build time) — the version is a hardcoded "v1.0" string for this change, per proposal's Impact/Follow-on work.
- No sticky/fixed positioning of any kind, per the spec's explicit non-sticky requirement.

## Decisions

**Standalone Angular component (`src/app/footer/footer.ts` + template), mirroring the header's structure.**
Same rationale as `add-app-header`'s equivalent decision: keeps `app.html` focused on composing the shell (`<app-header />`, `<router-outlet />`, `<app-footer />`) while the footer's own markup/styling stays self-contained and reusable.
- *Alternative considered*: inline markup in `app.html`. Rejected for the same reasons as the header — conflates the shell template with a self-contained UI piece.

**Smaller font size + `--color-text-muted` (not `--color-text`) to express reduced prominence.**
The `theming` capability already defines a muted/secondary text token (`--color-text-muted`) precisely for de-emphasized text, and a `--text-small` size token smaller than the header's `--text-heading`-based title. Using both together is a direct, verifiable way to satisfy "less prominent than the header" (spec's Reduced visual prominence requirement) without inventing new tokens or subjective spacing/weight tweaks.
- *Alternative considered*: keep `--color-text` but reduce only font size. Rejected because color is the stronger prominence signal in a dark theme (muted vs. primary text reads as "secondary content" at a glance) and the spec explicitly calls out both size and color.

**No background differentiation (transparent/inherits page background), unlike the header's `--color-surface` background.**
The header uses `--color-surface` to visually separate itself as a distinct bar; giving the footer the same treatment would make it look equally prominent, working against the "less prominent" requirement. A plain, backgroundless footer with just muted, smaller text recedes visually rather than presenting as another bar.
- *Alternative considered*: use `--color-surface` background like the header for shell symmetry. Rejected because it directly conflicts with the reduced-prominence requirement.

**Static (non-sticky) footer positioned via normal document flow, matching the header's non-sticky decision.**
No `position: sticky`/`fixed` — the footer sits after `<router-outlet />` and scrolls with the page, exactly as `app-header`'s (revised) non-sticky behavior does. This also avoids any risk of a fixed footer overlapping short-page content, which would be a new class of layout bug this component doesn't need to solve.
- *Alternative considered*: `position: sticky; bottom: 0;` to keep the version visible. Rejected per the spec's explicit non-sticky requirement and because a persistently visible footer would itself be a prominence increase, at odds with "less prominent than the header."

**Responsive via fluid CSS (`clamp()`), matching the header's approach.**
The footer contains only a short text string, so — like the header — fluid sizing (clamp on padding) is sufficient to avoid overflow at any width without discrete breakpoints.
- *Alternative considered*: fixed `@media` breakpoints. Rejected as unnecessary for a single short text element, consistent with the header's prior decision.

## Risks / Trade-offs

- [Hardcoded "v1.0" string will drift from the real app version as soon as one changes] → Acceptable and explicitly scoped out per proposal's Follow-on work; a later change can wire it to a real version source without altering this component's visual/layout contract.
- [No visual regression test exists to enforce "footer smaller/muted than header" going forward — a future edit to either component's CSS could silently violate it] → Acceptable for now; the spec's scenario gives a concrete, manually-checkable comparison (font-size and color-token diff) for reviewers until such tooling exists.
