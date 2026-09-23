## Why

The cart page has a "← Back to search" control that returns to the main page; the Impressum page has no equivalent, leaving the footer link (or the browser's back button) as the only way back.

## What Changes

- Add a "back to search" control to the Impressum page, analogous to the cart page's back-link: same position (top of the page, above the content), same visual style, same navigation target (the main page).
- The control's text goes through the existing translation mechanism, consistent with the rest of the Impressum page's content (a new `impressum.backToSearch` key, mirroring the existing `cartPage.backToSearch` key).

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
- `impressum`: adds a new requirement for a control that navigates back to the main page, analogous to `shopping-cart`'s existing "Return to the main page from the cart page" requirement.

## Impact

- Affected files: `src/app/impressum/impressum.html` (new back-link), `src/app/impressum/impressum.ts` (adds `RouterLink` import), `src/app/impressum/impressum.css` (back-link styling, mirroring `cart-page.css`'s `.back-link`), `src/app/language/translations.ts` (new `impressum.backToSearch` key).
