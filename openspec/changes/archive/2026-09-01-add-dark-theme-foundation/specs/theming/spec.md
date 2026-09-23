## Purpose

Defines the app-wide dark color palette, typography scale, and design tokens that all UI in the book store must use, and requires this dark theme to render as the default appearance of the application.

## ADDED Requirements

### Requirement: Dark color palette tokens
The system SHALL define a dark, professional color palette as reusable design tokens, including at minimum: background, surface, primary text, secondary/muted text, border, accent/brand, and semantic states (success, warning, error).

#### Scenario: Token set is available for consumption
- **WHEN** a component or stylesheet needs a themed color
- **THEN** a corresponding design token (e.g. background, surface, text, border, accent, success, warning, error) is available and resolves to a value from the dark palette

#### Scenario: Sufficient text contrast
- **WHEN** primary text is rendered on the background or surface token
- **THEN** the contrast ratio between the text color token and the background/surface color token meets or exceeds WCAG AA (4.5:1 for normal text)

### Requirement: Typography tokens
The system SHALL define a base typography scale (font family and a set of font sizes/weights) as reusable tokens, consistent with a modern, professional appearance.

#### Scenario: Typography tokens are available for consumption
- **WHEN** a component or stylesheet needs to set text styling
- **THEN** a corresponding typography token (font family, and at least heading/body/small size steps) is available

### Requirement: Dark theme applied by default
The system SHALL render the dark theme as the application's default and only appearance on initial load, without requiring any user action.

#### Scenario: App loads in dark theme
- **WHEN** the application is loaded in a browser with no prior user preference stored
- **THEN** the page background, surface, and text colors are rendered using the dark palette tokens

#### Scenario: Dark theme applies globally, not just within one component
- **WHEN** any page or view is rendered, including areas outside the root component's own template
- **THEN** the `html`/`body` background and default text color use the dark palette tokens, so no unstyled light-colored area is visible

### Requirement: No theme toggle in this change
The system SHALL NOT expose a light/dark theme switcher as part of this change; the dark theme is the sole supported appearance.

#### Scenario: No toggle control present
- **WHEN** a user looks for a way to switch themes in the UI
- **THEN** no light/dark toggle control exists
