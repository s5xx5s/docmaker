import { get, set, del } from 'idb-keyval';

/**
 * Zustand `persist` compatible storage adapter backed by IndexedDB (via idb-keyval).
 * Silently falls back to localStorage when IndexedDB is unavailable
 * (e.g. Firefox private mode or very old browsers).
 *
 * IndexedDB capacity: 50 MB+ vs localStorage's 5 MB limit.
 */
export const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await get<string>(name);
      return value ?? null;
    } catch {
      return localStorage.getItem(name);
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await set(name, value);
    } catch {
      localStorage.setItem(name, value);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name);
    } catch {
      localStorage.removeItem(name);
    }
  },
};

/** Clears all docmaker data from IndexedDB (used by "Clear All Data"). */
export async function clearIdbStorage(): Promise<void> {
  const keys = [
    'docmaker_projects_v2',
    'docmaker_settings_v2',
    'docmaker_themes_v2',
  ];
  await Promise.all(keys.map((k) => del(k).catch(() => {})));
}
