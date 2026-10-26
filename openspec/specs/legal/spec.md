# legal Specification

## Purpose

Defines the app's Legal page: a disclosure of the production (runtime) open-source dependencies the app ships, including transitive ones, each with its name, version, and license.

## Requirements

### Requirement: Legal page content
The system SHALL display a "Legal" page at a dedicated route listing every production dependency the app ships — including transitive production dependencies, not only direct ones — excluding development/build-only dependencies that are never shipped to the browser. Each listed dependency SHALL show its name, version, and license. A dependency whose license cannot be determined SHALL still be listed, with its license shown as unknown rather than being omitted.

#### Scenario: Legal page is reachable
- **WHEN** the user navigates to the Legal route
- **THEN** the Legal page is displayed

#### Scenario: Each dependency shows name, version, and license
- **WHEN** the Legal page is viewed
- **THEN** every listed dependency shows its name, its version, and its license

#### Scenario: Transitive production dependencies are included
- **WHEN** the Legal page is viewed
- **THEN** dependencies pulled in indirectly by a direct production dependency are listed, not only the direct dependencies declared in the app's own package manifest

#### Scenario: Development-only dependencies are excluded
- **WHEN** the Legal page is viewed
- **THEN** packages that are only used for building, linting, or testing the app, and are not shipped in the production bundle, are not listed

#### Scenario: A dependency with an undetermined license is still listed
- **WHEN** a listed dependency's license cannot be determined
- **THEN** it still appears on the page, with its license shown as unknown rather than being left off the list

### Requirement: Legal content follows the selected UI language
The system SHALL translate the Legal page's heading and labels to the application's currently selected UI language, consistent with the rest of the application. The dependency data itself — each dependency's name, version, and license — is factual and SHALL remain unchanged regardless of the selected language.

#### Scenario: Legal page heading and labels are shown in German
- **WHEN** the current UI language is German and the user views the Legal page
- **THEN** the page's heading and labels are displayed in German

#### Scenario: Legal page heading and labels are shown in English
- **WHEN** the current UI language is English and the user views the Legal page
- **THEN** the page's heading and labels are displayed in English

#### Scenario: Switching the language while viewing the Legal page updates its labels
- **WHEN** the user changes the selected UI language while viewing the Legal page
- **THEN** the page's heading and labels update to the newly selected language immediately

#### Scenario: Dependency data is unaffected by the selected language
- **WHEN** the user changes the selected UI language while viewing the Legal page
- **THEN** the listed dependencies' names, versions, and licenses remain unchanged

### Requirement: Return to the main page from the Legal page
The system SHALL provide a breadcrumb trail on the Legal page, shown above the Legal page's title, that navigates back to the main page when its main-page link is activated.

#### Scenario: Back control returns to the main page
- **WHEN** the user activates the breadcrumb trail's main-page link on the Legal page
- **THEN** the main page is displayed
