import { BookOpen, Layers, Globe, Download, ArrowRight, Github } from 'lucide-react';
import { useSettingsStore } from '../store/settings.store';

interface Props {
  onStart(): void;
}

const CONTENT = {
  en: {
    badge: '⚡ Open Source · MIT License',
    h1a: 'Create beautiful ',
    h1b: 'user guides',
    h1c: ' in minutes',
    sub: 'A standalone web-based editor for building professional documentation. Works entirely in the browser — no backend required.',
    start: 'Start Building',
    github: 'View on GitHub / مستودع المشروع',
    footer: 'Works entirely in the browser — no backend, no accounts, no tracking',
    features: [
      { icon: Layers, title: '24 Block Types', desc: 'Text, steps, cards, tables, code, galleries, and more.' },
      { icon: Globe, title: 'Multilingual', desc: 'Auto-translate with Gemini, OpenAI, or DeepL. Full RTL support.' },
      { icon: Download, title: 'Export Anywhere', desc: 'HTML, Markdown, JSON, or PDF — fully standalone.' },
    ],
  },
  ar: {
    badge: '⚡ مفتوح المصدر · رخصة MIT',
    h1a: 'أنشئ أدلة ',
    h1b: 'مستخدم احترافية',
    h1c: ' في دقائق',
    sub: 'محرر أدلة ويب مستقل لبناء توثيق احترافي. يعمل كاملاً في المتصفح — بدون خادم.',
    start: 'ابدأ الآن',
    github: 'GitHub / مستودع المشروع',
    footer: 'يعمل في المتصفح فقط — بدون خادم أو حساب أو تتبع',
    features: [
      { icon: Layers, title: '٢٤ نوع بلوك', desc: 'نصوص، خطوات، بطاقات، جداول، كود، معارض، والمزيد.' },
      { icon: Globe, title: 'متعدد اللغات', desc: 'ترجمة تلقائية بـ Gemini أو OpenAI أو DeepL. دعم كامل للـ RTL.' },
      { icon: Download, title: 'تصدير بكل مكان', desc: 'HTML أو Markdown أو JSON أو PDF — بدون اعتماديات.' },
    ],
  },
};

export function Landing({ onStart }: Props) {
  const { settings, updateSettings } = useSettingsStore();
  const lang = settings.uiLang;
  const c = CONTENT[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Topbar */}
      <nav className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-400" size={20} />
          <span className="font-bold text-lg tracking-tight">docmaker</span>
          <span className="text-xs text-gray-600 font-mono">v1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => updateSettings({ uiLang: lang === 'ar' ? 'en' : 'ar' })}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white border border-gray-700 hover:border-blue-500 rounded-lg px-3 py-1.5 transition-colors"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe size={14} />
            {lang === 'ar' ? 'EN' : 'العربية'}
          </button>
          <a
            href="https://github.com/s5xx5s/docmaker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Github size={14} />
            {c.github}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
          {c.badge}
        </div>

        <h1 className="text-5xl sm:text-6xl font-black leading-tight max-w-3xl mb-6">
          {c.h1a}
          <span className="text-blue-400">{c.h1b}</span>
          {c.h1c}
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mb-10">
          {c.sub}
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl px-8 py-3.5 font-bold text-base transition-colors shadow-lg shadow-blue-500/20"
          >
            {!isRtl && <ArrowRight size={18} />}
            {c.start}
            {isRtl && <ArrowRight size={18} className="rotate-180" />}
          </button>
          <a
            href="https://github.com/s5xx5s/docmaker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl px-8 py-3.5 font-semibold text-base transition-colors"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 max-w-4xl w-full">
          {c.features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors text-start">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-800/60 px-6 py-4 text-center text-xs text-gray-600">
        {c.footer}
      </footer>
    </div>
  );
}
