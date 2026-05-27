# Change: Add Translation Prompt Template System

## Why
Users currently have no control over how translation requests are formulated. A fixed, hard-coded prompt cannot adapt to different translation contexts (e.g., formal vs. casual, technical vs. literary). Allowing users to customize the prompt template empowers them to tune translation quality and behavior per their use case, while variable substitution makes templates dynamic and reusable.

## What Changes
- Add a `general` settings object to the `MultiTranslateSettings` data model, containing a user-editable prompt template string.
- Activate the "通用设置" (General Settings) sidebar item with a real section that replaces the current placeholder.
- Add a prompt template editor UI in the General Settings section with a textarea, available variable reference hints, and a reset-to-default button.
- Implement a variable substitution utility (`src/lib/prompt-template.ts`) that replaces `{variable}` placeholders in the prompt template with actual values.
- Define the default prompt template with supported variables: `{sourceText}`, `{sourceLanguage}`, and `{targetLanguage}`.
- Wire the prompt template into the future translation API call chain so that when translation is performed, the substituted prompt is sent to the provider.

## Impact
- Affected specs: settings (MODIFIED), translation (ADDED)
- Affected code: `src/lib/settings-storage.ts`, `src/lib/prompt-template.ts` (new), `src/components/settings/settings-page.tsx`, `src/components/settings/settings-sidebar.tsx` (activate general link), `src/components/settings/general-settings.tsx` (new)
- Schema: `MultiTranslateSettings` gains an optional `general` field; no schema version bump required (backward-compatible parser)