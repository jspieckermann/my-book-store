## 1. Playwright setup

- [x] 1.1 Add `@playwright/test` as a devDependency and run `npx playwright install chromium` — verify by inspecting `package.json` and confirming the Chromium binary installs successfully
- [x] 1.2 Create `playwright.config.ts` at the repo root: `testDir: './e2e'`, `use: { baseURL: 'http://localhost:4200' }`, `webServer: { command: 'npm start', url: 'http://localhost:4200', reuseExistingServer: !process.env.CI }`, Chromium-only `projects` entry — verify `npx playwright test --list` discovers the config without error
- [x] 1.3 Add an `"e2e": "playwright test"` script to `package.json`; add `playwright-report/`, `test-results/`, and `blob-report/` to `.gitignore` — verify `npm run e2e -- --list` runs without error
- [x] 1.4 Add a short comment at the top of `e2e/support/mock-google-auth.ts` (created in task 2.2) documenting that these tests require `src/environments/environment.ts`'s `googleOAuthClientId` to be a non-empty placeholder string (any value — it's never actually sent to Google since `window.google` is fully mocked) — verify by inspecting the comment is present once that file exists

## 2. Mock helpers

- [x] 2.1 Create `e2e/support/mock-google-books.ts` exporting a function that takes a `Page` and either a `{ items, totalItems }` payload or `'error'`, and intercepts `**/books/v1/volumes**` via `page.route()` accordingly — verify by using it in a throwaway test that a search resolves to the mocked payload
- [x] 2.2 Create `e2e/support/mock-google-auth.ts` exporting a function that takes a `Page` and `outcome: 'success' | 'cancelled' | 'failed'` (plus an optional `name` for the `'success'` case), and sets up both `page.addInitScript()` (stubbing `window.google.accounts.oauth2.initTokenClient`) and `page.route()` (intercepting `**/oauth2/v3/userinfo**`) together per design.md's decision — verify by using it in a throwaway test that clicking the login icon reaches the expected signed-in/signed-out state for each outcome

## 3. app-shell.spec.ts (app-header, app-footer, theming, page titles)

- [x] 3.1 Test: the header renders the book logo and "My-Book-Store" title on load — verify the test passes
- [x] 3.2 Test: the footer renders "v1.0" and is not sticky/fixed positioned (computed `position` is not `fixed`/`sticky`) — verify the test passes
- [x] 3.3 Test: the page background resolves to a dark color (not white/transparent) on load, and no theme-toggle control exists anywhere on the page — verify the test passes
- [x] 3.4 Test: the main page shows a "Search" page title above the filter section, and the cart page (navigated to directly) shows a "Your Cart" page title — verify the test passes
- [x] 3.5 Test: at a narrow viewport (375×667), the header, footer, and filter section remain fully visible with no horizontal scrollbar (`document.documentElement.scrollWidth` does not exceed `clientWidth`) — verify the test passes

## 4. book-search.spec.ts

- [x] 4.1 Test: the filter section (text input + search button) is visible on load — verify the test passes
- [x] 4.2 Test: the search button is disabled for empty/whitespace-only input and enabled once non-whitespace text is entered — verify the test passes
- [x] 4.3 Test: searching an ISBN-formatted value sends a request with `q=isbn:<cleaned>`; searching non-ISBN text sends the raw text as `q` (assert via the mocked route's captured request) — verify the test passes
- [x] 4.4 Test: a loading indicator is visible while a (deliberately delayed) mocked request is in flight, and the search button is disabled during it — verify the test passes
- [x] 4.5 Test: a successful multi-result search renders one card per book with its available attributes, and a book with only a title renders with no placeholder for the missing attributes — verify the test passes
- [x] 4.6 Test: a result with a cover image renders an image element for it; a result without one renders no image element — verify the test passes
- [x] 4.7 Test: a mocked response with more than 10 items shows pagination controls (correct "Page X of Y" text, Previous disabled on page 1, Next disabled on the last page, both work when clicked); a response with 10 or fewer items shows no pagination controls — verify the test passes
- [x] 4.8 Test: a mocked empty-results response shows the "Book not found" message with no attribute data rendered — verify the test passes
- [x] 4.9 Test: a mocked failed request (500) shows a visible error message near the filter section — verify the test passes
- [x] 4.10 Test: the "Add to cart" button is absent on a result card when signed out, and present when signed in (using the `mock-google-auth` `'success'` outcome) — verify the test passes

## 5. shopping-cart.spec.ts

- [x] 5.1 Test: the cart icon is absent from the header when signed out — verify the test passes
- [x] 5.2 Test: when signed in with an empty cart, the cart icon is visible with no badge and is not a link (non-interactive) — verify the test passes
- [x] 5.3 Test: searching, then activating "Add to cart", updates the header badge to 1 and turns the cart icon into a link to `/cart` — verify the test passes
- [x] 5.4 Test: the cart page lists the added book(s) as cards with no "Add to cart" control — verify the test passes
- [x] 5.5 Test: the PayPal-styled button is visible at the bottom of the cart page when it has items, and absent when the cart is empty — verify the test passes
- [x] 5.6 Test: activating a book card's delete control on the cart page removes it, decreases the header badge by one, and removing the last book shows the empty-cart message — verify the test passes
- [x] 5.7 Test: adding the same book twice and deleting one of its two cards removes only that one card, leaving the other — verify the test passes
- [x] 5.8 Test: the cart page's back control navigates back to the main page — verify the test passes
- [x] 5.9 Test: signing out while the cart has items clears it (badge/cart icon disappear along with the rest of the signed-out header state) — verify the test passes

## 6. google-login.spec.ts

- [x] 6.1 Test: the login icon is visible on the right side of the header when signed out — verify the test passes
- [x] 6.2 Test: activating the login icon with `mock-google-auth`'s `'success'` outcome shows the signed-in user's name in the header and hides the login icon — verify the test passes
- [x] 6.3 Test: the `'cancelled'` outcome leaves the header in its signed-out state (login icon shown, no name) — verify the test passes
- [x] 6.4 Test: the `'failed'` outcome leaves the header in its signed-out state — verify the test passes
- [x] 6.5 Test: a sign-out control is visible only when signed in, and activating it returns the header to its signed-out state — verify the test passes
- [x] 6.6 Test: reloading the page after a successful mocked sign-in returns to the signed-out state (no session persistence) — verify the test passes

## 7. Verification

- [x] 7.1 Run `npm run e2e` and confirm every test across all four spec files passes
- [x] 7.2 Run `npm run build` and confirm it still completes without errors (sanity check that the new devDependency and config don't affect the production build)
