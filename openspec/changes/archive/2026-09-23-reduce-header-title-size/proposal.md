## Why

The header title ("My-Book-Store") currently renders noticeably larger than the book-logo icon next to it, especially at wider viewports, so the pairing doesn't read as visually balanced.

## What Changes

- Reduce the header title's font size slightly (tune the existing `clamp()` sizing in `header.css`) so its visual scale sits closer to the logo icon's size, while remaining clearly readable and still the more prominent of the two.
- No new typography token is introduced — this stays within the existing `.title` clamp range already pulling from the `theming` capability's tokens.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
_(none — no requirement in `app-header` or `theming` pins an exact title size or a specific size relationship to the logo; both capabilities' existing requirements remain true after this tuning. `skip_specs: true` is set in this change's `.openspec.yaml`.)_

## Impact

- Affected files: `src/app/header/header.css` (`.title`'s `font-size`).
- No component logic, template, or test-relevant DOM structure changes — this is a pure visual/CSS tuning change.
