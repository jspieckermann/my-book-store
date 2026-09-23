# google-login Specification

## Purpose

Lets a user identify themselves by signing in with their existing Google account, and shows their name in the header once signed in — with no backend and no password to create.

## Requirements

### Requirement: Login icon in header
The system SHALL display a login icon on the very right side of the header — to the right of the shopping cart icon — whenever no user is currently signed in.

#### Scenario: Icon visible when signed out
- **WHEN** the application loads and no user has signed in yet
- **THEN** a login icon is visible on the very right side of the header, to the right of the shopping cart icon

### Requirement: Activating the icon starts Google sign-in
The system SHALL initiate Google's OAuth sign-in flow when the user activates the login icon.

#### Scenario: Activating the icon opens Google's sign-in flow
- **WHEN** the user activates the login icon
- **THEN** Google's OAuth sign-in flow is initiated, prompting the user to choose or confirm a Google account

### Requirement: Signed-in user's name shown in header
The system SHALL display the signed-in user's name in the header in place of the login icon after a Google sign-in completes successfully.

#### Scenario: Name shown after successful sign-in
- **WHEN** a Google sign-in attempt completes successfully
- **THEN** the signed-in user's name is displayed in the header

#### Scenario: Login icon no longer shown once signed in
- **WHEN** a user is currently signed in
- **THEN** the login icon is not shown in the header

### Requirement: Cancelled or failed sign-in leaves the header signed out
The system SHALL leave the header in its signed-out state (login icon shown, no name displayed) when a sign-in attempt is cancelled or fails.

#### Scenario: Cancelled sign-in keeps the icon shown
- **WHEN** the user closes or cancels the Google sign-in flow without completing it
- **THEN** the header continues to show the login icon and no user name is displayed

#### Scenario: Failed sign-in keeps the icon shown
- **WHEN** a Google sign-in attempt fails (e.g. an error response from Google)
- **THEN** the header continues to show the login icon and no user name is displayed

### Requirement: No session persistence in this stage
The system SHALL NOT persist the signed-in state across page reloads.

#### Scenario: Reloading the page returns to the signed-out state
- **WHEN** a signed-in user reloads the page
- **THEN** the header shows the login icon, not the previously signed-in user's name

### Requirement: Sign-out control
The system SHALL provide a control to sign out whenever a user is signed in. Activating it SHALL clear the signed-in state, immediately returning the header to its signed-out state (login icon shown, no name displayed). Sign-out shall be indicated by a logout symbol.

#### Scenario: Sign-out control visible when signed in
- **WHEN** a user is signed in
- **THEN** a control to sign out is visible in the header (also symbol)

#### Scenario: Activating sign-out returns to the signed-out state
- **WHEN** a signed-in user activates the sign-out control
- **THEN** the header immediately shows the login icon again and no user name is displayed

#### Scenario: No sign-out control when signed out
- **WHEN** no user is currently signed in
- **THEN** no sign-out control is shown — only the login icon
