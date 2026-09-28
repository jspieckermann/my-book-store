## Context

`BookSearch` (`src/app/book-search/book-search.ts`) currently computes `showPromo = computed(() => state().kind === 'idle' || state().kind === 'not-found')`, and `book-search.html` renders `@if (showPromo()) { <app-promo-section /> }` right after the "not-found" status message, above the results list and pagination. `PromoSection` fetches its random book set once in its constructor with no `active` input — the `@if`'s destroy/recreate cycle is what currently gives "fixed while shown, freshly re-randomized the next time it's shown" (see the `add-flashy-ad-section` design.md's "Mount/unmount drives the fetch, not an input flag" decision). See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- The promo section is present in the DOM in every `BookSearch` state, positioned after the results list and pagination controls.

**Non-Goals:**
- No change to `PromoSection` or `PromoCard`'s own internals (fetching, filtering, card rendering, styling) — this change is purely about *when* and *where* `BookSearch` renders `<app-promo-section />`.
- No change to the "Book not found" / loading / error messages themselves.

## Decisions

- **Remove `showPromo` entirely, render unconditionally**: since the promo section is now always shown, the computed signal has no remaining purpose — `book-search.html` renders a plain `<app-promo-section />` with no `@if` wrapper, at the end of `.book-search`, after the `@if (state(); as current) { ... }` block that holds the results list and pagination.
- **`PromoSection` becomes a permanent instance for the page's lifetime, not a remounting one**: removing the `@if` wrapper means Angular no longer destroys/recreates `PromoSection` on every state transition — it's created once when `BookSearch` mounts and persists until `BookSearch` itself is destroyed (e.g. navigating away). Consequently, its "fixed while shown" behavior (already specified) now effectively means "fixed for the entire time the search page is open," only re-rolling on a fresh navigation to the page — a strictly stronger version of the existing `promo-section` spec's "Selection stays fixed while the page remains in the same state" scenario, not a contradiction of it, so that requirement is left unmodified.
- **CSS spacing follows the element, not a special-cased selector**: `book-search.css` currently has `app-promo-section { margin-top: clamp(1rem, 3vw, 1.5rem); }` to add breathing room above the section when it sits right below the search form/status messages. Now that the section sits at the bottom (after results/pagination, which aren't always present), keep the same rule — `.book-search`'s flex-column `gap` still provides the base spacing from whichever element precedes it (status message, results list, or pagination), and the extra `margin-top` keeps it visually separated as a distinct "ad" block regardless of what's directly above it.

- **Headline styling matches the page's other headlines, not the garish card/badge treatment**: `promo-section.css`'s `.promo-headline` drops its `-webkit-text-stroke`, `text-shadow`, `text-transform: uppercase`, and custom `font-size`/`letter-spacing`, replacing them with the same rule set `book-search.css`'s `.page-title` uses (`var(--font-sans)`, `var(--text-body)`, `var(--font-weight-heading)`, `var(--color-text)`). The headline text itself changes from "Deal of the day" to "Best offers" via the existing `promoSection.headline` translation key. This only affects the headline — `PromoCard`'s garish, animated styling (border, background gradient accents, discount badge) is unchanged, since the "brighter, more saturated colors and animated visual treatment on its discount badges" part of the styling requirement is unaffected by this request.

## Risks / Trade-offs

- [Always rendering `PromoSection` means it now fires its random-books HTTP request on every page load / navigation to search, even when the user immediately performs a successful search and would have seen it disappear before] → Accepted; this is the explicit intent of the change (a persistent promo presence), and the request is small (a single batched fetch, same as today's idle-state load).
