import { create } from 'zustand';
import { loadSettings, saveSettings } from '../utils/storage';

export interface AppSettings {
  uiLang: 'en' | 'ar';
  autoSaveInterval: number; // seconds
  defaultThemeId: string;
  defaultGuideLang: string;
}

const DEFAULTS: AppSettings = {
  uiLang: 'en',
  autoSaveInterval: 30,
  defaultThemeId: 'dark-navy',
  defaultGuideLang: 'en',
};

interface SettingsStore {
  settings: AppSettings;
  updateSettings(patch: Partial<AppSettings>): void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: loadSettings<AppSettings>(DEFAULTS),

  updateSettings(patch) {
    set((s) => {
      const updated = { ...s.settings, ...patch };
      saveSettings(updated);
      return { settings: updated };
    });
  },
}));
