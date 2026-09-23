## MODIFIED Requirements

### Requirement: Add to cart button on result card
The system SHALL display an "Add to cart" button on the result card when a search finds a matching book and a user is currently signed in. The button SHALL NOT be shown when no user is signed in.

#### Scenario: Add to cart button visible on found book
- **WHEN** a search request completes successfully, finds a matching book, and a user is signed in
- **THEN** an "Add to cart" button is visible on that book's result card

#### Scenario: Add to cart button hidden when signed out
- **WHEN** a search request completes successfully and finds a matching book, but no user is currently signed in
- **THEN** no "Add to cart" button is shown on that book's result card
