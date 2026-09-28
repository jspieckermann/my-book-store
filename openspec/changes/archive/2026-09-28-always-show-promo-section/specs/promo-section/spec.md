## REMOVED Requirements

### Requirement: Promo section shown when there is nothing else to show
**Reason**: Superseded by a new requirement — the promo section is no longer conditionally shown only when there's nothing else to display (idle/not-found); it is now always visible regardless of search state.
**Migration**: See the new "Promo section always shown on the search page" requirement below.

## ADDED Requirements

### Requirement: Promo section always shown on the search page
The system SHALL always display the promo section on the search page, regardless of the current search state — before any search (idle), while a search is in progress (loading), when a search fails (error), when a search finds no matching results (not-found), and when a search finds one or more matching results (found). The promo section SHALL be positioned after the search results list and pagination controls in the page layout, so it never displaces search results. The existing "Book not found" message, loading indicator, and error message SHALL continue to be shown, unchanged, alongside the promo section in their respective states.

#### Scenario: Promo section shown before any search
- **WHEN** the search page loads and no search has yet been performed
- **THEN** the promo section is visible

#### Scenario: Promo section shown while a search is in progress
- **WHEN** a search request is in progress
- **THEN** the promo section is visible

#### Scenario: Promo section shown when a search fails
- **WHEN** a search request fails
- **THEN** the promo section is visible, alongside the error message

#### Scenario: Promo section shown alongside "Book not found"
- **WHEN** a search request completes successfully and finds no matching book
- **THEN** the "Book not found" message and the promo section are both visible

#### Scenario: Promo section shown alongside search results
- **WHEN** a search request completes successfully and finds one or more matching books
- **THEN** the promo section is visible, in addition to the list of matching books

#### Scenario: Promo section positioned below the results list and pagination
- **WHEN** a search finds results, with or without pagination controls shown
- **THEN** the promo section appears after the results list and, when present, after the pagination controls

## MODIFIED Requirements

### Requirement: Visually distinct, animated promotional styling
The promo section SHALL be styled distinctly from `BookCard` and `RecommendationCard` — using brighter, more saturated colors and animated visual treatment on its discount badges rather than the app's usual muted theme — and SHALL display a headline above the cards, styled the same as the page's other headlines rather than with garish promotional styling. When the user's system prefers reduced motion, the section's animations SHALL be disabled, replaced by a static (non-motion) visual treatment that keeps the badges visually distinct.

#### Scenario: Promotional headline is shown above the cards
- **WHEN** the promo section is displayed
- **THEN** a headline, styled the same as the page's other headlines, is visible above the row of cards

#### Scenario: Discount badges are animated by default
- **WHEN** the promo section is displayed and the user's system has no reduced-motion preference set
- **THEN** the discount badges show a visible animated effect

#### Scenario: Animation is disabled under reduced motion, with a static treatment retained
- **WHEN** the promo section is displayed and the user's system prefers reduced motion
- **THEN** the discount badges show no animation, but remain visually distinct via a static (non-motion) treatment
