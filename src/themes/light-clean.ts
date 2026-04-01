import type { Theme } from '../types';

export const lightClean: Theme = {
  id: 'light-clean',
  name: 'Light Clean',
  isBuiltIn: true,
  colors: {
    primary: '#2563eb',
    secondary: '#1d4ed8',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
  },
  fonts: { heading: 'Inter', body: 'Inter', code: 'JetBrains Mono', sizeBase: 16 },
  spacing: { sectionPadding: 48, blockGap: 24, borderRadius: 8 },
  shadows: 'light',
  animations: true,
};
