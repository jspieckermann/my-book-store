## MODIFIED Requirements

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

### Requirement: Book not found message
The system SHALL display the localized text for "Book not found" in the results area when a search request completes successfully but the API response contains no matching volume.

#### Scenario: No matching volume displays not-found message
- **WHEN** a search request completes successfully and the API response contains no matching volume
- **THEN** the localized "Book not found" text is displayed in the results area below the filter section, and no attribute listing is shown

#### Scenario: Not-found message reflects the selected language
- **WHEN** the current language is German and a search completes with no matching volume
- **THEN** the German translation of "Book not found" is displayed instead of the English text

### Requirement: Page title
The system SHALL display a small page title above the filter section on the main page, reading the localized text for "Search", using the `theming` capability's typography tokens.

#### Scenario: Page title visible on the main page
- **WHEN** the main page loads
- **THEN** a small title reading the localized "Search" text is visible above the filter section

#### Scenario: Page title reflects the selected language
- **WHEN** the current language is German
- **THEN** the page title shows the German translation of "Search" instead of the English text
