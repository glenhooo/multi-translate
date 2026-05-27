## ADDED Requirements

### Requirement: Streaming Translation Execution
The system SHALL execute translations by calling OpenAI-compatible chat completion APIs with streaming enabled, displaying results in real-time as tokens arrive.

#### Scenario: Successful streaming translation
- **WHEN** the user clicks the translate button with non-empty source text and at least one enabled provider
- **THEN** the system SHALL send a chat completion request to each enabled provider concurrently
- **THEN** the system SHALL display streamed text chunks in the corresponding ProviderCard as they arrive, producing a typewriter effect
- **THEN** each ProviderCard SHALL transition from `idle` to `streaming` to `done` status

#### Scenario: Empty source text validation
- **WHEN** the user clicks the translate button with empty source text
- **THEN** the translate button SHALL be disabled and no API call SHALL be made

#### Scenario: No enabled providers
- **WHEN** the user clicks the translate button with no enabled providers configured
- **THEN** no API call SHALL be made and the existing empty-state message SHALL remain visible

### Requirement: Prompt Construction
The system SHALL construct the translation prompt using the user-configured prompt template, substituting source text, source language, and target language variables before sending the request.

#### Scenario: Prompt built from template
- **WHEN** a translation request is initiated
- **THEN** the system SHALL load the prompt template from settings (or use the default) and replace `{sourceText}`, `{sourceLanguage}`, and `{targetLanguage}` with actual values
- **THEN** the constructed prompt SHALL be sent as the user message in the chat completion request

### Requirement: Parallel Multi-Provider Translation
The system SHALL send translation requests to all enabled providers concurrently, with each provider's result tracked independently.

#### Scenario: Multiple providers translating simultaneously
- **WHEN** translation is triggered with 2 or more enabled providers
- **THEN** all providers SHALL receive their requests concurrently (not sequentially)
- **THEN** each ProviderCard SHALL update independently as its own stream progresses

#### Scenario: One provider fails while others succeed
- **WHEN** one provider returns an error during translation
- **THEN** the failed provider's ProviderCard SHALL display an error message
- **THEN** other providers SHALL continue streaming unaffected

### Requirement: Translation State Display
Each ProviderCard SHALL display its current translation state: idle (waiting), streaming (in progress with typewriter effect), done (complete), or error (failed).

#### Scenario: Idle state
- **WHEN** no translation has been triggered for a provider
- **THEN** the ProviderCard SHALL display the placeholder text "等待翻译..."

#### Scenario: Streaming state with typewriter effect
- **WHEN** a translation stream is active for a provider
- **THEN** the ProviderCard SHALL display accumulated text chunks rendered incrementally as they arrive
- **THEN** a loading indicator SHALL be visible while streaming

#### Scenario: Done state
- **WHEN** a translation stream completes successfully
- **THEN** the ProviderCard SHALL display the full translated text
- **THEN** the loading indicator SHALL be removed

#### Scenario: Error state
- **WHEN** a translation request fails (network error, API error, or parse error)
- **THEN** the ProviderCard SHALL display an error message describing the failure
- **THEN** the error message SHALL be visually distinct from normal translation text

### Requirement: Translate Button State
The translate button SHALL be disabled while any translation is in progress to prevent duplicate requests.

#### Scenario: Button disabled during translation
- **WHEN** at least one provider is in `streaming` status
- **THEN** the translate button SHALL be disabled and visually indicate a loading state

#### Scenario: Button re-enabled after completion
- **WHEN** all providers have finished streaming (all in `done` or `error` status)
- **THEN** the translate button SHALL be re-enabled for the next translation

### Requirement: Third-Party Library for LLM Response Parsing
The system SHALL use the `openai` npm package (official OpenAI SDK) to handle chat completion API calls and SSE stream parsing.

#### Scenario: SDK-based streaming
- **WHEN** a translation request is sent
- **THEN** the system SHALL use the `openai` SDK's `chat.completions.create({ stream: true })` method
- **THEN** the SDK SHALL handle SSE parsing and provide an async iterator of text delta chunks
