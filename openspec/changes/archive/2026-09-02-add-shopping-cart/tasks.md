## 1. Cart service

- [x] 1.1 Generate a standalone `CartService` at `src/app/cart/cart.ts` using the `@Service()` pattern (matching `GoogleBooks`), exposing a read-only `count` signal and an `add()` method that increments it by one — verify the service compiles and `add()` correctly increments `count` (unit test or manual inspection)

## 2. Header: cart icon and badge

- [x] 2.1 Add an inline SVG shopping cart icon to `header.html`, positioned on the right side of the header's flex row (e.g. via `margin-inline-start: auto` on the icon or a spacer element) — verify by inspecting the template/layout that the icon renders after the title and is pushed to the right
- [x] 2.2 Inject `CartService` into `Header` and render a badge showing `cartService.count()` next to/on the icon, shown only when `count() > 0` — verify by inspecting the template's conditional binding
- [x] 2.3 Style the icon and badge using `theming` tokens only (icon via `currentColor` matching the existing logo convention, badge background/text from token colors) — verify by inspecting computed styles show only `theming` token values, no hardcoded hex/oklch colors added to `header.css`

## 3. Result card: add to cart button

- [x] 3.1 Inject `CartService` into `IsbnSearch` and add an "Add to cart" button inside `.book-card` (below the attribute list), calling `cartService.add()` on click — verify by inspecting the template that the button is present only in the found-book branch and its click handler calls `add()`
- [x] 3.2 Style the button using `theming` tokens, visually secondary relative to the existing search button (e.g. `--color-surface` background instead of `--color-accent`) — verify by inspecting computed styles show only `theming` token values

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm existing tests still pass
- [x] 4.3 Manually load the app and confirm the cart icon is visible in the header's right side with no badge shown initially
- [x] 4.4 Manually search a valid ISBN, click "Add to cart" on the result card, and confirm the header badge appears showing "1"
- [x] 4.5 Click "Add to cart" again (same or a different searched book) and confirm the badge count increments accordingly
- [x] 4.6 Confirm there is no way to click into or open the cart from the header icon (display-only, per spec)
