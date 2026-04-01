import { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { useThemeStore } from '../../store/theme.store';
import { generateId } from '../../utils/id';
import type { Theme, ThemeColors } from '../../types';

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  'Poppins', 'Raleway', 'Nunito', 'Source Sans Pro', 'Merriweather',
  'Playfair Display', 'Georgia', 'Crimson Text',
];

const CODE_FONTS = ['JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Courier New', 'Monaco'];

interface Props {
  theme: Theme;
  onApply(themeId: string): void;
  onClose(): void;
}

export function ThemeCustomizer({ theme: initialTheme, onApply, onClose }: Props) {
  const { addCustomTheme, updateCustomTheme } = useThemeStore();
  const [draft, setDraft] = useState<Theme>(() => ({
    ...JSON.parse(JSON.stringify(initialTheme)) as Theme,
    // Start as unsaved custom copy if editing a built-in
    id: initialTheme.isBuiltIn ? generateId() : initialTheme.id,
    name: initialTheme.isBuiltIn ? `${initialTheme.name} (custom)` : initialTheme.name,
    isBuiltIn: false,
  }));
  const [tab, setTab] = useState<'colors' | 'fonts' | 'spacing' | 'css'>('colors');

  function patchColors(patch: Partial<ThemeColors>) {
    setDraft(d => ({ ...d, colors: { ...d.colors, ...patch } }));
  }
  function patchFonts(patch: Partial<Theme['fonts']>) {
    setDraft(d => ({ ...d, fonts: { ...d.fonts, ...patch } }));
  }
  function patchSpacing(patch: Partial<Theme['spacing']>) {
    setDraft(d => ({ ...d, spacing: { ...d.spacing, ...patch } }));
  }

  function handleSave() {
    const { themes } = useThemeStore.getState();
    const exists = themes.some(t => t.id === draft.id && !t.isBuiltIn);
    if (exists) {
      updateCustomTheme(draft.id, draft);
    } else {
      addCustomTheme({ ...draft });
    }
    onApply(draft.id);
    onClose();
  }

  // Live preview — apply CSS vars to a sample div
  const previewStyle: React.CSSProperties = {
    backgroundColor: draft.colors.background,
    color: draft.colors.text,
    fontFamily: draft.fonts.body + ', sans-serif',
    border: `1px solid ${draft.colors.border}`,
  };

  const COLOR_FIELDS: Array<{ key: keyof ThemeColors; label: string }> = [
    { key: 'primary',    label: 'Primary' },
    { key: 'secondary',  label: 'Secondary' },
    { key: 'accent',     label: 'Accent' },
    { key: 'background', label: 'Background' },
    { key: 'surface',    label: 'Surface' },
    { key: 'text',       label: 'Text' },
    { key: 'textMuted',  label: 'Text Muted' },
    { key: 'border',     label: 'Border' },
    { key: 'success',    label: 'Success' },
    { key: 'warning',    label: 'Warning' },
    { key: 'danger',     label: 'Danger' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white">Theme Customizer</h2>
            <input
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="bg-gray-800 text-xs text-gray-300 rounded px-2 py-1 border border-gray-700 focus:outline-none focus:border-blue-500 w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDraft({ ...JSON.parse(JSON.stringify(initialTheme)) as Theme, id: draft.id, name: draft.name, isBuiltIn: false })}
              className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
            >
              <RotateCcw size={11} /> Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 font-semibold"
            >
              <Save size={12} /> Save & Apply
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded"><X size={16} /></button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Left: controls */}
          <div className="flex flex-col w-96 border-r border-gray-800 shrink-0">
            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              {(['colors', 'fonts', 'spacing', 'css'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
                    tab === t ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {t === 'css' ? 'Custom CSS' : t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {tab === 'colors' && (
                <div className="space-y-3">
                  {COLOR_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={draft.colors[key]}
                        onChange={e => patchColors({ [key]: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-300">{label}</p>
                        <p className="text-xs text-gray-600 font-mono">{draft.colors[key]}</p>
                      </div>
                      <input
                        type="text"
                        value={draft.colors[key]}
                        onChange={e => patchColors({ [key]: e.target.value })}
                        className="bg-gray-800 text-xs font-mono text-gray-300 rounded px-2 py-1 border border-gray-700 w-24 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {tab === 'fonts' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Heading Font</label>
                    <select value={draft.fonts.heading} onChange={e => patchFonts({ heading: e.target.value })}
                      className="w-full bg-gray-800 text-xs text-gray-300 rounded px-2 py-1.5 border border-gray-700 focus:outline-none">
                      {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Body Font</label>
                    <select value={draft.fonts.body} onChange={e => patchFonts({ body: e.target.value })}
                      className="w-full bg-gray-800 text-xs text-gray-300 rounded px-2 py-1.5 border border-gray-700 focus:outline-none">
                      {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Code Font</label>
                    <select value={draft.fonts.code} onChange={e => patchFonts({ code: e.target.value })}
                      className="w-full bg-gray-800 text-xs text-gray-300 rounded px-2 py-1.5 border border-gray-700 focus:outline-none">
                      {CODE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Base Font Size: {draft.fonts.sizeBase}px</label>
                    <input type="range" min={12} max={20} value={draft.fonts.sizeBase}
                      onChange={e => patchFonts({ sizeBase: Number(e.target.value) })}
                      className="w-full accent-blue-500" />
                    <div className="flex justify-between text-xs text-gray-600 mt-1"><span>12px</span><span>20px</span></div>
                  </div>
                </div>
              )}

              {tab === 'spacing' && (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Section Padding: {draft.spacing.sectionPadding}px</label>
                    <input type="range" min={16} max={96} value={draft.spacing.sectionPadding}
                      onChange={e => patchSpacing({ sectionPadding: Number(e.target.value) })}
                      className="w-full accent-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Block Gap: {draft.spacing.blockGap}px</label>
                    <input type="range" min={8} max={48} value={draft.spacing.blockGap}
                      onChange={e => patchSpacing({ blockGap: Number(e.target.value) })}
                      className="w-full accent-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Border Radius: {draft.spacing.borderRadius}px</label>
                    <input type="range" min={0} max={24} value={draft.spacing.borderRadius}
                      onChange={e => patchSpacing({ borderRadius: Number(e.target.value) })}
                      className="w-full accent-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Shadows</label>
                    <div className="flex gap-2">
                      {(['none', 'light', 'medium', 'heavy'] as const).map(s => (
                        <button key={s} onClick={() => setDraft(d => ({ ...d, shadows: s }))}
                          className={`text-xs px-2 py-1 rounded capitalize ${draft.shadows === s ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Animations</label>
                    <button
                      onClick={() => setDraft(d => ({ ...d, animations: !d.animations }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${draft.animations ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-gray-600 text-gray-500'}`}
                    >
                      {draft.animations ? '✓ Enabled' : '✗ Disabled'}
                    </button>
                  </div>
                </div>
              )}

              {tab === 'css' && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Custom CSS is injected into the preview and export.</p>
                  <textarea
                    value={draft.customCSS ?? ''}
                    onChange={e => setDraft(d => ({ ...d, customCSS: e.target.value }))}
                    rows={16}
                    placeholder=".gp-block { ... }"
                    className="w-full bg-gray-800 text-xs font-mono text-green-400 rounded-lg p-3 border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: live preview */}
          <div className="flex-1 overflow-auto bg-gray-950 p-4">
            <p className="text-xs text-gray-600 mb-2 text-center">Live Preview</p>
            <div className="rounded-xl overflow-hidden" style={previewStyle}>
              {/* Sidebar + content mockup */}
              <div className="flex h-64 text-xs">
                {/* Sidebar */}
                <div className="w-32 shrink-0 border-r p-3 flex flex-col gap-1" style={{ backgroundColor: draft.colors.surface, borderColor: draft.colors.border }}>
                  <div className="h-3 w-16 rounded-full mb-2" style={{ backgroundColor: draft.colors.primary }} />
                  {['Section 1', 'Section 2', 'Section 3'].map((s, i) => (
                    <div key={s} className="rounded px-2 py-1 text-xs" style={{
                      backgroundColor: i === 0 ? `${draft.colors.primary}20` : 'transparent',
                      color: i === 0 ? draft.colors.primary : draft.colors.textMuted,
                      fontWeight: i === 0 ? '600' : '400',
                    }}>{s}</div>
                  ))}
                </div>
                {/* Content */}
                <div className="flex-1 p-4 space-y-3" style={{ backgroundColor: draft.colors.background }}>
                  <div className="h-4 w-32 rounded-full" style={{ backgroundColor: draft.colors.text, opacity: 0.8 }} />
                  <div className="h-2 w-full rounded-full" style={{ backgroundColor: draft.colors.border }} />
                  <div className="h-2 w-4/5 rounded-full" style={{ backgroundColor: draft.colors.border }} />
                  <div className="h-8 rounded-lg p-2 flex gap-2 items-center" style={{ backgroundColor: `${draft.colors.primary}15`, border: `1px solid ${draft.colors.primary}40` }}>
                    <div className="h-4 w-4 rounded" style={{ backgroundColor: draft.colors.primary }} />
                    <div className="h-2 w-24 rounded-full" style={{ backgroundColor: draft.colors.primary, opacity: 0.6 }} />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded-lg" style={{ backgroundColor: draft.colors.primary }} />
                    <div className="h-6 w-16 rounded-lg border" style={{ borderColor: draft.colors.primary, backgroundColor: 'transparent' }} />
                  </div>
                </div>
              </div>
              {/* Font preview */}
              <div className="p-4 border-t" style={{ borderColor: draft.colors.border }}>
                <p style={{ fontFamily: `${draft.fonts.heading}, sans-serif`, color: draft.colors.text, fontSize: `${draft.fonts.sizeBase + 4}px`, fontWeight: 700 }}>
                  Heading — {draft.fonts.heading}
                </p>
                <p style={{ fontFamily: `${draft.fonts.body}, sans-serif`, color: draft.colors.textMuted, fontSize: `${draft.fonts.sizeBase}px` }}>
                  Body text — {draft.fonts.body}
                </p>
                <code style={{ fontFamily: `${draft.fonts.code}, monospace`, color: draft.colors.accent, fontSize: `${draft.fonts.sizeBase - 2}px` }}>
                  code() — {draft.fonts.code}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
