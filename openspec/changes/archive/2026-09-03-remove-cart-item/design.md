## Context

`Cart` (`src/app/cart/cart.ts`) stores `_books = signal<BookSummary[]>([])`; `add(book)` pushes a shallow copy (`{ ...book }`) on every call — a deliberate `add-cart-page` decision so that adding the same book twice produces two distinct object references, letting `cart-page.html`'s `@for (book of cart.books(); track book)` track each card correctly. `BookCard` (`src/app/book-card/book-card.ts`) already has a `showAddToCart` input following the "conditionally show a button, inject the service that button calls" pattern; `cart-page.html` renders it with `[showAddToCart]="false"`. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Remove exactly the one card the user clicked delete on — including when the cart holds multiple cards for the same book — never all cards matching that book's content.
- Reuse `BookCard`'s existing "own input flag, inject the service, call it directly" pattern (as `showAddToCart` already does) rather than introducing an output-event/parent-handles-it pattern just for this one new control.

**Non-Goals:**
- No undo/restore of a removed item — per proposal's Follow-on work.
- No change to how `add()` builds cart entries (shallow copies stay as-is; this change only adds a way to remove one).

## Decisions

**`Cart.remove(book: BookSummary)` filters by object reference identity (`this._books.update(books => books.filter(b => b !== book))`), not by content equality.**
Because `add()` already pushes a distinct shallow copy per activation, every array element is a unique object reference even when two entries have identical field values. `cart-page.html`'s `@for` loop hands `BookCard` the exact array-element reference via its `book` input, so calling `remove()` with that same reference removes only that element — filtering by content equality (e.g. comparing `title`/`authors`) would incorrectly remove every card for that book at once, which the spec's "Removing one of several identical books removes only that card" scenario explicitly rules out.
- *Alternative considered*: track cart entries by array index instead of object reference. Rejected — indexes shift as items are removed, and passing a live index into a child component that doesn't re-render synchronously with the array is more error-prone than reference identity, which needs no extra bookkeeping.

**`BookCard` gains a `showDelete = input(false)` alongside the existing `showAddToCart = input(true)`, and calls `cart.remove(book())` directly from a new delete button shown when `showDelete()` is true — no new `@Output()`.**
Matches the existing `showAddToCart`/`cart.add(book())` pattern exactly; `BookCard` already injects `Cart`, so no new wiring is needed beyond the one new input and button.
- *Alternative considered*: emit a `(delete)` output and let `CartPage` call `cart.remove()`. Rejected — inconsistent with how `showAddToCart` already handles its own service call internally; introducing a second pattern for a symmetrical case (delete vs. add) would be needless divergence.

**`cart-page.html` passes `[showDelete]="true"` (delete shown, add-to-cart hidden); `book-search.html`'s usage stays as `<app-book-card [book]="book" />`, leaving `showDelete` at its `false` default (no delete control on search result cards).**
Mirrors the existing `showAddToCart` split between the two pages exactly, just inverted.

## Risks / Trade-offs

- [Filtering by `!==` reference identity silently does nothing if some future caller ever passes a `book` value that isn't the exact array-element reference (e.g. a re-constructed copy)] → Mitigated: the only caller is `BookCard`, which receives `book` as a direct `@Input`/`input()` binding from the `@for` loop's own iteration variable, guaranteeing reference identity; no other call site exists.
