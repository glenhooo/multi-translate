export const DEFAULT_PROMPT_TEMPLATE =
  "Translate the following {sourceLanguage} text to {targetLanguage}. Only return the translated text, nothing else.\n\n{sourceText}"

export type PromptVariables = {
  sourceText: string
  sourceLanguage: string
  targetLanguage: string
}

/**
 * Replaces {variable} placeholders in the template with corresponding values.
 * Unknown variables are left unchanged in the output.
 */
export function replaceVariables(
  template: string,
  vars: PromptVariables
): string {
  let result = template

  result = result.replace(/\{sourceText\}/g, vars.sourceText)
  result = result.replace(/\{sourceLanguage\}/g, vars.sourceLanguage)
  result = result.replace(/\{targetLanguage\}/g, vars.targetLanguage)

  return result
}