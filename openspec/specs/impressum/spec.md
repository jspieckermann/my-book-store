# impressum Specification

## Purpose

Defines the app's legal notice (Impressum) page: its route, required content sections, and the rule that its content is not subject to the app's language switching.

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

### Requirement: Impressum content is not translated
The system SHALL render the Impressum page's content in German regardless of the application's currently selected UI language.

#### Scenario: Impressum stays German while English is the selected UI language
- **WHEN** English is the currently selected UI language and the user views the Impressum page
- **THEN** the Impressum page's content is displayed in German, not translated to English

#### Scenario: Switching the UI language does not change the Impressum's content
- **WHEN** the user changes the selected UI language while viewing the Impressum page
- **THEN** the Impressum page's content remains unchanged, in German
