# app-footer Specification

## Purpose

Defines the site footer shown at the bottom of every page: its content (the version number), how it lays out across viewport sizes, its non-sticky positioning, and its reduced visual prominence relative to the header.

## Requirements

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

### Requirement: Responsive layout
The footer SHALL remain fully visible and usable across mobile, tablet, and desktop viewport widths, without its content overflowing, clipping, or causing horizontal page scrolling.

#### Scenario: Narrow viewport
- **WHEN** the application is viewed at a mobile-width viewport (e.g. 320–480px wide)
- **THEN** the footer and its version text remain fully visible within the viewport width with no horizontal scrollbar and no clipped content

#### Scenario: Wide viewport
- **WHEN** the application is viewed at a desktop-width viewport (e.g. 1280px or wider)
- **THEN** the footer content is not stretched or misaligned in a way that harms readability

### Requirement: Footer not sticky
The system SHALL render the footer in normal document flow at the end of the page content; it SHALL NOT be pinned to the viewport (no sticky or fixed positioning).

#### Scenario: Footer scrolls with page content
- **WHEN** the page is scrolled
- **THEN** the footer moves with the page content rather than remaining pinned to the viewport

### Requirement: Reduced visual prominence
The footer SHALL be visually less prominent than the header: it SHALL use smaller text and a muted (secondary) text color rather than the header's primary title styling.

#### Scenario: Footer text is smaller and muted than header title
- **WHEN** the footer's text size and color are compared to the header title's text size and color
- **THEN** the footer's font size is smaller than the header title's font size, and the footer's text color is a muted/secondary color token rather than the header title's primary text color token

### Requirement: Theme consistency
The footer SHALL use the color and typography tokens defined by the `theming` capability rather than introducing new hardcoded colors or fonts.

#### Scenario: Footer colors and typography come from theme tokens
- **WHEN** the footer's background, text color, and font are inspected
- **THEN** each resolves to a value from the `theming` capability's design and typography tokens
