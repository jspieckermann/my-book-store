## Why

The cart page and Impressum page each have a "← Back to search" link that only ever goes to the main page. Replacing it with a real breadcrumb trail (positioned above the page title) shows the user's location in the site's structure, not just a way back, and is the more standard navigation pattern for a page one level below the home page.

## What Changes

- Remove the "← Back to search" link from the cart page and the Impressum page (both markup and its `cartPage.backToSearch`/`impressum.backToSearch` translation keys).
- Add a breadcrumb trail above the `<h1>` page title on both pages: a link back to the main page (reusing the main page's own title, "Search"/"Suche", as the label) followed by the current page's title (non-interactive, marked as the current page for assistive technology).
- Implement the breadcrumb as one shared, reusable component (mirroring how `BookCard`/`RecommendationCard` are shared across pages) rather than duplicating the markup on each page.

## Capabilities

### New Capabilities
- `breadcrumb-navigation`: a shared breadcrumb trail shown above a page's title, linking back to the main page and naming the current page.

### Modified Capabilities
- `shopping-cart`: replaces the "Return to the main page from the cart page" requirement (a bare back-link) with breadcrumb-based navigation.
- `impressum`: replaces the "Return to the main page from the Impressum page" requirement (a bare back-link) with breadcrumb-based navigation.

## Impact

- Affected files: new `src/app/breadcrumb/` component; `src/app/cart-page/cart-page.html`/`.css`/`.ts`, `src/app/impressum/impressum.html`/`.css`/`.ts` (remove back-link, add breadcrumb); `src/app/language/translations.ts` (remove the two `backToSearch` keys, reuse existing page-title keys for breadcrumb labels).
