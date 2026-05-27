## ADDED Requirements

### Requirement: Settings Route
The system SHALL provide a frontend `/settings` route for the configuration page.

#### Scenario: Navigate from homepage configuration button
- **WHEN** the user clicks the homepage top-right "配置" button
- **THEN** the application SHALL navigate to `/settings`
- **AND** the settings page SHALL render without requiring a backend server response beyond the SPA document

#### Scenario: Direct settings route load
- **WHEN** the user opens `/settings` directly in an SPA-compatible environment
- **THEN** the application SHALL render the settings page
- **AND** the browser URL SHALL remain `/settings`

#### Scenario: Return to homepage from settings brand
- **WHEN** the user clicks the application brand on the settings page
- **THEN** the application SHALL navigate to `/`
- **AND** the homepage SHALL render

### Requirement: Settings Page Layout
The system SHALL render a settings page based on the provided desktop and mobile HTML designs using existing application theme tokens.

#### Scenario: Desktop settings layout
- **WHEN** the viewport width is at least the `md` breakpoint
- **THEN** the settings page SHALL show a sticky top navigation bar
- **AND** SHALL display a left sidebar titled "配置"
- **AND** SHALL display settings content to the right of the sidebar
- **AND** SHALL show the footer at the bottom of the page

#### Scenario: Mobile settings layout
- **WHEN** the viewport width is less than the `md` breakpoint
- **THEN** the settings page SHALL show a compact sticky top header
- **AND** SHALL stack settings content in a single column
- **AND** SHALL show a fixed bottom navigation bar with History, Saved, and active Settings entries
- **AND** SHALL include enough bottom spacing so content is not hidden behind the bottom navigation

### Requirement: Settings Navigation
The system SHALL provide settings-specific navigation that highlights the active provider management area.

#### Scenario: Desktop sidebar navigation
- **WHEN** the settings page renders on desktop
- **THEN** the sidebar SHALL include entries for "提供商管理", "通用设置", and "配置管理"
- **AND** "提供商管理" SHALL be visually active
- **AND** inactive entries SHALL show hover states using existing theme tokens

#### Scenario: Mobile bottom navigation active state
- **WHEN** the settings page renders on mobile
- **THEN** the bottom navigation SHALL include History, Saved, and Settings entries
- **AND** the Settings entry SHALL be visually active
- **AND** inactive entries SHALL remain visible but not active

### Requirement: Provider Management
The system SHALL allow users to view and edit OpenAI-compatible translation provider configurations.

#### Scenario: Provider management section rendered
- **WHEN** the settings page renders
- **THEN** the provider management section SHALL display the title "提供商 (Providers)" or equivalent mobile copy
- **AND** SHALL display helper text explaining that translation API service providers can be configured
- **AND** SHALL display an "添加提供商" or "Add New Provider" action

#### Scenario: Provider configuration card fields
- **WHEN** a provider configuration card is displayed
- **THEN** it SHALL include fields for provider name, provider type, API Base URL, API Key, and model names
- **AND** it SHALL include an enabled/disabled switch
- **AND** provider type SHALL be constrained to OpenAI-compatible service configuration
- **AND** model names SHALL accept comma-separated values

#### Scenario: Add provider
- **WHEN** the user clicks the add provider action
- **THEN** the system SHALL create a new editable provider configuration card
- **AND** the new provider SHALL default to OpenAI-compatible type

### Requirement: Provider Settings Persistence
The system SHALL store provider settings locally in the browser.

#### Scenario: Save provider settings locally
- **WHEN** the user edits provider settings and clicks Save
- **THEN** the system SHALL persist the provider configuration to browser localStorage
- **AND** the saved API Base URL, API Key, enabled state, and model names SHALL be restored after page reload

#### Scenario: Privacy-first settings storage
- **WHEN** provider settings are saved
- **THEN** API keys and provider settings SHALL remain in browser storage only
- **AND** the application SHALL NOT send provider settings to any backend service as part of saving settings

### Requirement: API Key Visibility Control
The system SHALL mask API keys by default and allow users to toggle visibility per provider card.

#### Scenario: API key masked by default
- **WHEN** a provider card renders with an API key value
- **THEN** the API Key input SHALL use password-style masking
- **AND** a visibility toggle control SHALL be available

#### Scenario: Toggle API key visibility
- **WHEN** the user activates the API key visibility control
- **THEN** the API Key input SHALL switch between masked and visible text states for that provider card

### Requirement: Configuration Import and Export
The system SHALL provide local JSON import and export controls for configuration data.

#### Scenario: Export configuration
- **WHEN** the user clicks the export configuration action
- **THEN** the system SHALL produce a JSON file containing the current local settings schema version and provider configurations
- **AND** the exported data SHALL be generated entirely in the browser

#### Scenario: Import valid configuration
- **WHEN** the user imports a valid settings JSON file
- **THEN** the system SHALL validate the schema version and provider fields
- **AND** SHALL replace the current local settings with the imported configuration
- **AND** SHALL render the imported providers on the settings page

#### Scenario: Reject invalid configuration
- **WHEN** the user imports invalid JSON or an unsupported settings schema
- **THEN** the system SHALL reject the import
- **AND** SHALL keep the existing local settings unchanged
- **AND** SHALL show user-facing feedback that the import failed

### Requirement: Settings Actions
The system SHALL render provider card actions matching the settings design.

#### Scenario: Provider card actions visible
- **WHEN** a provider card renders
- **THEN** it SHALL display a Test action
- **AND** SHALL display a Save action
- **AND** action buttons SHALL have hover/focus states using existing theme tokens

#### Scenario: Test action scope
- **WHEN** the user clicks the Test action before translation API execution is implemented
- **THEN** the system SHALL provide user-facing placeholder feedback instead of performing an external API request

### Requirement: Settings Theme Mapping
The system SHALL implement the settings design using existing shadcn/Tailwind theme tokens and existing local assets.

#### Scenario: HTML design colors mapped to shadcn equivalents
- **WHEN** implementing the settings HTML mockup
- **THEN** design colors SHALL be mapped to existing tokens such as `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`, and `bg-primary`
- **AND** no custom Material Design color variables SHALL be added to `src/index.css`

#### Scenario: No external design CDNs
- **WHEN** implementing the settings page
- **THEN** the application SHALL NOT load Tailwind CDN, Google Fonts, or Material Symbols CDN from the supplied HTML
- **AND** icons SHALL use existing local React icon dependencies or inline components

#### Scenario: Dark mode compatibility
- **WHEN** the application theme switches between light and dark modes
- **THEN** the settings page SHALL continue using existing shadcn theme tokens
- **AND** controls, cards, borders, and navigation active states SHALL remain legible
