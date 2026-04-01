import { ArrowLeft, Monitor, Database, Sliders, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../store/settings.store';
import { useThemeStore } from '../store/theme.store';
import { useProjectStore } from '../store/project.store';
import { exportProjectsJSON } from '../utils/storage';

interface Props { onBack(): void }

const COMMON_LANGS = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function Settings({ onBack }: Props) {
  const { settings, updateSettings } = useSettingsStore();
  const { themes } = useThemeStore();
  const { projects } = useProjectStore();

  const totalGuides = projects.reduce((s, p) => s + p.guides.length, 0);
  const totalSections = projects.reduce((s, p) => s + p.guides.reduce((gs, g) => gs + g.sections.length, 0), 0);
  const storageSize = (() => {
    try {
      const all = JSON.stringify(projects);
      return (new Blob([all]).size / 1024).toFixed(1);
    } catch { return '?'; }
  })();

  function clearAllData() {
    if (!confirm('Delete ALL projects, guides, and settings? This cannot be undone.')) return;
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft size={18} /></button>
        <h1 className="text-base font-bold">Settings</h1>
      </nav>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">

          {/* ── General ─────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sliders size={15} className="text-blue-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">General</h2>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">

              {/* UI Language */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-white">Interface Language</p>
                  <p className="text-xs text-gray-500 mt-0.5">App UI language</p>
                </div>
                <select
                  value={settings.uiLang}
                  onChange={e => updateSettings({ uiLang: e.target.value as 'en' | 'ar' })}
                  className="bg-gray-800 text-sm text-gray-300 rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="ar">🇸🇦 العربية</option>
                </select>
              </div>

              {/* Auto-save interval */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-white">Auto-save Interval</p>
                  <p className="text-xs text-gray-500 mt-0.5">How often unsaved changes are saved</p>
                </div>
                <select
                  value={settings.autoSaveInterval}
                  onChange={e => updateSettings({ autoSaveInterval: Number(e.target.value) })}
                  className="bg-gray-800 text-sm text-gray-300 rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>

              {/* Default Theme */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-white">Default Theme</p>
                  <p className="text-xs text-gray-500 mt-0.5">Applied to new guides</p>
                </div>
                <select
                  value={settings.defaultThemeId}
                  onChange={e => updateSettings({ defaultThemeId: e.target.value })}
                  className="bg-gray-800 text-sm text-gray-300 rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              {/* Default Guide Language */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-white">Default Guide Language</p>
                  <p className="text-xs text-gray-500 mt-0.5">Content language for new guides</p>
                </div>
                <select
                  value={settings.defaultGuideLang}
                  onChange={e => updateSettings({ defaultGuideLang: e.target.value })}
                  className="bg-gray-800 text-sm text-gray-300 rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  {COMMON_LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* ── Storage & Data ───────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Database size={15} className="text-blue-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Storage & Data</h2>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">

              {/* Stats */}
              <div className="px-5 py-4">
                <p className="text-sm font-medium text-white mb-3">localStorage Usage</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Projects', value: projects.length },
                    { label: 'Guides', value: totalGuides },
                    { label: 'Sections', value: totalSections },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-white">{value}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3">Estimated size: {storageSize} KB</p>
              </div>

              {/* Export all */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-white">Export All Data</p>
                  <p className="text-xs text-gray-500 mt-0.5">Download all projects as JSON backup</p>
                </div>
                <button
                  onClick={() => exportProjectsJSON(projects)}
                  className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800 rounded-lg px-3 py-1.5"
                >
                  Download Backup
                </button>
              </div>

              {/* Clear all */}
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-red-400">Clear All Data</p>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently delete all projects and settings</p>
                </div>
                <button
                  onClick={clearAllData}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900 rounded-lg px-3 py-1.5"
                >
                  <Trash2 size={12} /> Clear All
                </button>
              </div>
            </div>
          </section>

          {/* ── About ───────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Monitor size={15} className="text-blue-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">About</h2>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
              <div className="flex items-center justify-between px-5 py-4">
                <p className="text-sm text-gray-400">Version</p>
                <p className="text-sm text-white font-mono">1.0.0</p>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <p className="text-sm text-gray-400">Block types</p>
                <p className="text-sm text-white">24</p>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <p className="text-sm text-gray-400">Built-in themes</p>
                <p className="text-sm text-white">{themes.filter(t => t.isBuiltIn).length}</p>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <p className="text-sm text-gray-400">Storage</p>
                <p className="text-sm text-white">localStorage (browser)</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-gray-400 mb-2">Source</p>
                <a
                  href="https://github.com/s5xx5s/docmaker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  github.com/s5xx5s/docmaker ↗
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
