import type { BlockType } from '../types';

export interface GuideTemplate {
  id: string;
  icon: string;
  name:        { en: string; ar: string };
  description: { en: string; ar: string };
  sections: Array<{
    title:      { en: string; ar: string };
    icon?:      string;
    blockTypes: BlockType[];
  }>;
}

export const GUIDE_TEMPLATES: GuideTemplate[] = [
  {
    id: 'blank',
    icon: '📄',
    name:        { en: 'Blank Guide',     ar: 'دليل فارغ'         },
    description: { en: 'Start from scratch with no sections.', ar: 'ابدأ من الصفر بدون أقسام.' },
    sections: [],
  },
  {
    id: 'product-manual',
    icon: '📋',
    name:        { en: 'Product Manual',  ar: 'دليل المنتج'        },
    description: { en: 'User manual with getting started, features, and FAQ.', ar: 'دليل المستخدم: البدء، الميزات، الأسئلة الشائعة.' },
    sections: [
      { title: { en: 'Getting Started', ar: 'البدء' },           icon: '🚀', blockTypes: ['highlight', 'steps'] },
      { title: { en: 'Features',        ar: 'الميزات' },          icon: '✨', blockTypes: ['cards']              },
      { title: { en: 'FAQ',             ar: 'أسئلة شائعة' },      icon: '❓', blockTypes: ['faq']               },
      { title: { en: 'Support',         ar: 'الدعم' },            icon: '💬', blockTypes: ['text', 'button']    },
    ],
  },
  {
    id: 'api-docs',
    icon: '⚡',
    name:        { en: 'API Documentation', ar: 'توثيق API'       },
    description: { en: 'Technical reference with endpoints and code examples.', ar: 'مرجع تقني مع نقاط النهاية والأمثلة.' },
    sections: [
      { title: { en: 'Overview',        ar: 'نظرة عامة' },        icon: '📖', blockTypes: ['text', 'highlight'] },
      { title: { en: 'Authentication',  ar: 'المصادقة' },          icon: '🔑', blockTypes: ['alert', 'code']    },
      { title: { en: 'Endpoints',       ar: 'نقاط النهاية' },      icon: '🔌', blockTypes: ['table']            },
      { title: { en: 'Code Examples',   ar: 'أمثلة برمجية' },     icon: '💡', blockTypes: ['code', 'code']     },
    ],
  },
  {
    id: 'onboarding',
    icon: '👋',
    name:        { en: 'Onboarding Guide', ar: 'دليل الإعداد'    },
    description: { en: 'Welcome new users and walk them through setup.', ar: 'رحّب بالمستخدمين الجدد واشرح خطوات الإعداد.' },
    sections: [
      { title: { en: 'Welcome',         ar: 'مرحباً' },            icon: '👋', blockTypes: ['text', 'stats']       },
      { title: { en: 'Setup',           ar: 'الإعداد' },           icon: '⚙️', blockTypes: ['steps', 'checklist'] },
      { title: { en: 'Next Steps',      ar: 'الخطوات التالية' },   icon: '🎯', blockTypes: ['cards', 'button']    },
    ],
  },
  {
    id: 'release-notes',
    icon: '🎉',
    name:        { en: 'Release Notes',   ar: 'ملاحظات الإصدار'  },
    description: { en: 'Document new features, fixes, and known issues.', ar: 'وثّق الجديد والإصلاحات والمشاكل المعروفة.' },
    sections: [
      { title: { en: "What's New",      ar: 'الجديد' },            icon: '✨', blockTypes: ['highlight', 'cards'] },
      { title: { en: 'Bug Fixes',       ar: 'إصلاح الأخطاء' },     icon: '🐛', blockTypes: ['checklist']         },
      { title: { en: 'Known Issues',    ar: 'مشاكل معروفة' },      icon: '⚠️', blockTypes: ['alert', 'table']   },
    ],
  },
  {
    id: 'quick-start',
    icon: '🚀',
    name:        { en: 'Quick Start',     ar: 'بداية سريعة'       },
    description: { en: 'Installation, configuration, and first run.', ar: 'التثبيت، الإعداد، والتشغيل الأول.' },
    sections: [
      { title: { en: 'Installation',    ar: 'التثبيت' },           icon: '📦', blockTypes: ['steps', 'code']      },
      { title: { en: 'Configuration',   ar: 'الإعداد' },           icon: '⚙️', blockTypes: ['code', 'alert']     },
      { title: { en: 'Hello World',     ar: 'أول تجربة' },         icon: '🌍', blockTypes: ['code', 'highlight']  },
    ],
  },
];
