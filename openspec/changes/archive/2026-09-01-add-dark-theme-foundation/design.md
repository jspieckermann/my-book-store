## Context

The project is an Angular 22 app scaffolded via `ng new`, with Tailwind CSS v4 already installed (`tailwindcss`, `@tailwindcss/postcss`) but not yet configured with any custom theme — `src/styles.css` only has `@import 'tailwindcss';`, and the only existing colors live in a `:host` block inline in the starter's `src/app/app.html` template. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Provide one canonical place (`src/styles.css`) where the dark palette and typography scale are defined, so future components style themselves with token references instead of hard-coded colors.
- Make the dark theme the effective default with zero runtime logic (no JS theme switching, no `prefers-color-scheme` branching) — this is a fixed dark theme, not a dark *mode*.
- Keep the token set small and semantic (named by role: `background`, `surface`, `text`, `accent`, etc.) rather than by raw hue, so the palette can be retuned later without renaming call sites.

**Non-Goals:**
- No light theme or user-facing theme toggle (see proposal.md and spec's "No theme toggle in this change").
- No redesign of actual book-store screens/components — none exist yet; this change only touches the starter placeholder and the global stylesheet.
- No component library or design system tooling (e.g. Storybook) — out of scope for this change.

## Decisions

**Tailwind v4 `@theme` directive as the token source, mirrored as CSS custom properties.**
Tailwind v4 lets you declare design tokens directly in CSS via `@theme { --color-background: ...; }` inside `src/styles.css`, which simultaneously (a) defines standard CSS custom properties usable anywhere (`var(--color-background)`), and (b) generates matching Tailwind utility classes (`bg-background`, `text-text`, etc.). This avoids maintaining a separate `tailwind.config.ts` palette that could drift from the CSS, and lets both Tailwind-class-based styling and plain CSS (like the starter's `:host` block) consume the same source of truth.
- *Alternative considered*: a `tailwind.config.ts` `theme.extend.colors` block. Rejected because Tailwind v4's CSS-first config is the current recommended approach and keeps tokens colocated with the rest of global CSS in one file.
- *Alternative considered*: raw CSS custom properties only, no Tailwind theme integration. Rejected because it would forfeit Tailwind utility classes for the palette, forcing components to write custom CSS instead of using `bg-*`/`text-*` utilities.

**OKLCH color space for palette values.**
The existing starter placeholder already defines its accent colors in OKLCH (`oklch(51.01% 0.274 263.83)`), and OKLCH gives more perceptually-uniform lightness steps than HSL/RGB, which helps keep a dark palette's surface/background/border steps visually consistent. Continue that convention for the new tokens rather than mixing color spaces.

**Semantic token naming, not raw scale naming.**
Tokens are named by role (`--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-success`, `--color-warning`, `--color-error`) rather than by a numeric scale (`--color-gray-900`). Roles are what components actually need to reference, and it lets the underlying color values be retuned later without touching every call site.
- *Alternative considered*: keep a numeric gray/accent scale like the starter's `--gray-900`/`--gray-700`/`--gray-400` and let components pick a step. Rejected because it pushes theme decisions (which gray for text vs. muted text) into every component instead of centralizing them once.

**Global defaults via plain `body`/`html` CSS rules, not a wrapper component.**
`src/styles.css` is global (not component-scoped), so setting `background-color`/`color` on `body` there is sufficient to guarantee the dark background covers the whole viewport, including areas the root component doesn't fill (matches the spec's "applies globally" scenario). No wrapper `<div>` or root-component host binding is needed.

**Starter placeholder (`src/app/app.html`) is restyled in place, not deleted.**
The proposal calls for restyling it as a working demonstration that tokens render correctly end-to-end. Its `:host` block's ad-hoc color variables are replaced with references to the new global tokens (e.g. `var(--color-text)` instead of `var(--gray-900)`). The placeholder's structural markup (logo, pill links, social links) is left alone — only color/typography values change.

## Risks / Trade-offs

- [Placeholder page is likely to be deleted once real book-store screens are built, making its restyle short-lived] → Acceptable: its value is validating the tokens work end-to-end now, not long-term reuse. Effort spent there is intentionally small (color/typography swaps only, no structural changes).
- [Semantic token set may turn out to be incomplete once real components are built (e.g. missing a hover/focus-ring token)] → Acceptable for a foundation change; documented as extendable, and adding a token later is non-breaking (additive).
- [Fixed dark-only theme means no `prefers-color-scheme` respect for users who prefer light] → Accepted per proposal scope; a future change can add a toggle/light theme on top of this same token structure without restructuring it, since tokens are already semantic rather than hardcoded.
