## Why

The ISBN filter section (`add-isbn-search`) currently sends the search request but deliberately discards the response — nothing about the found book is ever shown, and a successful "book not found" response looks identical to a successful match. Users need to actually see what they searched for.

## What Changes

- Display the search result below the filter section, in the same area used for the existing loading/error status feedback.
- On a successful search that finds a book, show a purely textual listing of its attributes: title, authors, publisher, published date, and description (each shown only when present in the API response — Google Books does not guarantee any of these fields are populated).
- On a successful search that finds no book (the API responds successfully but with zero results), show the text "Book not found" in the same results area instead of an attribute listing.
- **BREAKING** (internal only, no external API/consumers affected): reverses `isbn-search`'s existing "Request status feedback" requirement, which currently states the system SHALL NOT render the returned book data — this change makes rendering that data the whole point. The `GoogleBooksService`'s method changes from returning `Observable<void>` to returning the book data (or a not-found indicator) needed to render it.
- No visual/graphic result (e.g. cover thumbnail) is rendered — text only, per the explicit "first step" scope from the request.

## Capabilities

### Modified Capabilities
- `isbn-search`: The "Request status feedback" requirement is modified — the existing loading/error scenarios are preserved, but the "no result data rendered" scenario is replaced with new requirements for rendering the found book's attributes or a "Book not found" message in the results area below the filter section.

### New Capabilities
(none — this is a direct extension of the existing `isbn-search` capability's behavior, not a separate concern)

## Impact

- **Code**: `src/app/isbn-search/google-books.ts` (service method now returns the parsed book data or a not-found signal instead of discarding the response), `src/app/isbn-search/isbn-search.ts`/`.html`/`.css` (new results-rendering state and template section).
- **Dependencies**: None new.
- **Systems**: Still calls the same public, unauthenticated Google Books `volumes` endpoint from `add-isbn-search` — no new external calls or endpoints.
- **Follow-on work**: Displaying a cover image/thumbnail, showing multiple results when a query matches more than one volume, and richer formatting (e.g. Markdown/HTML in the description) are not part of this change.
