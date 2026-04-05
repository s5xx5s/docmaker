// ── Demo Project ─────────────────────────────────────────────────────────────
// Shown to every new visitor who has no projects yet.
// Full bilingual content (EN + AR) across 5 sections.

import type { Project, Guide, Section, Block } from '../types';

const D = 'demo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function block(b: Record<string, any>): Block {
  return { id: b['id'] ?? Math.random().toString(36).slice(2), ...b } as Block;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1: Welcome
// ─────────────────────────────────────────────────────────────────────────────
const s1en: Block[] = [
  block({ id:`${D}-b1`, type:'highlight', variant:'info',
    title:'What is docmaker?',
    content:'A standalone, open-source guide editor that works entirely in your browser. No sign-up, no server, no tracking — everything is stored locally.' }),
  block({ id:`${D}-b2`, type:'text',
    content:'Use this tool to build user manuals, onboarding guides, API documentation, product walkthroughs, or any structured documentation — then export it as a standalone HTML file, Markdown, JSON, or PDF.',
    align:'left' }),
  block({ id:`${D}-b3`, type:'stats',
    items:[
      { value:'24',  label:'Block Types' },
      { value:'5',   label:'Built-in Themes' },
      { value:'4',   label:'Export Formats' },
      { value:'18+', label:'Languages' },
    ], columns:4 }),
  block({ id:`${D}-b4`, type:'divider', style:'solid', label:'' }),
  block({ id:`${D}-b5`, type:'cards', columns:3, cards:[
    { title:'Editor',  description:'Drag & drop blocks, reorder sections, live preview.', icon:'✏️' },
    { title:'Themes',  description:'5 built-in themes + unlimited custom themes.',         icon:'🎨' },
    { title:'Export',  description:'HTML, Markdown, JSON, or PDF — fully standalone.',     icon:'📤' },
  ]}),
];

const s1ar: Block[] = [
  block({ id:`${D}-b1ar`, type:'highlight', variant:'info',
    title:'ما هو docmaker؟',
    content:'محرر أدلة مستقل ومفتوح المصدر يعمل كاملاً في متصفحك. لا تسجيل، لا خادم، لا تتبع — كل شيء محفوظ محلياً.' }),
  block({ id:`${D}-b2ar`, type:'text',
    content:'استخدم هذه الأداة لبناء أدلة المستخدم، أدلة الإعداد، توثيق الـ API، شروحات المنتج، أو أي توثيق منظم — ثم صدّره كملف HTML مستقل أو Markdown أو JSON أو PDF.',
    align:'right' }),
  block({ id:`${D}-b3ar`, type:'stats',
    items:[
      { value:'24',  label:'نوع بلوك' },
      { value:'5',   label:'ثيمات جاهزة' },
      { value:'4',   label:'صيغ تصدير' },
      { value:'18+', label:'لغة مدعومة' },
    ], columns:4 }),
  block({ id:`${D}-b4ar`, type:'divider', style:'solid', label:'' }),
  block({ id:`${D}-b5ar`, type:'cards', columns:3, cards:[
    { title:'المحرر',    description:'سحب وإفلات للبلوكات، إعادة ترتيب الأقسام، معاينة مباشرة.', icon:'✏️' },
    { title:'الثيمات',   description:'٥ ثيمات جاهزة + ثيمات مخصصة غير محدودة.',                  icon:'🎨' },
    { title:'التصدير',   description:'HTML أو Markdown أو JSON أو PDF — بدون اعتماديات.',          icon:'📤' },
  ]}),
];

const sec1: Section = {
  id:`${D}-s1`, title:'👋 Welcome to docmaker', order:0, isActive:true,
  blocks: s1en,
  translations:{ ar:{ title:'👋 مرحباً بك في docmaker', blocks: s1ar } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 2: Getting Started
// ─────────────────────────────────────────────────────────────────────────────
const s2en: Block[] = [
  block({ id:`${D}-b10`, type:'steps', steps:[
    { title:'Create a Project',   description:'Click "New Project" on the home screen and give it a name.' },
    { title:'Add a Guide',        description:'Open your project and click "New Guide" to create the first guide.' },
    { title:'Build with Blocks',  description:'Select a section on the left, then click "+ Add" to pick a block type.' },
    { title:'Pick a Theme',       description:'Click "Theme" in the editor toolbar to choose or customize a theme.' },
    { title:'Export',             description:'Click "Export" and download your guide as HTML, Markdown, JSON, or PDF.' },
  ]}),
  block({ id:`${D}-b11`, type:'alert', variant:'tip',
    title:'💡 Auto-save',
    content:'Your work is saved automatically every 2 seconds. You can also press the "Save" button at any time.' }),
  block({ id:`${D}-b12`, type:'checklist', interactive:true, items:[
    { label:'Create your first project',               checked:false },
    { label:'Add a guide with at least 3 sections',    checked:false },
    { label:'Try a Text block and a Steps block',      checked:false },
    { label:'Switch themes to see the difference',     checked:false },
    { label:'Export your guide as standalone HTML',    checked:false },
  ]}),
];

const s2ar: Block[] = [
  block({ id:`${D}-b10ar`, type:'steps', steps:[
    { title:'أنشئ مشروعاً',      description:'اضغط على "مشروع جديد" في الشاشة الرئيسية وأعطه اسماً.' },
    { title:'أضف دليلاً',        description:'افتح المشروع واضغط على "دليل جديد" لإنشاء أول دليل.' },
    { title:'ابنِ بالبلوكات',    description:'اختر قسماً من اليمين، ثم اضغط "+ إضافة" لاختيار نوع البلوك.' },
    { title:'اختر ثيماً',        description:'اضغط على "ثيم" في شريط أدوات المحرر لاختيار ثيم أو تخصيصه.' },
    { title:'صدّر الدليل',       description:'اضغط على "تصدير" ونزّل دليلك كـ HTML أو Markdown أو JSON أو PDF.' },
  ]}),
  block({ id:`${D}-b11ar`, type:'alert', variant:'tip',
    title:'💡 الحفظ التلقائي',
    content:'يتم حفظ عملك تلقائياً كل ثانيتين. يمكنك أيضاً الضغط على زر "حفظ" في أي وقت.' }),
  block({ id:`${D}-b12ar`, type:'checklist', interactive:true, items:[
    { label:'أنشئ مشروعك الأول',                  checked:false },
    { label:'أضف دليلاً بثلاثة أقسام على الأقل', checked:false },
    { label:'جرّب بلوك نص وبلوك خطوات',           checked:false },
    { label:'غيّر الثيم لترى الفرق',              checked:false },
    { label:'صدّر دليلك كـ HTML مستقل',           checked:false },
  ]}),
];

const sec2: Section = {
  id:`${D}-s2`, title:'🚀 Getting Started', order:1, isActive:true,
  blocks: s2en,
  translations:{ ar:{ title:'🚀 كيف تبدأ', blocks: s2ar } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 3: Block Types
// ─────────────────────────────────────────────────────────────────────────────
const s3en: Block[] = [
  block({ id:`${D}-b20`, type:'accordion', items:[
    { title:'📝 Text & Content', defaultOpen:true,
      content:'Text · Highlight (info/warning/success/danger) · Quote · Alert (5 variants) · Divider' },
    { title:'📋 Structure', defaultOpen:false,
      content:'Steps · Checklist · FAQ · Table · Compare (pros/cons) · Cards · Timeline · Flow' },
    { title:'🖼️ Media', defaultOpen:false,
      content:'Image · Video (YouTube/Vimeo/direct) · Gallery (lightbox) · Code (syntax) · Embed' },
    { title:'📊 Data & Display', defaultOpen:false,
      content:'Stats · Rating · Logo · Button · Image + Text (split layout)' },
  ]}),
  block({ id:`${D}-b21`, type:'code', language:'javascript', showLineNumbers:true,
    code:`// Example: iterate guide sections
const guide = JSON.parse(localStorage.getItem('my_guide'));

guide.sections.forEach(section => {
  console.log(\`📂 \${section.title} — \${section.blocks.length} blocks\`);
  section.blocks.forEach(block => {
    console.log(\`   └─ [\${block.type}]\`);
  });
});` }),
  block({ id:`${D}-b22`, type:'quote',
    content:'Documentation is a love letter that you write to your future self.',
    author:'Damian Conway', source:'' }),
  block({ id:`${D}-b23`, type:'compare',
    leftTitle:'✅ With Good Docs',  rightTitle:'❌ Without Docs',
    leftItems:['Fast onboarding','Self-service support','Consistent usage','Fewer mistakes'],
    rightItems:['Slow onboarding','Constant questions','Inconsistent usage','Costly errors'] }),
];

const s3ar: Block[] = [
  block({ id:`${D}-b20ar`, type:'accordion', items:[
    { title:'📝 النصوص والمحتوى', defaultOpen:true,
      content:'نص · تمييز (معلومات/تحذير/نجاح/خطر) · اقتباس · تنبيه (٥ أنواع) · فاصل' },
    { title:'📋 الهيكل', defaultOpen:false,
      content:'خطوات · قائمة تحقق · الأسئلة الشائعة · جدول · مقارنة · بطاقات · جدول زمني · تدفق' },
    { title:'🖼️ الوسائط', defaultOpen:false,
      content:'صورة · فيديو (YouTube/Vimeo/مباشر) · معرض (lightbox) · كود (تلوين) · تضمين' },
    { title:'📊 البيانات والعرض', defaultOpen:false,
      content:'إحصائيات · تقييم · شعار · زر · صورة + نص (تخطيط منقسم)' },
  ]}),
  block({ id:`${D}-b21ar`, type:'code', language:'javascript', showLineNumbers:true,
    code:`// مثال: التنقل عبر أقسام الدليل
const guide = JSON.parse(localStorage.getItem('my_guide'));

guide.sections.forEach(section => {
  console.log(\`📂 \${section.title} — \${section.blocks.length} بلوك\`);
  section.blocks.forEach(block => {
    console.log(\`   └─ [\${block.type}]\`);
  });
});` }),
  block({ id:`${D}-b22ar`, type:'quote',
    content:'التوثيق هو رسالة حب تكتبها لنفسك في المستقبل.',
    author:'Damian Conway', source:'' }),
  block({ id:`${D}-b23ar`, type:'compare',
    leftTitle:'✅ مع توثيق جيد', rightTitle:'❌ بدون توثيق',
    leftItems:['إعداد سريع','دعم ذاتي','استخدام متسق','أخطاء أقل'],
    rightItems:['إعداد بطيء','أسئلة متكررة','استخدام متباين','أخطاء مكلفة'] }),
];

const sec3: Section = {
  id:`${D}-s3`, title:'🧩 Block Types', order:2, isActive:true,
  blocks: s3en,
  translations:{ ar:{ title:'🧩 أنواع البلوكات', blocks: s3ar } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 4: Themes
// ─────────────────────────────────────────────────────────────────────────────
const s4en: Block[] = [
  block({ id:`${D}-b30`, type:'highlight', variant:'success',
    title:'5 Built-in Themes',
    content:'Dark Navy · Midnight · Arctic (light) · Emerald · Corporate — all professionally designed and ready to use.' }),
  block({ id:`${D}-b31`, type:'steps', steps:[
    { title:'Click "Theme" in the editor toolbar', description:'Opens the theme picker with all built-in and custom themes.' },
    { title:'Select a theme',                       description:'Click any swatch to apply it live in the editor.' },
    { title:'Customize (optional)',                  description:'Click "Customize" to edit colors, fonts, spacing, or add custom CSS.' },
    { title:'Export custom theme',                   description:'Save your theme as JSON to reuse across projects.' },
  ]}),
  block({ id:`${D}-b32`, type:'alert', variant:'info',
    title:'CSS Custom Properties',
    content:'All theme colors are exposed as CSS variables (--gp-primary, --gp-bg …). Your exported HTML file matches the preview exactly.' }),
];

const s4ar: Block[] = [
  block({ id:`${D}-b30ar`, type:'highlight', variant:'success',
    title:'٥ ثيمات جاهزة',
    content:'Dark Navy · Midnight · Arctic (فاتح) · Emerald · Corporate — جميعها مصممة باحترافية وجاهزة للاستخدام.' }),
  block({ id:`${D}-b31ar`, type:'steps', steps:[
    { title:'اضغط "ثيم" في شريط الأدوات', description:'يفتح منتقي الثيمات بجميع الثيمات الجاهزة والمخصصة.' },
    { title:'اختر ثيماً',                  description:'اضغط على أي ثيم لتطبيقه مباشرةً في المحرر.' },
    { title:'خصّص (اختياري)',              description:'اضغط "تخصيص" لتعديل الألوان والخطوط والمسافات أو إضافة CSS مخصص.' },
    { title:'صدّر الثيم المخصص',           description:'احفظ ثيمك كـ JSON لإعادة استخدامه في مشاريع أخرى.' },
  ]}),
  block({ id:`${D}-b32ar`, type:'alert', variant:'info',
    title:'متغيرات CSS المخصصة',
    content:'جميع ألوان الثيم متاحة كمتغيرات CSS (--gp-primary، --gp-bg …). ملف HTML المصدَّر يطابق المعاينة تماماً.' }),
];

const sec4: Section = {
  id:`${D}-s4`, title:'🎨 Themes & Customization', order:3, isActive:true,
  blocks: s4en,
  translations:{ ar:{ title:'🎨 الثيمات والتخصيص', blocks: s4ar } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Section 5: Export
// ─────────────────────────────────────────────────────────────────────────────
const s5en: Block[] = [
  block({ id:`${D}-b40`, type:'table', striped:true,
    headers:['Format','Best For','Self-contained?'],
    rows:[
      ['🌐 HTML',     'Share online, embed in websites',    '✅ Yes — single file, no deps'],
      ['📝 Markdown', 'GitHub README, wikis, docs sites',   '⚠️ Images as URLs'],
      ['💾 JSON',     'Backup, re-import, version control', '✅ Yes — full fidelity'],
      ['📄 PDF',      'Print, offline reading',             '✅ Via browser print dialog'],
    ]}),
  block({ id:`${D}-b41`, type:'highlight', variant:'warning',
    title:'Multilingual Export',
    content:'When your guide has multiple languages, use "Translate" to auto-translate all blocks using Gemini, OpenAI, DeepL, or a custom endpoint.' }),
  block({ id:`${D}-b42`, type:'faq', items:[
    { question:'Is my data stored on a server?',
      answer:"No. Everything is in your browser's localStorage. Nothing leaves your device unless you export and share it." },
    { question:'Can I use docmaker offline?',
      answer:'Yes. After the first load the app works fully offline. Export anytime without an internet connection.' },
    { question:'How do I share a guide with someone?',
      answer:'Export as HTML (single .html file) and send by email, upload to a web server, or host on GitHub Pages.' },
    { question:'Can I contribute or self-host?',
      answer:'Yes! docmaker is open-source (MIT). Fork the repo, add block types, or deploy your own instance.' },
  ]}),
  block({ id:`${D}-b43`, type:'button',
    label:'⭐ View on GitHub / عرض على GitHub',
    href:'https://github.com/s5xx5s/docmaker',
    variant:'primary', size:'md', align:'center' }),
];

const s5ar: Block[] = [
  block({ id:`${D}-b40ar`, type:'table', striped:true,
    headers:['الصيغة','الأفضل لـ','مستقل بذاته؟'],
    rows:[
      ['🌐 HTML',     'المشاركة عبر الإنترنت، التضمين في المواقع', '✅ نعم — ملف واحد بدون اعتماديات'],
      ['📝 Markdown', 'GitHub README، الويكي، مواقع التوثيق',      '⚠️ الصور كروابط URL'],
      ['💾 JSON',     'النسخ الاحتياطي، الاستيراد، إدارة الإصدارات','✅ نعم — دقة كاملة'],
      ['📄 PDF',      'الطباعة، القراءة دون اتصال',                 '✅ عبر حوار الطباعة بالمتصفح'],
    ]}),
  block({ id:`${D}-b41ar`, type:'highlight', variant:'warning',
    title:'التصدير متعدد اللغات',
    content:'عندما يحتوي دليلك على لغات متعددة، استخدم "ترجمة" لترجمة جميع البلوكات تلقائياً باستخدام Gemini أو OpenAI أو DeepL أو نقطة نهاية مخصصة.' }),
  block({ id:`${D}-b42ar`, type:'faq', items:[
    { question:'هل بياناتي محفوظة على خادم؟',
      answer:'لا. كل شيء في localStorage بمتصفحك. لا يغادر أي شيء جهازك إلا إذا قمت بالتصدير والمشاركة بنفسك.' },
    { question:'هل يمكنني استخدام docmaker دون اتصال بالإنترنت؟',
      answer:'نعم. بعد التحميل الأول يعمل التطبيق بالكامل دون اتصال. صدّر أدلتك في أي وقت.' },
    { question:'كيف أشارك دليلاً مع شخص آخر؟',
      answer:'صدّره كـ HTML (ملف .html واحد) وأرسله بالبريد الإلكتروني، أو ارفعه على خادم ويب، أو استضفه على GitHub Pages.' },
    { question:'هل يمكنني المساهمة أو الاستضافة الذاتية؟',
      answer:'نعم! docmaker مفتوح المصدر (MIT). يمكنك fork المشروع وإضافة أنواع بلوكات جديدة أو نشر نسختك الخاصة.' },
  ]}),
  block({ id:`${D}-b43ar`, type:'button',
    label:'⭐ عرض على GitHub / View on GitHub',
    href:'https://github.com/s5xx5s/docmaker',
    variant:'primary', size:'md', align:'center' }),
];

const sec5: Section = {
  id:`${D}-s5`, title:'📤 Export & Share', order:4, isActive:true,
  blocks: s5en,
  translations:{ ar:{ title:'📤 التصدير والمشاركة', blocks: s5ar } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Guide & Project
// ─────────────────────────────────────────────────────────────────────────────
const demoGuide: Guide = {
  id:`${D}-guide`, projectId:`${D}-project`,
  title:'docmaker — Feature Tour',
  subtitle:'A complete walkthrough of all features',
  themeId:'dark-navy',
  direction:'ltr',
  defaultLang:'en',
  availableLangs:[
    { code:'en', name:'English',  dir:'ltr', flag:'🇺🇸' },
    { code:'ar', name:'العربية', dir:'rtl', flag:'🇸🇦' },
  ],
  sections:[sec1, sec2, sec3, sec4, sec5],
  isPublished:false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const demoProject: Project = {
  id:`${D}-project`,
  name:'docmaker Demo',
  description:'Example project — explore all features then create your own!',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  guides:[demoGuide],
};

export const DEMO_SEEDED_KEY = 'docmaker_demo_seeded';
