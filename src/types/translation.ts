// ── Translation Types ─────────────────────────────────────────────────────────

export interface Language {
  code: string;       // 'ar' | 'en' | 'fr' | ...
  name: string;       // 'العربية' | 'English' | ...
  dir: 'rtl' | 'ltr';
  flag: string;       // '🇸🇦'
}

export type TranslationProvider = 'gemini' | 'openai' | 'deepl' | 'custom';

export interface TranslationConfig {
  provider: TranslationProvider;
  apiKey: string;
  customEndpoint?: string;
  customHeaders?: Record<string, string>;
  targetLangs: string[];
}
