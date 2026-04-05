// ── Demo Project ─────────────────────────────────────────────────────────────
// Shown to every new visitor who has no projects yet.
// Showcases all major block types across 5 sections.

import type { Project, Guide, Section, Block } from '../types';

const D = 'demo'; // fixed id prefix — stays stable

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function block(b: Record<string, any>): Block {
  return { id: b['id'] ?? Math.random().toString(36).slice(2), ...b } as Block;
}

// ── Section 1: Welcome ────────────────────────────────────────────────────────
const sec1: Section = {
  id: `${D}-s1`,
  title: '👋 Welcome to docmaker',
  order: 0,
  isActive: true,
  translations: {
    ar: { title: '👋 مرحباً بك في docmaker', blocks: [] }
  },
  blocks: [
    block({ id: `${D}-b1`, type: 'highlight', variant: 'info',
      title: 'What is docmaker?',
      content: 'A standalone, open-source guide editor that works entirely in your browser. No sign-up, no server, no tracking — everything is stored locally.'
    }),
    block({ id: `${D}-b2`, type: 'text',
      content: 'Use this tool to build user manuals, onboarding guides, API documentation, product walkthroughs, or any structured documentation — then export it as a standalone HTML file, Markdown, JSON, or PDF.',
      align: 'left'
    }),
    block({ id: `${D}-b3`, type: 'stats',
      items: [
        { value: '24', label: 'Block Types', prefix: '', suffix: '' },
        { value: '5',  label: 'Built-in Themes', prefix: '', suffix: '' },
        { value: '4',  label: 'Export Formats', prefix: '', suffix: '' },
        { value: '18+', label: 'Languages', prefix: '', suffix: '' },
      ],
      columns: 4
    }),
    block({ id: `${D}-b4`, type: 'divider', style: 'solid', label: '' }),
    block({ id: `${D}-b5`, type: 'cards', columns: 3,
      cards: [
        { title: 'Editor', description: 'Drag & drop blocks, reorder sections, live preview.', icon: '✏️' },
        { title: 'Themes',  description: '5 built-in themes + unlimited custom themes.', icon: '🎨' },
        { title: 'Export',  description: 'HTML, Markdown, JSON, or PDF — fully standalone.', icon: '📤' },
      ]
    }),
  ],
};

// ── Section 2: Getting Started ────────────────────────────────────────────────
const sec2: Section = {
  id: `${D}-s2`,
  title: '🚀 Getting Started',
  order: 1,
  isActive: true,
  translations: {
    ar: { title: '🚀 كيف تبدأ', blocks: [] }
  },
  blocks: [
    block({ id: `${D}-b10`, type: 'steps',
      steps: [
        { title: 'Create a Project',   description: 'Click "New Project" on the home screen and give it a name.' },
        { title: 'Add a Guide',        description: 'Open your project and click "New Guide" to create the first guide.' },
        { title: 'Build with Blocks',  description: 'Select a section on the left, then click "+ Add" to pick a block type.' },
        { title: 'Pick a Theme',       description: 'Click "Theme" in the editor toolbar to choose or customize a theme.' },
        { title: 'Export',             description: 'Click "Export" and download your guide as HTML, Markdown, JSON, or PDF.' },
      ]
    }),
    block({ id: `${D}-b11`, type: 'alert', variant: 'tip',
      title: '💡 Auto-save',
      content: 'Your work is saved automatically every 2 seconds. You can also press the "Save" button at any time.'
    }),
    block({ id: `${D}-b12`, type: 'checklist', interactive: true,
      items: [
        { label: 'Create your first project', checked: false },
        { label: 'Add a guide with at least 3 sections', checked: false },
        { label: 'Try a Text block and a Steps block', checked: false },
        { label: 'Switch themes to see the difference', checked: false },
        { label: 'Export your guide as standalone HTML', checked: false },
      ]
    }),
  ],
};

// ── Section 3: Block Types ────────────────────────────────────────────────────
const sec3: Section = {
  id: `${D}-s3`,
  title: '🧩 Block Types',
  order: 2,
  isActive: true,
  translations: {
    ar: { title: '🧩 أنواع البلوكات', blocks: [] }
  },
  blocks: [
    block({ id: `${D}-b20`, type: 'accordion',
      items: [
        { title: '📝 Text & Content',   defaultOpen: true,
          content: 'Text • Highlight (info/warning/success/danger) • Quote • Alert (5 variants) • Divider' },
        { title: '📋 Structure',        defaultOpen: false,
          content: 'Steps • Checklist • FAQ • Table • Compare (pros/cons) • Cards • Timeline • Flow' },
        { title: '🖼️ Media',            defaultOpen: false,
          content: 'Image • Video (YouTube/Vimeo/direct) • Gallery (lightbox) • Code (syntax highlight) • Embed' },
        { title: '📊 Data & Display',   defaultOpen: false,
          content: 'Stats • Rating • Logo • Button • Image + Text (split layout)' },
      ]
    }),
    block({ id: `${D}-b21`, type: 'code',
      language: 'javascript',
      showLineNumbers: true,
      code: `// Example: fetch data and display it
async function loadGuide(guideId) {
  const response = await fetch(\`/api/guides/\${guideId}\`);
  const guide = await response.json();

  guide.sections.forEach(section => {
    console.log(\`Section: \${section.title}\`);
    console.log(\`Blocks: \${section.blocks.length}\`);
  });
}

loadGuide('my-guide-id');`
    }),
    block({ id: `${D}-b22`, type: 'quote',
      content: 'Documentation is a love letter that you write to your future self.',
      author: 'Damian Conway',
      source: ''
    }),
    block({ id: `${D}-b23`, type: 'compare',
      leftTitle: '✅ With Good Docs',
      rightTitle: '❌ Without Docs',
      leftItems: ['Fast onboarding', 'Self-service support', 'Consistent usage', 'Fewer mistakes'],
      rightItems: ['Slow onboarding', 'Constant questions', 'Inconsistent usage', 'Costly errors'],
    }),
  ],
};

// ── Section 4: Theming ────────────────────────────────────────────────────────
const sec4: Section = {
  id: `${D}-s4`,
  title: '🎨 Themes & Customization',
  order: 3,
  isActive: true,
  translations: {
    ar: { title: '🎨 الثيمات والتخصيص', blocks: [] }
  },
  blocks: [
    block({ id: `${D}-b30`, type: 'highlight', variant: 'success',
      title: '5 Built-in Themes',
      content: 'Dark Navy · Midnight · Arctic (light) · Emerald · Corporate — all professionally designed and ready to use.'
    }),
    block({ id: `${D}-b31`, type: 'steps',
      steps: [
        { title: 'Click "Theme" in the editor toolbar', description: 'Opens the theme picker with all built-in and custom themes.' },
        { title: 'Select a theme',                       description: 'Click any swatch to preview it live in the editor.' },
        { title: 'Customize (optional)',                 description: 'Click "Customize" to edit colors, fonts, spacing, or add custom CSS.' },
        { title: 'Export custom theme',                  description: 'Save your theme as JSON to reuse across projects.' },
      ]
    }),
    block({ id: `${D}-b32`, type: 'alert', variant: 'info',
      title: 'CSS Custom Properties',
      content: 'All theme colors are exposed as CSS variables (--gp-primary, --gp-bg, etc.) — your exported HTML file matches the preview exactly.'
    }),
  ],
};

// ── Section 5: Export ─────────────────────────────────────────────────────────
const sec5: Section = {
  id: `${D}-s5`,
  title: '📤 Export & Share',
  order: 4,
  isActive: true,
  translations: {
    ar: { title: '📤 التصدير والمشاركة', blocks: [] }
  },
  blocks: [
    block({ id: `${D}-b40`, type: 'table',
      striped: true,
      headers: ['Format', 'Best For', 'Self-contained?'],
      rows: [
        ['🌐 HTML',     'Share online, embed in websites',    '✅ Yes — single file, no deps'],
        ['📝 Markdown', 'GitHub README, wikis, docs sites',   '⚠️  Images as URLs'],
        ['💾 JSON',     'Backup, re-import, version control', '✅ Yes — full fidelity'],
        ['📄 PDF',      'Print, offline reading',             '✅ Via browser print dialog'],
      ]
    }),
    block({ id: `${D}-b41`, type: 'highlight', variant: 'warning',
      title: 'Multilingual Export',
      content: 'When your guide has multiple languages, click "Translate" to auto-translate all blocks using Gemini, OpenAI, DeepL, or a custom endpoint.'
    }),
    block({ id: `${D}-b42`, type: 'faq',
      items: [
        { question: 'Is my data stored on a server?',
          answer: 'No. Everything is stored in your browser\'s localStorage. Nothing leaves your device unless you export and share it.' },
        { question: 'Can I use docmaker offline?',
          answer: 'Yes. After the first load the app works fully offline. Export your guides anytime without an internet connection.' },
        { question: 'How do I share a guide with someone?',
          answer: 'Export it as HTML (a single .html file) and send it by email, upload to a web server, or host it on GitHub Pages.' },
        { question: 'Can I contribute or self-host?',
          answer: 'Yes! docmaker is open-source (MIT). Fork the repo, add block types, or deploy your own instance.' },
      ]
    }),
    block({ id: `${D}-b43`, type: 'button',
      label: '⭐ View on GitHub / عرض على GitHub',
      href: 'https://github.com/s5xx5s/docmaker',
      variant: 'primary', size: 'md', align: 'center'
    }),
  ],
};

// ── Guide ─────────────────────────────────────────────────────────────────────
const demoGuide: Guide = {
  id: `${D}-guide`,
  projectId: `${D}-project`,
  title: 'docmaker — Feature Tour',
  subtitle: 'A complete walkthrough of all features',
  themeId: 'dark-navy',
  direction: 'ltr',
  defaultLang: 'en',
  availableLangs: [
    { code: 'en', name: 'English',  dir: 'ltr', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  ],
  sections: [sec1, sec2, sec3, sec4, sec5],
  isPublished: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ── Project ───────────────────────────────────────────────────────────────────
export const demoProject: Project = {
  id: `${D}-project`,
  name: 'docmaker Demo',
  description: 'Example project — explore all features then create your own!',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  guides: [demoGuide],
};

export const DEMO_SEEDED_KEY = 'docmaker_demo_seeded';
