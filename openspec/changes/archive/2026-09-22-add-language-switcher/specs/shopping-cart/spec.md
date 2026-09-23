## MODIFIED Requirements

### Requirement: Cart page title
The system SHALL display a small page title above the cart page's content, reading the localized text for "Your Cart", using the `theming` capability's typography tokens.

#### Scenario: Page title visible on the cart page
- **WHEN** the cart page loads
- **THEN** a small title reading the localized "Your Cart" text is visible above the cart page's content

#### Scenario: Page title reflects the selected language
- **WHEN** the current language is German
- **THEN** the page title shows the German translation of "Your Cart" instead of the English text
