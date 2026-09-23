## 1. Main page title

- [x] 1.1 In `book-search.html`, add `<h1 class="page-title">Search</h1>` as the first element inside `<section class="book-search">`, before the filter form — verify by inspecting it renders above the filter section and no other markup changed
- [x] 1.2 Add a `.page-title` rule to `book-search.css` using `theming` tokens (small size, e.g. `var(--text-body)`, `font-weight: var(--font-weight-heading)`, `color: var(--color-text)`, `margin: 0`) — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added

## 2. Cart page title

- [x] 2.1 In `cart-page.html`, add `<h1 class="page-title">Your Cart</h1>` as the first element inside `<section class="cart-page">`, before the back link — verify by inspecting it renders above the back link and the rest of the page's content, with no other markup changed
- [x] 2.2 Add a `.page-title` rule to `cart-page.css` matching `book-search.css`'s `.page-title` treatment (same token usage) — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it completes without errors
- [x] 3.2 Run `npm test` and confirm existing tests still pass
- [x] 3.3 Manually confirm the main page shows a small "Search" title above the filter section
- [x] 3.4 Manually confirm the cart page shows a small "Your Cart" title above its content (back link and book list/empty message)
