import type { Project } from '../types';

const PROJECTS_KEY = 'docmaker_projects';
const SETTINGS_KEY = 'docmaker_settings';

// ── Projects ──────────────────────────────────────────────────────────────────

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// ── Settings ──────────────────────────────────────────────────────────────────

export function loadSettings<T>(defaults: T): T {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<T>) } : defaults;
  } catch {
    return defaults;
  }
}

export function saveSettings<T>(settings: T): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ── Storage Usage ─────────────────────────────────────────────────────────────

/** Returns total localStorage usage in KB */
export function getStorageUsageKB(): number {
  let total = 0;
  for (const key in localStorage) {
    if (!Object.prototype.hasOwnProperty.call(localStorage, key)) continue;
    total += (localStorage.getItem(key) ?? '').length;
  }
  return Math.round(total / 1024);
}

/** Browser localStorage limit is typically 5 MB */
export const STORAGE_LIMIT_KB = 5120;

// ── Import / Export ───────────────────────────────────────────────────────────

export function exportProjectsJSON(projects: Project[]): void {
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `docmaker-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProjectsJSON(file: File): Promise<Project[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Project[];
        resolve(Array.isArray(data) ? data : [data]);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
