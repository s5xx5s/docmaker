import type { Theme } from '../types';

export const corporate: Theme = {
  id: 'corporate',
  name: 'Corporate',
  isBuiltIn: true,
  colors: {
    primary: '#1e3a5f',
    secondary: '#0f2744',
    accent: '#2563eb',
    background: '#f0f4f8',
    surface: '#ffffff',
    text: '#1a202c',
    textMuted: '#718096',
    border: '#cbd5e0',
    success: '#276749',
    warning: '#c05621',
    danger: '#9b2c2c',
  },
  fonts: { heading: 'Georgia', body: 'Inter', code: 'Courier New', sizeBase: 16 },
  spacing: { sectionPadding: 56, blockGap: 28, borderRadius: 4 },
  shadows: 'medium',
  animations: false,
};
