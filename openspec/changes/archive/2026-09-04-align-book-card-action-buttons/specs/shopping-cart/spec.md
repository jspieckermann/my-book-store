## ADDED Requirements

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
