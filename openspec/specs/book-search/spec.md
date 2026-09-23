# book-search Specification

## Purpose

Defines the book search filter section: a single freetext input accepting an ISBN, author, or title, and a search button, that queries the Google Books API — including its responsive layout, request status feedback, and how a found book's result is displayed (card, cover image, add-to-cart). This is the renamed, generalized successor to the retired `isbn-search` capability.

## Requirements

### Requirement: Filter section content
The system SHALL render a filter section containing a freetext input accepting an ISBN, author, or title, and a search button.

#### Scenario: Filter section renders on load
- **WHEN** the application loads any page
- **THEN** a filter section is visible containing a text input and a search button

### Requirement: Search triggers Google Books API request
The system SHALL send a request to the Google Books API using the entered search text when the user activates the search button or submits the input (e.g. pressing Enter while the input is focused). When the entered text matches an ISBN format (10 or 13 digits, optionally hyphenated, optionally ending in an "X" check digit), the request SHALL query by ISBN; otherwise the request SHALL send the entered text as a general search query. Every request SHALL restrict results to the currently selected language using the Google Books API's own language-restriction parameter. A search currently being displayed SHALL be re-sent with the newly selected language's restriction whenever the user changes the language.

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

#### Scenario: Request is restricted to the currently selected language
- **WHEN** a search request is sent
- **THEN** the request includes a language restriction matching the currently selected UI language

#### Scenario: Changing the language re-sends a currently displayed search
- **WHEN** search results are currently displayed and the user changes the selected language
- **THEN** the same search is re-sent restricted to the newly selected language, and the displayed results update accordingly

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

### Requirement: Search results list
The system SHALL render every matching book as a vertical list of result cards in the results area when a search completes successfully and finds at least one matching book, up to the current page's set of results (see "Results pagination"). Each card SHALL show that book's available attributes — title, authors, publisher, published date, and description — as plain text, omitting (not showing as blank or as an error) any attribute absent from the API response. When a book's description is longer than 350 characters, only the first 350 characters (broken at the last whole word, followed by an ellipsis) SHALL be shown, followed on its own line by a control combining a chevron icon and the localized text for "Read more" that expands the description to its full text; activating that control again SHALL collapse it back to the truncated form, at which point the control's text SHALL read the localized text for "Read less" while expanded and revert to the localized text for "Read more" once collapsed.

#### Scenario: Multiple matches render as a vertical list
- **WHEN** a search request completes successfully and the API response contains more than one matching volume
- **THEN** each matching book on the current page is displayed as its own result card, stacked vertically in the results area below the filter section

#### Scenario: Single match still renders as a list of one
- **WHEN** a search request completes successfully and the API response contains exactly one matching volume
- **THEN** that book is displayed as a single result card in the results area

#### Scenario: Missing attributes are omitted gracefully per book
- **WHEN** a displayed book's data is missing one or more of the attributes
- **THEN** only the attributes that are present are shown for that book, with no placeholder or error text for the missing ones

#### Scenario: Short description renders in full with no expand control
- **WHEN** a displayed book's description is 350 characters or fewer
- **THEN** the full description is shown as plain text, with no expand control present

#### Scenario: Long description is truncated with an expand control
- **WHEN** a displayed book's description is longer than 350 characters
- **THEN** only the first 350 characters of the description are shown, followed by an ellipsis, with a chevron-and-"Read more" control shown on its own line below the truncated text

#### Scenario: Activating the expand control reveals the full description
- **WHEN** the user activates the "Read more" control on a card whose description is truncated
- **THEN** the full description text is shown in place of the truncated text, and the control's text changes to "Read less" with its chevron pointing the opposite direction

#### Scenario: Activating the control again re-collapses the description
- **WHEN** the user activates the "Read less" control on a card whose full description is currently shown
- **THEN** the description returns to its truncated form with the ellipsis, and the control's text reverts to "Read more" with its chevron pointing back to its original direction

#### Scenario: Expand/collapse control text reflects the selected language
- **WHEN** the current language is German and a book's description is truncated
- **THEN** the expand control shows the German translation of "Read more" (and "Read less" once expanded), instead of the English text

### Requirement: Results pagination
The system SHALL limit the results list to at most 10 books per page, and SHALL display pagination controls (Previous/Next) below the results list when more matching books exist than fit on a single page. Submitting a new search SHALL always start at the first page.

#### Scenario: First page shows at most 10 results
- **WHEN** a search matches more than 10 books
- **THEN** the results list initially shows only the first 10 matching books

#### Scenario: Pagination controls hidden when everything fits on one page
- **WHEN** a search matches 10 or fewer books
- **THEN** no pagination controls are shown below the results list

#### Scenario: Pagination controls shown when more results exist
- **WHEN** a search matches more than 10 books
- **THEN** pagination controls are visible below the results list

#### Scenario: Number of overall pages in Pagination controls shown when more results exist
- **WHEN** a search matches more than 10 books
- **THEN** pagination controls must show the total number of pages

#### Scenario: Next page shows the next set of results
- **WHEN** the user activates the "Next" pagination control and further matching books exist beyond the current page
- **THEN** the results list is replaced with the next page's set of up to 10 matching books

#### Scenario: Previous page shows the prior set of results
- **WHEN** the user activates the "Previous" pagination control while viewing a page after the first
- **THEN** the results list is replaced with the prior page's set of up to 10 matching books

#### Scenario: Previous control disabled on the first page
- **WHEN** the results list is showing the first page
- **THEN** the "Previous" pagination control is disabled

#### Scenario: Next control disabled on the last page
- **WHEN** the results list is showing the last page of matching books
- **THEN** the "Next" pagination control is disabled

#### Scenario: New search resets to the first page
- **WHEN** the user submits a new search after having navigated to a later page of a previous search's results
- **THEN** the new search's results list starts at the first page

### Requirement: Book not found message
The system SHALL display the localized text for "Book not found" in the results area when a search request completes successfully but the API response contains no matching volume.

#### Scenario: No matching volume displays not-found message
- **WHEN** a search request completes successfully and the API response contains no matching volume
- **THEN** the localized "Book not found" text is displayed in the results area below the filter section, and no attribute listing is shown

#### Scenario: Not-found message reflects the selected language
- **WHEN** the current language is German and a search completes with no matching volume
- **THEN** the German translation of "Book not found" is displayed instead of the English text

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

### Requirement: Average rating display
The system SHALL display a found book's average rating and ratings count on its result card when the Google Books API response includes both for that book. The rating SHALL be shown as a row of star icons in the top-right corner of the card, rounded to the nearest whole star out of five, followed by the total number of ratings in brackets. When the API response does not include a rating for a book, no rating indicator SHALL be shown for that book (no placeholder or zero-star indicator).

#### Scenario: Rating displayed when available
- **WHEN** a search request completes successfully, finds a matching book, and the API response includes an average rating and ratings count for that book
- **THEN** a row of star icons representing the rating, rounded to the nearest whole star, is displayed in the top-right corner of the result card, followed by the ratings count in brackets

#### Scenario: Rating rounds to the nearest whole star
- **WHEN** a book's average rating is not a whole number (e.g. 3.6)
- **THEN** the displayed star icons reflect that rating rounded to the nearest whole star (e.g. 4 filled stars)

#### Scenario: No rating indicator when rating data is absent
- **WHEN** a search request completes successfully, finds a matching book, and the API response does not include an average rating and ratings count for that book
- **THEN** no rating indicator, placeholder, or zero-star display is shown on that book's result card

#### Scenario: Rating shown on cart page cards
- **WHEN** a book with rating data is displayed as a card on the cart page
- **THEN** the same star-and-count rating indicator is shown in the top-right corner of that card, consistent with its appearance on a search result card

### Requirement: Book price display
The system SHALL display a price for every found book, generated as a random value between 10.00 € and 70.50 € (inclusive) when the book is first mapped from the API response. The price SHALL be shown without a label, in a bold, visually prominent font size, positioned directly above the card's action button (the "Add to cart" control on a search result card, or the delete control on a cart page card).

#### Scenario: Price shown on a search result card
- **WHEN** a search request completes successfully and finds a matching book
- **THEN** that book's result card displays a price, with no label, in bold text above the "Add to cart" button

#### Scenario: Price shown on a cart page card
- **WHEN** a book is displayed as a card on the cart page
- **THEN** that book's card displays the same price it had on its search result card, with no label, in bold text above the delete control

#### Scenario: Price stays within the defined range
- **WHEN** any book's displayed price is inspected
- **THEN** the price is between 10.00 € and 70.50 € inclusive

### Requirement: Add to cart button on result card
The system SHALL display an "Add to cart" button on the result card when a search finds a matching book and a user is currently signed in. The button SHALL NOT be shown when no user is signed in.

#### Scenario: Add to cart button visible on found book
- **WHEN** a search request completes successfully, finds a matching book, and a user is signed in
- **THEN** an "Add to cart" button is visible on that book's result card

#### Scenario: Add to cart button hidden when signed out
- **WHEN** a search request completes successfully and finds a matching book, but no user is currently signed in
- **THEN** no "Add to cart" button is shown on that book's result card

### Requirement: Per-book cart quantity badge on result card
The system SHALL display a badge next to the "Add to cart" control on a search result card, showing the number of times that book is currently in the cart. The system SHALL NOT show the badge when that book is not currently in the cart. A book on a result card is considered to be "in the cart" when its title matches, case-insensitively and with whitespace trimmed, the title of a book already in the cart.

#### Scenario: Badge hidden when the book is not in the cart
- **WHEN** a search result card's book is not currently in the cart
- **THEN** no quantity badge is shown next to that card's "Add to cart" control

#### Scenario: Badge shows the current count after the book is added
- **WHEN** a user activates the "Add to cart" control for a found book
- **THEN** a quantity badge showing 1 appears next to that card's "Add to cart" control

#### Scenario: Badge count increases with each activation
- **WHEN** a user activates the same result card's "Add to cart" control additional times
- **THEN** the badge's shown count increases by one for each activation

### Requirement: API key authentication
The system SHALL include a configured Google Books API key in requests to the Google Books API's volumes endpoint when a key is configured for the application, so requests use the key's own quota rather than the shared anonymous quota. When no key is configured, the system SHALL continue sending the request unauthenticated rather than failing to build or throwing at runtime.

#### Scenario: Configured key is included in requests
- **WHEN** a Google Books API key is configured for the application and a search is performed
- **THEN** the request sent to the Google Books API's volumes endpoint includes that key

#### Scenario: No key configured falls back to unauthenticated requests
- **WHEN** no Google Books API key is configured for the application and a search is performed
- **THEN** the request sent to the Google Books API's volumes endpoint has no key parameter, and the search still proceeds (subject to the existing loading/error/found/not-found behavior)

### Requirement: Page title
The system SHALL display a small page title above the filter section on the main page, reading the localized text for "Search", using the `theming` capability's typography tokens.

#### Scenario: Page title visible on the main page
- **WHEN** the main page loads
- **THEN** a small title reading the localized "Search" text is visible above the filter section

#### Scenario: Page title reflects the selected language
- **WHEN** the current language is German
- **THEN** the page title shows the German translation of "Search" instead of the English text
