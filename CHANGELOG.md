# Changelog

All notable changes to docmaker are documented in this file.

## [1.0.0] — 2025

### Added

#### Core Editor
- Project and guide management with localStorage persistence
- Drag-and-drop section and block reordering via @dnd-kit
- Auto-save every 2 seconds with save status indicator
- Device preview switching (desktop / tablet / mobile)
- Inline live preview panel alongside the editor

#### 24 Block Types
- **Text blocks**: Paragraph, Heading (H1/H2/H3), Quote, Callout
- **Media blocks**: Image (URL or base64), Video (embed URL), Code (with language label)
- **Layout blocks**: Divider, Spacer, Two-Column layout
- **Structure blocks**: Steps (numbered list), FAQ (question/answer pairs), Cards (grid), Table (headers + rows)
- **Interactive blocks**: Accordion (collapsible), Tabs, Alert (info/warning/danger/success)
- **Navigation blocks**: Button (link with style variants), Link
- **Embed blocks**: Raw HTML embed, Badge

#### Theming
- 5 built-in themes: Dark Navy, Midnight, Arctic, Emerald, Corporate
- Theme customizer with 4 tabs: Colors, Fonts, Spacing, Custom CSS
- Live preview while customizing
- Export/import custom themes as JSON
- CSS custom properties (`--gp-*`) as single source of truth between preview and HTML export

#### Multilingual Support
- Add/remove languages per guide (18 pre-defined common languages)
- Auto-translate sections using: Gemini (gemini-1.5-flash), OpenAI (gpt-4o-mini), DeepL (v2), or any custom REST API
- API keys stored locally, never transmitted except to chosen provider
- Translation stored per section per language code
- Language switcher in preview and exported HTML

#### Export
- **HTML**: Standalone file — all CSS and JS inlined, Google Fonts linked, responsive sidebar, language switcher, lightbox for images, accordion for FAQ/Accordion blocks
- **Markdown**: GitHub-flavored with auto-generated table of contents
- **JSON**: Full guide data — re-importable into docmaker
- **PDF**: Print-optimized view with browser print dialog

#### Settings
- Interface language (English / Arabic)
- Auto-save interval (5s / 10s / 30s / 1m / 5m)
- Default theme for new guides
- Default content language for new guides
- localStorage usage stats (projects / guides / sections / KB)
- Export all projects as JSON backup
- Import projects from JSON
- Clear all data
