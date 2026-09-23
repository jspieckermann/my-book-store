## ADDED Requirements

### Requirement: Interactive control feedback
The system SHALL show a visible hover state and a visible pressed/active state for every interactive control (button or link) in the application, using the `theming` capability's tokens rather than new hardcoded colors. When the user's system prefers reduced motion, any motion-based feedback (e.g. scaling) SHALL be disabled, but a non-motion visual indication (e.g. a brightness or opacity change) SHALL still be shown so a press is never entirely invisible.

#### Scenario: Hovering an interactive control shows a visible hover state
- **WHEN** the user hovers a button or link control
- **THEN** the control's appearance visibly changes from its resting state

#### Scenario: Pressing an interactive control shows a visible pressed state
- **WHEN** the user presses (activates) a button or link control
- **THEN** the control's appearance visibly changes from both its resting and hover states, providing feedback that the press registered

#### Scenario: Reduced motion preference disables motion-based feedback but keeps a visual indication
- **WHEN** the user's system is set to prefer reduced motion and the user presses an interactive control
- **THEN** no scaling or other motion-based transition is applied, but the control still shows a non-motion visual change (e.g. brightness or opacity)
