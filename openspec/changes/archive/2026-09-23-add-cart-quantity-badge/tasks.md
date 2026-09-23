## 1. Translations

- [x] 1.1 Add `bookCard.alreadyInCart` to `translations.ts` — English "{count} already in cart", German "{count} bereits im Warenkorb" — verify the key exists in both languages and uses the same `{count}` placeholder style as the existing `bookCard.ratingLabel` key

## 2. BookCard (search page)

- [x] 2.1 In `book-card.ts`, add a `cartQuantity` computed matching the cart's books by case-insensitive, trimmed title against `book().title`, counting matches — verify by inspecting it returns 0 when the book isn't in the cart and increments correctly as matching books are added
- [x] 2.2 In `book-card.html`, wrap the existing "Add to cart" button in a new `.add-to-cart-row` container, and add a badge `<span>` inside it (shown only when `cartQuantity() > 0`) whose text is the full translated phrase from `bookCard.alreadyInCart` (e.g. "2 already in cart"), not a bare number — verify by inspecting the badge is absent when the book isn't in the cart and reads the correct full phrase when it is
- [x] 2.3 In `book-card.css`, add `.add-to-cart-row` (`display: flex; align-items: center; gap: 0.5rem`) taking over the button's existing `align-self: flex-start`, and style the new badge as a pill consistent with the header's `.cart-badge` color treatment (`border-radius: 999px`, `background-color: var(--color-accent)`, `color: var(--color-background)`) but sized with horizontal padding for its full-phrase text rather than a compact 1-2 digit number, positioned inline rather than as an absolute overlay — verify no new hardcoded colors/fonts are introduced and the button's existing position/alignment is visually unchanged when the badge isn't shown

## 3. RecommendationCard (recommendations section)

- [x] 3.1 In `recommendation-card.ts`, add the same `cartQuantity` computed as task 2.1, matching this component's `book()` against `cart.books()` — verify the same behavior as 2.1
- [x] 3.2 In `recommendation-card.html`, wrap the existing add-to-cart button in a `.add-to-cart-row` container with the same badge markup as task 2.2 — verify the same behavior as 2.2
- [x] 3.3 In `recommendation-card.css`, add `.add-to-cart-row`, moving the button's existing `align-self: flex-start; margin-top: auto` onto the wrapper (preserving the cross-card bottom-alignment behavior from `add-book-recommendations`), and reuse the same badge styling as task 2.3 — verify by measuring that add-to-cart-button Y positions still match exactly across cards of differing content length, the same way they did before this change (DONE: build clean; live measurement deferred to task 6.2's manual verification pass)

## 4. Unit tests

- [x] 4.1 Update `book-card.spec.ts`: add tests asserting the badge is absent when the book isn't in the cart, appears with count 1 after one matching book is in the cart, and reflects a higher count when multiple matching-title books are in the cart — verify `npm test` passes (also extended the fixture helper to provide `Cart.books()`, which the new `cartQuantity` computed reads and the existing mock didn't supply)
- [x] 4.2 Update `recommendation-card.spec.ts` with the equivalent tests for `RecommendationCard` — verify `npm test` passes (same fixture-helper extension)
- [x] 4.3 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold (DONE: 140 tests passed, coverage 99.14% stmts / 93.54% branches / 97.41% funcs / 99.21% lines)

## 5. e2e tests

- [x] 5.1 Update `e2e/book-search.spec.ts` (or add a new spec) asserting: no badge is shown on a result card before adding that book; after activating "Add to cart", a badge reading "1 already in cart" appears next to that card's control; activating it again updates the badge to "2 already in cart" — verify `npm run e2e` passes
- [x] 5.2 Update `e2e/book-recommendations.spec.ts` with the equivalent assertions for a recommendation card's add-to-cart control and badge — verify `npm run e2e` passes

## 6. Verification

- [x] 6.1 Run `npm run lint`, `npm run build`, `npm test`, and `npm run e2e` and confirm all four pass (DONE: lint clean, 0 findings; build clean; 140 unit tests passed, coverage 99.14% stmts / 93.54% branches; 55/55 e2e tests passed)
- [x] 6.2 Manually verify in the browser: adding a book from search shows a badge with the correct count next to its "Add to cart" control, adding the same book again increments it, a different book's card shows no badge, the same behavior holds on a recommendation card, and the cart page's own book cards (delete control, no "Add to cart") show no badge anywhere (DONE: verified via throwaway Playwright scripts against the dev server — badge hidden at 0, reads "1/2/3 already in cart" correctly as the same book is added repeatedly, cart page shows zero `.cart-quantity-badge` elements anywhere, recommendation card badge behaves identically, and cross-card button alignment between a short-title and long-title recommendation card still matches exactly (both at Y=1017.34375), confirming task 3.3's deferred alignment check; scripts and screenshot removed after verification)
