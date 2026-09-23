# shopping-cart Specification

## Purpose

Defines the shopping cart's behavior: accepting an added book, tracking the books added, displaying a running count via a badge on a cart icon in the header, and letting the user view the cart's contents on a dedicated cart page reachable from that icon. Editing or removing individual items from the cart is explicitly out of scope for this stage.

## Requirements

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

### Requirement: Cart cleared on sign-out
The system SHALL reset the cart's total count to zero when a user signs out.

#### Scenario: Signing out clears the cart count
- **WHEN** a signed-in user with one or more books in the cart signs out
- **THEN** the cart's total count resets to zero

### Requirement: Add book to cart
The system SHALL provide an "Add to cart" control on a found book's result card. Activating it SHALL add that book to the cart, increasing the total count shown in the header's badge by one.

#### Scenario: Adding a book increments the count
- **WHEN** a user activates the "Add to cart" control for a found book
- **THEN** the cart's total count increases by one and the header badge reflects the new count

#### Scenario: Adding the same book multiple times increments each time
- **WHEN** a user activates the "Add to cart" control multiple times, for the same or different books
- **THEN** the cart's total count increases by one for each activation

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

### Requirement: Cart page title
The system SHALL display a small page title above the cart page's content, reading the localized text for "Your Cart", using the `theming` capability's typography tokens.

#### Scenario: Page title visible on the cart page
- **WHEN** the cart page loads
- **THEN** a small title reading the localized "Your Cart" text is visible above the cart page's content

#### Scenario: Page title reflects the selected language
- **WHEN** the current language is German
- **THEN** the page title shows the German translation of "Your Cart" instead of the English text

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

### Requirement: Cart action controls use consistent icon-based buttons
The "Add to cart" control and the cart page's delete control SHALL each be rendered as an icon-only button: "Add to cart" SHALL show a shopping-cart icon matching the icon used for the header's cart indicator, and the delete control SHALL show its existing delete/trash icon. Both controls SHALL share the same button appearance (size, padding, border, and background), differing only in the icon displayed, and each SHALL expose an accessible name describing its action for users relying on assistive technology.

#### Scenario: Add-to-cart control shows a cart icon instead of text
- **WHEN** a user views a found book's result card
- **THEN** the "Add to cart" control is displayed as an icon-only button showing a shopping-cart icon, with no visible text label

#### Scenario: Add-to-cart and delete controls share the same button appearance
- **WHEN** a user compares the "Add to cart" control on a search result card with the delete control on a cart page card
- **THEN** both controls have the same size, padding, border, and background styling, differing only in the icon shown

#### Scenario: Icon-only controls remain accessible
- **WHEN** a screen reader user encounters the "Add to cart" control or the delete control
- **THEN** each control exposes an accessible name describing its action ("Add to cart" / "Remove from cart")
