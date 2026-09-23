## Why

The header's logo and title are currently plain, non-interactive elements. On the cart page (and any future page), there's no quick way back to the main search page except the small "Back to search" link on the cart page itself — clicking the logo/title, a near-universal web convention, does nothing.

## What Changes

- `header.html`/`.ts`: wrap the logo and the "My-Book-Store" title in a single link that navigates to the main page (`/`), matching the existing cart-icon link pattern (one `<a>` wrapping both visual pieces, not two separate links).
- `header.css`: give the new link the same hover/press visual feedback already used by the header's other interactive controls (cart, login, logout), and keep the logo/title's existing sizing and spacing unchanged.
- No visual change when already on the main page — the link is still present and clickable there, it's just a same-page no-op navigation.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `app-header`: the header's logo and title become a link to the main page.

## Impact

- Affected files: `src/app/header/header.html`, `src/app/header/header.css`.
- Existing unit tests (`header.spec.ts`) and e2e tests referencing the header's structure may need updates if they assert on the logo/title's exact DOM position (e.g. as direct children of `.header`) rather than by class/text content.
