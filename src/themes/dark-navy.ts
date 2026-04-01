import type { Theme } from '../types';

export const darkNavy: Theme = {
  id: 'dark-navy',
  name: 'Dark Navy',
  isBuiltIn: true,
  colors: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#60a5fa',
    background: '#030712',
    surface: '#0f172a',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: '#1e293b',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  fonts: { heading: 'Inter', body: 'Inter', code: 'JetBrains Mono', sizeBase: 16 },
  spacing: { sectionPadding: 48, blockGap: 24, borderRadius: 8 },
  shadows: 'medium',
  animations: true,
};
