## Context

The cart page (`src/app/cart-page/`) and Impressum page (`src/app/impressum/`) each currently render an identical `.back-link` anchor (`RouterLink` to `/`) directly after their `<h1 class="page-title">`, added in two earlier separate changes and never shared as a component. Both pages already inject `Language` and translate their own `pageTitle` key. The main page's own title is `bookSearch.pageTitle` ("Search" / "Suche"). See proposal.md for why this is being replaced.

## Goals / Non-Goals

**Goals:**
- One shared, reusable component for the breadcrumb trail, used by both pages (and available to any future page one level below the main page).
- No new translation keys for the breadcrumb labels themselves — reuse each page's existing `pageTitle` key and the main page's `bookSearch.pageTitle`, keeping breadcrumb wording automatically consistent with each page's own heading.

**Non-Goals:**
- No multi-level breadcrumb trails (e.g. `Search | Cart | Checkout`) — this app's navigation is flat (main page, cart page, Impressum page), so every breadcrumb trail is exactly two segments: the main page, then the current page.
- No change to the main page itself (it has no breadcrumb — there's nothing above it).

## Decisions

- **New `Breadcrumb` component** (`src/app/breadcrumb/`): takes a single `currentPageLabel = input.required<string>()` (the already-translated current page title). Renders a `<nav aria-label="...">` containing an ordered list: a `RouterLink` to `/` labeled with the translated `bookSearch.pageTitle` (injecting `Language` itself, same pattern as `BookCard`/`RecommendationCard` injecting their own dependencies rather than having the parent pass everything down), then a separator, then a `<span aria-current="page">{{ currentPageLabel() }}</span>` for the current page. The nav's own accessible name uses a new `breadcrumb.navigationLabel` translation key ("Breadcrumb" / "Brotkrumennavigation"), keeping it translated like every other user-facing/aria string in this app (e.g. the pagination arrows' `aria-label`s).
- **Separator**: a plain text `|` between the two segments (`<span aria-hidden="true"> | </span>`), consistent with this app's existing preference for plain text/characters over new iconography where one isn't already established (the `←` in the old back-link text was the same kind of choice).
- **Placement**: both `cart-page.html` and `impressum.html` render `<app-breadcrumb [currentPageLabel]="language.translate('cartPage.pageTitle')" />` (respectively `impressum.pageTitle`) as the first element inside their root `<section>`, directly before the existing `<h1 class="page-title">` — swapping the old order (title, then back-link) since the request places the breadcrumb above the title.
- **Removal**: the `.back-link` CSS block (identical in both `cart-page.css` and `impressum.css`), the `<a class="back-link">` markup, and the `cartPage.backToSearch`/`impressum.backToSearch` translation keys are deleted outright — this is a straight replacement, not a case needing a deprecation period or fallback.

## Risks / Trade-offs

- [A shared component adds a small level of indirection for what was two copies of one `<a>` tag] → Accepted: the project already shares near-identical card components (`BookCard`, `RecommendationCard`) across pages rather than duplicating markup, and a third consumer (any future page) would otherwise duplicate the breadcrumb markup a third time.
