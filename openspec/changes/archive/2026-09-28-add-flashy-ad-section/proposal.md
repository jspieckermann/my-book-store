## Why

The search page's "no results" and pre-search states are currently a dead end (a plain "Book not found" message, or nothing at all before the first search). This adds a deliberately tacky, over-the-top promotional section in those two states — a parody of aggressive discount-ad UX patterns — showing real books with fake "unbelievable" discounts, as a contrast to the calm, honest presentation used everywhere else in the app.

## What Changes

- Add a new promo/ad section shown on the search page in two states: (1) after a search completes with no matching results (alongside the existing "Book not found" message, which is unchanged), and (2) before any search has been performed (the page's initial state).
- The section shows randomly selected real books about AI engineering from the Google Books API, filtered to only include books that have a real cover image. The number of cards shown is not fixed — more are shown as available screen width grows, fewer as it shrinks.
- Each promo card shows: cover image, title, a fake discount price treatment (the book's existing randomly-generated price shown struck through as the "original" price, a lower randomly-discounted "now" price, and a percentage-off badge), and a functional "Add to cart" control that adds the real book to the real cart (shown only when signed in, matching the rest of the app's convention).
- The section has a loud, over-the-top promotional headline, and is deliberately styled differently from `BookCard`/`RecommendationCard` — brighter colors, animated badges (with a static fallback under `prefers-reduced-motion`), less information per card (no author, rating, publisher, or description).
- Layout: a single row, no scrollbar, no pagination controls — however many cards fit at the current viewport width are shown; the rest are simply not displayed. The fetched set of books is fixed once fetched (no auto-rotation).

## Capabilities

### New Capabilities
- `promo-section`: a deliberately garish promotional section shown on the search page when there's nothing else to show (no results, or no search yet), presenting random real books with fake discounts.

### Modified Capabilities
_(none — `book-search`'s existing requirements, including the "Book not found" message, are unchanged; this section is purely additive alongside them)_

## Impact

- Affected files: new `src/app/promo-section/` and `src/app/promo-card/` components (or similarly named); `src/app/book-search/google-books.ts` (a new method to fetch a batch of random books); `src/app/book-search/book-search.html`/`.ts` (wiring the new section into the `idle` and `not-found` states); `src/app/language/translations.ts` (new headline/badge translation keys).
