## 1. Breadcrumb component

- [x] 1.1 Create `src/app/breadcrumb/breadcrumb.ts`: standalone component with `currentPageLabel = input.required<string>()`, injecting `Language` — verify the component compiles
- [x] 1.2 Create `src/app/breadcrumb/breadcrumb.html`: a `<nav>` with a translated `aria-label` (`breadcrumb.navigationLabel`), containing a `RouterLink` to `/` labeled with `language.translate('bookSearch.pageTitle')`, a visually-hidden-from-AT separator (`aria-hidden="true"`), and a `<span aria-current="page">{{ currentPageLabel() }}</span>` for the current page — verify by inspecting the main-page link's `href` resolves to `/` and the current-page span carries `aria-current="page"`
- [x] 1.3 Create `src/app/breadcrumb/breadcrumb.css` reusing existing theming tokens and matching this app's existing link styling (the `.back-link` color/hover/press treatment being removed) for the main-page link — verify no new hardcoded colors/fonts are introduced

## 2. Translations

- [x] 2.1 Add `breadcrumb.navigationLabel` to `translations.ts` — English "Breadcrumb", German "Brotkrumennavigation" — verify the key exists in both languages
- [x] 2.2 Remove the now-unused `cartPage.backToSearch` and `impressum.backToSearch` keys from `translations.ts` (both English and German) — verify by inspecting no remaining references to either key in the codebase

## 3. Wire into the cart page

- [x] 3.1 In `cart-page.html`, replace the `<a class="back-link">` with `<app-breadcrumb [currentPageLabel]="language.translate('cartPage.pageTitle')" />` placed directly before `<h1 class="page-title">` — verify by inspecting the breadcrumb renders above the title and the old back-link markup is gone
- [x] 3.2 In `cart-page.ts`, replace the `RouterLink` import (no longer used directly by this component) with the `Breadcrumb` component in `imports` — verify the component compiles
- [x] 3.3 In `cart-page.css`, remove the now-unused `.back-link` rule block — verify by inspecting no other selector in the file still targets `.back-link`

## 4. Wire into the Impressum page

- [x] 4.1 In `impressum.html`, replace the `<a class="back-link">` with `<app-breadcrumb [currentPageLabel]="language.translate('impressum.pageTitle')" />` placed directly before `<h1 class="page-title">` — verify by inspecting the breadcrumb renders above the title and the old back-link markup is gone
- [x] 4.2 In `impressum.ts`, replace the `RouterLink` import with the `Breadcrumb` component in `imports` — verify the component compiles
- [x] 4.3 In `impressum.css`, remove the now-unused `.back-link` rule block — verify by inspecting no other selector in the file still targets `.back-link`

## 5. Unit tests

- [x] 5.1 Add `breadcrumb.spec.ts` covering: the main-page link's `href` is `/` and its text is the translated `bookSearch.pageTitle`; the current-page segment shows `currentPageLabel()` and carries `aria-current="page"`; the current-page segment is not a link — verify `npm test` passes
- [x] 5.2 Update `cart-page.spec.ts` for the breadcrumb replacing the back-link (assert the breadcrumb is present with `cartPage.pageTitle` as its current-page label instead of asserting on `.back-link`) — verify `npm test` passes
- [x] 5.3 Update `impressum.spec.ts` for the breadcrumb replacing the back-link (assert the breadcrumb is present with `impressum.pageTitle` as its current-page label instead of asserting on `.back-link`) — verify `npm test` passes
- [x] 5.4 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 134 tests passed, coverage 99.11% stmts / 93.44% branches / 97.32% funcs / 99.19% lines)

## 6. e2e tests

- [x] 6.1 Update `e2e/shopping-cart.spec.ts`'s "the back control returns to the main page" test to activate the breadcrumb's main-page link instead of `.back-link` — verify `npm run e2e` passes
- [x] 6.2 Update `e2e/impressum.spec.ts`'s "the back-link on the Impressum page navigates to the main page" test to activate the breadcrumb's main-page link instead of `.back-link` — verify `npm run e2e` passes
- [x] 6.3 Add an assertion (in either updated spec, or a new one) that the breadcrumb is rendered above the page's `<h1>` title (e.g. comparing bounding box `y` positions) — verify `npm run e2e` passes (DONE: added to shopping-cart.spec.ts's breadcrumb test. Also found and fixed a third, untracked `.back-link` reference in `e2e/language-switcher.spec.ts` — not listed in this task group but broken by the same removal, so fixed alongside it rather than leaving it failing)

## 7. Verification

- [x] 7.1 Run `npm run build` and confirm it completes without errors (DONE: clean build, same pre-existing header.css budget warning, unrelated to this change)
- [x] 7.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 134 tests passed, coverage 99.11% stmts / 93.44% branches / 97.32% funcs / 99.19% lines)
- [x] 7.3 Run `npm run e2e` and confirm the full e2e suite passes (DONE: 53/53 passed)
- [x] 7.4 Manually verify in the browser: the breadcrumb appears above the title on both the cart page and the Impressum page, reads "Search | Your Cart" and "Search | Imprint" (and the German equivalents after switching language), activating the main-page link navigates to `/`, and no "← Back to search" text remains anywhere (DONE: verified via a throwaway Playwright script against the dev server — both pages show the breadcrumb above the title with correct text, the link navigates to `/`, and no "Back to search" text remains anywhere in the page body; German-locale wording already covered by the updated `language-switcher.spec.ts` e2e test; script and screenshots removed after verification)
