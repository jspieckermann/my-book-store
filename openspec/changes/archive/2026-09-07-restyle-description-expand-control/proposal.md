## Why

The description truncation length needs to grow from 250 to 350 characters, and the expand control's current appearance — a boxed icon-only button sitting inline right after the text — should instead read as a text link ("Read more"/"Read less" with a chevron) placed on its own line below the description, which is more familiar and more discoverable than an icon alone.

## What Changes

- `book-card.ts`: raise the truncation threshold from 250 to 350 characters (word-boundary + ellipsis, same logic as before, only the number changes).
- `book-card.html`/`.css`: replace the current icon-only `.expand-button` (boxed chrome, inline after the text) with a link-style control placed on its own line below the (truncated or full) description text, showing a chevron icon plus the visible text "Read more" when collapsed or "Read less" when expanded.
- No change to the underlying expand/collapse behavior itself — only the numeric threshold and the control's visual presentation and position change.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `book-search`: the "Search results list" requirement's truncation length changes to 350 characters, and the expand control's description changes from an icon-only inline control to a chevron + "Read more"/"Read less" text control positioned below the description.

## Impact

- Affected files: `src/app/book-card/book-card.ts`, `src/app/book-card/book-card.html`, `src/app/book-card/book-card.css`.
- Existing unit tests (`book-card.spec.ts`) and e2e tests referencing the `.expand-button` class, its `aria-label`s, the 250-character threshold, or long-description fixtures under the new 350-character threshold will need review.
