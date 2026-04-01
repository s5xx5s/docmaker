import { BookOpen, Layers, Globe, Download, Zap, ExternalLink } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Topbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-400" size={22} />
          <span className="font-bold text-lg tracking-tight">docmaker</span>
          <span className="text-xs text-gray-500 ml-1">v1.0.0</span>
        </div>
        <a
          href="https://github.com/s5xx5s/docmaker"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ExternalLink size={16} />
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/50 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-8">
          <Zap size={14} />
          Open Source · MIT License
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
          Create beautiful
          <span className="text-blue-400"> user guides</span>
          <br />in minutes
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          A standalone web-based editor for building professional documentation.
          Works entirely in the browser — no backend required.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
            onClick={() => alert('Coming in Phase 4 — Project Manager')}
          >
            Start Building
          </button>
          <a
            href="https://github.com/s5xx5s/docmaker"
            target="_blank"
            rel="noreferrer"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
          >
            View on GitHub
          </a>
        </div>
      </main>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Layers size={20} className="text-blue-400" />,
              title: '24 Content Blocks',
              desc: 'Text, steps, cards, tables, code, timelines, galleries, and more.',
            },
            {
              icon: <Globe size={20} className="text-green-400" />,
              title: 'Multilingual',
              desc: 'Auto-translate with Gemini, OpenAI, or DeepL. Full RTL/LTR support.',
            },
            {
              icon: <Download size={20} className="text-purple-400" />,
              title: 'Export Anywhere',
              desc: 'Export to HTML, Markdown, JSON, or PDF — fully standalone.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
        docmaker · MIT License · Built with React + Vite + Tailwind CSS
      </footer>
    </div>
  );
}

export default App;
