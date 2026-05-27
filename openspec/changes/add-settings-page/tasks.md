## 1. Routing and Shell
- [x] 1.1 Add a lightweight frontend route switch for `/` and `/settings`.
- [x] 1.2 Update the homepage top-right "配置" button to navigate to `/settings`.
- [x] 1.3 Ensure settings brand/navigation can return to `/` without a full page reload where possible.

## 2. Settings Page UI
- [x] 2.1 Create `SettingsPage` with responsive desktop and mobile layout based on the supplied HTML mockups.
- [x] 2.2 Create desktop settings sidebar with Provider Management active and placeholder entries for General Settings and Configuration Management.
- [x] 2.3 Create mobile bottom navigation with History, Saved, and active Settings entries.
- [x] 2.4 Create provider management section header, add provider button, provider card, and empty/add hint state.
- [x] 2.5 Create administration section with import/export controls.

## 3. Provider Configuration Behavior
- [x] 3.1 Define the provider settings data model and localStorage helpers.
- [x] 3.2 Load saved settings on page render and seed sensible defaults only when no saved settings exist.
- [x] 3.3 Support editing provider name, enabled state, API Base URL, API Key, and comma-separated model names.
- [x] 3.4 Support adding a new OpenAI-compatible provider card.
- [x] 3.5 Support saving provider settings to localStorage.
- [x] 3.6 Add API key visibility toggle while keeping password fields masked by default.

## 4. Configuration Import/Export
- [x] 4.1 Export current settings as a JSON file from localStorage state.
- [x] 4.2 Import settings from a local JSON file after validating schema version and provider fields.
- [x] 4.3 Show user-facing feedback for successful or invalid import/export actions.

## 5. Styling and Validation
- [x] 5.1 Map the HTML design colors and typography to existing shadcn/Tailwind theme tokens without adding custom color variables.
- [x] 5.2 Verify desktop and mobile responsive layouts, including the mobile bottom nav safe-area spacing.
- [x] 5.3 Run lint/typecheck/build checks available in the project and fix introduced issues.
