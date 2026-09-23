## Why

A user browsing search results or recommendations has no way to tell, at a glance, that a book is already in their cart (or how many copies), since adding the same book multiple times is allowed but nothing on the card reflects that. A small per-book quantity badge next to the "Add to cart" control closes that gap.

## What Changes

- Add a quantity badge next to the "Add to cart" control on search result cards (`BookCard`, as used on the search page) and on recommendation cards (`RecommendationCard`), showing how many times that book is currently in the cart.
- The badge is hidden entirely when the book is not in the cart (count is zero); it never shows "0".
- "How many times this book is in the cart" is determined the same way this codebase already matches books without a stable identifier elsewhere (`book-recommendations`' cart-exclusion logic): a case-insensitive, trimmed title comparison against `Cart.books()`.
- The badge only ever appears alongside the "Add to cart" control itself, so it's naturally absent on the cart page's own book cards (which show a delete control instead, never "Add to cart").

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
- `book-search`: adds a requirement for a per-book cart-quantity badge next to the "Add to cart" control on a search result card.
- `book-recommendations`: adds the equivalent requirement for a recommendation card.

## Impact

- Affected files: `src/app/book-card/book-card.ts`/`.html`/`.css` (new computed + badge markup, next to the existing add-to-cart button), `src/app/recommendation-card/recommendation-card.ts`/`.html`/`.css` (same), `src/app/language/translations.ts` (a new accessible-label translation key for the badge, mirroring the existing `bookCard.ratingLabel` pattern).
