import { useState } from 'react';
import { Globe } from 'lucide-react';
import type { Guide, Section, Theme } from '../../types';
import { BlockRenderer } from '../blocks/BlockRenderer';

// ── Theme → CSS vars ──────────────────────────────────────────────────────────

function themeToStyle(theme: Theme): React.CSSProperties {
  const shadowMap = {
    none: 'none',
    light: '0 1px 3px rgba(0,0,0,0.15)',
    medium: '0 4px 12px rgba(0,0,0,0.25)',
    heavy: '0 8px 24px rgba(0,0,0,0.45)',
  };
  return {
    '--gp-primary':    theme.colors.primary,
    '--gp-secondary':  theme.colors.secondary,
    '--gp-accent':     theme.colors.accent,
    '--gp-bg':         theme.colors.background,
    '--gp-surface':    theme.colors.surface,
    '--gp-text':       theme.colors.text,
    '--gp-muted':      theme.colors.textMuted,
    '--gp-border':     theme.colors.border,
    '--gp-success':    theme.colors.success,
    '--gp-warning':    theme.colors.warning,
    '--gp-danger':     theme.colors.danger,
    '--gp-font-head':  theme.fonts.heading,
    '--gp-font-body':  theme.fonts.body,
    '--gp-font-code':  theme.fonts.code,
    '--gp-size-base':  `${theme.fonts.sizeBase}px`,
    '--gp-pad':        `${theme.spacing.sectionPadding}px`,
    '--gp-gap':        `${theme.spacing.blockGap}px`,
    '--gp-radius':     `${theme.spacing.borderRadius}px`,
    '--gp-shadow':     shadowMap[theme.shadows],
    backgroundColor:   theme.colors.background,
    color:             theme.colors.text,
    fontFamily:        theme.fonts.body + ', sans-serif',
    fontSize:          `${theme.fonts.sizeBase}px`,
  } as React.CSSProperties;
}

// ── Section content (with translation fallback) ───────────────────────────────

function getSectionContent(section: Section, lang: string) {
  const tr = section.translations[lang];
  return {
    title:  tr?.title  ?? section.title,
    blocks: tr?.blocks ?? section.blocks,
  };
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  guide: Guide;
  theme: Theme;
  activeSectionId?: string | null;
  onSectionChange?: (id: string) => void;
  /** 'inline' = embedded in editor panel | 'full' = standalone full-screen page */
  mode?: 'inline' | 'full';
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GuidePreview({ guide, theme, activeSectionId, onSectionChange, mode = 'inline' }: Props) {
  const [lang, setLang] = useState<string>(guide.defaultLang);

  const sections = guide.sections.filter(s => s.isActive);
  const currentId = activeSectionId ?? sections[0]?.id ?? null;
  const currentSection = sections.find(s => s.id === currentId) ?? sections[0] ?? null;

  function selectSection(id: string) {
    if (onSectionChange) onSectionChange(id);
  }

  const { title: sectionTitle, blocks } = currentSection
    ? getSectionContent(currentSection, lang)
    : { title: '', blocks: [] };

  const hasMultipleLangs = guide.availableLangs.length > 1;

  const containerClass = mode === 'full'
    ? 'flex h-screen overflow-hidden'
    : 'flex h-full overflow-hidden rounded-xl border';

  return (
    <div className={containerClass} style={themeToStyle(theme)}>

      {/* ── Sidebar nav ─────────────────────────────────────────────── */}
      {sections.length > 1 && (
        <aside
          className="w-56 shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ borderColor: 'var(--gp-border)', backgroundColor: 'var(--gp-surface)' }}
        >
          {/* Guide title */}
          <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--gp-border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--gp-muted)' }}>
              {guide.subtitle ? guide.subtitle : 'Guide'}
            </p>
            <h2 className="text-sm font-bold leading-tight" style={{ color: 'var(--gp-text)', fontFamily: 'var(--gp-font-head), sans-serif' }}>
              {guide.title}
            </h2>
          </div>

          {/* Section list */}
          <nav className="flex-1 py-2">
            {sections.map((s) => {
              const active = s.id === currentId;
              const { title: t } = getSectionContent(s, lang);
              return (
                <button
                  key={s.id}
                  onClick={() => selectSection(s.id)}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{
                    color:           active ? 'var(--gp-primary)' : 'var(--gp-muted)',
                    backgroundColor: active ? 'color-mix(in srgb, var(--gp-primary) 12%, transparent)' : 'transparent',
                    fontWeight:      active ? '600' : '400',
                    borderLeft:      active ? '3px solid var(--gp-primary)' : '3px solid transparent',
                  }}
                >
                  {s.icon && <span className="mr-2">{s.icon}</span>}
                  {t}
                </button>
              );
            })}
          </nav>

          {/* Language switcher */}
          {hasMultipleLangs && (
            <div className="border-t p-3" style={{ borderColor: 'var(--gp-border)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Globe size={12} style={{ color: 'var(--gp-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--gp-muted)' }}>Language</span>
              </div>
              <select
                value={lang}
                onChange={e => setLang(e.target.value)}
                className="w-full text-xs rounded px-2 py-1 border focus:outline-none"
                style={{
                  backgroundColor: 'var(--gp-bg)',
                  color:           'var(--gp-text)',
                  borderColor:     'var(--gp-border)',
                }}
              >
                {guide.availableLangs.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                ))}
              </select>
            </div>
          )}
        </aside>
      )}

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto" style={{ padding: 'var(--gp-pad)' }}>

        {/* Guide header (only when single section / no sidebar) */}
        {sections.length <= 1 && (
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--gp-text)', fontFamily: 'var(--gp-font-head), sans-serif' }}>
              {guide.title}
            </h1>
            {guide.subtitle && (
              <p className="text-base" style={{ color: 'var(--gp-muted)' }}>{guide.subtitle}</p>
            )}
            {/* Language switcher for single-section guides */}
            {hasMultipleLangs && (
              <div className="flex items-center gap-2 mt-3">
                <Globe size={14} style={{ color: 'var(--gp-muted)' }} />
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="text-sm rounded px-2 py-1 border focus:outline-none"
                  style={{ backgroundColor: 'var(--gp-surface)', color: 'var(--gp-text)', borderColor: 'var(--gp-border)' }}
                >
                  {guide.availableLangs.map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                  ))}
                </select>
              </div>
            )}
          </header>
        )}

        {/* Section title */}
        {currentSection && (
          <>
            <h2
              className="text-2xl font-bold mb-6"
              style={{
                color:      'var(--gp-text)',
                fontFamily: 'var(--gp-font-head), sans-serif',
                borderBottom: `2px solid var(--gp-primary)`,
                paddingBottom: '12px',
              }}
            >
              {currentSection.icon && <span className="mr-2">{currentSection.icon}</span>}
              {sectionTitle}
            </h2>

            {/* Blocks */}
            {blocks.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--gp-muted)' }}>No content yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gp-gap)' }}>
                {blocks.map(block => (
                  <div key={block.id}>
                    <BlockRenderer block={block} theme={theme} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {sections.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm" style={{ color: 'var(--gp-muted)' }}>No sections yet.</p>
          </div>
        )}

        {/* Custom CSS injection */}
        {theme.customCSS && <style>{theme.customCSS}</style>}
      </main>
    </div>
  );
}
