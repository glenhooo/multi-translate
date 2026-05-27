## Context
The translation comparison flow currently has no mechanism for users to influence how translation prompts are constructed. The "通用设置" (General Settings) sidebar item exists but has no implementation behind it.

This change adds a prompt template system that:
- Lives in the settings page under the General Settings section
- Supports variable substitution so prompts adapt to each translation request
- Is backward-compatible with existing saved settings (no data loss)

## Goals / Non-Goals

**Goals:**
- Allow users to view and edit the translation prompt template in the General Settings section.
- Support three variables: `{sourceText}`, `{sourceLanguage}`, `{targetLanguage}`.
- Provide a `replaceVariables(template, vars)` utility that performs substitution.
- Provide a sensible default prompt template.
- Persist the prompt template alongside existing provider settings in localStorage.
- Add a "reset to default" button in the UI.

**Non-Goals:**
- Advanced template features (conditionals, loops, functions).
- Per-provider prompt templates (all providers share the same template in this change).
- Prompt history or templated snippets beyond the single editable template.
- Actual translation API calls (the prompt is prepared for use but the call itself is a separate concern).

## Decisions

| Decision | Description | Alternatives |
| --- | --- | --- |
| Schema evolution | Add `general` as an optional field to `MultiTranslateSettings` without bumping `schemaVersion`. When `general` is missing, the parser fills in defaults. | Bump to `schemaVersion: 2` with migration; simpler to keep at 1 since the new field is backward-compatible. |
| Variable syntax | Use `{variableName}` — curly brace interpolation, matched by a simple regex replace. | Use `{{variableName}}` (double braces) or `${variableName}` (JS template literal syntax). Single curly braces are simplest and match common prompt template conventions. |
| Substitution utility location | New file `src/lib/prompt-template.ts` exporting `replaceVariables` and `DEFAULT_PROMPT_TEMPLATE`. | Inline in `settings-storage.ts`; a separate file keeps concerns clean and is testable independently. |
| Default prompt template | `"Translate the following {sourceLanguage} text to {targetLanguage}. Only return the translated text, nothing else.\n\n{sourceText}"` | Simpler prompt like `"Translate to {targetLanguage}: {sourceText}"`; the chosen default provides clear language context and output constraints. |
| UI widget | Single textarea with label, variable reference hint text, and a "恢复默认" (Reset to Default) link button. No live preview. | Live preview or rich markdown editor; unnecessary complexity for initial release. |
| Sidebar activation | Change `active` on the "通用设置" sidebar link from `false` to toggled via scroll/click, or make the General Settings section always visible and navigable via anchor link (matching existing sidebar pattern). | For simplicity, use anchor-based navigation matching the existing `#providers` pattern; the sidebar link navigates to `#general`. |

## Data Model Changes

```diff
 type MultiTranslateSettings = {
   schemaVersion: 1;
   providers: TranslationProviderConfig[];
+  general?: GeneralSettings;
   updatedAt: string;
 };

+ type GeneralSettings = {
+   promptTemplate: string;
+ };
```

```ts
// Default value
const DEFAULT_PROMPT_TEMPLATE =
  "Translate the following {sourceLanguage} text to {targetLanguage}. Only return the translated text, nothing else.\n\n{sourceText}";
```

### Variable Substitution API

```ts
type PromptVariables = {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
};

function replaceVariables(template: string, vars: PromptVariables): string;
```

The function performs a simple regex replace for each variable key. Unknown variables are left as-is (so `{unknownVar}` stays in the output).

## Component Architecture

```
src/
└── components/
    └── settings/
        ├── settings-page.tsx       # ← add GeneralSettings section rendering
        ├── settings-sidebar.tsx    # ← activate #general link
        └── general-settings.tsx    # NEW: prompt template editor section
```

## Risks / Trade-offs
- Single curly brace syntax may conflict with potential future template use (e.g., JSON-like structures in prompts). Mitigation: document the convention and keep the substitution regex strict.
- No per-provider templates means users cannot give different instructions to different providers. Mitigation: this is a deliberate MVP scope; per-provider templates can be added later by moving `promptTemplate` into `TranslationProviderConfig` or an override mechanism.
- Adding `general` to the data model without schema version bump means we rely on optional field handling. If the settings are exported and re-imported on an older version of the app, the `general` field is silently dropped. Mitigation: the current app is at MVP stage with no backward-compatibility concerns across versions.

## Open Questions
- Should the prompt template be a system-level message or user-level message in the OpenAI API call? (Assumption: system message, since it provides instructions to the model — confirm during implementation.)
- Should the general settings section include any other settings beyond the prompt template? (Scope this change to prompt template only; other general settings can be added in future proposals.)