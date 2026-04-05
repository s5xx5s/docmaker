import LZString from 'lz-string';
import type { Project } from '../types';

const PROJECTS_KEY = 'docmaker_projects';
const SETTINGS_KEY = 'docmaker_settings';

// ── Compression helpers ────────────────────────────────────────────────────
// LZString.compressToUTF16 stores compressed data as a UTF-16 string which
// fits safely inside localStorage (avoids any UTF-8 encoding edge-cases).

function compress(value: string): string {
  return LZString.compressToUTF16(value);
}

/** Decompresses a value, falling back to plain JSON if it was stored without compression. */
function decompress(raw: string): string {
  const decompressed = LZString.decompressFromUTF16(raw);
  // decompressFromUTF16 returns null when the input isn't LZ-compressed
  return decompressed ?? raw;
}

// ── Projects ──────────────────────────────────────────────────────────────────

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    return JSON.parse(decompress(raw)) as Project[];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, compress(JSON.stringify(projects)));
}

// ── Settings ──────────────────────────────────────────────────────────────────

export function loadSettings<T>(defaults: T): T {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(decompress(raw)) as Partial<T>) };
  } catch {
    return defaults;
  }
}

export function saveSettings<T>(settings: T): void {
  localStorage.setItem(SETTINGS_KEY, compress(JSON.stringify(settings)));
}

// ── Storage Usage ─────────────────────────────────────────────────────────────

/** Returns total localStorage usage in KB (across all keys). */
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
