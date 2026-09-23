## Context

`Cart` (`src/app/cart/cart.ts`) currently exposes only `count: Signal<number>`, incremented by a parameterless `add()`. The Angular Router is already configured (`appConfig` in `app.config.ts` calls `provideRouter(routes)`, and `app.html` already renders `<router-outlet />`) but `app.routes.ts` is an empty array and `app.html` renders `<app-book-search />` unconditionally, outside the outlet — the router is present but unused. `book-search.html`'s `@for` loop renders each result as a `<li class="book-card">` containing cover image, attribute list, and (conditionally) an "Add to cart" button — this markup only exists in one place today. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Put the app's existing, currently-dormant router to use rather than inventing a parallel "page" mechanism (e.g. a hand-rolled visibility toggle) — this is what `provideRouter`/`RouterOutlet` are already there for.
- Extract the book-card markup into a shared component now that a second render site (the cart page) genuinely needs it — `add-search-results-list`'s design explicitly deferred this extraction "until a second place needs to render a book card," and that place now exists.

**Non-Goals:**
- No item identity/de-duplication logic for the cart — per proposal, duplicate additions of the same book simply appear as separate cards.
- No checkout, payment, or order-total UI — per proposal's explicit scope note.
- No cart persistence across reloads — unchanged from the existing shopping-cart behavior established in earlier changes.

## Decisions

**`app.routes.ts` gains two routes — `{ path: '', component: BookSearch }` and `{ path: 'cart', component: CartPage }` — and `app.html` drops the standalone `<app-book-search />`, relying solely on `<router-outlet />` between the header and footer.**
This is the natural use of the router scaffolding that's already configured but empty. The visible behavior at `/` is unchanged (the search UI still renders there); only *how* it renders changes (via the router instead of being hardcoded into `app.html`).
- *Alternative considered*: keep `book-search` outside the router and build the cart page as an in-component view toggle (a signal in `App` swapping between "search" and "cart" templates, no URL change). Rejected — the app already ships router infrastructure for exactly this kind of navigation; reinventing view-switching alongside an unused router would be duplicate machinery, and a real route gives the cart page a real, bookmarkable/back-button-friendly URL (`/cart`) essentially for free.

**A new `BookCard` component (`src/app/book-card/book-card.ts`) takes `@Input() book: BookSummary` and `@Input() showAddToCart = true`, renders the cover/attributes/optional "Add to cart" button, and injects `Cart`/`GoogleAuth` itself to wire the button's click.**
Both call sites (`book-search.html`'s `@for` and the new `cart-page.html`'s `@for`) keep owning their own `<li class="book-card">` wrapper and `<ul class="results-list">` (list semantics and layout stay page-level), and just render `<app-book-card [book]="book" />` (search results, default `showAddToCart`) or `<app-book-card [book]="book" [showAddToCart]="false" />` (cart page) inside it. Having `BookCard` inject `Cart`/`GoogleAuth` directly (rather than emitting an output event) matches how `Header` and `BookSearch` already inject services directly instead of threading callbacks.
- *Alternative considered*: keep the card markup duplicated in both templates. Rejected — the two would drift out of sync over time, and this is exactly the second-call-site condition the earlier design explicitly named as the trigger for extraction.

**`Cart` stores `BookSummary[]` instead of a bare count; `add(book: BookSummary)` pushes a shallow copy (`{ ...book }`), and `count` becomes `computed(() => this._books().length)` so `Header`'s existing `cart.count()` usage is unaffected.**
A shallow copy on each push guarantees every cart entry is a distinct object reference, even when the same book is added twice from the same still-rendered search result (which would otherwise push the same object reference twice, breaking `@for`'s `track book` identity requirement in the cart page). The sign-out effect changes from `this._count.set(0)` to `this._books.set([])`.
- *Alternative considered*: give each `BookSummary` a stable id (e.g. from Google's per-volume `id`, not currently captured) and track/de-duplicate by id. Rejected per the Non-Goals above — out of scope for this change, and not needed just to make `@for` tracking work.

**The header's cart icon is `<a class="cart" routerLink="/cart">...</a>` when `cart.count() > 0`, and stays the existing non-interactive `<span class="cart">...</span>` when it's `0`.**
Matches the spec's "interactive only when non-empty" requirement using a real link (correct semantics for cart-icon-navigation, and gets keyboard/focus behavior for free) rather than a `<button>` with a manual `router.navigate()` call.

**Note for archive/sync**: `openspec/specs/shopping-cart/spec.md`'s `## Purpose` still reads "Viewing or managing the cart's contents is explicitly out of scope" — this delta cannot touch `## Purpose` (it belongs to an existing capability), so it will need a direct hand-edit to the main spec at sync/archive time to stop contradicting the newly-added viewing capability.

## Risks / Trade-offs

- [Moving `book-search` into the router changes how `App`'s template is structured, which is a broader touch point than the cart feature itself] → Accepted; it's a small, mechanical move (one component reference relocated from a template to a route config) and is necessary to get a real "page" and "back" navigation without building a parallel mechanism.
- [Duplicate cart entries for the same book (per Non-Goals) may look odd to a user who adds the same title twice] → Accepted per proposal's explicit scope; can be revisited once the API layer captures a stable per-book id.
