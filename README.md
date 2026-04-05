<div align="center">

<img src="https://raw.githubusercontent.com/s5xx5s/docmaker/main/public/favicon.svg" alt="docmaker" width="64" height="64" />

# docmaker

**محرر أدلة مستقل ومفتوح المصدر — يعمل كاملاً في المتصفح**

*A standalone, open-source guide editor — runs entirely in your browser*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-s5xx5s.github.io%2Fdocmaker-blue?style=for-the-badge)](https://s5xx5s.github.io/docmaker/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

<br/>

[**🚀 Try it live →**](https://s5xx5s.github.io/docmaker/) &nbsp;·&nbsp;
[**📖 Documentation**](docs/) &nbsp;·&nbsp;
[**🐛 Report a Bug**](https://github.com/s5xx5s/docmaker/issues) &nbsp;·&nbsp;
[**✨ Request a Feature**](https://github.com/s5xx5s/docmaker/issues)

</div>

---

## ✨ What is docmaker?

**docmaker** is a browser-based guide editor that lets you create beautiful, professional documentation in minutes — with **zero setup, zero accounts, and zero server**.

> بناء أدلة المستخدم الاحترافية في دقائق — بدون خادم أو حساب أو إنترنت

Everything is stored in your browser's `localStorage`. Export your guides as a **standalone HTML file**, **Markdown**, **JSON**, or **PDF** — and share them anywhere.

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| ✏️ **24 Block Types** | Text, Steps, Cards, FAQ, Table, Code, Gallery, Timeline, Stats, Accordion, and more |
| 🎨 **5 Built-in Themes** | Dark Navy, Midnight, Arctic (light), Emerald, Corporate + unlimited custom themes |
| 🌍 **Multilingual** | Auto-translate into 18+ languages using Gemini, OpenAI, DeepL, or a custom API |
| 📤 **4 Export Formats** | Standalone HTML · GitHub Markdown · JSON backup · PDF |
| 👁️ **Live Preview** | Inline preview with desktop / tablet / mobile switching |
| ↔️ **RTL Support** | Full right-to-left support — including Arabic, Hebrew, Persian |
| 🖱️ **Drag & Drop** | Reorder sections and blocks with smooth drag handles |
| 🔒 **100% Private** | No tracking, no analytics, no accounts — your data never leaves your device |

---

## 🚀 Quick Start

### Use online (no install)
👉 **[https://s5xx5s.github.io/docmaker/](https://s5xx5s.github.io/docmaker/)**

### Run locally

```bash
git clone https://github.com/s5xx5s/docmaker.git
cd docmaker
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 How to Use

```
1. Create a Project   →  click "New Project" on the home screen
2. Add a Guide        →  open a project → "New Guide"
3. Add Sections       →  click + in the sections panel
4. Add Blocks         →  click "+ Add" in the blocks panel
5. Pick a Theme       →  click "Theme" in the editor toolbar
6. Translate          →  click "Translate" to add languages
7. Export             →  click "Export" → choose format
```

---

## 🧩 Block Types (24)

<details>
<summary><strong>📝 Text & Content</strong></summary>

| Block | Description |
|-------|-------------|
| `text` | Paragraph with alignment control |
| `highlight` | Callout box — info / warning / success / danger |
| `quote` | Blockquote with author and source |
| `alert` | Dismissible alert — 5 variants including tip |
| `divider` | Section separator — solid / dashed / dotted |

</details>

<details>
<summary><strong>📋 Structure</strong></summary>

| Block | Description |
|-------|-------------|
| `steps` | Numbered step-by-step list |
| `checklist` | Interactive to-do list |
| `faq` | Question and answer pairs |
| `table` | Headers + rows with optional striping |
| `compare` | Side-by-side comparison (pros/cons) |
| `cards` | Icon + title + description cards grid |
| `timeline` | Vertical or horizontal timeline |
| `flow` | Process flow with arrows |

</details>

<details>
<summary><strong>🖼️ Media</strong></summary>

| Block | Description |
|-------|-------------|
| `image` | Image (URL or base64) with caption |
| `video` | YouTube, Vimeo, or direct video URL |
| `gallery` | Image grid with lightbox navigation |
| `code` | Syntax-highlighted code block |
| `embed` | Iframe embed |

</details>

<details>
<summary><strong>📊 Data & Display</strong></summary>

| Block | Description |
|-------|-------------|
| `stats` | KPI stat cards with value + label |
| `rating` | Star rating display |
| `logo` | Logo image with optional link |
| `button` | CTA button — 4 styles, 3 sizes |
| `image-text` | Side-by-side image + text |
| `accordion` | Collapsible content panels |

</details>

---

## 🌍 Translation Providers

| Provider | Model | Free Tier |
|----------|-------|-----------|
| **Google Gemini** | `gemini-1.5-flash` | ✅ Yes |
| **OpenAI** | `gpt-4o-mini` | ❌ Paid (cheap) |
| **DeepL** | v2 API | ✅ 500K chars/month |
| **Custom** | Any REST endpoint | ✅ Bring your own |

> API keys are stored in your browser's `localStorage` only — never sent to any third party.

---

## 📤 Export Formats

### 🌐 HTML (recommended)
Fully standalone `.html` file — no external dependencies:
- All CSS inlined (theme + block styles via CSS custom properties)
- JavaScript inlined (accordion, lightbox, language switcher, sidebar nav)
- Google Fonts linked · Responsive sidebar navigation
- Language switcher when multiple languages are present

### 📝 Markdown
GitHub-flavored markdown with auto-generated table of contents.

### 💾 JSON
Full data export — re-import into docmaker at any time.

### 📄 PDF
Opens a print-optimized window → save via browser's print dialog.

---

## 🎨 Theming

Each theme controls:
- **Colors** — primary, background, text, accent, border, sidebar, code bg, heading
- **Typography** — heading font, body font, font size, line height
- **Spacing** — border radius, section padding, content max-width
- **Custom CSS** — arbitrary style overrides

Custom themes are saved to `localStorage` and can be exported / imported as JSON.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript 5.5 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| State management | Zustand 5 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Icons | lucide-react |
| Storage | Browser `localStorage` |
| Deployment | GitHub Pages (GitHub Actions) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── blocks/          # 24 block components (one file per type)
│   ├── editor/          # SectionList, BlockList, BlockWrapper, BlockPicker
│   ├── export/          # ExportPanel
│   ├── preview/         # GuidePreview
│   ├── project/         # ProjectCard, ProjectModal
│   ├── theme/           # ThemePicker, ThemeCustomizer
│   └── translation/     # TranslationPanel
├── data/                # demoProject.ts (seeded for new visitors)
├── export/              # html.ts · markdown.ts · json.ts · pdf.ts
├── pages/               # Landing · Home · ProjectPage · Editor · Preview · Settings
├── providers/           # translation.ts (Gemini, OpenAI, DeepL, Custom)
├── store/               # project.store · theme.store · settings.store
├── types/               # Block · Guide · Project · Theme TypeScript types
└── utils/               # id.ts · storage.ts
```

---

## 🧑‍💻 Development

```bash
npm run dev       # Start development server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

### Deploy to GitHub Pages

Push to `main` → GitHub Actions builds and deploys automatically.

See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to add a new block type
- How to add a translation provider
- Code style guidelines

---

## 📄 License

**MIT** — free to use, modify, and distribute. See [LICENSE](LICENSE).

---

<div align="center">

Made with ❤️ · **vibe coding**

⭐ If you find this useful, consider giving it a star!

</div>
