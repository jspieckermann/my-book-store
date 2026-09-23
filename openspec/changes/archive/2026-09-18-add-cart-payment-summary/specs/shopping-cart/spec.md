## MODIFIED Requirements

### Requirement: PayPal-styled payment button
The system SHALL display a payment button styled to resemble PayPal's button (PayPal's yellow/gold color and "PayPal" wordmark) within a payment section at the bottom of the cart page, below the book list, when the cart contains one or more books. Activating the button SHALL have no effect — no payment processing, navigation, or network request occurs.

#### Scenario: Payment button visible below the cart list
- **WHEN** the cart page is viewed and the cart contains one or more books
- **THEN** a PayPal-styled payment button is visible within the payment section at the bottom of the page, below the book list

#### Scenario: Payment button hidden when cart is empty
- **WHEN** the cart page is viewed and the cart contains no books
- **THEN** no payment section or payment button is shown

#### Scenario: Activating the button has no effect
- **WHEN** the user activates the payment button
- **THEN** no payment processing, navigation, or network request occurs

## ADDED Requirements

### Requirement: Cart order summary
The system SHALL display, within the payment section, a summary showing the total number of items in the cart and their combined price, positioned above the payment button. The summary SHALL update immediately as books are added to or removed from the cart.

#### Scenario: Summary shows item count and total price
- **WHEN** the cart page is viewed and the cart contains one or more books
- **THEN** the payment section shows the total number of items in the cart and the sum of their prices

#### Scenario: Summary updates when the cart contents change
- **WHEN** a book is added to or removed from the cart while the cart page is displayed
- **THEN** the item count and total price shown in the payment section update to reflect the new cart contents

#### Scenario: No summary shown when cart is empty
- **WHEN** the cart page is viewed and the cart contains no books
- **THEN** no order summary is shown
