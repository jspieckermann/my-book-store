## ADDED Requirements

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
