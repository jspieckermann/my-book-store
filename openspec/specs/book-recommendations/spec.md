# book-recommendations Specification

## Purpose

Defines the "same author" book recommendations shown on the cart page: how candidates are fetched, which are excluded, how they're displayed, and how the user navigates them.

## Requirements

### Requirement: Recommendations section visibility
The system SHALL display a recommendations section below the cart's book list when the cart contains one or more books and at least one recommended book is available. The system SHALL NOT render the section when the cart is empty, or when a recommendations fetch returns no results.

#### Scenario: Section shown when the cart has books and recommendations are available
- **WHEN** the cart contains one or more books and the recommendations fetch returns at least one book
- **THEN** the recommendations section is visible below the cart's book list

#### Scenario: Section hidden when the cart is empty
- **WHEN** the cart contains no books
- **THEN** the recommendations section is not rendered

#### Scenario: Section hidden when no recommendations are found
- **WHEN** the cart contains one or more books but the recommendations fetch returns no results
- **THEN** the recommendations section is not rendered

### Requirement: Recommendations are fetched by the cart's authors
The system SHALL request book recommendations from the Google Books API by querying the authors of the books currently in the cart, issuing one request per unique author and merging the results so that a book matching any of those authors is included. When the cart contains more than 5 unique authors, the system SHALL restrict the query to the first 5. The system SHALL exclude from the recommendations any book whose title matches (case-insensitively) a book already in the cart, and SHALL de-duplicate books whose title matches (case-insensitively) another already-included recommendation.

#### Scenario: One request per author, merged into one result
- **WHEN** the cart contains books by multiple distinct authors
- **THEN** one Google Books request is sent per unique author, and the recommendations shown combine matches from all of those requests

#### Scenario: Author count is capped
- **WHEN** the cart contains books by more than 5 unique authors
- **THEN** the request queries only the first 5 unique authors

#### Scenario: Books already in the cart are excluded
- **WHEN** a recommendations fetch returns a book whose title matches a book already in the cart
- **THEN** that book is not shown in the recommendations section

#### Scenario: A book matched by more than one author's request is shown only once
- **WHEN** the same book title is returned by more than one of the per-author requests
- **THEN** it appears only once in the merged recommendations

### Requirement: Recommendations refetch only when the cart's author set changes
The system SHALL refetch recommendations when the set of unique authors across the cart's books changes. The system SHALL NOT refetch when the cart changes in a way that leaves its set of unique authors unchanged.

#### Scenario: Adding a book by a new author triggers a refetch
- **WHEN** a book by an author not already represented in the cart is added to the cart
- **THEN** the recommendations are refetched

#### Scenario: Adding a book by an already-represented author does not trigger a refetch
- **WHEN** a book is added to the cart by an author who already has another book in the cart
- **THEN** the recommendations are not refetched

### Requirement: Minimal recommendation card content
The system SHALL display each recommended book using a card with a small, top-aligned cover image (when available) on the left and the title, author(s), price, and an icon-only add-to-cart control stacked on the right. The system SHALL NOT show a recommended book's publisher, published date, description, or rating on this card. The system SHALL truncate the title and author text with an ellipsis when longer than 50 characters, and SHALL NOT truncate text at or under 50 characters.

#### Scenario: Recommendation card shows a top-aligned cover on the left and title, author, price, and an add-to-cart control on the right
- **WHEN** a recommended book is displayed
- **THEN** its card shows a small cover image (if available), top-aligned, on the left, and the title, author(s), price, and an icon-only add-to-cart control stacked on the right, with no publisher, date, description, or rating shown

#### Scenario: Title or author text over 50 characters is truncated
- **WHEN** a recommended book's title or author text is longer than 50 characters
- **THEN** it is cut to 50 characters and an ellipsis is appended

#### Scenario: Title or author text at or under 50 characters is shown in full
- **WHEN** a recommended book's title or author text is 50 characters or fewer
- **THEN** it is shown unchanged, with no ellipsis appended

### Requirement: Adding a recommended book to the cart
The system SHALL add a recommended book to the cart when its add-to-cart control is activated, using the same behavior as adding a book from search results (including allowing the same book to be added more than once).

#### Scenario: Activating a recommendation's add-to-cart control adds it to the cart
- **WHEN** the user activates a recommended book's add-to-cart control
- **THEN** that book is added to the cart, increasing the cart's total count

#### Scenario: The same recommended book can be added more than once
- **WHEN** the user activates the same recommended book's add-to-cart control multiple times
- **THEN** the cart's total count increases by one for each activation

### Requirement: Paging through recommendations without scrollbars
The system SHALL display recommendations as a single row that is a fixed-size window of a larger fetched list, with Previous/Next controls that step through the list. The system SHALL NOT rely on a scrollbar for navigating the recommendations, and SHALL NOT wrap the cards onto more than one row. The Previous and Next controls SHALL remain visible and reachable at narrow viewport widths, with the cards in the row shrinking rather than wrapping or causing the page to overflow horizontally.

#### Scenario: Navigation controls remain visible at narrow viewport widths
- **WHEN** the recommendations section is displayed at a narrow viewport width
- **THEN** the cards stay in a single row, shrinking as needed, the Previous and Next controls stay fully within the viewport, and the page does not scroll horizontally

#### Scenario: Next control reveals the next window of recommendations
- **WHEN** more recommended books exist beyond the currently displayed window and the user activates the Next control
- **THEN** the display advances to the next window of recommended books

#### Scenario: Previous control reveals the prior window of recommendations
- **WHEN** the user activates the Previous control while viewing a window after the first
- **THEN** the display returns to the prior window of recommended books

#### Scenario: Previous control disabled on the first window
- **WHEN** the first window of recommendations is displayed
- **THEN** the Previous control is disabled

#### Scenario: Next control disabled on the last window
- **WHEN** the last window of recommendations is displayed
- **THEN** the Next control is disabled

#### Scenario: No paging controls when everything fits in one window
- **WHEN** the fetched recommendations all fit within a single window
- **THEN** no Previous/Next controls are shown
