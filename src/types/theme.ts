// ── Theme Types ───────────────────────────────────────────────────────────────

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  code: string;
  sizeBase: number; // px
}

export interface ThemeSpacing {
  sectionPadding: number; // px
  blockGap: number;       // px
  borderRadius: number;   // px
}

export interface Theme {
  id: string;
  name: string;
  isBuiltIn: boolean;
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  shadows: 'none' | 'light' | 'medium' | 'heavy';
  animations: boolean;
  customCSS?: string;
}
