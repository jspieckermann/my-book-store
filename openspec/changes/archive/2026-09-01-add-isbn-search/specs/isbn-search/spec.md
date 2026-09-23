## Purpose

Defines the ISBN filter section: a freetext ISBN input and search button that queries the Google Books API, including its responsive layout and basic request status feedback. Rendering the returned book data is explicitly out of scope for this capability.

## ADDED Requirements

### Requirement: Filter section content
The system SHALL render a filter section containing a freetext input for an ISBN number and a search button.

#### Scenario: Filter section renders on load
- **WHEN** the application loads any page
- **THEN** a filter section is visible containing a text input and a search button

### Requirement: Search triggers Google Books API request
The system SHALL send a request to the Google Books API using the entered ISBN when the user activates the search button or submits the input (e.g. pressing Enter while the input is focused).

#### Scenario: Search button sends the entered ISBN
- **WHEN** the user enters an ISBN into the input and activates the search button
- **THEN** a request is sent to the Google Books API's volumes endpoint with the entered ISBN as the search query

#### Scenario: Submitting the input triggers the same search
- **WHEN** the user enters an ISBN into the input and presses Enter while the input is focused
- **THEN** the same search request is sent as when activating the search button

### Requirement: Search button disabled for invalid or in-flight state
The system SHALL disable the search button when the input is empty or contains only whitespace, and while a search request is already in flight.

#### Scenario: Empty input disables search
- **WHEN** the ISBN input is empty or contains only whitespace
- **THEN** the search button is disabled

#### Scenario: In-flight request disables search
- **WHEN** a search request has been sent and a response has not yet been received
- **THEN** the search button is disabled until the request completes (successfully or with an error)

### Requirement: Request status feedback
The system SHALL indicate to the user when a search request is in progress, and SHALL display a visible error message near the filter section if the request fails (network error or non-success API response). The system SHALL NOT render the returned book data.

#### Scenario: Loading state shown during request
- **WHEN** a search request has been sent and a response has not yet been received
- **THEN** a loading indicator is visible near the filter section

#### Scenario: Error shown on request failure
- **WHEN** a search request fails (network error or the API returns a non-success response)
- **THEN** an error message is visible near the filter section describing that the search failed

#### Scenario: No result data rendered on success
- **WHEN** a search request completes successfully
- **THEN** no book title, author, cover, or other result data from the response is rendered anywhere in the UI

### Requirement: Responsive layout
The filter section SHALL remain fully visible and usable across mobile, tablet, and desktop viewport widths, without the input, button, or filter section container overflowing, clipping, or causing horizontal page scrolling.

#### Scenario: Narrow viewport
- **WHEN** the application is viewed at a mobile-width viewport (e.g. 320–480px wide)
- **THEN** the filter section, input, and search button remain fully visible within the viewport width with no horizontal scrollbar and no clipped or overlapping content

#### Scenario: Wide viewport
- **WHEN** the application is viewed at a desktop-width viewport (e.g. 1280px or wider)
- **THEN** the filter section content is not stretched edge-to-edge in a way that harms readability or usability

### Requirement: Theme consistency
The filter section SHALL use the color and typography tokens defined by the `theming` capability rather than introducing new hardcoded colors or fonts.

#### Scenario: Filter section colors and typography come from theme tokens
- **WHEN** the filter section's background, text, input, button, and error message colors and fonts are inspected
- **THEN** each resolves to a value from the `theming` capability's design and typography tokens
