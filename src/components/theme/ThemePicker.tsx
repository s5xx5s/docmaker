import { X, Check, Plus, Download, Upload } from 'lucide-react';
import { useThemeStore } from '../../store/theme.store';
import type { Theme } from '../../types';

interface Props {
  selectedThemeId: string;
  onSelect(id: string): void;
  onClose(): void;
  onCustomize(theme: Theme): void;
}

function ThemePreviewSwatch({ theme }: { theme: Theme }) {
  return (
    <div
      className="rounded-lg overflow-hidden border-2 transition-all"
      style={{ borderColor: 'transparent', backgroundColor: theme.colors.background }}
    >
      {/* Mini header */}
      <div style={{ backgroundColor: theme.colors.surface, padding: '6px 8px', borderBottom: `1px solid ${theme.colors.border}` }}>
        <div className="flex gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
          <div className="h-1.5 w-8 rounded-full" style={{ backgroundColor: theme.colors.textMuted }} />
        </div>
      </div>
      {/* Mini content */}
      <div style={{ padding: '6px 8px' }}>
        <div className="h-1.5 w-12 rounded-full mb-1.5" style={{ backgroundColor: theme.colors.primary }} />
        <div className="h-1 w-full rounded-full mb-1" style={{ backgroundColor: theme.colors.border }} />
        <div className="h-1 w-4/5 rounded-full mb-1" style={{ backgroundColor: theme.colors.border }} />
        <div className="h-1 w-3/5 rounded-full" style={{ backgroundColor: theme.colors.border }} />
      </div>
      {/* Color dots */}
      <div style={{ padding: '4px 8px 6px', display: 'flex', gap: '3px' }}>
        {[theme.colors.primary, theme.colors.accent, theme.colors.success, theme.colors.warning].map((c, i) => (
          <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}

export function ThemePicker({ selectedThemeId, onSelect, onClose, onCustomize }: Props) {
  const { themes, deleteCustomTheme, exportTheme, importTheme } = useThemeStore();
  const builtIn = themes.filter(t => t.isBuiltIn);
  const custom = themes.filter(t => !t.isBuiltIn);

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const theme = await importTheme(file);
        onSelect(theme.id);
      } catch {
        alert('Invalid theme file');
      }
    };
    input.click();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <h2 className="text-sm font-semibold text-white">Choose Theme</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleImport} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 rounded-lg px-2 py-1.5">
              <Upload size={12} /> Import
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded"><X size={16} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Built-in */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Built-in</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {builtIn.map(theme => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={theme.id === selectedThemeId}
                  onSelect={() => onSelect(theme.id)}
                  onCustomize={() => onCustomize(theme)}
                />
              ))}
            </div>
          </div>

          {/* Custom */}
          {custom.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Custom</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {custom.map(theme => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isSelected={theme.id === selectedThemeId}
                    onSelect={() => onSelect(theme.id)}
                    onCustomize={() => onCustomize(theme)}
                    onDelete={() => deleteCustomTheme(theme.id)}
                    onExport={() => exportTheme(theme.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Create new */}
          <div>
            <button
              onClick={() => onCustomize(themes.find(t => t.id === selectedThemeId) ?? builtIn[0])}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 border border-dashed border-blue-800 rounded-xl px-4 py-3 w-full justify-center transition-colors"
            >
              <Plus size={14} /> Customize Current Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeCard({
  theme, isSelected, onSelect, onCustomize, onDelete, onExport,
}: {
  theme: Theme; isSelected: boolean; onSelect(): void; onCustomize(): void;
  onDelete?(): void; onExport?(): void;
}) {
  return (
    <div className="group flex flex-col gap-1.5">
      <button
        onClick={onSelect}
        className={`relative rounded-xl overflow-hidden border-2 transition-all ${
          isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-700 hover:border-gray-500'
        }`}
      >
        <ThemePreviewSwatch theme={theme} />
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 bg-blue-500 rounded-full p-0.5">
            <Check size={10} className="text-white" />
          </div>
        )}
      </button>
      <p className="text-xs text-center text-gray-400 truncate">{theme.name}</p>
      <div className="flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onCustomize} className="text-xs text-gray-500 hover:text-blue-400">Edit</button>
        {onExport && <button onClick={onExport} className="text-gray-500 hover:text-gray-300 p-0.5"><Download size={10} /></button>}
        {onDelete && <button onClick={onDelete} className="text-xs text-gray-500 hover:text-red-400">Del</button>}
      </div>
    </div>
  );
}
