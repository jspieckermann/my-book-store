## Purpose

Defines the shared breadcrumb trail shown above a page's title on pages one level below the main page, letting the user see their location and navigate back to the main page.

## ADDED Requirements

### Requirement: Breadcrumb trail shown above the page title
The system SHALL display a breadcrumb trail directly above a page's `<h1>` title, consisting of a link back to the main page followed by the current page's title. The link back to the main page SHALL use the main page's own title as its label. The current page's title in the trail SHALL NOT be a link, and SHALL be identifiable as the current page to assistive technology.

#### Scenario: Breadcrumb trail appears above the page title
- **WHEN** a page that has a breadcrumb trail is displayed
- **THEN** the breadcrumb trail is rendered directly above that page's `<h1>` title

#### Scenario: Breadcrumb trail shows a link to the main page and the current page
- **WHEN** the breadcrumb trail is displayed
- **THEN** it shows the main page's title as a link to the main page, followed by the current page's title, which is not a link

### Requirement: Activating the breadcrumb's main-page link navigates there
The system SHALL navigate to the main page when the breadcrumb trail's main-page link is activated.

#### Scenario: Activating the main-page link navigates to the main page
- **WHEN** the user activates the breadcrumb trail's main-page link
- **THEN** the main page is displayed
