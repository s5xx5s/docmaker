import { create } from 'zustand';
import type { Theme } from '../types';
import { darkNavy } from '../themes/dark-navy';
import { lightClean } from '../themes/light-clean';
import { corporate } from '../themes/corporate';
import { greenTech } from '../themes/green-tech';
import { warmSand } from '../themes/warm-sand';

const BUILT_IN_THEMES: Theme[] = [darkNavy, lightClean, corporate, greenTech, warmSand];
const CUSTOM_KEY = 'docmaker_custom_themes';

function loadCustomThemes(): Theme[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? (JSON.parse(raw) as Theme[]) : [];
  } catch {
    return [];
  }
}

interface ThemeStore {
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

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themes: [...BUILT_IN_THEMES, ...loadCustomThemes()],
  activeThemeId: 'dark-navy',

  getTheme(id) {
    return get().themes.find((t) => t.id === id) ?? darkNavy;
  },

  setActiveTheme(id) {
    set({ activeThemeId: id });
  },

  addCustomTheme(theme) {
    set((s) => ({ themes: [...s.themes, theme] }));
    const customs = get().themes.filter((t) => !t.isBuiltIn);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customs));
  },

  updateCustomTheme(id, patch) {
    set((s) => ({
      themes: s.themes.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
    const customs = get().themes.filter((t) => !t.isBuiltIn);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customs));
  },

  deleteCustomTheme(id) {
    set((s) => ({ themes: s.themes.filter((t) => t.id !== id) }));
    const customs = get().themes.filter((t) => !t.isBuiltIn);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customs));
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
}));
