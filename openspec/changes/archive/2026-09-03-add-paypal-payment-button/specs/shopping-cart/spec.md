## ADDED Requirements

### Requirement: PayPal-styled payment button
The system SHALL display a payment button styled to resemble PayPal's button (PayPal's yellow/gold color and "PayPal" wordmark) at the bottom of the cart page, below the book list, when the cart contains one or more books. Activating the button SHALL have no effect — no payment processing, navigation, or network request occurs.

#### Scenario: Payment button visible below the cart list
- **WHEN** the cart page is viewed and the cart contains one or more books
- **THEN** a PayPal-styled payment button is visible at the bottom of the page, below the book list

#### Scenario: Payment button hidden when cart is empty
- **WHEN** the cart page is viewed and the cart contains no books
- **THEN** no payment button is shown

#### Scenario: Activating the button has no effect
- **WHEN** the user activates the payment button
- **THEN** no payment processing, navigation, or network request occurs
