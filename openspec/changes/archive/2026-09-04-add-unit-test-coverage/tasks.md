## 1. Coverage tooling setup

- [x] 1.1 Add `@vitest/coverage-v8` as a devDependency (matching the installed `vitest` major version) — verify by inspecting `package.json`/`package-lock.json` and confirming `npm install` succeeds
- [x] 1.2 Create `vitest-base.config.ts` at the repo root configuring `coverage.provider: 'v8'` and `coverage.thresholds.lines: 85` — verify `npm test -- --coverage` picks it up (per `--runner-config`'s default-file auto-discovery) without needing an explicit `--runner-config` flag
- [x] 1.3 Update `package.json`'s `test` script to `ng test --coverage` so `npm test` always runs with coverage and the threshold enforced — verify `npm test` (no extra flags) now reports coverage and fails if under 85%

## 2. Cart service tests

- [x] 2.1 Create `src/app/cart/cart.spec.ts` covering: `add()` appends a book and increments `count`; `remove()` removes by reference identity (removing one of two identical-content entries leaves the other, per the `remove-cart-item` design decision); the sign-out effect clears `books()` to `[]` when a fake `GoogleAuth.user()` signal transitions to `null` — verify by running `npm test -- --include src/app/cart/cart.spec.ts` and confirming all cases pass

## 3. GoogleAuth service tests

- [x] 3.1 Create `src/app/google-auth/google-auth.spec.ts` covering: `login()` no-ops (no `HttpClient` call, no token-client construction) when `environment.googleOAuthClientId` is empty; `login()` no-ops when `window.google` is undefined; `login()` constructs the token client with the configured client ID and calls `requestAccessToken()` when both are present (stub `window.google.accounts.oauth2.initTokenClient`); `handleTokenResponse`'s success path calls the userinfo endpoint with a bearer header and sets `user()` from the response's `name`; a token response with no `access_token` sets `user()` to `null` without an HTTP call; a userinfo HTTP error sets `user()` to `null`; `logout()` sets `user()` to `null` — verify by running `npm test -- --include src/app/google-auth/google-auth.spec.ts` and confirming all cases pass, using `HttpTestingController` for the userinfo call and a stubbed `window.google` (set up/torn down per test)

## 4. GoogleBooks service tests

- [x] 4.1 Create `src/app/book-search/google-books.spec.ts` covering: an ISBN-formatted query (10 and 13 digit, hyphenated) sends `q=isbn:<cleaned>`; a non-ISBN query sends the raw text as `q`; `startIndex`/`maxResults` follow the `(page-1)*10`/`10` formula for page 1 and page 3; the `key` param is present when `environment.googleBooksApiKey` is set and absent when it's empty; response mapping produces one `BookSummary` per `items` entry with `http://` cover URLs rewritten to `https://`; an absent `items` array maps to `{ books: [], totalItems: 0 }` — verify by running `npm test -- --include src/app/book-search/google-books.spec.ts` using `HttpTestingController` to assert request params and flush controlled responses

## 5. BookSearch component tests

- [x] 5.1 Create `src/app/book-search/book-search.spec.ts` covering: `isSearchDisabled` is true for empty/whitespace-only input and while loading; `search()` transitions through loading to found/not-found/error based on a faked `GoogleBooks.search()` observable; `hasNextPage`/`hasPreviousPage`/`totalPages` compute correctly at page-size boundaries (exactly 10, 11, 20 total items); `goToNextPage()`/`goToPreviousPage()` call `GoogleBooks.search()` with `activeQuery()` (not the live, possibly-edited `query()`) and the target page; a next-page fetch returning zero books reverts to the previous page's state instead of showing an empty list; submitting a new search resets `page()` to 1 — verify by running `npm test -- --include src/app/book-search/book-search.spec.ts` with `GoogleBooks` provided as a fake

## 6. BookCard component tests

- [x] 6.1 Create `src/app/book-card/book-card.spec.ts` covering: each attribute (title/authors/publisher/publishedDate/description) renders only when present on the input `book`, with no placeholder for missing ones; the cover image renders only when `coverImageUrl` is set; the "Add to cart" button renders only when `showAddToCart()` is true and a fake `GoogleAuth.user()` is non-null, and clicking it calls `Cart.add(book())`; the delete button renders only when `showDelete()` is true, and clicking it calls `Cart.remove(book())` — verify by running `npm test -- --include src/app/book-card/book-card.spec.ts` with `Cart`/`GoogleAuth` provided as fakes

## 7. CartPage component tests

- [x] 7.1 Create `src/app/cart-page/cart-page.spec.ts` covering: the book list renders one `app-book-card` per entry in a faked `Cart.books()` with `showAddToCart="false"`/`showDelete="true"`; the empty-cart message renders instead when `Cart.books()` is empty; the PayPal-styled button renders only when non-empty and has no click handler wired; the back link is present — verify by running `npm test -- --include src/app/cart-page/cart-page.spec.ts` with `Cart` provided as a fake

## 8. Header component tests

- [x] 8.1 Create `src/app/header/header.spec.ts` covering: the cart icon is absent entirely when a faked `GoogleAuth.user()` is `null`; when signed in and `Cart.count()` is 0, the cart icon renders as a non-interactive `<span>` with no badge; when `Cart.count()` is greater than 0, it renders as an `<a>` linking to `/cart` with the badge showing the count; the login button is shown when signed out and calls `GoogleAuth.login()`; the user name and logout button are shown when signed in and the logout button calls `GoogleAuth.logout()` — verify by running `npm test -- --include src/app/header/header.spec.ts` with `Cart`/`GoogleAuth` provided as fakes

## 9. Footer smoke test

- [x] 9.1 Create `src/app/footer/footer.spec.ts` with a single test asserting the component creates and renders "v1.0" — verify by running `npm test -- --include src/app/footer/footer.spec.ts`

## 10. Verification

- [x] 10.1 Run `npm test` (with coverage now on by default per task 1.3) and confirm every test file passes
- [x] 10.2 Inspect the coverage report and confirm repo-wide line coverage is at least 85%; if short, add missing test cases to the relevant file(s) above rather than lowering the threshold
- [x] 10.3 Run `npm run build` and confirm it still completes without errors (sanity check that the new devDependency and config don't affect the production build)
