## 1. Price generation

- [x] 1.1 In `google-books.ts`, add `price: number;` (required, not optional) to `BookSummary`, and set it in `toBookSummary()` as `Math.round((Math.random() * (70.5 - 10) + 10) * 100) / 100` — verify by inspecting the generated value always falls within 10–70.5
- [x] 1.2 Update `google-books.spec.ts`'s existing `toEqual`-based mapping test(s) to account for the new `price` field (e.g. assert `price` is a number within range separately, then compare the rest of the object without `price`) — verify `npm test` passes

## 2. Price display

- [x] 2.1 In `book-card.html`, add a price element (e.g. `<p class="price">`) right after the attributes list and before the add-to-cart/delete button blocks, so it renders directly above whichever action button is present on every card, showing `book().price` formatted via `toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })` with no label — verify by inspecting the template renders the formatted price unconditionally (no `@if` gating, since price is always present)
- [x] 2.2 In `book-card.css`, style `.price` with `font-weight: 700` and a font size larger than `--text-body` (reuse the `--text-heading` scale or a comparable step), colored with `var(--color-text)` — verify by inspecting the selector uses only token-based values and no new hardcoded colors

## 3. Update existing fixtures and tests

- [x] 3.1 Add a `price` value to every `BookSummary` object literal in `book-card.spec.ts`, `cart-page.spec.ts`, and `cart.spec.ts` so they satisfy the now-required field — verify `npm test` passes with no TypeScript errors
- [x] 3.2 Add unit tests in `book-card.spec.ts` asserting the `.price` element renders the formatted price (e.g. a book with `price: 42.5` renders "42,50 €") on both an add-to-cart card and a delete card — verify `npm test` passes

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm it completes without errors
- [x] 4.2 Run `npm test` and confirm all unit tests pass with coverage still at or above the 85% threshold
- [x] 4.3 Run `npm run e2e` and confirm the full e2e suite passes (no e2e assertions need new price-specific coverage per this change's scope, but existing tests must not break now that every card shows a price)
- [x] 4.4 Manually verify in the browser that every book card (search results and cart page) shows a bold, prominent, unlabeled price directly above its action button, and that adding a book to the cart shows the same price on its cart card as it showed on its search result card (verified via a throwaway Playwright script with screenshots: "29,82 €" shown bold above add-to-cart on the search card, identical "29,82 €" above the delete button on the cart card)
