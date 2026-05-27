## ADDED Requirements

### Requirement: Prompt Template Default
The system SHALL provide a default translation prompt template with three supported variables.

#### Scenario: Default prompt template defined
- **WHEN** the application initializes or no custom prompt template is set
- **THEN** the default prompt template SHALL contain the variable placeholders `{sourceText}`, `{sourceLanguage}`, and `{targetLanguage}`
- **AND** the default SHALL instruct the model to translate the source text and return only the translated result

### Requirement: Variable Substitution
The system SHALL provide a utility that substitutes variable placeholders in a prompt template with actual values before sending a translation request.

#### Scenario: Basic substitution
- **WHEN** `replaceVariables` is called with a template containing `{sourceText}`, `{sourceLanguage}`, and `{targetLanguage}`
- **THEN** each `{variable}` placeholder SHALL be replaced with the corresponding value from the provided variable map

#### Scenario: Unknown variables preserved
- **WHEN** the template contains a `{unknownVar}` that does not match any known variable
- **THEN** the unknown placeholder SHALL remain unchanged in the output string

#### Scenario: Special characters in variable values
- **WHEN** a variable value contains characters that could be interpreted as regex or template syntax
- **THEN** the substitution SHALL treat them as literal text and SHALL NOT throw an error