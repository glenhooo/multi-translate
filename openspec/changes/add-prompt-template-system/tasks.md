## 1. Data Model & Utility
- [ ] 1.1 Add `GeneralSettings` type and optional `general` field to `MultiTranslateSettings` in `src/lib/settings-storage.ts`.
- [ ] 1.2 Update `parseSettings` to safely handle missing `general` by filling defaults.
- [ ] 1.3 Update `createDefaultSettings` to include default `general` settings.
- [ ] 1.4 Create `src/lib/prompt-template.ts` with `DEFAULT_PROMPT_TEMPLATE` constant, `PromptVariables` type, and `replaceVariables` function.

## 2. General Settings UI
- [ ] 2.1 Create `src/components/settings/general-settings.tsx` with:
  - Section heading "通用设置" and description
  - Prompt template textarea
  - Variable reference hint text listing available variables
  - "恢复默认" (Reset to Default) button
  - Save-triggering behavior (reuses the existing save flow from settings page)
- [ ] 2.2 Update `settings-sidebar.tsx` to make the "通用设置" link scroll to `#general` (matching existing `#providers` anchor pattern).
- [ ] 2.3 Update `settings-page.tsx` to render `GeneralSettings` section alongside `ProviderManagement` and `ConfigurationAdmin`.
- [ ] 2.4 Verify mobile layout: the General Settings section renders correctly in single-column mobile view.

## 3. Integration & Validation
- [ ] 3.1 Run TypeScript type check (`pnpm typecheck` or `tsc --noEmit`) and fix any errors.
- [ ] 3.2 Run linter (`pnpm lint`) and fix any issues.
- [ ] 3.3 Verify settings save/load roundtrip preserves the prompt template value in localStorage.
- [ ] 3.4 Verify export/import roundtrip includes the `general` field and is applied correctly.
- [ ] 3.5 Verify the "通用设置" sidebar nav link is visually active (or at minimum navigates to the correct section anchor).