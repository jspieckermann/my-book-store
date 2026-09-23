## 1. Impressum page component

- [x] 1.1 Create `src/app/impressum/impressum.ts`: a standalone `ImpressumPage` component (no `Language` injection — its content is deliberately static German, not translated) — verify the component compiles and renders with no dependencies beyond Angular itself
- [x] 1.2 Create `src/app/impressum/impressum.html` with static German content in the following sections, using the fake data below, and a `<h1 class="page-title">` matching the existing page-title convention (`cart-page.html`, `book-search.html`):
  - Operator identity + address: "Max Mustermann", "Musterstraße 12", "12345 Musterstadt"
  - Contact: email `contact@my-book-store.example`, phone `+49 30 12345678`
  - VAT ID: "DE123456789"
  - EU ODR link: real link to `https://ec.europa.eu/consumers/odr/` (the platform link itself is factual, not fake data), opening in a new tab
  - VSBG statement: not willing/not obligated to participate in consumer arbitration board proceedings
  - Liability disclaimer covering both the site's own content and links to external sites
  - verify by inspecting all six content sections are present, all text is German, and there is no `language.translate(...)` call anywhere in the file
- [x] 1.3 Create `src/app/impressum/impressum.css` reusing the app's existing typography/color tokens (`--font-sans`, `--text-body`, `--color-text`, `--color-text-muted`, etc.) for section headings and body text, consistent with `cart-page.css`'s approach — verify no new hardcoded colors/fonts are introduced

## 2. Routing and footer link

- [x] 2.1 In `app.routes.ts`, add `{ path: 'impressum', component: ImpressumPage }` — verify navigating to `/impressum` renders the page
- [x] 2.2 In `footer.html`, add a `routerLink="/impressum"` text link ("Impressum") next to the existing version `<span>`, styled like the app's existing text links (e.g. `cart-page.html`'s `.back-link`) — verify the footer renders both the version text and the link on every page
- [x] 2.3 In `footer.ts`, import `RouterLink` into the component's `imports` — verify the component compiles

## 3. Unit tests

- [x] 3.1 Add `src/app/impressum/impressum.spec.ts` covering: the page renders (smoke test); each of the six required content sections is present (operator name/address, contact, VAT ID, EU ODR link with the correct `href`, VSBG statement, liability disclaimer); the rendered text is unaffected by the injected `Language` service's current value (assert identical content with `Language` left at its default `'en'` vs. after `setLanguage('de')`) — verify `npm test` passes
- [x] 3.2 Update `footer.spec.ts` (or create it, if it doesn't already exist) to assert the footer renders a link to `/impressum` alongside the existing version text — verify `npm test` passes
- [x] 3.3 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 103 tests passed, coverage 98.85% stmts / 93.4% branches / 96.29% funcs / 98.93% lines)

## 4. e2e tests

- [x] 4.1 Add `e2e/impressum.spec.ts` asserting: the footer's Impressum link is visible on the main page and the cart page; activating it navigates to `/impressum`; the Impressum page displays the operator name, the EU ODR link, and the VAT ID — verify `npm run e2e` passes
- [x] 4.2 Add an e2e assertion that the Impressum page's content is unchanged after switching the header language selector to German while already on `/impressum` (or navigating to it after switching) — confirms the "not translated" behavior end-to-end — verify `npm run e2e` passes

## 5. Verification

- [x] 5.1 Run `npm run build` and confirm it completes without errors (DONE: clean build, same pre-existing header.css budget warning, unrelated to this change)
- [x] 5.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 103 tests passed, coverage 98.85% stmts / 93.4% branches / 96.29% funcs / 98.93% lines)
- [x] 5.3 Run `npm run e2e` and confirm the full e2e suite passes (DONE: 46/46 passed)
- [x] 5.4 Manually verify in the browser that: the footer link is visible and positioned sensibly on every page; it navigates to `/impressum`; the page displays all six required content sections with the fake data specified above; the EU ODR link opens the real EU ODR platform in a new tab; switching the language selector while on the Impressum page (or after) leaves its content in German (DONE: verified via throwaway Playwright script with screenshots — footer link visible on main page and cart page, navigates to `/impressum`, all six sections render with the exact fake data, EU ODR link has `target="_blank"`, page content byte-identical before/after switching the language selector to German; script and screenshots removed after verification)
