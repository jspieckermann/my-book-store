## REMOVED Requirements

### Requirement: Impressum content is not translated
**Reason**: Reversed per user request — the Impressum's headlines and body content now follow the app's selected UI language like every other page, rather than staying fixed in German.
**Migration**: See the new "Impressum content follows the selected UI language" requirement below.

## ADDED Requirements

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
