import type { Theme } from '../types';

export const warmSand: Theme = {
  id: 'warm-sand',
  name: 'Warm Sand',
  isBuiltIn: true,
  colors: {
    primary: '#b45309',
    secondary: '#92400e',
    accent: '#d97706',
    background: '#fefce8',
    surface: '#fffbeb',
    text: '#1c1917',
    textMuted: '#78716c',
    border: '#e7d5b3',
    success: '#15803d',
    warning: '#b45309',
    danger: '#dc2626',
  },
  fonts: { heading: 'Georgia', body: 'Inter', code: 'JetBrains Mono', sizeBase: 16 },
  spacing: { sectionPadding: 48, blockGap: 24, borderRadius: 6 },
  shadows: 'light',
  animations: true,
};
