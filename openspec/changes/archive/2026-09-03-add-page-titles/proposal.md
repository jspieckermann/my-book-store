## Why

With two routed pages now (the main search page and the cart page), there's nothing on either page itself indicating which one you're on beyond the URL and page content — a small heading per page gives that orientation directly.

## What Changes

- The main (search) page gets a small title, "Search", displayed above the filter section.
- The cart page gets a small title, "Your Cart", displayed above its content.
- Both titles use the app's existing `theming` typography tokens and are visually small (not a large hero heading) — this is about page orientation, not a redesign.
- **Assumption**: "title" here means a small on-page heading (not the browser tab/document title) — the request's emphasis on "small" reads as a visual-size description, which only makes sense for an on-page element. Updating the browser tab title per route is not part of this change.

## Capabilities

### Modified Capabilities
- `book-search`: gains a small page-title requirement for the main page.
- `shopping-cart`: gains a small page-title requirement for the cart page.

## Impact

- **Code**: `src/app/book-search/book-search.html`/`.css` (add a small `<h1>` title above the filter form); `src/app/cart-page/cart-page.html`/`.css` (add a small `<h1>` title above the cart page's content).
- **Dependencies**: None new.
- **Systems**: Purely client-side, presentational only.
- **Follow-on work**: Updating the browser tab's document title per route (e.g. via Angular's `Title` service) is not part of this change.
