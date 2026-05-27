## 1. Dependencies
- [x] 1.1 Install `openai` npm package via pnpm

## 2. Translation API Layer
- [x] 2.1 Add `translateStream()` function to `src/lib/translate-api.ts` that accepts a provider config, prompt text, and a chunk callback; uses the `openai` SDK to call the chat completion API with `stream: true` and invokes the callback for each text delta
- [x] 2.2 Add proper error handling: catch network errors, API errors, and streaming parse errors; surface them via the callback or thrown exceptions

## 3. State Lift — Source Text
- [x] 3.1 Lift `text` state from `SourcePanel` to `TranslationWorkbench`; pass it down to `SourcePanel` as a controlled prop
- [x] 3.2 Add `onTextChange` callback prop to `SourcePanel` so the parent receives text updates

## 4. Translation Orchestration in TranslationWorkbench
- [x] 4.1 Add translation state type (`idle | streaming | done | error`) and a `Record<string, TranslationState>` keyed by provider ID
- [x] 4.2 Add `targetLang` state in `TranslationWorkbench` (lifted from `TargetPanel`) and pass it down
- [x] 4.3 Implement the translate button `onClick` handler: validate source text is non-empty, build the prompt using `replaceVariables()`, then fire `translateStream()` concurrently for each enabled provider
- [x] 4.4 Disable the translate button while any provider is in `streaming` state
- [x] 4.5 Pass the translation state map down through `TargetPanel` to `ProviderCard`

## 5. ProviderCard — Streaming Display
- [x] 5.1 Extend `ProviderCard` props to accept translation state (`status`, `text`, `error`)
- [x] 5.2 Render accumulated text when status is `streaming` or `done`; show error message when status is `error`; show placeholder only when `idle`
- [x] 5.3 Add a loading indicator (spinner or pulsing dot) when status is `streaming`

## 6. TargetPanel — Wire Translation State
- [x] 6.1 Update `TargetPanel` to accept the translation state map and `targetLang` as props (instead of managing `targetLang` internally)
- [x] 6.2 Pass translation state to each `ProviderCard` by matching provider ID

## 7. Validation
- [x] 7.1 Run `pnpm typecheck` and fix any TypeScript errors
- [x] 7.2 Run `pnpm lint` and fix any lint errors
- [x] 7.3 Manual test: configure a provider, enter text, click translate, verify streaming typewriter display across multiple providers
