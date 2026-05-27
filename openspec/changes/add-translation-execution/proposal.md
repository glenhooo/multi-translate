# Change: Implement Translation Execution with Streaming Typewriter Display

## Why
The translation workbench UI is fully scaffolded but the translate button is non-functional. Users cannot execute translations, view results, or compare outputs across providers. This is the core feature of the application.

## What Changes
- Introduce the `openai` npm package to call OpenAI-compatible chat completion APIs with streaming support
- Add a `translateStream()` function in `src/lib/translate-api.ts` that sends a prompt to a provider and yields streamed text chunks
- Lift source text state from `SourcePanel` up to `TranslationWorkbench` so it can be passed to the translation pipeline
- Wire the translate button to orchestrate parallel streaming calls across all enabled providers
- Extend `ProviderCard` to accept translation state (idle / streaming / done / error) and render streamed text with a typewriter effect
- Add loading indicator and error display to `ProviderCard`
- Disable the translate button while a translation is in progress

## Impact
- Affected specs: `translation-execution` (new capability)
- Affected code:
  - `src/lib/translate-api.ts` — new `translateStream()` function
  - `src/components/homepage/translation-workbench.tsx` — state lift, translate handler
  - `src/components/homepage/source-panel.tsx` — expose text via callback
  - `src/components/homepage/target-panel.tsx` — pass translation params to ProviderCard
  - `src/components/homepage/provider-card.tsx` — streaming result display, typewriter effect, error/loading states
  - `package.json` — add `openai` dependency
