import type { Theme } from '../types';

export const warmSand: Theme = {
  id: 'warm-sand',
  name: 'Warm Sand',
  isBuiltIn: true,
  colors: {
    primary: '#b45309',
    secondary: '#92400e',
    accent: '#d97706',
    background: '#fdf8f0',
    surface: '#fffbf0',
    text: '#292524',
    textMuted: '#78716c',
    border: '#e7e5e4',
    success: '#65a30d',
    warning: '#ca8a04',
    danger: '#b91c1c',
  },
  fonts: { heading: 'Georgia', body: 'Inter', code: 'JetBrains Mono', sizeBase: 16 },
  spacing: { sectionPadding: 52, blockGap: 26, borderRadius: 10 },
  shadows: 'light',
  animations: true,
};
