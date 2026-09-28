## Purpose

Defines a deliberately garish promotional section shown on the search page whenever there's nothing else to show (before any search, or after a search with no matches), presenting random real books with fake "unbelievable" discounts as a parody of aggressive ad UX.

## ADDED Requirements

### Requirement: Promo section shown when there is nothing else to show
The system SHALL display the promo section on the search page when no search has yet been performed, and when a search completes with no matching results. The system SHALL NOT display the promo section while a search is in progress, when a search has failed, or when a search has found matching results. The existing "Book not found" message SHALL continue to be shown, unchanged, alongside the promo section when a search finds no matches.

#### Scenario: Promo section shown before any search
- **WHEN** the search page loads and no search has yet been performed
- **THEN** the promo section is visible

#### Scenario: Promo section shown alongside "Book not found"
- **WHEN** a search request completes successfully and finds no matching book
- **THEN** the "Book not found" message and the promo section are both visible

#### Scenario: Promo section hidden while searching
- **WHEN** a search request is in progress
- **THEN** the promo section is not shown

#### Scenario: Promo section hidden on search failure
- **WHEN** a search request fails
- **THEN** the promo section is not shown

#### Scenario: Promo section hidden when results are found
- **WHEN** a search request completes successfully and finds one or more matching books
- **THEN** the promo section is not shown

### Requirement: Random books about AI engineering with a real cover image
The system SHALL populate the promo section with randomly selected books about AI engineering fetched from the Google Books API, each of which has a real cover image. Books without a cover image SHALL be excluded from selection. The selected set SHALL remain fixed once fetched; it SHALL NOT be re-fetched or re-randomized while the triggering state (idle or not-found) remains active.

#### Scenario: Selected books all have a cover image
- **WHEN** the promo section's books are inspected
- **THEN** every displayed book has a cover image; none are shown without one

#### Scenario: Selected books are about AI engineering
- **WHEN** the promo section's books are fetched
- **THEN** the search query used is drawn from a pool of AI-engineering-related terms

#### Scenario: Selection stays fixed while the page remains in the same state
- **WHEN** the promo section is displayed and no new search is performed
- **THEN** the same set of books continues to be shown, not replaced by a new random set

### Requirement: Fake discount price display
The system SHALL display each promo book's existing randomly-generated price as a struck-through "original" price, alongside a lower "now" price computed by applying a random discount percentage to it, and a badge showing that percentage off. The badge SHALL be fully visible, not clipped by the section's row layout.

#### Scenario: Original, discounted price, and percentage badge are all shown
- **WHEN** a promo card is displayed
- **THEN** it shows the book's original price with strikethrough styling, a lower discounted price, and a badge stating the percentage discount

#### Scenario: Percentage badge is not clipped
- **WHEN** a promo card that fully fits within the visible row is displayed
- **THEN** its percentage-off badge is entirely visible, with no part of it cut off by the row's edge

#### Scenario: Discounted price is lower than the original price
- **WHEN** a promo card's discounted price is inspected
- **THEN** it is lower than that card's struck-through original price, consistent with the displayed percentage-off badge

### Requirement: Minimal promo card content
The system SHALL display each promo book using a card showing only its cover image, title, the discount price treatment, and an "Add to cart" control. The system SHALL NOT show a promo book's author, publisher, published date, description, or rating.

#### Scenario: Promo card shows only cover, title, price treatment, and add-to-cart
- **WHEN** a promo card is displayed
- **THEN** it shows the cover image, title, the discount price treatment, and an "Add to cart" control, with no author, publisher, date, description, or rating shown

### Requirement: Add to cart on a promo card
The system SHALL display an "Add to cart" control on each promo card when a user is signed in, and SHALL NOT display it when no user is signed in. Activating it SHALL add that book to the cart, using the same behavior as adding a book from search results.

#### Scenario: Add to cart control visible when signed in
- **WHEN** a user is signed in and the promo section is displayed
- **THEN** each promo card shows an "Add to cart" control

#### Scenario: Add to cart control hidden when signed out
- **WHEN** no user is signed in and the promo section is displayed
- **THEN** no promo card shows an "Add to cart" control

#### Scenario: Activating a promo card's add-to-cart control adds it to the cart
- **WHEN** the user activates a promo card's "Add to cart" control
- **THEN** that book is added to the cart, increasing the cart's total count

### Requirement: Visually distinct, animated promotional styling
The promo section SHALL be styled distinctly from `BookCard` and `RecommendationCard` — using brighter, more saturated colors and animated visual treatment on its discount badges rather than the app's usual muted theme — and SHALL display a prominent, attention-grabbing promotional headline above the cards. When the user's system prefers reduced motion, the section's animations SHALL be disabled, replaced by a static (non-motion) visual treatment that keeps the badges visually distinct.

#### Scenario: Promotional headline is shown above the cards
- **WHEN** the promo section is displayed
- **THEN** a prominent promotional headline is visible above the row of cards

#### Scenario: Discount badges are animated by default
- **WHEN** the promo section is displayed and the user's system has no reduced-motion preference set
- **THEN** the discount badges show a visible animated effect

#### Scenario: Animation is disabled under reduced motion, with a static treatment retained
- **WHEN** the promo section is displayed and the user's system prefers reduced motion
- **THEN** the discount badges show no animation, but remain visually distinct via a static (non-motion) treatment

### Requirement: Single-row layout with no scrolling or navigation controls
The promo section SHALL display its cards in a single row, without a horizontal scrollbar and without pagination or navigation controls. The number of cards visible SHALL depend on the available width, with no fixed upper limit driven by the layout itself: cards that do not fit in the row SHALL simply not be shown, rather than being reachable through scrolling or additional controls, and more cards SHALL become visible as available width increases (up to the number of qualifying books fetched). A card that does not fully fit within the available width SHALL NOT be shown even partially.

#### Scenario: More cards visible as the viewport gets wider
- **WHEN** the promo section is displayed and the viewport width increases
- **THEN** at least as many cards are visible as before, with additional cards appearing once there is room for them, up to the number of qualifying books available

#### Scenario: Fewer cards visible on a narrow viewport
- **WHEN** the promo section is displayed at a viewport too narrow to fit every qualifying book's card
- **THEN** only as many cards as fit are visible, with no scrollbar and no way to reach the remaining cards

#### Scenario: No partially-visible card at the row's edge
- **WHEN** the available width is not an exact multiple of a card's width plus the gap between cards
- **THEN** no partially-cut-off card is shown at the edge of the row; only cards that fit completely are visible
