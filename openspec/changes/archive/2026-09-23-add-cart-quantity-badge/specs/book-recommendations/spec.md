## ADDED Requirements

### Requirement: Per-book cart quantity badge on recommendation card
The system SHALL display a badge next to the add-to-cart control on a recommendation card, showing the number of times that book is currently in the cart. The system SHALL NOT show the badge when that book is not currently in the cart. A recommended book is considered to be "in the cart" using the same case-insensitive, trimmed title comparison used elsewhere for recommendation cards.

#### Scenario: Badge hidden when the recommended book is not in the cart
- **WHEN** a recommendation card's book is not currently in the cart
- **THEN** no quantity badge is shown next to that card's add-to-cart control

#### Scenario: Badge shows the current count after the recommended book is added
- **WHEN** a user activates a recommendation card's add-to-cart control
- **THEN** a quantity badge showing 1 appears next to that card's add-to-cart control

#### Scenario: Badge count increases with each activation
- **WHEN** a user activates the same recommendation card's add-to-cart control additional times
- **THEN** the badge's shown count increases by one for each activation
