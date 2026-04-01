import { BookOpen, Layers, Globe, Download, ArrowRight, Github } from 'lucide-react';

interface Props {
  onStart(): void;
}

const FEATURES = [
  { icon: Layers, title: '24 Block Types', titleAr: '٢٤ نوع بلوك', desc: 'Text, steps, cards, tables, code, galleries, and more.', descAr: 'نصوص، خطوات، بطاقات، جداول، كود، معارض، والمزيد.' },
  { icon: Globe, title: 'Multilingual', titleAr: 'متعدد اللغات', desc: 'Auto-translate with Gemini, OpenAI, or DeepL.', descAr: 'ترجمة تلقائية بـ Gemini أو OpenAI أو DeepL.' },
  { icon: Download, title: 'Export Anywhere', titleAr: 'تصدير بكل مكان', desc: 'HTML, Markdown, JSON, or PDF — no dependencies.', descAr: 'HTML أو Markdown أو JSON أو PDF — بدون اعتماديات.' },
];

export function Landing({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Topbar */}
      <nav className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-400" size={20} />
          <span className="font-bold text-lg tracking-tight">docmaker</span>
          <span className="text-xs text-gray-600 font-mono ml-1">v1.0.0</span>
        </div>
        <a
          href="https://github.com/s5xx5s/docmaker"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5 transition-colors"
        >
          <Github size={14} />
          GitHub / مستودع المشروع
        </a>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
          <span>⚡</span>
          Open Source · MIT License · مفتوح المصدر
        </div>

        <h1 className="text-5xl sm:text-6xl font-black leading-tight max-w-3xl mb-4">
          Create beautiful{' '}
          <span className="text-blue-400">user guides</span>
          {' '}in minutes
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mb-4">
          A standalone web-based editor for building professional documentation.
        </p>
        <p className="text-base text-gray-500 mb-10 font-arabic" dir="rtl">
          محرر أدلة المستخدم — يعمل كاملاً في المتصفح، بدون سيرفر.
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl px-8 py-3.5 font-bold text-base transition-colors shadow-lg shadow-blue-500/20"
          >
            ابدأ الآن / Start Building
            <ArrowRight size={18} />
          </button>
          <a
            href="https://github.com/s5xx5s/docmaker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl px-8 py-3.5 font-semibold text-base transition-colors"
          >
            <Github size={16} />
            View on GitHub
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 max-w-4xl w-full">
          {FEATURES.map(({ icon: Icon, title, titleAr, desc, descAr }) => (
            <div key={title} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 text-left hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-0.5">{title}</h3>
              <p className="text-xs text-gray-500 mb-3" dir="rtl">{titleAr}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              <p className="text-xs text-gray-600 mt-1" dir="rtl">{descAr}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-800/60 px-6 py-4 text-center text-xs text-gray-600">
        Works entirely in the browser — no backend, no accounts, no tracking · يعمل في المتصفح فقط، بدون خادم أو حساب
      </footer>
    </div>
  );
}
