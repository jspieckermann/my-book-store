## Why

The search is currently ISBN-only, which forces a user who doesn't have the ISBN in hand (the common case) to look it up elsewhere first. Accepting ISBN, author, or title in the same field removes that friction and is the natural next step now that a real result card exists to show whatever is found.

## What Changes

- Replace the ISBN-only text input with a general search field: the same one field now accepts an ISBN, an author name, or a title, and the search button (or Enter) submits whichever was typed.
- Update the query sent to the Google Books API: when the entered text looks like an ISBN (10 or 13 digits, optionally hyphenated, tolerant of a trailing "X" check digit), the request continues to use Google's `isbn:` query prefix for precise matching; any other input is sent as a general query, which Google's API already matches against title, author, and other metadata.
- Update the field's placeholder/label text (e.g. from "Enter ISBN" to something reflecting ISBN/author/title) so the UI reflects the new scope.
- Continue displaying only the first matching result — this is already this capability's existing behavior (`items[0]` of the API response) and does not change; called out here only to confirm it's not part of this change's scope.
- **BREAKING (internal rename, no external API/consumers affected)**: the capability, component, and related identifiers are renamed from "ISBN search" to "book search" throughout, since the feature is no longer ISBN-specific: capability path `isbn-search` → `book-search`, component `IsbnSearch`/`app-isbn-search` → `BookSearch`/`app-book-search`, folder `src/app/isbn-search/` → `src/app/book-search/`, and `GoogleBooks.searchByIsbn()` → a general search method. All other behavior this capability already had (result card, cover image, add-to-cart button, loading/error/not-found feedback, responsive layout, theme consistency, API key authentication) carries over unchanged under the new name.

## Capabilities

### New Capabilities
- `book-search`: The renamed, generalized successor to `isbn-search` — a single search field accepting ISBN, author, or title, all downstream behavior (result card, cover image, add-to-cart, status feedback, responsive layout, theme consistency, API key auth) carried over unchanged from `isbn-search`.

### Modified Capabilities
- `isbn-search`: Retired in full — every requirement is removed as part of this rename; its behavior continues under the new `book-search` capability above. (This change's `.openspec.yaml` sets `retire_capabilities: true` so archiving this change deletes `openspec/specs/isbn-search/spec.md`.)

## Impact

- **Code**: `src/app/isbn-search/` renamed to `src/app/book-search/` (component class, selector, file names); `google-books.ts` (query-construction logic changes to detect ISBN-like input vs. general text; the `searchByIsbn` method is renamed); `src/app/app.ts`/`app.html` (selector reference updated).
- **Dependencies**: None new — still the same Google Books `volumes` endpoint.
- **Systems**: Purely client-side query-construction and naming changes; no new external calls.
- **Follow-on work**: Showing more than the first matching result, and any ISBN-specific validation beyond the simple format heuristic used for query routing, are not part of this change.
