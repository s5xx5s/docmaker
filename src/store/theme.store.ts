import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Theme } from '../types';
import { darkNavy } from '../themes/dark-navy';
import { lightClean } from '../themes/light-clean';
import { corporate } from '../themes/corporate';
import { greenTech } from '../themes/green-tech';
import { warmSand } from '../themes/warm-sand';
import { idbStorage } from '../utils/idb-storage';

const BUILT_IN_THEMES: Theme[] = [darkNavy, lightClean, corporate, greenTech, warmSand];

interface ThemeStore {
  /** True once the IDB read has completed on startup. */
  _hydrated: boolean;
  themes: Theme[];
  activeThemeId: string;
  getTheme(id: string): Theme;
  setActiveTheme(id: string): void;
  addCustomTheme(theme: Theme): void;
  updateCustomTheme(id: string, patch: Partial<Theme>): void;
  deleteCustomTheme(id: string): void;
  exportTheme(id: string): void;
  importTheme(file: File): Promise<Theme>;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      _hydrated: false,
      themes: BUILT_IN_THEMES,
      activeThemeId: 'dark-navy',

      getTheme(id) {
        return get().themes.find((t) => t.id === id) ?? darkNavy;
      },

      setActiveTheme(id) {
        set({ activeThemeId: id });
      },

      addCustomTheme(theme) {
        set((s) => ({ themes: [...s.themes, theme] }));
      },

      updateCustomTheme(id, patch) {
        set((s) => ({
          themes: s.themes.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }));
      },

      deleteCustomTheme(id) {
        set((s) => ({ themes: s.themes.filter((t) => t.id !== id) }));
      },

      exportTheme(id) {
        const theme = get().getTheme(id);
        const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `theme-${theme.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      importTheme(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const theme = JSON.parse(reader.result as string) as Theme;
              theme.isBuiltIn = false;
              get().addCustomTheme(theme);
              resolve(theme);
            } catch {
              reject(new Error('Invalid theme file'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      },
    }),
    {
      name: 'docmaker_themes_v2',
      storage: createJSONStorage(() => idbStorage),
      // Only persist custom themes — built-ins are always bundled in code
      partialize: (state) => ({
        themes: state.themes.filter((t) => !t.isBuiltIn),
      }),
      onRehydrateStorage: () => (state) => {
        useThemeStore.setState({ _hydrated: true });

        // Re-merge built-in themes with any custom themes loaded from IDB
        const customThemes = state?.themes.filter((t) => !t.isBuiltIn) ?? [];
        useThemeStore.setState({ themes: [...BUILT_IN_THEMES, ...customThemes] });

        // ── Migrate custom themes from old localStorage (one-time) ──────────
        if (customThemes.length === 0) {
          try {
            const raw = localStorage.getItem('docmaker_custom_themes');
            if (raw) {
              const migrated = JSON.parse(raw) as Theme[];
              if (Array.isArray(migrated) && migrated.length > 0) {
                useThemeStore.setState({ themes: [...BUILT_IN_THEMES, ...migrated] });
                localStorage.removeItem('docmaker_custom_themes');
              }
            }
          } catch { /* ignore migration errors */ }
        }
      },
    }
  )
);
