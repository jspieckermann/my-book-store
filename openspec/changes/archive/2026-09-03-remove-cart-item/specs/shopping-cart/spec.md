## REMOVED Requirements

### Requirement: No cart item editing or removal in this stage
**Reason**: Reversed — the system now provides a delete control on each book card on the cart page. Editing (a book's details or quantity) remains unsupported, restated under the new "No cart item editing in this stage" requirement below.
**Migration**: See "Remove book from cart" and "No cart item editing in this stage" requirements.

## ADDED Requirements

### Requirement: Remove book from cart
The system SHALL display a delete control on each book card on the cart page. Activating a book's delete control SHALL remove that book from the cart, updating the cart page's list and the cart count shown in the header immediately.

#### Scenario: Delete control visible on each cart card
- **WHEN** the user views the cart page and the cart contains one or more books
- **THEN** each book card on the cart page shows a delete control

#### Scenario: Activating delete removes that book
- **WHEN** the user activates a book card's delete control on the cart page
- **THEN** that book is removed from the cart, the cart page's list no longer shows it, and the header's cart count decreases by one

#### Scenario: Removing the last book shows the empty-cart message
- **WHEN** the user removes the only book remaining in the cart
- **THEN** the cart page shows the empty-cart message instead of an empty list

#### Scenario: Removing one of several identical books removes only that card
- **WHEN** the same book was added to the cart more than once and the user activates the delete control on one of its cards
- **THEN** only that one card is removed; the other card(s) for the same book remain in the cart

### Requirement: No cart item editing in this stage
The system SHALL NOT provide any way to edit an individual item's details or quantity in the cart, in this stage.

#### Scenario: No edit controls on the cart page
- **WHEN** the user views the cart page
- **THEN** no control exists to edit any individual book's details or quantity in the cart
