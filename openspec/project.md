# Project Context

## Purpose
Multi-translate is a translation comparison tool for general users. Users configure their own OpenAI API-compatible translation services (custom API Base URL and API Key), submit text for translation, and view results from multiple services side-by-side for comparison. The tool helps users evaluate translation quality across different services by presenting results in a parallel view.

**Goals:**
- Enable users to compare translation results from multiple services visually
- Support flexible self-hosted or third-party OpenAI API-compatible endpoints
- Keep user data private — API keys and translation content never leave the browser
- Provide a responsive experience that works on both desktop and mobile

## Tech Stack
- **Language:** TypeScript (strict mode: erasableSyntaxOnly, verbatimModuleSyntax)
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4 + shadcn/ui + Radix UI primitives
- **Package Manager:** pnpm
- **Linting:** ESLint 9 (flat config) + Prettier
- **Spec-driven Development:** OpenSpec

## Project Conventions

### Code Style
- **Formatting:** Prettier with semicolons, double quotes, 2-space indent, trailing commas (ES5), print width 80
- **Naming:**
  - JS/TS variables, functions, types: camelCase
  - React components: PascalCase (exported name)
  - File names and component directories: kebab-case
  - CSS class utilities: kebab-case (via Tailwind)
- **Imports:** Use path aliases (`@/`) configured in tsconfig and vite
- **Component Pattern:** shadcn/ui style — functional components with `cva` for variant styling, `cn()` for class merging

### Architecture Patterns
- **SPA Architecture:** Pure frontend single-page application, no backend server
- **Component Organization:** Follow shadcn/ui convention — components in `src/components/ui/` for primitives, `src/components/` for app-specific components
- **State Management:** React hooks and context (no external state library unless needed later)
- **API Communication:** Direct client-side calls to user-configured OpenAI-compatible endpoints; API keys stored in browser localStorage
- **Source Language Detection:** Auto-detect source language; target language selected by user

### Testing Strategy
- Testing framework will be introduced later as the project matures
- Preferred future approach: Vitest + React Testing Library for unit tests

### Git Workflow
- **Trunk-based development:** Short-lived feature branches off main, merge via fast-forward or rebase
- **Commit style:** Descriptive messages, conventional commits preferred when applicable
- **No CI/CD pipeline yet** — will be added when deployment workflow is established

## Domain Context
- **Translation services:** Only OpenAI API-compatible format is supported; users provide their own API Base URL and API Key
- **Comparison display:** Side-by-side layout showing translation results from each configured service in parallel columns
- **Language handling:** Source language auto-detected by the translation service; target language explicitly chosen by the user
- **User role:** General users with daily translation needs who want to compare quality across services

## Important Constraints
- **No backend:** Pure frontend SPA — all computation and API calls happen in the browser
- **组件拆分:** 分析页面结构，将其拆解为合理的组件树，将组件架构图输出给用户确认。
- **Privacy-first:** User data (API keys, translation content) never leaves the browser; no server-side storage or analytics
- **Mobile responsive:** Must support mobile device usage with responsive layout
- **OpenAI API compatibility only:** Translation services must conform to OpenAI chat completion API format; users are responsible for providing valid endpoints and keys

## External Dependencies
- **OpenAI API-compatible endpoints:** User-configured external translation services accessed directly from the browser via HTTPS
- **shadcn/ui + Radix UI:** UI component primitives and patterns
- **Tailwind CSS v4:** Utility-first styling framework
- **Vite + React 19:** Build and rendering runtime