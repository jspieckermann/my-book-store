## Context

The `theming` capability (from `add-dark-theme-foundation`, already archived) established color and typography tokens in `src/styles.css` via a Tailwind v4 `@theme` block: `--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, plus `--font-sans`, `--text-heading`/`--text-body`/`--text-small` and matching weight/line-height tokens. The app's root template (`src/app/app.html`) still holds the unmodified Angular CLI starter placeholder content. No routing beyond the empty `app.routes.ts` exists yet, and no other header/nav component exists. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Ship one standalone Angular component that renders the logo + title and is reusable as the app shell's header regardless of which route is active.
- Make it responsive using CSS alone (fluid sizing/spacing), not JS-driven breakpoint logic — matches the project's current no-JS-styling-logic approach from the theming change.
- Reuse existing `theming` tokens exclusively; add no new color or font values.

**Non-Goals:**
- No navigation links/menu, search bar, or user/account controls in the header — no routes exist yet for a nav to point to (see proposal's Follow-on work).
- No mobile hamburger/drawer menu — not needed since there is no nav content to collapse.
- No new theme tokens — if the header needs a value `theming` doesn't provide, that is out of scope for this change (surface it instead of inventing one).

## Decisions

**Standalone Angular component (`src/app/header/header.ts` + template), not inline markup in `app.html`.**
Angular 22's standalone-components-by-default model makes this a natural boundary: the header has its own concerns (logo markup, responsive CSS) separate from `app.html`'s job of composing the page shell (`<app-header />` + `<router-outlet />`). This also matches how future shell pieces (e.g. a footer) would likely be added later.
- *Alternative considered*: keep the header as markup directly inside `app.html`. Rejected because it conflates the root shell template with a self-contained, reusable piece of UI, and makes the header harder to test or reuse in isolation.

**Inline SVG book icon, not an icon font/library.**
No icon library is installed, and pulling one in (e.g. Angular Material icons, a Font Awesome package) is a new dependency for a single icon — disproportionate for this change. An inline SVG (a simple open-book glyph) can be sized and colored via `currentColor` so it inherits the `--color-text`/`--color-accent` token automatically, satisfying the theme-consistency requirement without extra CSS.
- *Alternative considered*: an `<img>` referencing a static asset file. Rejected because a raster/external image can't inherit `currentColor` for theme-token coloring and adds a binary asset to track for a simple glyph.

**Responsive via fluid CSS (`clamp()`/flex), not fixed breakpoints.**
The header only contains a logo + title (no nav items to reflow), so the responsive requirement reduces to "don't overflow or clip at any width." `clamp()` on the title font-size and flexible padding via Tailwind's spacing utilities handles this smoothly without needing discrete `@media` breakpoints or a hamburger toggle.
- *Alternative considered*: fixed `@media` breakpoints resizing title/logo in steps. Rejected as unnecessary complexity for two elements that just need to scale continuously.

**Static header, not sticky.**
The header uses normal document flow and scrolls with page content rather than pinning to the viewport top, per the `app-header` spec's "Header not sticky" requirement. It still uses the `--color-surface`/`--color-background` token for its background so it's visually consistent with the page regardless of scroll position.
- *Alternative considered*: `position: sticky; top: 0;` to keep the header pinned while scrolling. Rejected per the spec's explicit non-sticky requirement.

## Risks / Trade-offs

- [No nav content yet means the header's responsive behavior is only lightly tested by real content — a future nav menu could reveal new overflow cases] → Acceptable: this change's spec scope is explicitly logo+title only; a follow-on change adding nav will need its own responsive design work (e.g. hamburger menu), noted in proposal.md's Follow-on work.
- [Removing the Angular starter placeholder is **BREAKING** for anyone still relying on the starter demo content] → Acceptable and intentional per the user's explicit choice to replace it now; nothing else in the codebase references that markup (confirmed via proposal's Impact).
- [Inline SVG hand-authored rather than sourced from an icon set could look inconsistent with a future, more complete icon system] → Acceptable for now; if/when the project adopts an icon library later, swapping one inline SVG for a library icon is a small, isolated change.
