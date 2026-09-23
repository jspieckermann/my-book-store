## 1. Language service and dictionary

- [x] 1.1 Create `src/app/language/language.ts`: `@Service()` class `Language` with `readonly current = signal<'en' | 'de'>(...).asReadonly()` (initial value read from `localStorage['language']`, falling back to `'en'`), `toggle()` (flips the value, writes it back to `localStorage`), `readonly localeCode = computed(() => current() === 'de' ? 'de-DE' : 'en-US')`, `translate(key: string, params?: Record<string, string | number>): string` (dictionary lookup + `{name}` placeholder substitution), and a constructor `effect()` setting `document.documentElement.lang = current()` — verify by inspecting `toggle()` flips and persists, `translate()` substitutes placeholders, and `localeCode` follows `current`
- [x] 1.2 Create `src/app/language/translations.ts` exporting the full EN/DE dictionary below (one flat `Record<'en' | 'de', Record<string, string>>`) — verify every key used by tasks 2–7 exists in both languages:

  | Key | English | German |
  |---|---|---|
  | `header.bookLogo` | Book logo | Buch-Logo |
  | `header.shoppingCart` | Shopping cart | Warenkorb |
  | `header.signOut` | Sign out | Abmelden |
  | `header.logIn` | Log in with Google | Mit Google anmelden |
  | `header.languageSelector` | Language | Sprache |
  | `bookSearch.pageTitle` | Search | Suche |
  | `bookSearch.searchPlaceholder` | Search by ISBN, author, or title | Suche nach ISBN, Autor oder Titel |
  | `bookSearch.searchButton` | Search | Suchen |
  | `bookSearch.searching` | Searching… | Suche läuft… |
  | `bookSearch.searchFailed` | Search failed. Please try again. | Suche fehlgeschlagen. Bitte versuchen Sie es erneut. |
  | `bookSearch.bookNotFound` | Book not found | Buch nicht gefunden |
  | `bookSearch.paginationNav` | Search results pages | Suchergebnisseiten |
  | `bookSearch.previous` | Previous | Zurück |
  | `bookSearch.next` | Next | Weiter |
  | `bookSearch.pageOf` | Page {page} of {total} | Seite {page} von {total} |
  | `bookCard.title` | Title | Titel |
  | `bookCard.authors` | Author(s) | Autor(en) |
  | `bookCard.publisher` | Publisher | Verlag |
  | `bookCard.published` | Published | Erschienen |
  | `bookCard.description` | Description | Beschreibung |
  | `bookCard.readMore` | Read more | Mehr lesen |
  | `bookCard.readLess` | Read less | Weniger anzeigen |
  | `bookCard.addToCart` | Add to cart | In den Warenkorb |
  | `bookCard.removeFromCart` | Remove from cart | Aus dem Warenkorb entfernen |
  | `bookCard.ratingLabel` | Rating: {filled} out of 5 stars ({count} ratings) | Bewertung: {filled} von 5 Sternen ({count} Bewertungen) |
  | `cartPage.pageTitle` | Your Cart | Ihr Warenkorb |
  | `cartPage.backToSearch` | ← Back to search | ← Zurück zur Suche |
  | `cartPage.empty` | Your cart is empty | Ihr Warenkorb ist leer |
  | `cartPage.item` | item | Artikel |
  | `cartPage.items` | items | Artikel |

## 2. Header: language-switcher control and localized labels

- [x] 2.1 In `header.html`, add a globe-icon `<button class="language-switcher" type="button" (click)="language.toggle()">` — a minimal globe SVG (circle + horizontal line + one vertical lens path, `viewBox="0 0 24 24"`, `stroke-width="1.6"`, matching this app's existing icon style) plus a `<span>` showing `{{ language.current() === 'en' ? 'DE' : 'EN' }}`, with `[attr.aria-label]="language.translate('header.switchLanguage')"` — placed so it's always rendered regardless of sign-in state (not inside the `@if (googleAuth.user())` blocks) — verify it's visible both signed in and signed out
- [x] 2.2 Restructure `header.html`'s right-hand section into a `<div class="header-actions">` wrapping the existing cart block, the new language-switcher, and the user-info/login block — verify the DOM groups all three under one wrapper
- [x] 2.3 In `header.css`, add `.header-actions { display: flex; align-items: center; gap: <match existing header gap>; margin-inline-start: auto; }`, remove the now-redundant `margin-inline-start: auto` from `.cart` and `.login`, and style `.language-switcher` with the same icon-button hover/press pattern already used by `.cart`/`.login`/`.logout` (`filter` on hover, `filter` + `scale()` on active, reduced-motion override) — verify the header's visual layout (spacing, right-alignment) is unchanged from before this task
- [x] 2.4 Replace the hardcoded `aria-label`s in `header.html` with `language.translate(...)` calls: `"Book logo"` → `header.bookLogo`, both `"Shopping cart"` occurrences → `header.shoppingCart`, both `"Sign out"` occurrences → `header.signOut`, `"Log in with Google"` → `header.logIn` — verify by inspecting no hardcoded English aria-label text remains in the file
- [x] 2.5 In `header.ts`, `inject(Language)` and expose it (e.g. `protected readonly language = inject(Language);`) for the template to call — verify the component compiles and the new bindings resolve

## 3. Book search page: localized text

- [x] 3.1 In `book-search.html`, replace every static string with a `language.translate(...)` call using the matching key from the dictionary: page title (`bookSearch.pageTitle`), input `placeholder`/`aria-label` (`bookSearch.searchPlaceholder`), search button text (`bookSearch.searchButton`), loading status (`bookSearch.searching`), error status (`bookSearch.searchFailed`), not-found status (`bookSearch.bookNotFound`), pagination `<nav>` `aria-label` (`bookSearch.paginationNav`), "Previous"/"Next" button text (`bookSearch.previous`/`bookSearch.next`), and the page-indicator text via `language.translate('bookSearch.pageOf', { page: page(), total: totalPages() })` — verify by inspecting no hardcoded English UI text remains in the file
- [x] 3.2 In `book-search.ts`, `inject(Language)` and expose it for the template — verify the component compiles

## 4. Book card: localized attribute labels and controls

- [x] 4.1 In `book-card.html`, replace the `<dt>` labels ("Title", "Author(s)", "Publisher", "Published", "Description") with `language.translate(...)` calls (`bookCard.title`, `bookCard.authors`, `bookCard.publisher`, `bookCard.published`, `bookCard.description`), the expand/collapse button text with `language.translate(expanded() ? 'bookCard.readLess' : 'bookCard.readMore')`, and the add-to-cart/delete buttons' `aria-label`s with `language.translate('bookCard.addToCart')` / `language.translate('bookCard.removeFromCart')` — verify by inspecting no hardcoded English text remains for these elements
- [x] 4.2 In `book-card.ts`, `inject(Language)`; update the `ratingLabel` computed to build its string via `language.translate('bookCard.ratingLabel', { filled: filledCount, count: this.book().ratingsCount })` instead of a hardcoded English template literal; update `formattedPrice` to use `this.book().price.toLocaleString(this.language.localeCode(), { style: 'currency', currency: 'EUR' })` instead of the hardcoded `'de-DE'` — verify with manual checks that both English and German locale codes produce correctly formatted currency strings

## 5. Cart page: localized text and locale-aware total

- [x] 5.1 In `cart-page.html`, replace the page title, back-link text, and empty-cart message with `language.translate(...)` calls (`cartPage.pageTitle`, `cartPage.backToSearch`, `cartPage.empty`) — leave "PayPal" untranslated (brand name) — verify by inspecting no hardcoded English text remains for these elements
- [x] 5.2 In `cart-page.ts`, `inject(Language)`; update `itemCountLabel` to select between `language.translate('cartPage.item')` / `language.translate('cartPage.items')` based on count instead of the hardcoded English words; update `formattedTotalPrice` to use `this.cart.totalPrice().toLocaleString(this.language.localeCode(), { style: 'currency', currency: 'EUR' })` instead of the hardcoded `'de-DE'` — verify with manual checks for both languages and both singular/plural counts

## 6. Book search results follow the selected language via the Google Books API

- [x] 6.1 In `google-books.ts`, `inject(Language)` into `GoogleBooks` and add `langRestrict: this.language.current()` to the request params sent to the Google Books API's volumes endpoint — verify by inspecting the request includes the current language code
- [x] 6.2 In `book-search.ts`, add a constructor `effect()` that reads `language.current()` and, if a search is currently active (`activeQuery()` non-empty, read via `untracked()` so it isn't itself a dependency), re-runs `fetchPage(this.page())` — verify by inspecting the effect only fires a re-fetch when a search is already active, and preserves the current page rather than resetting to page 1
- [x] 6.3 Add a unit test in `google-books.spec.ts` (DONE) asserting the request's `langRestrict` param matches the current `Language` value (both `'en'` default and after switching to `'de'`) — verify `npm test` passes
- [x] 6.4 Add a unit test in `book-search.spec.ts` asserting: changing the language while idle (no search yet) does not trigger a fetch; changing the language while results are displayed re-sends the search and preserves the current page — verify `npm test` passes (DONE: 96 tests passed, coverage 99.29% stmts / 92.89% branches)

## 7. Update existing tests

- [x] 7.1 Add `src/app/language/language.spec.ts` covering: defaults to `'en'` with no stored preference; `toggle()` flips to `'de'` and persists to `localStorage`; a fresh instance picks up a previously persisted `'de'`; `translate()` substitutes `{placeholder}` params; `localeCode` is `'en-US'` for English and `'de-DE'` for German; the `document.documentElement.lang` side effect follows `current()` — verify `npm test` passes
- [x] 7.2 Add a `beforeEach`/`afterEach` clearing the `localStorage` language key in any spec file that exercises `language.toggle()` or the header's toggle button, to prevent cross-test pollution within the same file — verify by running the affected spec files in isolation and together, confirming the same results either way
- [x] 7.3 Add unit tests in `header.spec.ts` for the new language-switcher control: visible when signed in and when signed out, shows "DE" while English is active, clicking it calls `language.toggle()` (or, using the real service, flips `language.current()` and the shown code) — verify `npm test` passes
- [x] 7.4 Check `book-search.spec.ts`, `book-card.spec.ts`, and `cart-page.spec.ts` for text assertions that now resolve through `Language` (defaulting to English, so most should be unaffected) — verify `npm test` passes, fixing any assertion that unexpectedly breaks
- [x] 7.5 Add an e2e test (e.g. `e2e/language-switcher.spec.ts`) asserting: the toggle is visible signed out and signed in; clicking it switches key visible text across the header, search page, a result card, and the cart page to German; clicking it again switches back to English; the selected language survives a page reload — verify `npm run e2e` passes
- [x] 7.6 Add an e2e test asserting that changing the language while search results are displayed re-sends the request with the new `langRestrict` value and updates the displayed results (mock two different responses for `en` vs `de` `langRestrict` and confirm the displayed title/description changes accordingly) — verify `npm run e2e` passes (DONE: 42/42 e2e tests passed)

## 8. Verification

- [x] 8.1 Run `npm run build` and confirm it completes without errors
- [x] 8.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 96 tests passed, coverage 99.29% stmts / 92.89% branches / 98.59% funcs / 99.03% lines)
- [x] 8.3 Run `npm run e2e` and confirm the full e2e suite passes (DONE: 42/42 passed)
- [x] 8.4 Manually verify in the browser that: the globe toggle is visible and positioned correctly signed in and signed out; clicking it switches the header, search page, a result card (labels, Read more/less, add-to-cart), and the cart page (title, back link, empty state, order summary, price formatting) to German; reloading the page keeps the selected language; changing the language while viewing search results re-fetches them with the new language restriction; cart items are unaffected by a later language change (DONE: verified via throwaway Playwright script with screenshots — German search shows a different langRestrict-driven listing/price, cart item stays the original English snapshot after switching to German, language persists across reload, then reverts correctly on toggling back to English; script and screenshots removed after verification)

## 9. Revision: replace the globe toggle with a flag + language-code select box

- [x] 9.1 In `language.ts`, replace `toggle()` with `setLanguage(locale: Locale): void` (sets the value directly and persists it to `localStorage`) — a `<select>`'s `(change)` event reports the chosen value directly, not "the other one," so a toggle no longer fits — verify by inspecting it sets and persists the given locale
- [x] 9.2 In `translations.ts`, replace the `header.switchLanguage` key (whose English/German values were phrased as a toggle action, "Switch to German"/"Zu Englisch wechseln") with `header.languageSelector` ("Language" / "Sprache"), describing the control generically — verify no remaining reference to the old key
- [x] 9.3 In `header.html`, replace the globe-icon `<button class="language-switcher">` with `<select class="language-switcher" [attr.aria-label]="language.translate('header.languageSelector')" [value]="language.current()" (change)="onLanguageChange($event)">` containing two `<option>`s showing a flag emoji + language code as plain text (`<option value="en">🇬🇧 EN</option>`, `<option value="de">🇩🇪 DE</option>`) — verify it's visible both signed in and signed out, and its selection reflects `language.current()`
- [x] 9.4 In `header.ts`, add `onLanguageChange(event: Event): void` calling `this.language.setLanguage((event.target as HTMLSelectElement).value as Locale)` — the same native-form-control pattern `book-search.ts`'s `onQueryInput` already uses — verify selecting an option updates `language.current()`
- [x] 9.5 In `header.css`, replace the button/icon-based `.language-switcher`/`.language-icon`/`.language-code` styles with `<select>`-appropriate styling (border, rounded corners, background/text matching the app's surface/text tokens, hover/press `filter` feedback) — verify the header's visual layout (spacing, right-alignment) is otherwise unchanged
- [x] 9.6 Update every test/usage referencing the old `toggle()` method or the button-based markup to the new `setLanguage(...)`/`<select>` API: `language.spec.ts`, `header.spec.ts`, `book-card.spec.ts`, `book-search.spec.ts`, `google-books.spec.ts`, and `e2e/language-switcher.spec.ts` (button `.click()` → `.selectOption(...)`, `.language-code` text assertions → `<select>` `value`/`<option>` assertions) — verify `npm test` and `npm run e2e` both pass
- [x] 9.7 Run `npm run build`, `npm test`, and `npm run e2e`, and manually verify in the browser that the select box shows a flag + code per language, reflects the current language, and switching options changes the UI language immediately (DONE: build clean; 97 unit tests passed, coverage 99.29% stmts / 92.73% branches; 43/43 e2e tests passed; manual check via throwaway Playwright script confirmed the select renders both options and switches EN↔DE correctly — on Windows the flag emoji render as two-letter fallback boxes (`GB`/`DE`) rather than pictorial flags, a platform emoji-font limitation, not an app bug; script and screenshots removed after verification)

## 10. Fix: grey flash when opening the language selector's dropdown

- [x] 10.1 Add `color-scheme: dark` to `html` in `src/styles.css` — this app has a fixed dark theme with no light-mode support, but without declaring `color-scheme`, the browser doesn't know that, so native form controls (most visibly the language-switcher `<select>`'s dropdown popup) briefly paint with default light UA chrome before repainting dark, producing a visible grey flash on open — verify by inspecting `getComputedStyle(document.documentElement).colorScheme` is `'dark'`, and by opening the language selector in a real browser to confirm the popup now paints dark immediately with no flash
- [x] 10.2 Run `npm run build`, `npm test`, and `npm run e2e` to confirm the global style change causes no regression (DONE: build clean; 97 unit tests passed, coverage 99.29% stmts / 92.73% branches; 43/43 e2e tests passed; manual check confirmed `color-scheme: dark` is applied and the dropdown popup now renders with a dark background matching the app theme instead of default light grey)
- [x] 10.3 (DONE — the flash still occurred in Firefox after 10.1) Root cause: a `<select>`'s dropdown popup is native OS/browser UI outside the page's normal rendering pipeline, and `color-scheme` support for it is inconsistent — Chromium themes it fully, but Firefox's native popup widget doesn't reliably honor it. Since this can't be fixed from CSS alone in every engine, replace the native `<select>` with a fully custom dropdown: in `header.html`, a `<button class="language-switcher-toggle">` showing the current flag + code (`aria-haspopup`, `aria-expanded`), and, when open, a `<div class="language-switcher-menu" role="listbox">` of two `<button role="option">` elements (flag + code each, `aria-selected`) — an ordinary `<div>` styled entirely by this app's own CSS, so no native popup is ever created and there is nothing left for the browser to paint with default chrome — verify by inspecting the markup contains no `<select>`
- [x] 10.4 In `header.ts`, add `languageMenuOpen = signal(false)`, `toggleLanguageMenu()`, `closeLanguageMenu()`, and `selectLanguage(locale: Locale)` (calls `language.setLanguage(locale)` then closes the menu); inject `ElementRef` and add a `@HostListener('document:click', ['$event'])` that closes the menu when the click target is outside `elementRef.nativeElement` — verify the menu opens/closes on the toggle button, closes on selecting an option, and closes on an outside click
- [x] 10.5 In `header.html`, add `(keydown.escape)="closeLanguageMenu()"` on the wrapping element so Escape closes the open menu — verify by inspecting the binding is present
- [x] 10.6 In `header.css`, replace the `<select>`-specific `.language-switcher` styling with `.language-switcher` (positioning context), `.language-switcher-toggle` (the same border/background/hover/press styling the select had), `.language-switcher-caret` (small chevron icon), `.language-switcher-menu` (absolutely positioned panel below the toggle, matching the app's surface/border tokens, drop shadow), and `.language-switcher-option` (each option button, hover background, a distinct `.selected` background using `--color-accent`) — verify the header's visual layout (spacing, right-alignment) is otherwise unchanged
- [x] 10.7 Update every test referencing the old `<select>` markup to the new button + menu markup: `header.spec.ts` (`.language-switcher-toggle`/`.language-switcher-menu`/`.language-switcher-option` instead of `<select>`/`<option>`, plus a new test for closing on outside click), `e2e/language-switcher.spec.ts` (a `selectLanguage(page, code)` helper that clicks the toggle then the matching option button, instead of Playwright's `.selectOption(...)`) — verify `npm test` and `npm run e2e` both pass
- [x] 10.8 Run `npm run build`, `npm test`, and `npm run e2e`; manually verify in both Chromium and Firefox (`npx playwright install firefox`) that opening the language selector shows the app's own dark-styled dropdown immediately with no flash in either engine, that selecting an option switches the language and closes the menu, and that clicking outside or pressing Escape closes it without changing the language (DONE: build clean, with a pre-existing-pattern 194-byte-over-budget warning on `header.css`'s 4kB soft budget — not an error, left as-is; 99 unit tests passed, coverage 98.67% stmts / 93.04% branches; 43/43 e2e tests passed; manual Playwright checks in both Chromium and Firefox confirmed the dropdown renders fully dark-styled immediately on open with no flash in either engine, and Firefox renders the flag emoji pictorially where Windows Chromium shows fallback code boxes; scripts and screenshots removed after verification)

## 11. Revision: two-row header-actions layout (language switcher above cart/user/logout)

- [x] 11.1 In `header.html`, wrap the language-switcher markup in `<div class="header-actions-row header-actions-row-top">` and the cart + user-info/login-logout markup in `<div class="header-actions-row header-actions-row-bottom">`, both direct children of `.header-actions` — verify by inspecting the DOM has two row wrappers, top containing only the language switcher
- [x] 11.2 In `header.css`, change `.header-actions` from a single flex row to `flex-direction: column; align-items: flex-end;` (keeping `margin-inline-start: auto`) and add `.header-actions-row` with the `display: flex; align-items: center; gap: ...` the single row previously had — verify no other selector needed changes, since every moved element (`.cart`, `.language-switcher`, `.login`, `.logout`, `.user-name`) keeps its own class/styling untouched
- [x] 11.3 Run `npm run build`, `npm test`, and `npm run e2e`; manually verify in the browser (signed out, signed in with an empty cart, and signed in with a cart item) that the language switcher renders alone on the top row, right-aligned, with the cart/user-name/logout (or login) on the row below it, also right-aligned (DONE: build clean, same pre-existing soft budget warning, now 282 bytes over 4kB — still far under the 8kB error threshold; 99 unit tests passed, coverage 98.67% stmts / 93.04% branches; 43/43 e2e tests passed, including the narrow-viewport no-horizontal-scroll check; manual Playwright screenshots confirmed both rows render correctly right-aligned in every auth/cart state; scripts and screenshots removed after verification)
