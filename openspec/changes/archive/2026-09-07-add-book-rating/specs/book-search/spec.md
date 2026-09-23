## ADDED Requirements

### Requirement: Average rating display
The system SHALL display a found book's average rating and ratings count on its result card when the Google Books API response includes both for that book. The rating SHALL be shown as a row of star icons in the top-right corner of the card, rounded to the nearest whole star out of five, followed by the total number of ratings in brackets. When the API response does not include a rating for a book, no rating indicator SHALL be shown for that book (no placeholder or zero-star indicator).

#### Scenario: Rating displayed when available
- **WHEN** a search request completes successfully, finds a matching book, and the API response includes an average rating and ratings count for that book
- **THEN** a row of star icons representing the rating, rounded to the nearest whole star, is displayed in the top-right corner of the result card, followed by the ratings count in brackets

#### Scenario: Rating rounds to the nearest whole star
- **WHEN** a book's average rating is not a whole number (e.g. 3.6)
- **THEN** the displayed star icons reflect that rating rounded to the nearest whole star (e.g. 4 filled stars)

#### Scenario: No rating indicator when rating data is absent
- **WHEN** a search request completes successfully, finds a matching book, and the API response does not include an average rating and ratings count for that book
- **THEN** no rating indicator, placeholder, or zero-star display is shown on that book's result card

#### Scenario: Rating shown on cart page cards
- **WHEN** a book with rating data is displayed as a card on the cart page
- **THEN** the same star-and-count rating indicator is shown in the top-right corner of that card, consistent with its appearance on a search result card
