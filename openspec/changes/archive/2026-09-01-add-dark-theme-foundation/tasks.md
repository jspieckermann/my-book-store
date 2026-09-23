## 1. Color palette tokens

- [x] 1.1 Add a Tailwind v4 `@theme` block to `src/styles.css` defining color tokens: `--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-success`, `--color-warning`, `--color-error` (OKLCH values, dark/professional palette) — verify `npm run build` succeeds and each token is present as a generated CSS custom property in the build output
- [x] 1.2 Verify text contrast: check `--color-text` against `--color-background` and `--color-surface` meets WCAG AA (4.5:1) using a contrast checker — record the ratios in a code comment or commit note

## 2. Typography tokens

- [x] 2.1 Add typography tokens to the `@theme` block (font family, and heading/body/small size + weight steps) reflecting a modern, professional look — verify the tokens generate corresponding Tailwind utilities (e.g. `font-sans`, `text-*`) via `npm run build`

## 3. Global dark defaults

- [x] 3.1 Add global `html`/`body` rules in `src/styles.css` setting `background-color` and `color` from the new background/text tokens — verify by running `npm start` and confirming in the browser that the full viewport (not just the root component's content) renders dark with no light-colored flash or gaps
- [x] 3.2 Confirm no light/dark toggle exists anywhere in the app (no theme-switch control, no `prefers-color-scheme` branching) — verify by inspecting `src/app/**` for toggle-related code and confirming none exists

## 4. Restyle starter placeholder

- [x] 4.1 Replace the ad-hoc `:host` color variables in `src/app/app.html` (`--gray-900`, `--gray-700`, `--gray-400`, etc.) with references to the new global color tokens, keeping existing structural markup unchanged — verify by running `npm start` and visually confirming the placeholder page (heading, paragraph, pill links, social icons, divider) renders using the new dark palette
- [x] 4.2 Update the placeholder's typography (`h1`, `p`, `.pill`) to use the new typography tokens — verify by inspecting computed styles in the browser devtools match the token values

## 5. Verification

- [x] 5.1 Run `npm run build` and confirm it completes without errors or Tailwind warnings about unknown theme keys
- [x] 5.2 Run `npm test` and confirm existing tests (e.g. `app.spec.ts`) still pass
- [x] 5.3 Manually load the app in a browser and confirm every visible region (page background, root component content, and any margin/gutter area) uses the dark palette with no unstyled light background visible
