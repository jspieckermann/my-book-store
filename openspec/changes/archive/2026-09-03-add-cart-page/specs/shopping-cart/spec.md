## REMOVED Requirements

### Requirement: No cart viewing or management in this stage
**Reason**: Reversed — the system now provides a dedicated cart page listing the cart's books. Editing or removing individual items remains unsupported, restated under the new "No cart item editing or removal in this stage" requirement below.
**Migration**: See "Cart page shows added books" and "No cart item editing or removal in this stage" requirements.

## ADDED Requirements

### Requirement: Cart page shows added books
The system SHALL display a dedicated cart page listing every book currently in the cart, each as a book card showing that book's available attributes and cover image (the same presentation as a search result card), with no "Add to cart" control on any card. When the cart has no books, the cart page SHALL display a message indicating the cart is empty instead of an empty list.

#### Scenario: Cart page lists the books in the cart
- **WHEN** the user navigates to the cart page and the cart contains one or more books
- **THEN** each book in the cart is displayed as its own book card on the cart page, with no "Add to cart" control

#### Scenario: Cart page shows an empty-cart message
- **WHEN** the user navigates to the cart page and the cart contains no books
- **THEN** a message indicating the cart is empty is displayed instead of a book list

### Requirement: Cart icon links to the cart page when non-empty
The system SHALL make the shopping cart icon in the header navigate to the cart page when activated, but only when the cart contains one or more books. When the cart is empty, the cart icon SHALL remain a non-interactive display-only indicator.

#### Scenario: Cart icon navigates to the cart page when non-empty
- **WHEN** the cart contains one or more books and the user activates the cart icon
- **THEN** the cart page is displayed

#### Scenario: Cart icon is not interactive when empty
- **WHEN** the cart contains no books
- **THEN** activating the cart icon has no effect; it remains a display-only indicator

### Requirement: Return to the main page from the cart page
The system SHALL provide a control on the cart page that navigates back to the main page.

#### Scenario: Back control returns to the main page
- **WHEN** the user activates the back control on the cart page
- **THEN** the main page is displayed

### Requirement: No cart item editing or removal in this stage
The system SHALL NOT provide any way to edit or remove individual items from the cart, in this stage.

#### Scenario: No edit or remove controls on the cart page
- **WHEN** the user views the cart page
- **THEN** no control exists to edit or remove any individual book from the cart
