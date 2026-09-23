## Why

The app has a header (from `add-app-header`) but no footer, so there's no place to surface app-level metadata like the current version. A minimal footer showing "v1.0" gives the app a complete top-to-bottom shell and a visible version marker for this early build.

## What Changes

- Add a new standalone footer component rendered at the bottom of the app, displaying the version number "v1.0".
- Make the footer responsive: it adapts padding and text sizing across mobile, tablet, and desktop viewport widths without horizontal overflow or clipping.
- Keep the footer visually less prominent than the header: smaller text and muted color from the existing dark theme tokens (`theming` capability), rather than the header's bolder title styling.
- The footer SHALL NOT be sticky/fixed — it sits in normal document flow at the end of the page content and scrolls away with the rest of the page, matching the header's non-sticky behavior.
- Style the footer using the existing dark theme tokens from the `theming` capability, consistent with the header and the rest of the app.

## Capabilities

### New Capabilities
- `app-footer`: Defines the site footer — its content (version number), layout behavior across viewport sizes, non-sticky positioning, and its less-prominent visual weight relative to the header.

### Modified Capabilities
(none — this change consumes the existing `theming` tokens but does not change their requirements, and does not change the `app-header` capability)

## Impact

- **Code**: New footer component (e.g. `src/app/footer/`), `src/app/app.html` (footer added below `<router-outlet />`), `src/app/app.ts` (registers the new footer component).
- **Dependencies**: None new — uses Angular's standalone components and the existing Tailwind v4 setup with `theming` tokens.
- **Systems**: Purely front-end UI; no routing, API, or data changes. The version number "1.0" is a static, hardcoded string for this change (no build-time injection from `package.json` or similar).
- **Follow-on work**: Wiring the displayed version to an actual build/release version source (rather than a hardcoded string) is not part of this change.
