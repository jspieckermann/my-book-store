## ADDED Requirements

### Requirement: API key authentication
The system SHALL include a configured Google Books API key in requests to the Google Books API's volumes endpoint when a key is configured for the application, so requests use the key's own quota rather than the shared anonymous quota. When no key is configured, the system SHALL continue sending the request unauthenticated rather than failing to build or throwing at runtime.

#### Scenario: Configured key is included in requests
- **WHEN** a Google Books API key is configured for the application and a search is performed
- **THEN** the request sent to the Google Books API's volumes endpoint includes that key

#### Scenario: No key configured falls back to unauthenticated requests
- **WHEN** no Google Books API key is configured for the application and a search is performed
- **THEN** the request sent to the Google Books API's volumes endpoint has no key parameter, and the search still proceeds (subject to the existing loading/error/found/not-found behavior)
