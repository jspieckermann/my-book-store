## Why

The app is currently the unmodified Angular CLI starter (default light placeholder page, no custom design tokens) even though Tailwind CSS v4 is already installed. Before real book-store screens get built, the project needs a reusable, professional dark theme foundation so every future component inherits consistent colors, typography, and spacing instead of ad-hoc styles.

## What Changes

- Define a dark, professional color palette (background, surface, text, border, accent/brand, and semantic states such as success/warning/error) as Tailwind v4 `@theme` tokens plus supporting CSS custom properties in `src/styles.css`.
- Set the dark theme as the app's default (single fixed theme for this change — no light/dark toggle).
- Establish base typography tokens (font family, weight, size scale) consistent with a "modern, professional" look, replacing the current starter's ad-hoc `:host` variables in `src/app/app.html`.
- Set global element defaults (`body`, `html`) to use the new background/text tokens so the dark theme applies app-wide, not just within one component.
- Restyle the existing Angular starter placeholder (`src/app/app.html`) to use the new tokens, as a working demonstration that the theme renders correctly end-to-end.
- Document the token set (names, purpose, usage) so future components have a clear contract to build against.

## Capabilities

### New Capabilities
- `theming`: Defines the app-wide dark color palette, typography scale, and design tokens that all UI must use, plus the requirement that these render as the default (and only) theme.

### Modified Capabilities
(none — no existing capabilities/specs in this project yet)

## Impact

- **Code**: `src/styles.css` (new `@theme` tokens, global element defaults), `src/app/app.html` (remove starter's inline `:host` color variables, adopt new tokens), `tailwind.config`/PostCSS setup if a config file needs to reference the palette.
- **Dependencies**: None new — uses the already-installed Tailwind CSS v4 (`@tailwindcss/postcss`).
- **Systems**: Purely front-end styling; no API, routing, or data changes.
- **Follow-on work**: Future components/pages will consume these tokens rather than defining their own colors — not part of this change, but this change sets the contract they'll follow.
