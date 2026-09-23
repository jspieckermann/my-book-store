## Purpose

Defines the site header shown at the top of every page: its content (book-themed logo and the "My-Book-Store" title), how it lays out across viewport sizes, and its visual consistency with the app's dark theme.

## ADDED Requirements

### Requirement: Header content
The system SHALL render a header at the top of the application containing a book-themed logo and the text "My-Book-Store" as the site title.

#### Scenario: Header renders on load
- **WHEN** the application loads any page
- **THEN** a header is visible at the top of the viewport containing a book-themed logo and the title "My-Book-Store"

#### Scenario: Title text is exact
- **WHEN** the header is rendered
- **THEN** the visible title text reads exactly "My-Book-Store"

### Requirement: Responsive layout
The header SHALL remain fully visible and usable across mobile, tablet, and desktop viewport widths, without the logo, title, or header container overflowing, clipping, or causing horizontal page scrolling.

#### Scenario: Narrow viewport
- **WHEN** the application is viewed at a mobile-width viewport (e.g. 320–480px wide)
- **THEN** the header, logo, and title remain fully visible within the viewport width with no horizontal scrollbar and no clipped or overlapping content

#### Scenario: Wide viewport
- **WHEN** the application is viewed at a desktop-width viewport (e.g. 1280px or wider)
- **THEN** the header content is not stretched edge-to-edge in a way that harms readability (e.g. the logo/title grouping stays reasonably positioned rather than becoming disproportionately spaced)

### Requirement: Theme consistency
The header SHALL use the color and typography tokens defined by the `theming` capability rather than introducing new hardcoded colors or fonts.

#### Scenario: Header colors come from theme tokens
- **WHEN** the header's background, text, and logo colors are inspected
- **THEN** each resolves to a value from the `theming` capability's design tokens (e.g. background/surface, text, accent)

#### Scenario: Header typography comes from theme tokens
- **WHEN** the header title's font family, size, and weight are inspected
- **THEN** they resolve to values from the `theming` capability's typography tokens

### Requirement: Header not sticky
The system SHALL render a header at the top of the application which is not sticky.

#### Scenario: Header renders on load
- **WHEN** the application scrolls
- **THEN** the header moves as well.
