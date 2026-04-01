# docmaker

A standalone, open-source guide editor that runs entirely in your browser. Create beautiful, multilingual documentation with no server required — everything is stored in localStorage.

![docmaker](https://img.shields.io/badge/version-1.0.0-blue) ![license](https://img.shields.io/badge/license-MIT-green) ![react](https://img.shields.io/badge/react-19-blue) ![typescript](https://img.shields.io/badge/typescript-5.7-blue)

## Features

- **24 block types** — text, headings, images, videos, alerts, code, tables, steps, FAQs, cards, dividers, and more
- **5 built-in themes** — Dark Navy, Midnight, Arctic, Emerald, Corporate + unlimited custom themes
- **Multilingual** — translate guides into 18+ languages using Gemini, OpenAI, DeepL, or a custom endpoint
- **4 export formats** — Standalone HTML, GitHub Markdown, JSON backup, PDF via print dialog
- **Live preview** — inline preview with desktop/tablet/mobile device switching
- **Drag & drop** — reorder sections and blocks with @dnd-kit
- **Zero dependencies at runtime** — exported HTML files have no external dependencies
- **100% local** — no accounts, no server, no tracking. All data in localStorage

## Quick Start

```bash
git clone https://github.com/s5xx5s/docmaker.git
cd docmaker
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Usage

1. **Create a project** — click "New Project" on the home screen
2. **Add a guide** — open a project and click "New Guide"
3. **Edit content** — click a section, then add blocks from the block palette
4. **Pick a theme** — click "Theme" in the editor toolbar
5. **Translate** — click "Translate" to add languages and auto-translate content
6. **Export** — click "Export" to download as HTML, Markdown, JSON, or PDF

## Block Types

| Category | Blocks |
|----------|--------|
| Text | Paragraph, Heading (H1/H2/H3), Quote, Callout |
| Media | Image, Video, Code |
| Layout | Divider, Spacer, Columns |
| Structure | Steps, FAQ, Cards, Table |
| Interactive | Accordion, Tabs, Alert |
| Navigation | Button, Link |
| Embed | HTML Embed, Badge |

## Translation Providers

| Provider | Model | Notes |
|----------|-------|-------|
| Gemini | gemini-1.5-flash | Free tier available |
| OpenAI | gpt-4o-mini | Fast and affordable |
| DeepL | v2 API | Free tier up to 500K chars/month |
| Custom | Any REST API | Bring your own endpoint |

API keys are stored in localStorage and never sent anywhere except the respective provider.

## Export Formats

### HTML
Exports a fully standalone `.html` file with:
- All CSS inlined (theme + block styles)
- JavaScript inlined (accordion, lightbox, language switcher, sidebar nav)
- Google Fonts linked
- Responsive sidebar navigation
- Language switcher if multiple languages exist

### Markdown
GitHub-flavored markdown with:
- Auto-generated table of contents
- All 24 block types rendered as appropriate markdown

### JSON
Full guide data export — can be re-imported into docmaker.

### PDF
Opens a print-optimized window and triggers the browser's print dialog. Save as PDF from there.

## Themes

Each theme defines:
- Color palette (primary, background, text, accent, border, sidebar, code bg, etc.)
- Typography (heading font, body font, font size, line height)
- Spacing (border radius, section padding, content width)
- Custom CSS (arbitrary overrides)

Custom themes are saved to localStorage and can be exported/imported as JSON.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript 5.7 |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Icons | lucide-react |
| Storage | localStorage (browser-native) |

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Project Structure

```
src/
├── components/
│   ├── blocks/          # 24 block components + BlockRenderer + BlockList
│   ├── editor/          # SectionList
│   ├── export/          # ExportPanel
│   ├── preview/         # GuidePreview
│   ├── project/         # ProjectCard, ProjectModal
│   ├── theme/           # ThemePicker, ThemeCustomizer
│   └── translation/     # TranslationPanel
├── export/              # html.ts, markdown.ts, json.ts, pdf.ts
├── pages/               # Home, ProjectPage, Editor, Preview, Settings
├── providers/           # translation.ts (Gemini, OpenAI, DeepL, Custom)
├── store/               # project.store, theme.store, settings.store
├── types/               # index.ts (Block, Guide, Project, Theme types)
└── utils/               # id.ts, storage.ts
```

## License

MIT — see [LICENSE](LICENSE)
