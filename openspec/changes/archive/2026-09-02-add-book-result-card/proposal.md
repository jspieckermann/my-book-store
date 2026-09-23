## Why

The found book's attributes are currently rendered as a plain definition list with no visual structure and no cover image, which reads more like debug output than a real book-store feature. A card-style presentation with the cover image makes a found result feel like an actual product listing.

## What Changes

- Wrap the found book's result (the existing title/authors/publisher/published-date/description attributes) in a single visually distinct card container in the results area, instead of the current unstyled definition list.
- Add the book's cover image to the card when the Google Books API response includes one (`volumeInfo.imageLinks`), using the largest available thumbnail Google returns for the volume.
- Ratio of cover image shall be kept
- When no cover image is available for the found book, the card SHALL render without an image slot — no placeholder graphic or broken-image icon — consistent with how the existing attribute list already omits attributes that are absent from the response.
- Style the card using the existing dark theme tokens from the `theming` capability, consistent with the rest of the app.
- Continue to only change the *found-book* presentation — the "Book not found" and error/loading messages are unaffected and remain plain text, per `add-isbn-search-results`'s existing scope.

## Capabilities

### Modified Capabilities
- `isbn-search`: Adds new requirements for a card-style container and cover image display for the found-book result (via ADDED delta blocks — the existing "Search result display" requirement's text-attribute behavior is unchanged).

### New Capabilities
(none)

## Impact

- **Code**: `src/app/isbn-search/google-books.ts` (extract a cover image URL from the API response into `BookSummary`), `src/app/isbn-search/isbn-search.html`/`.css` (card layout, `<img>` element for the cover).
- **Dependencies**: None new.
- **Systems**: Still the same Google Books `volumes` endpoint; the cover image itself loads directly from Google's image CDN (`books.google.com`) referenced in the API response, not a new endpoint this app calls.
- **Follow-on work**: A placeholder/fallback graphic for books without a cover, image loading/error states (e.g. a broken image URL), and lazy-loading are not part of this change.
