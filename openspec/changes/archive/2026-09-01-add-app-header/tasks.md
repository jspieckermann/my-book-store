## 1. Header component scaffold

- [x] 1.1 Generate a standalone `Header` component at `src/app/header/` (e.g. `header.ts`, `header.html`, `header.css`) — verify the files exist and `ng build` still succeeds with the component unreferenced
- [x] 1.2 Add an inline SVG open-book logo and the title text "My-Book-Store" to the header template — verify by inspecting the rendered DOM contains the exact text "My-Book-Store" and an `<svg>` element

## 2. Styling: theme consistency

- [x] 2.1 Style the header background using `--color-surface`/`--color-background` and the title text using `--color-text` (or `--font-weight-heading`/`--text-*` typography tokens), with the logo using `currentColor` so it inherits a theme color token — verify by inspecting computed styles in devtools show only `theming` token values, no hardcoded hex/oklch colors in the header's own CSS
- [x] 2.2 Apply typography tokens (`--font-sans`, and a heading-appropriate size/weight token) to the title — verify computed `font-family`/`font-size`/`font-weight` match the token values

## 3. Responsive layout

- [x] 3.1 Implement fluid responsive sizing (e.g. `clamp()` for title font-size, flexible padding) so the header does not overflow, clip, or cause horizontal scroll — verify by resizing the browser viewport from 320px to 1920px wide with no horizontal scrollbar appearing and no visual clipping of logo/title
- [x] 3.2 Ensure the header uses normal (static) positioning and scrolls with page content, with a background from the theme tokens — verify no `position: sticky`/`fixed` is applied to the header and, with temporary tall content, the header moves off-screen when scrolling past it (then remove any temporary content used only for this check)

## 4. Wire into app shell

- [x] 4.1 Register the `Header` component in `src/app/app.ts` and reference it in `src/app/app.html` as `<app-header />` above `<router-outlet />` — verify `ng build` succeeds and the header renders on app load
- [x] 4.2 Remove the Angular CLI starter placeholder content from `src/app/app.html` (the starter `<style>` block, `<main>` demo content with the Angular logo, "Congratulations!" text, pill links, and social links) — verify `src/app/app.html` contains only the header and `<router-outlet />` (plus any minimal required wrapper markup)

## 5. Verification

- [x] 5.1 Run `npm run build` and confirm it completes without errors
- [x] 5.2 Run `npm test` and confirm existing tests still pass (update `app.spec.ts` if it asserted on removed starter content)
- [x] 5.3 Manually load the app in a browser at mobile (~375px), tablet (~768px), and desktop (~1440px) widths and confirm the header renders correctly (logo + "My-Book-Store" title visible, dark themed, no overflow) at each width
