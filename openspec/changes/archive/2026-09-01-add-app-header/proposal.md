## Why

The app currently has no header — it still shows the unmodified Angular CLI starter placeholder (logo, "Congratulations!" text, doc links). A real book-store shell needs a persistent, responsive header identifying the site (title "My-Book-Store" plus a book-themed logo) before any further pages or navigation are built on top of it.

## What Changes

- Add a new standalone header component rendered at the top of the app, containing a book-themed logo (inline SVG icon) and the title "My-Book-Store".
- Make the header responsive: it adapts padding/logo and title sizing across mobile, tablet, and desktop viewport widths without horizontal overflow or clipping.
- Style the header using the existing dark theme tokens from the `theming` capability (background/surface, text, accent) established in `add-dark-theme-foundation`, so it's visually consistent with the rest of the app.
- **BREAKING**: Remove the Angular CLI starter placeholder content from `src/app/app.html` (the demo logo, "Congratulations!" text, doc/tutorial pill links, and social links) and replace it with the new header plus the existing `<router-outlet />`.

## Capabilities

### New Capabilities
- `app-header`: Defines the responsive site header — its content (logo + title), layout behavior across viewport sizes, and visual consistency with the dark theme.

### Modified Capabilities
(none — this change consumes the existing `theming` tokens but does not change their requirements)

## Impact

- **Code**: New header component (e.g. `src/app/header/`), `src/app/app.html` (starter placeholder removed, header + router-outlet added), `src/app/app.ts` (registers the new header component), possibly `src/app/app.css` (currently empty).
- **Dependencies**: None new — uses Angular's standalone components and the existing Tailwind v4 setup with `theming` tokens.
- **Systems**: Purely front-end UI; no routing, API, or data changes. The header itself contains no navigation links yet (no other routes exist).
- **Follow-on work**: Navigation links/menu inside the header are not part of this change and can be added once real pages/routes exist.
