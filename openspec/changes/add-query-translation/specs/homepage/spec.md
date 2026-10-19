## ADDED Requirements
### Requirement: Translate URL Query Text
The system SHALL support a `q` query parameter on the homepage that pre-fills the source text and automatically starts translation when the value is non-empty. The query value SHALL be URL-decoded and limited to the source input's 5,000-character maximum.

#### Scenario: Translate text supplied in the homepage URL
- **WHEN** the user opens the homepage with a non-empty `q` query parameter
- **THEN** the source input SHALL display the decoded query value, up to 5,000 characters
- **AND** the workbench SHALL automatically start translating that text

#### Scenario: Ignore an empty query parameter
- **WHEN** the user opens the homepage with a missing or empty `q` query parameter
- **THEN** the source input SHALL remain empty
- **AND** the workbench SHALL NOT automatically start a translation
