## Context
The user provided desktop and mobile HTML mockups for a settings page. The page configures translation providers and administration actions for MultiTranslate. The existing app is a React 19 + Vite SPA with shadcn-style UI primitives, Tailwind CSS v4, and a privacy-first constraint that API keys and translation content must stay in the browser.

## Goals / Non-Goals

**Goals:**
- Implement a `/settings` frontend route that can be opened from the homepage "配置" button.
- Recreate the supplied desktop and mobile settings layouts with React components and shadcn-compatible styling.
- Support local provider configuration for OpenAI API-compatible services.
- Persist settings in browser `localStorage` only.
- Keep the page responsive: desktop uses sidebar + content; mobile uses compact header + bottom nav.
- Reuse existing theme tokens and `lucide-react` icons; do not load Google Fonts, Tailwind CDN, or Material Symbols from the HTML mockup.

**Non-Goals:**
- Real translation API request execution from the settings page.
- Supporting non-OpenAI-compatible provider protocols such as native Anthropic or Google Gemini APIs.
- Full History/Saved pages; those nav entries may remain placeholders until separate proposals define them.
- Backend storage, server sync, analytics, or remote secrets management.

## Decisions

| Decision | Description | Alternatives considered |
| --- | --- | --- |
| Routing | Add a lightweight browser-history based route switch in `App.tsx` for `/` and `/settings`. This satisfies the requested clean path without adding a router dependency while the app only has two pages. | Add `react-router-dom` now; defer until nested/dynamic routes are needed. |
| Provider scope | Keep provider type OpenAI-compatible only, even though the mockup includes other protocol names. This follows the project constraint that only OpenAI API-compatible endpoints are supported. | Expose Anthropic/Gemini native types now; rejected because it conflicts with current domain constraints. |
| Persistence | Store provider configuration under one versioned localStorage key, e.g. `multi-translate:settings:v1`. API keys remain in-browser. | IndexedDB or backend storage; rejected as unnecessary for the current settings payload and privacy constraints. |
| Icons | Use existing `lucide-react` icons that semantically match the Material Symbols in the mockup. | Add Material Symbols package or Google Fonts CDN; rejected to avoid new dependency/CDN use. |
| Styling | Map mockup classes to shadcn tokens: `bg-surface`/`surface-container-*` -> `bg-background`/`bg-card`/`bg-muted`, `text-on-surface*` -> `text-foreground`/`text-muted-foreground`, `outline-variant` -> `border-border`, `primary-container` -> `bg-primary` or `bg-primary/10` where appropriate. | Add a Material 3 CSS token palette; rejected to keep theme maintenance simple. |
| Configuration import/export | Import/export JSON includes provider settings and preferences. Import replaces current local settings after validation. | Merge import with existing settings; deferred because replacement is simpler and predictable. |

## Data Model

```ts
type TranslationProviderConfig = {
  id: string;
  name: string;
  enabled: boolean;
  type: "openai-compatible";
  apiBaseUrl: string;
  apiKey: string;
  models: string[];
};

type MultiTranslateSettings = {
  schemaVersion: 1;
  providers: TranslationProviderConfig[];
  updatedAt: string;
};
```

Default seed data may include one disabled or enabled example provider to match the mockup, but saved user data MUST take precedence over defaults.

## Component Architecture

```
src/
├── App.tsx                         # route switch: / -> HomePage, /settings -> SettingsPage
├── components/
│   ├── homepage/
│   │   └── top-nav-bar.tsx         # links configuration button to /settings
│   ├── settings/
│   │   ├── settings-page.tsx       # page shell and responsive layout
│   │   ├── settings-top-nav.tsx    # desktop/mobile top header for settings
│   │   ├── settings-sidebar.tsx    # desktop settings section navigation
│   │   ├── settings-bottom-nav.tsx # mobile bottom nav for History/Saved/Settings
│   │   ├── provider-management.tsx # provider section container and add flow
│   │   ├── provider-config-card.tsx# editable provider form card
│   │   ├── provider-enabled-switch.tsx
│   │   └── configuration-admin.tsx # import/export controls
│   └── ui/
│       ├── button.tsx              # existing
│       └── form primitives as needed (input/select/switch may be added locally)
└── lib/
    ├── settings-storage.ts         # localStorage load/save/import/export helpers
    └── utils.ts                    # existing cn() helper
```

## Route Behavior
- `/` renders the existing `HomePage`.
- `/settings` renders `SettingsPage`.
- Clicking the homepage "配置" button navigates to `/settings` using SPA navigation when possible.
- Clicking the brand in the settings top nav navigates back to `/`.
- Directly opening `/settings` should render the settings page in Vite dev/preview environments; production hosting must provide the usual SPA fallback to `index.html`.

## Risks / Trade-offs
- A custom lightweight router is sufficient for two pages but may need replacement by React Router if the app gains nested routes, route loaders, or complex navigation guards.
- Storing API keys in localStorage is consistent with the current browser-only architecture but exposes keys to scripts running in the same origin; the app should avoid third-party scripts and remind users that keys are stored locally.
- Importing configuration replaces local settings, which is simpler but can overwrite existing provider entries; confirmation UI can be added during implementation if needed.
- The shadcn token mapping will not exactly match the Material Design colors in the mockup, but preserves project theme consistency and dark mode behavior.

## Open Questions
- Should the provider card include a delete action in the first implementation, or only add/save/test as shown in the mockup?
- Should the Test button perform a real OpenAI-compatible request now, or remain a UI placeholder until translation API logic is implemented?
