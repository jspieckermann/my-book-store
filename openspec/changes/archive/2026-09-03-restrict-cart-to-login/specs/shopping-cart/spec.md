## MODIFIED Requirements

### Requirement: Cart icon with count badge
The system SHALL display a shopping cart icon on the right side of the header when a user is signed in. The icon SHALL show a badge with the total number of books added to the cart when that count is greater than zero, and SHALL show no badge when the count is zero. The cart icon SHALL NOT be shown when no user is signed in.

#### Scenario: Icon visible with no badge when cart is empty
- **WHEN** a user is signed in, the application has loaded, and no book has been added to the cart
- **THEN** the shopping cart icon is visible on the right side of the header with no count badge shown

#### Scenario: Badge shows current count after items are added
- **WHEN** a user is signed in and one or more books have been added to the cart
- **THEN** the shopping cart icon displays a badge showing the total number of books added

#### Scenario: Cart icon hidden when signed out
- **WHEN** no user is currently signed in
- **THEN** the shopping cart icon is not shown anywhere in the header

## ADDED Requirements

### Requirement: Cart cleared on sign-out
The system SHALL reset the cart's total count to zero when a user signs out.

#### Scenario: Signing out clears the cart count
- **WHEN** a signed-in user with one or more books in the cart signs out
- **THEN** the cart's total count resets to zero
