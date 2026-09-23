## ADDED Requirements

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
