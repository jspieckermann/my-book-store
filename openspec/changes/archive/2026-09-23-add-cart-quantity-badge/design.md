## Context

`Cart.add(book)` pushes a shallow copy (`{ ...book }`) into the cart's signal array (`src/app/cart/cart.ts`), so a book rendered on a search result card or recommendation card is never the same object reference as its counterpart in the cart — matching has to be value-based. This codebase already has exactly this problem and an established answer: `book-recommendations.ts`'s cart-exclusion filter matches by `book.title?.trim().toLowerCase()`, documented as "the same data-model limitation the rest of the app already lives with" (no stable volume ID). `BookCard` (search page and cart page) and `RecommendationCard` (recommendations section) each already inject `Cart` directly and already have their own small `computed()`s for card-specific derived state (formatted price, rating stars, truncated text). The header already has one quantity-badge visual precedent: `.cart-badge` in `header.css` — a small pill, `border-radius: 999px`, `background-color: var(--color-accent)`, positioned as an absolute overlay on the cart icon. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- A per-book quantity badge that appears next to (not overlapping) the "Add to cart" control, since the request specifically says "next to" — a different placement than the header's overlay-badge precedent.
- Reuse the existing title-matching convention exactly, rather than introducing a second, possibly-inconsistent way to compare books.
- Badge is purely reactive to `Cart.books()` — no new state, no manual refresh logic.

**Non-Goals:**
- No change to the cart page's own book cards — they render with `showAddToCart=false`, so they never show the "Add to cart" control the badge is anchored to, and the request scopes this to the search page and recommendations section only.
- No shared badge component — the two consuming components (`BookCard`, `RecommendationCard`) each get their own small computed and markup, matching how the title-matching logic itself is already duplicated rather than extracted (see Context) and how each component already owns its own small presentational computeds.
- No change to the header's own total-count `.cart-badge` — a different, pre-existing feature, left untouched.

## Decisions

- **Matching logic**: `cart.books().filter((b) => b.title?.trim().toLowerCase() === book().title?.trim().toLowerCase()).length`, added as a `cartQuantity` computed in both `BookCard` and `RecommendationCard`, mirroring `book-recommendations.ts`'s existing comparison style exactly (same trim/lowercase treatment, same `undefined`-safe optional chaining).
- **Visibility**: the badge is rendered only when `cartQuantity() > 0`, and only inside the same `@if` block that already gates the "Add to cart" button itself (`showAddToCart() && googleAuth.user()` in `BookCard`; `googleAuth.user()` in `RecommendationCard`) — so it can never appear without its button, and never needs its own separate sign-in check.
- **Layout: a small wrapper, not a sibling span**: both components currently render the "Add to cart" button as the last flex child of a flex-column container, using `align-self: flex-start` (`BookCard`) or `align-self: flex-start; margin-top: auto` (`RecommendationCard`, load-bearing for the cross-card button-alignment behavior from `add-book-recommendations`). A bare sibling `<span>` after the button would stack on a new line, not sit beside it. Both templates get a new `.add-to-cart-row` wrapper (`display: flex; align-items: center; gap: 0.5rem`) around the button + badge; the wrapper takes over the `align-self`/`margin-top: auto` the button used to carry, so `RecommendationCard`'s existing cross-card alignment is preserved unchanged.
- **Content: full text, not a bare number**: the badge's visible text is the whole translated phrase (new key `bookCard.alreadyInCart`, "{count} already in cart" / "{count} bereits im Warenkorb"), not just the digit — e.g. a card with two copies in the cart shows a badge reading "2 already in cart". Since the visible text already is the complete, self-explanatory sentence, no separate `aria-label` is needed on top of it (unlike the star-rating indicator, which visually shows only stars and relies on `bookCard.ratingLabel` for an accessible name — here the visible content and the accessible content are the same string).
- **Visual style**: a rounded pill/chip (`border-radius: 999px`, `background-color: var(--color-accent)`, `color: var(--color-background)`) reusing the header `.cart-badge`'s color treatment, but sized for a short phrase rather than a 1-2 digit number — wider, with horizontal padding for the text, positioned as an inline sibling rather than an absolute corner overlay.

## Risks / Trade-offs

- [Title-based matching can under/over-count the same way the existing exclusion logic can misfire (a reissued edition with a slightly different title won't count; two genuinely different books that happen to share a title will be conflated)] → Accepted, for the same reason `book-recommendations` already accepted it: no stable identifier exists in this data model, and the cost of either failure mode is low for a quantity indicator.
- [Duplicating the small `cartQuantity` computed and the matching expression across two components risks drift if the matching rule ever changes] → Accepted, consistent with this codebase's existing choice not to extract the identical logic in `book-recommendations.ts`/`google-books.ts`; a shared identity/matching utility is a larger, separate concern if it's ever wanted.
