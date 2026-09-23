## Context

`GoogleBooks.search()` maps each API response item to a `BookSummary` exactly once (in `toBookSummary()`); the same `BookSummary` object instance then flows from the search results list into the cart when a user clicks "Add to cart" (`Cart.add()` does `{ ...book }`, a shallow spread that preserves any existing fields, including a price already set on that object). `book-card.ts`/`.html` is the shared component rendering both search-result and cart-page cards. See proposal.md for why the price is random rather than sourced from an API.

## Goals / Non-Goals

**Goals:**
- Every displayed book has a price, generated once (at API-response-mapping time) and displayed unchanged afterward for that specific book record — including on its cart card, so the price a user saw when adding matches what they see in their cart.
- No label, bold, visually prominent (larger than the body attribute text), positioned directly above the card's action button, on every book card (search results and cart page alike).
- Formatted as German-locale currency (comma decimal separator, trailing € sign, e.g. "42,50 €"), matching this session's established display convention.

**Non-Goals:**
- No cart total / sum of prices — out of scope, not requested.
- No stable pricing across separate searches for the "same" real-world book — this app has no stable book identifier (no ISBN/volume ID currently tracked in `BookSummary`), so a fresh search naturally produces a new `BookSummary` object with its own freshly generated price. Accepted trade-off (see Risks).
- No price editing or persistence beyond the current session's in-memory objects.

## Decisions

- **Where price is generated**: inside `toBookSummary()` in `google-books.ts`, as `price: Math.round((Math.random() * (70.5 - 10) + 10) * 100) / 100`. Generating it here (once, at data-mapping time) rather than in `book-card.ts` (which would regenerate on every change-detection read if implemented as a `computed()`/getter) is what keeps the price stable across re-renders and across the search-card → cart-card handoff.
- **Type**: `price: number;` added to `BookSummary` as a required (non-optional) field, unlike `averageRating`/`ratingsCount` which are optional and API-sourced — every book always gets a generated price, so there's no "absent" case to gate on.
- **Formatting**: `book().price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })`, which renders e.g. `42,50 €` — no manual string building, no new hardcoded currency symbol logic.
- **Placement in the template**: a single price element placed in `book-card.html` right after the attributes list (`</dl>`) and before the `@if (showAddToCart()...)` / `@if (showDelete())` button blocks, so it always renders directly above whichever action button is present, satisfying "above the add to cart button" for search cards and extending the same treatment to the delete button on cart cards (per the confirmed scope: show on every card, not just where "Add to cart" appears).
- **Styling**: bold weight and a larger font size than the existing `--text-body` token — reuse `--text-heading`-scale sizing (or a comparable larger step) with `font-weight: 700` (bolder than this app's existing `--font-weight-heading`, which is used for labels, not for a prominent standalone price), colored with `var(--color-text)` (no new hardcoded color).

## Risks / Trade-offs

- [Re-searching for the same real-world book yields a different `BookSummary` object and thus a different random price] → Accepted: this app has no stable book identity to persist a price against; documented explicitly rather than silently glossed over. A user adding a book to the cart still sees a consistent price between the search card and the cart card for that specific add, which is the behavior that matters most.
- [Existing unit tests assert exact `BookSummary` shapes via `toEqual`] → These will fail once every mapped book gains a random `price`; update them to assert the field's presence/numeric range instead of exact equality (or extract price separately before comparing the rest of the object).
