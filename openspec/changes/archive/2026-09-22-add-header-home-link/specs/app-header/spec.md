## MODIFIED Requirements

### Requirement: Header content
The system SHALL render a header at the top of the application containing a book-themed logo and the text "My-Book-Store" as the site title. The logo and title SHALL together form a single link that navigates to the main page when activated.

#### Scenario: Header renders on load
- **WHEN** the application loads any page
- **THEN** a header is visible at the top of the viewport containing a book-themed logo and the title "My-Book-Store"

#### Scenario: Title text is exact
- **WHEN** the header is rendered
- **THEN** the visible title text reads exactly "My-Book-Store"

#### Scenario: Activating the logo or title navigates to the main page
- **WHEN** the user activates the header's logo or title from any page
- **THEN** the main page is displayed

#### Scenario: Logo and title form a single link
- **WHEN** the header is rendered
- **THEN** the logo and the title are both part of one link control, not two separate links
