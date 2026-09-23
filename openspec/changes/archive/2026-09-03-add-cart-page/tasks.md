## 1. Cart data model

- [x] 1.1 In `src/app/cart/cart.ts`, replace `_count = signal(0)` with `_books = signal<BookSummary[]>([])` (import `BookSummary` from `../book-search/google-books`), change `add()` to `add(book: BookSummary): void` pushing `{ ...book }` onto the array, expose `readonly books = this._books.asReadonly()`, and expose `readonly count = computed(() => this._books().length)` — verify by inspecting `Header`'s existing `cart.count()` usage still compiles unchanged
- [x] 1.2 Update the sign-out `effect()` to call `this._books.set([])` instead of `this._count.set(0)` — verify by inspecting the effect still triggers on `googleAuth.user()` becoming `null`

## 2. Shared BookCard component

- [x] 2.1 Create `src/app/book-card/book-card.ts`/`.html`/`.css` as a component with `@Input({ required: true }) book!: BookSummary` and `@Input() showAddToCart = true`, injecting `Cart` and `GoogleAuth`, rendering the cover image, attribute list (title/authors/publisher/publishedDate/description), and an "Add to cart" button shown when `showAddToCart && googleAuth.user()` that calls `cart.add(book)` — move the corresponding markup out of `book-search.html` and the corresponding `.book-cover`/`.book-details`/`.book-summary`/`.book-attribute`/`.add-to-cart-button` styles out of `book-search.css` into `book-card.css` — verify by inspecting the moved styles are byte-for-byte the same token usage, no new hardcoded colors
- [x] 2.2 Update `book-search.html`'s `@for` loop to render `<li class="book-card"><app-book-card [book]="book" /></li>` instead of the inline markup, and add `BookCard` to `BookSearch`'s `imports` — verify by inspecting `npm run build` succeeds and the rendered card content is unchanged from before the extraction

## 3. Routing

- [x] 3.1 In `src/app/app.routes.ts`, add `{ path: '', component: BookSearch }` and `{ path: 'cart', component: CartPage }` to the `routes` array — verify by inspecting both components are imported and referenced correctly
- [x] 3.2 In `src/app/app.html`, remove the standalone `<app-book-search />` element (keep `<router-outlet />` between `<app-header />` and `<app-footer />`); remove the now-unused direct `BookSearch` import from `App`'s `imports` array in `app.ts` if no longer referenced in the template — verify by inspecting `npm run build` succeeds and the home route renders the search UI via the router

## 4. Cart page

- [x] 4.1 Create `src/app/cart-page/cart-page.ts`/`.html`/`.css`: inject `Cart`, render `cart.books()` as a `<ul class="results-list">` of `<li class="book-card"><app-book-card [book]="book" [showAddToCart]="false" /></li>` when non-empty, an empty-cart message when `cart.books().length === 0`, and a back control using `routerLink="/"` — verify by inspecting no "Add to cart" button renders on any card and the empty-cart branch is mutually exclusive with the list branch
- [x] 4.2 Style `cart-page.css` (results list layout, empty-cart message, back control) using only `theming` tokens, consistent with `book-search.css`'s `.results-list`/`.status` treatment — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added

## 5. Header integration

- [x] 5.1 In `header.html`, change the cart icon block to `<a class="cart" routerLink="/cart">...</a>` when `cart.count() > 0`, keeping the existing non-interactive `<span class="cart">...</span>` markup when `cart.count() === 0`; add `RouterLink` to `Header`'s `imports` — verify by inspecting the icon/badge markup inside both branches is otherwise identical to today, and only the wrapping element and its interactivity differ

## 6. Verification

- [x] 6.1 Run `npm run build` and confirm it completes without errors
- [x] 6.2 Run `npm test` and confirm existing tests still pass
- [x] 6.3 Manually confirm the cart icon is not clickable (no navigation) while the cart is empty
- [x] 6.4 Manually add one or more books to the cart, confirm the cart icon becomes clickable, and confirm clicking it navigates to the cart page showing the correct books with no "Add to cart" button on any card
- [x] 6.5 Manually confirm the cart page's back control navigates back to the main search page
- [x] 6.6 Manually add the same book to the cart twice and confirm it appears as two separate cards on the cart page
- [x] 6.7 Manually navigate directly to `/cart` with an empty cart (e.g. by typing the URL) and confirm the empty-cart message is shown instead of an empty list
- [x] 6.8 Manually sign out with items in the cart and confirm the cart icon disappears (existing behavior from `restrict-cart-to-login`, re-verify it still holds with the new data model)
