import type { Theme } from '../types';

export const greenTech: Theme = {
  id: 'green-tech',
  name: 'Green Tech',
  isBuiltIn: true,
  colors: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: '#0a0f0d',
    surface: '#0f1a15',
    text: '#ecfdf5',
    textMuted: '#6ee7b7',
    border: '#064e3b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  fonts: { heading: 'Inter', body: 'Inter', code: 'JetBrains Mono', sizeBase: 16 },
  spacing: { sectionPadding: 48, blockGap: 24, borderRadius: 10 },
  shadows: 'medium',
  animations: true,
};
