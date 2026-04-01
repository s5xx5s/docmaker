import type { Block } from './block';
import type { Theme } from './theme';
import type { Language } from './translation';

// ── Section ───────────────────────────────────────────────────────────────────

export interface SectionTranslation {
  title: string;
  subtitle?: string;
  blocks: Block[];
}

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  blocks: Block[];
  translations: Record<string, SectionTranslation>;
}

// ── Guide ─────────────────────────────────────────────────────────────────────

export interface Guide {
  id: string;
  projectId: string;
  title: string;
  subtitle?: string;
  direction?: 'ltr' | 'rtl';
  logo?: string;
  themeId: string;
  themeOverrides?: Partial<Theme>;
  defaultLang: string;
  availableLangs: Language[];
  sections: Section[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Project ───────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  guides: Guide[];
}
