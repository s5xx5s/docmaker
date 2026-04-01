// ── JSON Exporter ─────────────────────────────────────────────────────────────
import type { Guide } from '../types';

export function exportGuideAsJSON(guide: Guide): string {
  return JSON.stringify(guide, null, 2);
}

export function downloadJSON(guide: Guide) {
  const json = exportGuideAsJSON(guide);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${guide.title.replace(/\s+/g, '-').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
