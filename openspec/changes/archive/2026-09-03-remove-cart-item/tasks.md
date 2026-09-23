## 1. Cart service

- [x] 1.1 Add `remove(book: BookSummary): void` to `src/app/cart/cart.ts` that filters `_books` by reference identity (`books.filter((b) => b !== book)`) — verify by inspecting the filter uses `!==`, not a content/field comparison

## 2. BookCard delete control

- [x] 2.1 Add `readonly showDelete = input(false);` to `src/app/book-card/book-card.ts`, alongside the existing `showAddToCart` input — verify by inspecting it defaults to `false`
- [x] 2.2 In `book-card.html`, add a delete icon button (inline SVG, styled like the existing header icons) shown when `showDelete()` is true, calling `cart.remove(book())` on click, with an `aria-label` like "Remove from cart" — verify by inspecting the button is independent of the existing `showAddToCart`/"Add to cart" block (both can theoretically coexist, though no current call site sets both true)
- [x] 2.3 Style the new delete icon in `book-card.css` using only `theming` tokens, consistent with `.add-to-cart-button`'s approach — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added

## 3. Cart page integration

- [x] 3.1 In `cart-page.html`, add `[showDelete]="true"` to `<app-book-card [book]="book" [showAddToCart]="false" />` — verify by inspecting `book-search.html`'s `<app-book-card [book]="book" />` usage is unchanged (still no delete control on search result cards)

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm existing tests still pass
- [x] 4.3 Manually add two or more different books to the cart, then delete one from the cart page, and confirm only that book's card disappears and the header's cart count decreases by one
- [x] 4.4 Manually add the same book to the cart twice, then delete one of its two cards on the cart page, and confirm exactly one card is removed while the other remains
- [x] 4.5 Manually remove the only book in the cart and confirm the cart page shows the empty-cart message
- [x] 4.6 Manually confirm no delete control appears on book cards on the main search page
