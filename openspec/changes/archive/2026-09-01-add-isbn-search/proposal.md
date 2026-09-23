## Why

The app currently has a header, footer, and a design system, but no way for a user to actually search for a book. An ISBN search bar that queries the Google Books API is the first real interactive feature and the foundation for future book-lookup functionality.

## What Changes

- Add a new standalone filter section component with a freetext input for an ISBN number and a search button.
- Make the filter section responsive: it adapts layout and sizing across mobile, tablet, and desktop viewport widths without horizontal overflow or clipping.
- On search button click (or submitting the input), send the entered ISBN to the Google Books API (`GET https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}`) and surface basic request status (loading while in flight, an inline error message on failure or network error) near the filter section.
- The search button SHALL be disabled while the input is empty/whitespace-only and while a request is already in flight, to prevent invalid or duplicate submissions.
- Style the filter section using the existing dark theme tokens from the `theming` capability, consistent with the header and footer.
- **Out of scope for this change**: rendering the returned book data (title, author, cover, etc.) is not part of this change — only the search input, button, and the API call/status feedback. Displaying results is explicitly deferred to a follow-on change.

## Capabilities

### New Capabilities
- `isbn-search`: Defines the ISBN filter section — its content (input + button), responsive layout, request behavior against the Google Books API, and basic loading/error status feedback (not full result rendering).

### Modified Capabilities
(none — this change consumes the existing `theming` tokens but does not change their requirements, and does not change `app-header` or `app-footer`)

## Impact

- **Code**: New filter component (e.g. `src/app/isbn-search/`), a new Angular service for the Google Books API call (e.g. `src/app/isbn-search/google-books.service.ts` or similar), `src/app/app.html` (filter section added between the header and `<router-outlet />`), `src/app/app.ts` (registers the new component), `src/app/app.config.ts` (adds `provideHttpClient()` for Angular's `HttpClient`, not currently configured).
- **Dependencies**: None new (uses Angular's built-in `@angular/common/http`), but `HttpClient` is not yet provided anywhere in the app, so app-level wiring is required.
- **Systems**: Calls the public, unauthenticated Google Books API `volumes` endpoint directly from the browser. No API key is configured or required for this change (Google allows limited, unauthenticated queries to this endpoint); adding a key for higher rate limits is out of scope.
- **Follow-on work**: Rendering/display of search results, ISBN format validation (checksum/length), and API key configuration are not part of this change.
