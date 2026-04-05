import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../utils/idb-storage';
import LZString from 'lz-string';

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
  /** True once the IDB read has completed on startup. */
  _hydrated: boolean;
  settings: AppSettings;
  updateSettings(patch: Partial<AppSettings>): void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      _hydrated: false,
      settings: DEFAULTS,

      updateSettings(patch) {
        set((s) => ({ settings: { ...s.settings, ...patch } }));
      },
    }),
    {
      name: 'docmaker_settings_v2',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ settings: state.settings }),
      // Always merge with DEFAULTS so new settings keys are never undefined
      merge: (persisted, current) => ({
        ...current,
        settings: { ...DEFAULTS, ...((persisted as Partial<SettingsStore>).settings ?? {}) },
      }),
      onRehydrateStorage: () => () => {
        useSettingsStore.setState({ _hydrated: true });

        // ── Migrate from old LZ-String localStorage (one-time) ──────────────
        try {
          const raw = localStorage.getItem('docmaker_settings');
          if (raw) {
            const decompressed = LZString.decompressFromUTF16(raw) ?? raw;
            const migrated = JSON.parse(decompressed) as Partial<AppSettings>;
            if (migrated && typeof migrated === 'object') {
              useSettingsStore.setState({ settings: { ...DEFAULTS, ...migrated } });
              localStorage.removeItem('docmaker_settings');
            }
          }
        } catch { /* ignore migration errors */ }
      },
    }
  )
);
