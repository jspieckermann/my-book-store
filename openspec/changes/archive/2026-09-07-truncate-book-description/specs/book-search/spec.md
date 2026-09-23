## MODIFIED Requirements

### Requirement: Search results list
The system SHALL render every matching book as a vertical list of result cards in the results area when a search completes successfully and finds at least one matching book, up to the current page's set of results (see "Results pagination"). Each card SHALL show that book's available attributes — title, authors, publisher, published date, and description — as plain text, omitting (not showing as blank or as an error) any attribute absent from the API response. When a book's description is longer than 250 characters, only the first 250 characters (broken at the last whole word, followed by an ellipsis) SHALL be shown along with an icon-only control to expand the description to its full text; activating that control again SHALL collapse it back to the truncated form.

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
- **WHEN** a displayed book's description is 250 characters or fewer
- **THEN** the full description is shown as plain text, with no expand control present

#### Scenario: Long description is truncated with an expand control
- **WHEN** a displayed book's description is longer than 250 characters
- **THEN** only the first 250 characters of the description are shown, followed by an ellipsis, alongside an icon-only expand control

#### Scenario: Activating the expand control reveals the full description
- **WHEN** the user activates the expand control on a card whose description is truncated
- **THEN** the full description text is shown in place of the truncated text, and the control's icon changes to indicate it can now collapse the description

#### Scenario: Activating the control again re-collapses the description
- **WHEN** the user activates the expand control again on a card whose full description is currently shown
- **THEN** the description returns to its truncated form with the ellipsis and expand icon
