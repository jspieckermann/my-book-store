## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Search result display
The system SHALL render the found book's available attributes — title, authors, publisher, published date, and description — as plain text in a results area below the filter section when a search completes successfully and finds a matching book. An attribute SHALL be omitted (not shown as blank or as an error) when it is absent from the API response.

#### Scenario: Book found displays available attributes
- **WHEN** a search request completes successfully and the API response contains at least one matching volume
- **THEN** the found book's available attributes (title, authors, publisher, published date, description) are displayed as text in the results area below the filter section

#### Scenario: Missing attributes are omitted gracefully
- **WHEN** the found book's data is missing one or more of the displayed attributes
- **THEN** only the attributes that are present are shown, with no placeholder or error text for the missing ones

### Requirement: Book not found message
The system SHALL display the text "Book not found" in the results area when a search request completes successfully but the API response contains no matching volume.

#### Scenario: No matching volume displays not-found message
- **WHEN** a search request completes successfully and the API response contains no matching volume
- **THEN** the text "Book not found" is displayed in the results area below the filter section, and no attribute listing is shown
