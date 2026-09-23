## ADDED Requirements

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
