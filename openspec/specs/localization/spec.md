# localization Specification

## Purpose

Defines the app's language-switching mechanism: a header control that instantly switches the application's UI language between English and German, the current-language state and its persistence, and which text in the application is subject to translation.

## Requirements

### Requirement: Language switcher control
The system SHALL display a language-selection control in the header offering English and German, each option showing that language's country flag alongside its short language code (e.g. a UK flag with "EN", a German flag with "DE"). The control SHALL be visible regardless of whether a user is signed in, and SHALL expose an accessible name describing its purpose.

#### Scenario: Control visible when signed out
- **WHEN** no user is signed in
- **THEN** the language switcher control is visible in the header

#### Scenario: Control visible when signed in
- **WHEN** a user is signed in
- **THEN** the language switcher control is visible in the header

#### Scenario: Control lists both languages as flag + code
- **WHEN** the language switcher control is inspected
- **THEN** it offers one entry per supported language, each showing that language's flag and short code (e.g. a UK flag with "EN", a German flag with "DE")

### Requirement: Switching the language
The system SHALL switch the application's current language immediately, without a page reload, when the user selects a different language from the language switcher control. All of the application's static UI text SHALL update to the newly selected language.

#### Scenario: Selecting German switches the language
- **WHEN** the user selects German from the language switcher control while English is active
- **THEN** the application's current language becomes German and its static UI text updates to German immediately, without a page reload

#### Scenario: Selecting English switches back
- **WHEN** the user selects English from the language switcher control while German is active
- **THEN** the application's current language becomes English and its static UI text updates to English immediately, without a page reload

### Requirement: Language persists across reloads
The system SHALL persist the user's selected language so that it remains active after the page is reloaded.

#### Scenario: Selected language survives a reload
- **WHEN** the user selects German and then reloads the page
- **THEN** the application loads with German as the current language

### Requirement: Default language
The system SHALL use English as the application's current language when no language has previously been selected.

#### Scenario: First visit defaults to English
- **WHEN** the application is loaded with no previously selected language
- **THEN** English is the current language

### Requirement: Book search results reflect the selected language via the API, not machine translation
The system SHALL NOT machine-translate book data retrieved from the Google Books API. Instead, search requests SHALL restrict results to the currently selected language using the Google Books API's own language-restriction parameter, so returned book data (title, authors, publisher, published date, description) is whatever the API provides for that language. A currently displayed search's results SHALL be re-fetched with the newly selected language's restriction when the language is changed.

#### Scenario: A search performed in German requests German-language results
- **WHEN** the current language is German and the user performs a search
- **THEN** the request sent to the Google Books API restricts results to German-language listings, and the displayed book data (title, authors, publisher, description, etc.) is whatever the API returns for those listings, not a translation of the English data

#### Scenario: Changing the language while viewing results re-fetches them
- **WHEN** the user is viewing search results and selects a different language from the language switcher control
- **THEN** the current search is re-run with the newly selected language's restriction, and the displayed results update to reflect it

#### Scenario: No results in the selected language
- **WHEN** a search restricted to the currently selected language matches no volumes
- **THEN** the system shows the same "Book not found" outcome as any other no-match search, rather than an error

#### Scenario: Cart items are not re-fetched when the language changes
- **WHEN** the user changes the language while books are already in the cart
- **THEN** those cart items continue to display the book data (and price) they had when added, unaffected by the language change
