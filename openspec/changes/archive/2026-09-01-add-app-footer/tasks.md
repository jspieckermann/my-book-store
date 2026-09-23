## 1. Footer component scaffold

- [x] 1.1 Generate a standalone `Footer` component at `src/app/footer/` (e.g. `footer.ts`, `footer.html`, `footer.css`) — verify the files exist and `ng build` still succeeds with the component unreferenced
- [x] 1.2 Add the version text "v1.0" to the footer template — verify by inspecting the rendered DOM contains the exact text "v1.0"

## 2. Styling: reduced prominence and theme consistency

- [x] 2.1 Style the footer text using `--color-text-muted` (not `--color-text`) and a font size smaller than the header title's (e.g. `--text-small`), with no background color set (footer inherits the page background rather than using `--color-surface`) — verify by inspecting computed styles show the muted color token and a smaller font-size than the header's title
- [x] 2.2 Apply `--font-sans` to the footer text — verify computed `font-family` matches the token value

## 3. Responsive layout and positioning

- [x] 3.1 Implement fluid responsive sizing (e.g. `clamp()` for padding) so the footer does not overflow, clip, or cause horizontal scroll — verify by resizing the browser viewport from 320px to 1920px wide with no horizontal scrollbar appearing and no visual clipping of the version text
- [x] 3.2 Ensure the footer uses normal (static) positioning and scrolls with page content — verify no `position: sticky`/`fixed` is applied to the footer and, with temporary tall content, the footer moves off-screen when scrolling past it (then remove any temporary content used only for this check)

## 4. Wire into app shell

- [x] 4.1 Register the `Footer` component in `src/app/app.ts` and reference it in `src/app/app.html` as `<app-footer />` below `<router-outlet />` — verify `ng build` succeeds and the footer renders at the bottom of the page on app load

## 5. Verification

- [x] 5.1 Run `npm run build` and confirm it completes without errors
- [x] 5.2 Run `npm test` and confirm existing tests still pass
- [x] 5.3 Manually load the app in a browser at mobile (~375px), tablet (~768px), and desktop (~1440px) widths and confirm the footer renders correctly (version "v1.0" visible, muted/smaller than the header, no overflow) at each width, and visually compare it side-by-side with the header to confirm it reads as less prominent
