## ADDED Requirements

### Requirement: Homepage Layout
The system SHALL render a full-page homepage layout containing a top navigation bar, a central translation workbench, and a footer.

#### Scenario: Full homepage rendered on load
- **WHEN** the user visits the application
- **THEN** the homepage SHALL display a TopNavBar at the top, TranslationWorkbench in the center, and Footer at the bottom
- **AND** the layout SHALL use the full viewport height with sticky top bar and bottom-pinned footer

### Requirement: Top Navigation Bar
The system SHALL display a sticky top navigation bar with the application brand, navigation links, and a configuration button.

#### Scenario: TopNavBar elements visible
- **WHEN** the homepage loads
- **THEN** the TopNavBar SHALL show a "MultiTranslate" brand with a translate icon on the left
- **AND** SHALL show navigation links "History" and "Saved" for desktop viewports
- **AND** SHALL show a "配置" (Settings) button with a gear icon on the right
- **AND** the bar SHALL remain sticky at the top when scrolling

#### Scenario: NavLink hover states
- **WHEN** the user hovers over a navigation link
- **THEN** the link SHALL transition to the primary color

### Requirement: Translation Workbench — Source Panel
The system SHALL provide a source language input panel as the left half of the translation workbench on desktop.

#### Scenario: SourcePanel visible and interactive
- **WHEN** the translation workbench renders
- **THEN** the SourcePanel SHALL display a language selector with "检测语言" (detect language) label and a dropdown arrow
- **AND** SHALL display a textarea with placeholder "在此输入需要翻译的文本..."
- **AND** SHALL display a character counter showing "0 / 5000"
- **AND** SHALL display a microphone icon button

#### Scenario: Clear text button
- **WHEN** the user clicks the close icon in the source panel header
- **THEN** the textarea content SHALL be cleared

### Requirement: Translation Workbench — Target Panel
The system SHALL provide a target language output panel as the right half of the translation workbench on desktop.

#### Scenario: TargetPanel visible with language options
- **WHEN** the translation workbench renders
- **THEN** the TargetPanel SHALL display quick-select language buttons: "英语" and "日语"
- **AND** SHALL display a "more languages" dropdown button with an expand icon
- **AND** SHALL display translation result area containing ProviderCard components

### Requirement: Translation Workbench — Provider Cards
The system SHALL display translation results from multiple service providers as individual cards.

#### Scenario: Multiple provider cards rendered
- **WHEN** the translation workbench renders
- **THEN** at least three ProviderCard components SHALL be displayed in a vertical list
- **AND** each card SHALL contain a provider name heading (e.g. "Deepseek-v4", "Minimax 2.6", "OpenAI (GPT-4)")
- **AND** each card SHALL display placeholder text "等待翻译..." in italic when no translation is available
- **AND** each card SHALL provide copy and read-aloud icon buttons

#### Scenario: Provider card action buttons
- **WHEN** the user hovers over the copy or volume icon in a provider card
- **THEN** the icon SHALL show a hover effect transitioning to primary color

### Requirement: Translation Workbench — Swap Language Button
The system SHALL provide a button to swap source and target languages.

#### Scenario: Desktop swap button position
- **WHEN** the viewport is desktop width
- **THEN** a swap button with a "swap_horiz" icon SHALL be positioned absolutely at the vertical center between the source and target panels

#### Scenario: Mobile swap button position
- **WHEN** the viewport is mobile width
- **THEN** a swap button with a rotated "swap_horiz" icon SHALL be positioned between the source and target panels in the vertical flow

### Requirement: Translate Action Button
The system SHALL provide an explicit translate action button below the workbench.

#### Scenario: Translate button visible
- **WHEN** the translation workbench renders
- **THEN** a "翻译" button with an arrow_forward icon SHALL be displayed
- **AND** SHALL use the primary container color with hover transition to primary

### Requirement: Footer
The system SHALL display a footer with copyright and legal links.

#### Scenario: Footer rendered
- **WHEN** the homepage loads
- **THEN** the footer SHALL display copyright text "© 2024 LinguistAI Utility. All rights reserved."
- **AND** SHALL display links: "Help Center", "Privacy Policy", "Terms of Service"
- **AND** footer SHALL be pinned to the bottom of the page

### Requirement: Responsive Layout
The system SHALL adapt the translation workbench layout based on viewport width.

#### Scenario: Desktop layout (>= md breakpoint)
- **WHEN** the viewport width is at least 768px
- **THEN** the source and target panels SHALL be displayed side-by-side (each 50% width)

#### Scenario: Mobile layout (< md breakpoint)
- **WHEN** the viewport width is less than 768px
- **THEN** the source panel SHALL be on top and the target panel below
- **AND** a horizontal separator with the swap button SHALL appear between panels
- **AND** navigation links SHALL be hidden

### Requirement: Color Theme
The system SHALL use the default shadcn/ui theme tokens without any custom color variables.

#### Scenario: shadcn default tokens applied
- **WHEN** the application renders
- **THEN** colors SHALL use the existing shadcn CSS variables defined in `src/index.css` (`--primary`, `--secondary`, `--muted`, `--border`, `--background`, `--foreground`, etc.)
- **AND** no custom color tokens SHALL be added to the `@theme inline` block
- **AND** the built-in dark mode toggle (pressing `d` key) SHALL continue to work with shadcn default dark tokens

#### Scenario: Design colors mapped to shadcn equivalents
- **WHEN** implementing the HTML design mockup
- **THEN** design colors SHALL be mapped to the closest shadcn token equivalents (e.g., `bg-surface` → `bg-background`, `text-on-surface` → `text-foreground`, `border-outline-variant` → `border-border`, `bg-surface-container-lowest` → `bg-card`, `text-on-surface-variant` → `text-muted-foreground`, `text-primary-container` → `bg-primary`)

#### Scenario: Typography tokens applied
- **WHEN** any text element renders
- **THEN** the Inter Variable font family (configured via `@fontsource-variable/inter` in `index.css`) SHALL be used
- **AND** font sizing SHALL use Tailwind's default type scale (text-sm, text-base, text-lg, text-xl, etc.)