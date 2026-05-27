## MODIFIED Requirements

### Requirement: Settings Navigation
The system SHALL provide settings-specific navigation that highlights the active provider management area.

#### Scenario: Desktop sidebar navigation
- **WHEN** the settings page renders on desktop
- **THEN** the sidebar SHALL include entries for "提供商管理", "通用设置", and "配置管理"
- **AND** the "通用设置" entry SHALL scroll to the general settings section with id `#general` when clicked
- **AND** inactive entries SHALL show hover states using existing theme tokens

#### Scenario: Mobile bottom navigation active state (unchanged)
- **WHEN** the settings page renders on mobile
- **THEN** the bottom navigation SHALL include History, Saved, and Settings entries
- **AND** the Settings entry SHALL be visually active
- **AND** inactive entries SHALL remain visible but not active

### Requirement: General Settings Section
The system SHALL provide a General Settings section under the "通用设置" sidebar entry where users can configure application-wide preferences.

#### Scenario: General Settings section rendered
- **WHEN** the settings page renders
- **THEN** the general settings section SHALL display the title "通用设置"
- **AND** SHALL display helper text explaining that application-wide preferences can be configured

#### Scenario: Prompt template editor displayed
- **WHEN** the general settings section renders
- **THEN** a textarea SHALL display the current prompt template value
- **AND** a label SHALL indicate the textarea is for the "翻译提示词" (Translation Prompt)
- **AND** a hint SHALL list available variables: `{sourceText}`, `{sourceLanguage}`, `{targetLanguage}`

#### Scenario: Edit prompt template
- **WHEN** the user modifies the prompt template textarea
- **THEN** the change SHALL be reflected in the local state immediately
- **AND** the change SHALL be persisted when the user clicks the Save button

#### Scenario: Reset prompt template to default
- **WHEN** the user clicks the "恢复默认" (Reset to Default) button
- **THEN** the prompt template SHALL revert to the application-defined default value
- **AND** the change SHALL be reflected in the local state immediately

### Requirement: Provider Settings Persistence
The system SHALL store provider settings and general preferences locally in the browser.

#### Scenario: General settings included in persistence
- **WHEN** the user edits general settings and clicks Save
- **THEN** the system SHALL persist both provider configuration and general settings to browser localStorage
- **AND** the saved prompt template SHALL be restored after page reload

#### Scenario: Backward-compatible loading
- **WHEN** previously saved settings without a `general` field are loaded
- **THEN** the system SHALL fill in the default prompt template
- **AND** SHALL NOT overwrite the stored settings until the user explicitly saves

### Requirement: Configuration Import and Export
The system SHALL provide local JSON import and export controls for configuration data, including general settings.

#### Scenario: Export includes general settings
- **WHEN** the user exports configuration
- **THEN** the exported JSON SHALL include the `general` field with the current prompt template value
- **AND** the export SHALL be valid for re-import

#### Scenario: Import with general settings
- **WHEN** the user imports a settings JSON that includes a `general` field
- **THEN** the system SHALL apply the imported prompt template
- **AND** SHALL save it to localStorage

#### Scenario: Import without general settings
- **WHEN** the user imports a settings JSON that does not include a `general` field
- **THEN** the system SHALL fill in the default prompt template
- **AND** SHALL NOT reject the import