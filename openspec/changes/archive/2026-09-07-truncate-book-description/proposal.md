## Why

A book's full description can be very long, making result cards (and cart cards) tall and inconsistent in height, which hurts scannability of the results list. Truncating the description with an optional expand control keeps cards compact while still letting the user read the full text on demand.

## What Changes

- `book-card.html`/`.ts`: when a book's description is longer than 250 characters, display only the first 250 characters (broken at the last whole word, followed by an ellipsis) plus an icon-only "expand" button. Activating it reveals the full description and swaps the icon to a "collapse" state; activating again re-collapses it.
- Descriptions of 250 characters or fewer render exactly as today, with no expand control.
- This applies to every book card rendered by the shared `book-card` component — both search result cards and cart page cards — since they share the same markup and description text.
- The expand/collapse button follows the same icon-button chrome established for the add-to-cart/delete controls (same size, padding, border, background), differing only in icon.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `book-search`: the "Search results list" requirement's description attribute becomes truncatable/expandable instead of always shown in full.

## Impact

- Affected files: `src/app/book-card/book-card.html`, `src/app/book-card/book-card.ts`, `src/app/book-card/book-card.css`.
- Existing unit tests (`book-card.spec.ts`) and e2e tests referencing full description text will need review; long-description fixtures should be updated to assert truncated text plus the expand control.
