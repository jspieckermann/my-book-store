## REMOVED Requirements

### Requirement: No sign-out control or session persistence in this stage
**Reason**: Reversed — the system now provides a sign-out control. The persistence prohibition is retained, restated under the new "No session persistence in this stage" requirement below.
**Migration**: See "No session persistence in this stage" and "Sign-out control" requirements.

## ADDED Requirements

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
