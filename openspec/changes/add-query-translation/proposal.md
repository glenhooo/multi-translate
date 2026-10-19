# Change: Translate text from the `q` URL parameter

## Why
Users should be able to share or open a URL containing text and have it translated immediately, without pasting the text and starting the translation manually.

## What Changes
- Read the `q` query parameter when the homepage workbench first loads.
- Populate the source input with the decoded value and automatically start translation when it is non-empty.
- Respect the existing 5,000-character input limit.
- Do not repeatedly trigger translation for the same initial URL value during React development Strict Mode effects.

## Impact
- Affected specs: `homepage`
- Affected code: `src/components/homepage/translation-workbench.tsx`
