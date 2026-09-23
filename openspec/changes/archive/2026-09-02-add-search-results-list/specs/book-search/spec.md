## REMOVED Requirements

### Requirement: Search result display
**Reason**: Reversed — the system now displays every matching book (paginated), not only the first. Superseded by the new "Search results list" and "Results pagination" requirements below.
**Migration**: See "Search results list" and "Results pagination" requirements.

## ADDED Requirements

### Requirement: Search results list
The system SHALL render every matching book as a vertical list of result cards in the results area when a search completes successfully and finds at least one matching book, up to the current page's set of results (see "Results pagination"). Each card SHALL show that book's available attributes — title, authors, publisher, published date, and description — as plain text, omitting (not showing as blank or as an error) any attribute absent from the API response.

#### Scenario: Multiple matches render as a vertical list
- **WHEN** a search request completes successfully and the API response contains more than one matching volume
- **THEN** each matching book on the current page is displayed as its own result card, stacked vertically in the results area below the filter section

#### Scenario: Single match still renders as a list of one
- **WHEN** a search request completes successfully and the API response contains exactly one matching volume
- **THEN** that book is displayed as a single result card in the results area

#### Scenario: Missing attributes are omitted gracefully per book
- **WHEN** a displayed book's data is missing one or more of the attributes
- **THEN** only the attributes that are present are shown for that book, with no placeholder or error text for the missing ones

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
