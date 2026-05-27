# Change: Add settings route and provider configuration page

## Why
Users need a dedicated place to configure their OpenAI API-compatible translation providers before comparing translation results. The provided desktop and mobile HTML mockups define a settings experience that should become a first-class frontend route at `/settings`.

## What Changes
- Add a frontend `/settings` route that renders a new configuration page when users click the homepage top-right "配置" button.
- Build a responsive settings page based on the supplied HTML designs, including desktop sidebar navigation and mobile bottom navigation.
- Add provider management UI for configuring provider name, enabled state, API Base URL, API Key, and comma-separated model names.
- Persist provider configuration locally in the browser so API keys and settings never leave the user's device.
- Add import/export UI for local configuration JSON management.
- Map the HTML mockup's Material Design color classes to existing shadcn/Tailwind theme tokens instead of adding custom color variables.

## Impact
- Affected specs: settings
- Affected code: `src/App.tsx`, homepage navigation, new `src/components/settings/` components, possible shared localStorage utilities in `src/lib/`
- Dependencies: no new runtime dependency is required; icons should use the existing `lucide-react` dependency rather than external icon fonts/CDNs.
