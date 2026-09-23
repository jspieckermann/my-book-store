## 1. Back-link control

- [x] 1.1 Add `impressum.backToSearch` to `src/app/language/translations.ts` — English "← Back to search" (matching `cartPage.backToSearch`'s exact text), German "← Zurück zur Suche" (matching `cartPage.backToSearch`'s exact text) — verify the key exists in both languages
- [x] 1.2 In `impressum.ts`, add `RouterLink` to the component's `imports` — verify the component compiles
- [x] 1.3 In `impressum.html`, add `<a class="back-link" routerLink="/">{{ language.translate('impressum.backToSearch') }}</a>` directly below the `<h1 class="page-title">`, matching `cart-page.html`'s back-link placement — verify by inspecting the link renders above the identity section and navigates to `/`
- [x] 1.4 In `impressum.css`, add a `.back-link` rule set identical to `cart-page.css`'s (`align-self: flex-start`, accent color, hover/press feedback, reduced-motion override) — verify the control's visual style matches the cart page's back-link

## 2. Tests

- [x] 2.1 Add unit tests in `impressum.spec.ts` asserting: the back-link is present and points to `/`; its text reads "← Back to search" by default and "← Zurück zur Suche" after `language.setLanguage('de')` — verify `npm test` passes
- [x] 2.2 Add an e2e test in `e2e/impressum.spec.ts` asserting: activating the Impressum page's back-link navigates to the main page — verify `npm run e2e` passes

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it completes without errors (DONE: clean build, same pre-existing header.css budget warning, unrelated to this change)
- [x] 3.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 104 tests passed, coverage 98.86% stmts / 93.4% branches / 96.29% funcs / 98.95% lines)
- [x] 3.3 Run `npm run e2e` and confirm the full e2e suite passes (DONE: 48/48 passed)
- [x] 3.4 Manually verify in the browser that the back-link is visible above the Impressum content, styled consistently with the cart page's back-link, translates with the language selector, and navigates to the main page when activated (DONE: verified via throwaway Playwright script with screenshots — link renders directly below the page title, identical accent-blue styling to the cart page's back-link, text reads "← Back to search"/"← Zurück zur Suche" matching the language, and clicking it navigates to "/" with the search page title shown; script and screenshots removed after verification)
