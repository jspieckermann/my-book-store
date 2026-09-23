# impressum Specification

## Purpose

Defines the app's legal notice (Impressum) page: its route, required content sections, and how its content follows the app's language switching.

## Requirements

### Requirement: Impressum page content
The system SHALL display a legal notice ("Impressum") page at a dedicated route, containing: the operator's full name and postal address; contact details (email and phone); a VAT identification number; a link to the European Commission's Online Dispute Resolution (ODR) platform; a statement of the operator's willingness or unwillingness to participate in consumer dispute-resolution proceedings; and a liability disclaimer covering both the site's own content and links to external sites.

#### Scenario: Impressum page is reachable
- **WHEN** the user navigates to the Impressum route
- **THEN** the Impressum page is displayed

#### Scenario: Operator identity and contact details are shown
- **WHEN** the Impressum page is viewed
- **THEN** it displays the operator's full name, postal address, email, and phone number

#### Scenario: VAT identification number is shown
- **WHEN** the Impressum page is viewed
- **THEN** it displays a VAT identification number

#### Scenario: EU dispute resolution link is shown
- **WHEN** the Impressum page is viewed
- **THEN** it displays a link to the European Commission's Online Dispute Resolution (ODR) platform

#### Scenario: Consumer dispute-resolution statement is shown
- **WHEN** the Impressum page is viewed
- **THEN** it displays a statement of the operator's willingness or unwillingness to participate in consumer dispute-resolution proceedings

#### Scenario: Liability disclaimer is shown
- **WHEN** the Impressum page is viewed
- **THEN** it displays a liability disclaimer covering both the site's own content and links to external sites

### Requirement: Impressum content follows the selected UI language
The system SHALL translate the Impressum page's headings and body text (the page title, section headings, labels, and explanatory/disclaimer text) to the application's currently selected UI language, consistent with the rest of the application. The operator's fixed identity and legal data — full name, postal address, email, phone number, and VAT identification number — and the EU ODR platform link's URL SHALL remain unchanged regardless of the selected language.

#### Scenario: Impressum content is shown in German
- **WHEN** the current UI language is German and the user views the Impressum page
- **THEN** the page's headings and body text are displayed in German

#### Scenario: Impressum content is shown in English
- **WHEN** the current UI language is English and the user views the Impressum page
- **THEN** the page's headings and body text are displayed in English

#### Scenario: Switching the language while viewing the Impressum updates its content
- **WHEN** the user changes the selected UI language while viewing the Impressum page
- **THEN** the page's headings and body text update to the newly selected language immediately

#### Scenario: Fixed identity and legal data are unaffected by the selected language
- **WHEN** the user changes the selected UI language while viewing the Impressum page
- **THEN** the operator's full name, postal address, email, phone number, VAT identification number, and the EU ODR platform link's URL remain unchanged

### Requirement: Return to the main page from the Impressum page
The system SHALL provide a control on the Impressum page that navigates back to the main page.

#### Scenario: Back control returns to the main page
- **WHEN** the user activates the back control on the Impressum page
- **THEN** the main page is displayed
