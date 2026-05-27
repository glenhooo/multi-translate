## Context
The multi-translate workbench has full UI scaffolding (SourcePanel, TargetPanel, ProviderCard) and a settings system with provider configs and prompt templates, but no translation execution logic. The translate button is a visual placeholder with no onClick handler. Source text lives in SourcePanel's local state and is not accessible to parent components.

## Goals / Non-Goals
- **Goals:**
  - Enable users to click the translate button and receive streaming translations from all enabled providers simultaneously
  - Display translation results with a smooth typewriter effect as tokens arrive
  - Handle loading, error, and cancellation states gracefully
  - Keep the implementation simple and aligned with existing patterns (pure frontend, no state library)
- **Non-Goals:**
  - Server-side proxy or backend translation service
  - Translation history or persistence
  - Copy-to-clipboard and text-to-speech (those are separate features)
  - Retry logic or request queuing

## Decisions

### 1. Use `openai` npm package for API calls
- **What:** Add the official `openai` SDK as a dependency to handle chat completion streaming
- **Why:** It is the de facto standard for OpenAI-compatible APIs. The SDK handles SSE parsing, provides async iterators for streaming, and works in browser environments. This avoids writing a fragile manual SSE parser.
- **Alternatives considered:**
  - Raw `fetch` + `ReadableStream` — lighter but requires manual SSE parsing and is error-prone
  - `ai` (Vercel AI SDK) — popular but more coupled to Next.js/React Server Components patterns; overkill for a pure SPA

### 2. Typewriter effect via accumulated state + React rendering
- **What:** Each streamed text chunk is appended to a local state string. React re-renders the ProviderCard on each chunk, naturally producing a typewriter effect.
- **Why:** Simplest approach, no extra dependencies. The streaming callback from the `openai` SDK provides chunks at a rate that naturally looks like typewriter output. No need for `requestAnimationFrame` or animation libraries.
- **Alternatives considered:**
  - CSS `@keyframes` character-by-character animation — complex, hard to sync with streaming
  - Third-party typewriter library (e.g., `react-type-animation`) — unnecessary dependency for a simple append pattern

### 3. State lift: source text moves to TranslationWorkbench
- **What:** Lift `text` state from `SourcePanel` to `TranslationWorkbench`. SourcePanel reports text changes via a new `onTextChange` callback.
- **Why:** TranslationWorkbench needs access to source text, source language, and target language to build the translation request. Currently source text is trapped inside SourcePanel. Lifting is the simplest React pattern for this.
- **Alternatives considered:**
  - React Context — unnecessary for a two-level parent-child relationship
  - Global state store (Zustand/Jotai) — project convention is hooks-only

### 4. Parallel translation across providers
- **What:** When the translate button is clicked, fire streaming requests to all enabled providers concurrently using `Promise.allSettled` (each provider runs independently).
- **Why:** Users want to compare results side-by-side, so all providers should start simultaneously. Each provider's result is independent; one failure should not block others.
- **Alternatives considered:**
  - Sequential execution — slower, defeats the comparison purpose
  - Web Workers — unnecessary complexity for network-bound I/O

### 5. Translation state per provider in TranslationWorkbench
- **What:** TranslationWorkbench holds a `Map<string, TranslationState>` keyed by provider ID. Each entry tracks status (`idle` | `streaming` | `done` | `error`), accumulated text, and optional error message. This map is passed down to TargetPanel → ProviderCard.
- **Why:** Centralizing translation state in the workbench keeps the orchestration logic in one place. ProviderCard remains a pure display component.
- **Alternatives considered:**
  - Each ProviderCard manages its own fetch — harder to coordinate, cancel, or disable the button globally

## Risks / Trade-offs
- **`openai` SDK bundle size** — The package adds ~50KB gzipped. Mitigated by Vite's tree-shaking (only `OpenAI` class and chat completion methods are imported).
- **CORS issues** — Some OpenAI-compatible APIs may not support browser-side requests. This is a user configuration concern, not an app-level issue. The existing `checkProviderConnection` already faces the same constraint.
- **No abort/cancel during streaming** — Initial implementation will not support cancelling in-flight requests. This can be added later via `AbortController` passed to the SDK.

## Open Questions
- None identified; scope is clear.
