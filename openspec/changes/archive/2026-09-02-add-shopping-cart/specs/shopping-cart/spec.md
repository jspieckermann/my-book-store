## Purpose

Defines the shopping cart's minimal behavior for this stage of the app: accepting an added book, tracking a running total count, and displaying that count via a badge on a cart icon in the header. Viewing or managing the cart's contents is explicitly out of scope.

## ADDED Requirements

### Requirement: Cart icon with count badge
The system SHALL display a shopping cart icon on the right side of the header. The icon SHALL show a badge with the total number of books added to the cart when that count is greater than zero, and SHALL show no badge when the count is zero.

#### Scenario: Icon visible with no badge when cart is empty
- **WHEN** the application loads and no book has been added to the cart
- **THEN** the shopping cart icon is visible on the right side of the header with no count badge shown

#### Scenario: Badge shows current count after items are added
- **WHEN** one or more books have been added to the cart
- **THEN** the shopping cart icon displays a badge showing the total number of books added

### Requirement: Add book to cart
The system SHALL provide an "Add to cart" control on a found book's result card. Activating it SHALL add that book to the cart, increasing the total count shown in the header's badge by one.

#### Scenario: Adding a book increments the count
- **WHEN** a user activates the "Add to cart" control for a found book
- **THEN** the cart's total count increases by one and the header badge reflects the new count

#### Scenario: Adding the same book multiple times increments each time
- **WHEN** a user activates the "Add to cart" control multiple times, for the same or different books
- **THEN** the cart's total count increases by one for each activation

### Requirement: No cart viewing or management in this stage
The system SHALL NOT provide any way to open, view, edit, or remove items from the cart. The cart icon SHALL be a display-only indicator, not an interactive control that navigates or opens a view.

#### Scenario: Cart icon is not interactive
- **WHEN** a user looks for a way to view or change the cart's contents
- **THEN** no such control exists; the cart icon only displays the current count
