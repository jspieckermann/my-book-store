## Purpose

Defines the book search filter section: a single freetext input accepting an ISBN, author, or title, and a search button, that queries the Google Books API — including its responsive layout, request status feedback, and how a found book's result is displayed (card, cover image, add-to-cart). This is the renamed, generalized successor to the retired `isbn-search` capability.

## ADDED Requirements

### Requirement: Filter section content
The system SHALL render a filter section containing a freetext input accepting an ISBN, author, or title, and a search button.

#### Scenario: Filter section renders on load
- **WHEN** the application loads any page
- **THEN** a filter section is visible containing a text input and a search button

### Requirement: Search triggers Google Books API request
The system SHALL send a request to the Google Books API using the entered search text when the user activates the search button or submits the input (e.g. pressing Enter while the input is focused). When the entered text matches an ISBN format (10 or 13 digits, optionally hyphenated, optionally ending in an "X" check digit), the request SHALL query by ISBN; otherwise the request SHALL send the entered text as a general search query.

#### Scenario: Search button sends the entered query
- **WHEN** the user enters text into the input and activates the search button
- **THEN** a request is sent to the Google Books API's volumes endpoint using the entered text as the search query

#### Scenario: Submitting the input triggers the same search
- **WHEN** the user enters text into the input and presses Enter while the input is focused
- **THEN** the same search request is sent as when activating the search button

#### Scenario: ISBN-formatted input queries by ISBN
- **WHEN** the entered text matches an ISBN format (10 or 13 digits, optionally hyphenated)
- **THEN** the request queries the Google Books API specifically by that ISBN

#### Scenario: Non-ISBN input queries generally
- **WHEN** the entered text does not match an ISBN format (e.g. an author name or a title)
- **THEN** the request sends the entered text as a general search query to the Google Books API

### Requirement: Search button disabled for invalid or in-flight state
The system SHALL disable the search button when the input is empty or contains only whitespace, and while a search request is already in flight.

#### Scenario: Empty input disables search
- **WHEN** the search input is empty or contains only whitespace
- **THEN** the search button is disabled

#### Scenario: In-flight request disables search
- **WHEN** a search request has been sent and a response has not yet been received
- **THEN** the search button is disabled until the request completes (successfully or with an error)

### Requirement: Request status feedback
The system SHALL indicate to the user when a search request is in progress, and SHALL display a visible error message near the filter section if the request fails (network error or non-success API response).

#### Scenario: Loading state shown during request
- **WHEN** a search request has been sent and a response has not yet been received
- **THEN** a loading indicator is visible near the filter section

#### Scenario: Error shown on request failure
- **WHEN** a search request fails (network error or the API returns a non-success response)
- **THEN** an error message is visible near the filter section describing that the search failed

#### Scenario: No result data rendered on success
- **WHEN** a search request completes successfully but the API response contains no matching volume
- **THEN** no book title, author, or other book attribute data is rendered — only the "Book not found" message is shown in the results area

### Requirement: Search result display
The system SHALL render the first matching book's available attributes — title, authors, publisher, published date, and description — as plain text in a results area below the filter section when a search completes successfully and finds at least one matching book. Only the first matching result SHALL be displayed. An attribute SHALL be omitted (not shown as blank or as an error) when it is absent from the API response.

#### Scenario: Book found displays available attributes
- **WHEN** a search request completes successfully and the API response contains at least one matching volume
- **THEN** the first matching book's available attributes (title, authors, publisher, published date, description) are displayed as text in the results area below the filter section

#### Scenario: Missing attributes are omitted gracefully
- **WHEN** the found book's data is missing one or more of the displayed attributes
- **THEN** only the attributes that are present are shown, with no placeholder or error text for the missing ones

#### Scenario: Additional matches beyond the first are not shown
- **WHEN** a search request completes successfully and the API response contains more than one matching volume
- **THEN** only the first matching volume's attributes are displayed; no list or indication of additional matches is shown

### Requirement: Book not found message
The system SHALL display the text "Book not found" in the results area when a search request completes successfully but the API response contains no matching volume.

#### Scenario: No matching volume displays not-found message
- **WHEN** a search request completes successfully and the API response contains no matching volume
- **THEN** the text "Book not found" is displayed in the results area below the filter section, and no attribute listing is shown

### Requirement: Responsive layout
The filter section SHALL remain fully visible and usable across mobile, tablet, and desktop viewport widths, without the input, button, or filter section container overflowing, clipping, or causing horizontal page scrolling.

#### Scenario: Narrow viewport
- **WHEN** the application is viewed at a mobile-width viewport (e.g. 320–480px wide)
- **THEN** the filter section, input, and search button remain fully visible within the viewport width with no horizontal scrollbar and no clipped or overlapping content

#### Scenario: Wide viewport
- **WHEN** the application is viewed at a desktop-width viewport (e.g. 1280px or wider)
- **THEN** the filter section content is not stretched edge-to-edge in a way that harms readability or usability

### Requirement: Theme consistency
The filter section SHALL use the color and typography tokens defined by the `theming` capability rather than introducing new hardcoded colors or fonts.

#### Scenario: Filter section colors and typography come from theme tokens
- **WHEN** the filter section's background, text, input, button, and error message colors and fonts are inspected
- **THEN** each resolves to a value from the `theming` capability's design and typography tokens

### Requirement: Result card layout
The system SHALL present a found book's attributes within a single, visually distinct card container in the results area, rather than an unstyled list.

#### Scenario: Found book renders inside a card
- **WHEN** a search request completes successfully and finds a matching book
- **THEN** the book's attributes are displayed within a single card-style container in the results area below the filter section

### Requirement: Book cover image
The system SHALL display the book's cover image within the result card when the Google Books API response includes one for the found book. Ratio of cover image shall be kept. When no cover image is available, the card SHALL render without an image slot, with no placeholder graphic or broken-image indicator.

#### Scenario: Cover image displayed when available
- **WHEN** a search request completes successfully, finds a matching book, and the API response includes a cover image for that book
- **THEN** the book's cover image is displayed within the result card

#### Scenario: No image slot when cover is unavailable
- **WHEN** a search request completes successfully, finds a matching book, and the API response includes no cover image for that book
- **THEN** the result card renders with no image element and no placeholder graphic

### Requirement: Add to cart button on result card
The system SHALL display an "Add to cart" button on the result card when a search finds a matching book.

#### Scenario: Add to cart button visible on found book
- **WHEN** a search request completes successfully and finds a matching book
- **THEN** an "Add to cart" button is visible on that book's result card

### Requirement: API key authentication
The system SHALL include a configured Google Books API key in requests to the Google Books API's volumes endpoint when a key is configured for the application, so requests use the key's own quota rather than the shared anonymous quota. When no key is configured, the system SHALL continue sending the request unauthenticated rather than failing to build or throwing at runtime.

#### Scenario: Configured key is included in requests
- **WHEN** a Google Books API key is configured for the application and a search is performed
- **THEN** the request sent to the Google Books API's volumes endpoint includes that key

#### Scenario: No key configured falls back to unauthenticated requests
- **WHEN** no Google Books API key is configured for the application and a search is performed
- **THEN** the request sent to the Google Books API's volumes endpoint has no key parameter, and the search still proceeds (subject to the existing loading/error/found/not-found behavior)
