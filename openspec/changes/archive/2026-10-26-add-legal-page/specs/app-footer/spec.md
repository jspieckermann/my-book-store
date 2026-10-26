## MODIFIED Requirements

### Requirement: Footer content
The system SHALL render a footer at the bottom of the application containing the version number "1.0", a link to the Impressum page, and a link to the Legal page.

#### Scenario: Footer renders on load
- **WHEN** the application loads any page
- **THEN** a footer is visible at the bottom of the page content containing the version text "v1.0"

#### Scenario: Footer link navigates to the Impressum page
- **WHEN** the user activates the footer's Impressum link
- **THEN** the Impressum page is displayed

#### Scenario: Footer link navigates to the Legal page
- **WHEN** the user activates the footer's Legal link
- **THEN** the Legal page is displayed
