## Context

`add-isbn-search` built the `GoogleBooks` service and `IsbnSearch` component with a deliberate design decision to discard the API response entirely — `searchByIsbn()` returns `Observable<void>`, and the component only tracks an `'idle' | 'loading' | 'error'` status. That decision is now being reversed by this change. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Extend the existing `GoogleBooks` service and `IsbnSearch` component (not a new component) — this is the same feature area continuing to evolve, matching how the proposal frames it as a modification rather than a new capability.
- Keep the result model minimal: only the fields actually displayed (title, authors, publisher, published date, description), not the full raw Google Books API response shape.
- Distinguish three outcomes clearly in the component's state: request failed (existing `error` status, unchanged), request succeeded with no match (new "not found" outcome), and request succeeded with a match (new "found" outcome with data to render).

**Non-Goals:**
- No cover image/thumbnail rendering, no multi-result list, no rich text/HTML rendering of the description — plain text only, per proposal's explicit "first step" and Follow-on work scope.
- No caching of previous search results between searches — each new search replaces whatever was previously displayed.

## Decisions

**Extend `SearchStatus` to a discriminated union carrying result data, rather than adding a separate `result` field alongside `status`.**
Using `type SearchStatus = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error' } | { kind: 'not-found' } | { kind: 'found'; book: BookSummary }` (or equivalent) makes illegal states unrepresentable — the template can never end up with both an error message and book data present at once, which was possible with separate `status` + `result` fields. This directly serves the spec's requirement that the results area shows exactly one of: nothing, loading, error, "Book not found", or the book's attributes.
- *Alternative considered*: keep `status: 'idle' | 'loading' | 'error' | 'not-found' | 'found'` as a plain string plus a separate `result = signal<BookSummary | null>(null)`. Rejected because it allows inconsistent combinations (e.g. `status: 'error'` with a stale `result` still set) that the template would need to defensively guard against.

**`GoogleBooks.searchByIsbn()` returns `Observable<BookSummary | null>`** (`null` meaning "no match"), instead of the current `Observable<void>`.
The service already parses the HTTP response; extracting a minimal `BookSummary` (title, authors, publisher, publishedDate, description — mapped from the Google Books API's `items[0].volumeInfo`) and returning `null` when `items` is absent/empty keeps the response-shape knowledge in the service (matching `add-isbn-search`'s original separation-of-concerns rationale) rather than leaking the raw Google Books JSON shape into the component.
- *Alternative considered*: have the component inspect the raw HTTP response itself. Rejected — this is exactly the coupling the service layer exists to avoid, and it would leak Google's API response shape into the component.

**`BookSummary` is a small, local interface (not the full Google Books `Volume` type), with all fields optional except none guaranteed.**
Only `title`, `authors`, `publisher`, `publishedDate`, and `description` are extracted — matching the proposal's explicit attribute list. All are typed as optional (`string | undefined` / `string[] | undefined`) since Google Books does not guarantee any field's presence, which is what drives the "omit missing attributes gracefully" requirement.
- *Alternative considered*: use `@types/gapi.books` or hand-roll the full `Volume` interface. Rejected as unnecessary — the component only ever needs five fields, and a minimal interface keeps the "what does this component actually use" surface obvious.

**"Not found" is derived from `items` being absent or empty, not from HTTP status.**
The Google Books `volumes` endpoint returns HTTP 200 with `totalItems: 0` (and no `items` array) when nothing matches — it does not return a 404. So "not found" is a successful-response case handled in the service's success mapping, while genuine HTTP errors (network failure, non-2xx, including the rate-limit 429 seen during `add-isbn-search`'s testing) continue to flow through the existing `error` path unchanged.

**Results area reuses the same template region as the existing loading/error messages, rendered via the discriminated status.**
The spec calls out that "Book not found" appears in the same area as a found book's attributes, and design continues to keep it "near the filter section" like the existing loading/error feedback. A single `@switch` (or equivalent) on the status `kind` in `isbn-search.html` renders exactly one of: nothing (idle), loading indicator, error message, "Book not found", or the attribute list — never more than one at a time, reinforcing the discriminated-union decision above.

## Risks / Trade-offs

- [`BookSummary`'s fixed five-field shape will need extending for any future attribute (e.g. page count, cover image) — a follow-on change] → Acceptable; the service's mapping function is the single place to extend, and the component template only needs a new conditional block per new field.
- [Multiple matching volumes for one ISBN (rare but possible) are collapsed to "the first result" with no indication to the user that other matches exist] → Acceptable per proposal's Follow-on work (multi-result list is explicitly deferred); a single ISBN query realistically matches at most one real-world edition in the vast majority of cases.
