## Why

Books currently show no price, so there's nothing for a user to weigh when deciding whether to add one to the cart. Since this app has no real backend pricing data, a randomly generated price per book gives every card a plausible, prominent price to display.

## What Changes

- `google-books.ts`: when mapping an API response item to a `BookSummary`, generate a random price in the 10.00–70.50 € range (2 decimal places) and store it on the book. The price is generated once per fetched book record and stays fixed on that record afterward (including when the same book object is copied into the cart), so it stays consistent between a search result card and that same book's cart card; a fresh search for the same real-world book can yield a different price, since there is no stable book identity to key off (no ISBN/volume ID is currently tracked).
- `book-card.ts`/`.html`: display the price, formatted as German currency (e.g. "42,50 €", no "Price:" label), in bold and a visually prominent font size, positioned directly above whichever action button the card shows (add-to-cart on search result cards, delete on cart page cards) — shown on every book card, in both contexts.
- `book-card.css`: style the new price element (bold, larger font size than body text) using existing `theming` typography/color tokens.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `book-search`: adds a requirement that every displayed book shows a randomly generated price, formatted and positioned as described above.

## Impact

- Affected files: `src/app/book-search/google-books.ts`, `src/app/book-card/book-card.ts`, `src/app/book-card/book-card.html`, `src/app/book-card/book-card.css`.
- Existing unit tests (`google-books.spec.ts`, `book-card.spec.ts`) will need updates to account for the new always-present `price` field (e.g. relaxing exact-fixture `toEqual` assertions or asserting the field's presence/range instead of an exact value, since it's randomly generated).
