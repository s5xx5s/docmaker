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
    surface: '#0f1f18',
    text: '#ecfdf5',
    textMuted: '#6ee7b7',
    border: '#134e33',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#f43f5e',
  },
  fonts: { heading: 'Inter', body: 'Inter', code: 'JetBrains Mono', sizeBase: 15 },
  spacing: { sectionPadding: 40, blockGap: 20, borderRadius: 6 },
  shadows: 'medium',
  animations: true,
};
