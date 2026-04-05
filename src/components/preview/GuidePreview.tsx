import { useState, useEffect, useRef } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import type { Guide, Section, Theme } from '../../types';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { useSettingsStore } from '../../store/settings.store';

// ── Theme → CSS vars ──────────────────────────────────────────────────────────

function themeToStyle(theme: Theme): React.CSSProperties {
  const shadowMap = {
    none: 'none',
    light: '0 1px 3px rgba(0,0,0,0.15)',
    medium: '0 4px 12px rgba(0,0,0,0.25)',
    heavy: '0 8px 24px rgba(0,0,0,0.45)',
  };
  return {
    '--gp-primary':   theme.colors.primary,
    '--gp-secondary': theme.colors.secondary,
    '--gp-accent':    theme.colors.accent,
    '--gp-bg':        theme.colors.background,
    '--gp-surface':   theme.colors.surface,
    '--gp-text':      theme.colors.text,
    '--gp-muted':     theme.colors.textMuted,
    '--gp-border':    theme.colors.border,
    '--gp-success':   theme.colors.success,
    '--gp-warning':   theme.colors.warning,
    '--gp-danger':    theme.colors.danger,
    '--gp-font-head': theme.fonts.heading,
    '--gp-font-body': theme.fonts.body,
    '--gp-font-code': theme.fonts.code,
    '--gp-size-base': `${theme.fonts.sizeBase}px`,
    '--gp-pad':       `${theme.spacing.sectionPadding}px`,
    '--gp-gap':       `${theme.spacing.blockGap}px`,
    '--gp-radius':    `${theme.spacing.borderRadius}px`,
    '--gp-shadow':    shadowMap[theme.shadows],
    backgroundColor:  theme.colors.background,
    color:            theme.colors.text,
    fontFamily:       theme.fonts.body + ', sans-serif',
    fontSize:         `${theme.fonts.sizeBase}px`,
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

// ── Breakpoints ───────────────────────────────────────────────────────────────
// Drawer mode kicks in automatically when the container is narrower than this.
const DRAWER_BREAKPOINT = 540; // px — below this width sidebar becomes a drawer
const NARROW_SIDEBAR_BP  = 700; // px — below this use a slim sidebar (w-44 instead of w-56)

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  guide: Guide;
  theme: Theme;
  activeSectionId?: string | null;
  onSectionChange?: (id: string) => void;
  /** 'inline' = embedded in editor panel | 'full' = standalone full-screen page */
  mode?: 'inline' | 'full';
  /** Force compact/drawer mode regardless of container width (optional override) */
  compact?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GuidePreview({ guide, theme, activeSectionId, onSectionChange, mode = 'inline', compact = false }: Props) {
  const [lang, setLang] = useState<string>(guide.defaultLang);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(9999);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Auto-sync guide language with UI language ──────────────────────────────
  const uiLang = useSettingsStore(s => s.settings.uiLang);
  useEffect(() => {
    // Switch preview language automatically when UI language changes,
    // if the guide has a translation for that language.
    if (guide.availableLangs.some(l => l.code === uiLang)) {
      setLang(uiLang);
    }
  }, [uiLang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Responsive sidebar via ResizeObserver ──────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Measure on first render
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setContainerWidth(w);
      // Auto-close drawer when container widens past the breakpoint
      if (w >= DRAWER_BREAKPOINT) setDrawerOpen(false);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Drawer mode = forced by prop OR auto-detected narrow container
  const useDrawer = compact || containerWidth < DRAWER_BREAKPOINT;
  // Slim sidebar between breakpoints (tablet-ish)
  const slimSidebar = !useDrawer && containerWidth < NARROW_SIDEBAR_BP;

  const sidebarWidth = slimSidebar ? 'w-44' : 'w-56';

  const sections   = guide.sections.filter(s => s.isActive);
  const currentId  = activeSectionId ?? sections[0]?.id ?? null;
  const currentSection = sections.find(s => s.id === currentId) ?? sections[0] ?? null;
  const hasSidebar = sections.length > 1;

  function selectSection(id: string) {
    if (onSectionChange) onSectionChange(id);
    if (useDrawer) setDrawerOpen(false);
  }

  const { title: sectionTitle, blocks } = currentSection
    ? getSectionContent(currentSection, lang)
    : { title: '', blocks: [] };

  const hasMultipleLangs = guide.availableLangs.length > 1;
  const isRtl = (guide.direction ?? 'ltr') === 'rtl';

  const containerClass = mode === 'full'
    ? 'flex h-screen overflow-hidden'
    : 'flex h-full overflow-hidden rounded-xl border';

  // ── Sidebar inner (shared between static and overlay) ────────────────────

  const SidebarInner = ({ showClose }: { showClose?: boolean }) => (
    <>
      {/* Guide header */}
      <div
        className="px-4 py-4 border-b shrink-0 flex items-start justify-between gap-2"
        style={{ borderColor: 'var(--gp-border)' }}
      >
        <div className="min-w-0 flex-1">
          {guide.logo && (
            <img src={guide.logo} alt="Logo" className="h-7 mb-2 object-contain" />
          )}
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5 truncate"
            style={{ color: 'var(--gp-muted)' }}>
            {guide.subtitle || 'GUIDE'}
          </p>
          <h2 className="text-sm font-bold leading-tight break-words"
            style={{ color: 'var(--gp-text)', fontFamily: 'var(--gp-font-head), sans-serif' }}>
            {guide.title}
          </h2>
        </div>
        {showClose && (
          <button
            onClick={() => setDrawerOpen(false)}
            className="shrink-0 p-1 rounded-md hover:opacity-70 transition-opacity"
            style={{ color: 'var(--gp-muted)' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Section list */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {sections.map((s) => {
          const active = s.id === currentId;
          const { title: t } = getSectionContent(s, lang);
          return (
            <button
              key={s.id}
              onClick={() => selectSection(s.id)}
              className="w-full text-start px-4 py-2.5 text-sm transition-colors"
              style={{
                color:           active ? 'var(--gp-primary)' : 'var(--gp-muted)',
                backgroundColor: active ? 'color-mix(in srgb, var(--gp-primary) 12%, transparent)' : 'transparent',
                fontWeight:      active ? '600' : '400',
                borderInlineStart: active ? '3px solid var(--gp-primary)' : '3px solid transparent',
              }}
            >
              {s.icon && <span className="me-2">{s.icon}</span>}
              {t}
            </button>
          );
        })}
      </nav>

      {/* Language switcher */}
      {hasMultipleLangs && (
        <div className="border-t p-3 shrink-0" style={{ borderColor: 'var(--gp-border)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Globe size={12} style={{ color: 'var(--gp-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--gp-muted)' }}>Language</span>
          </div>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="w-full text-xs rounded px-2 py-1 border focus:outline-none"
            style={{ backgroundColor: 'var(--gp-bg)', color: 'var(--gp-text)', borderColor: 'var(--gp-border)' }}
          >
            {guide.availableLangs.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
      )}
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={`${containerClass} relative`}
      style={themeToStyle(theme)}
      dir={guide.direction ?? 'ltr'}
    >

      {/* ── Static sidebar (desktop / tablet) ────────────────────────── */}
      {hasSidebar && !useDrawer && (
        <aside
          className={`${sidebarWidth} shrink-0 flex flex-col border-e overflow-hidden`}
          style={{ borderColor: 'var(--gp-border)', backgroundColor: 'var(--gp-surface)' }}
        >
          <SidebarInner />
        </aside>
      )}

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main
        className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden"
        style={{ padding: 'var(--gp-pad)' }}
      >
        {/* Hamburger button (drawer mode only) */}
        {useDrawer && hasSidebar && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-full flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border text-sm"
            style={{
              color:           'var(--gp-muted)',
              borderColor:     'var(--gp-border)',
              backgroundColor: 'var(--gp-surface)',
            }}
          >
            <Menu size={15} style={{ color: 'var(--gp-primary)', flexShrink: 0 }} />
            <span className="truncate font-medium" style={{ color: 'var(--gp-text)' }}>
              {sectionTitle || guide.title}
            </span>
          </button>
        )}

        {/* Single-section guide header */}
        {sections.length <= 1 && (
          <header className="mb-8">
            {guide.logo && (
              <img src={guide.logo} alt="Logo" className="h-12 mb-4 object-contain" />
            )}
            <h1 className="text-3xl font-bold mb-2 break-words"
              style={{ color: 'var(--gp-text)', fontFamily: 'var(--gp-font-head), sans-serif' }}>
              {guide.title}
            </h1>
            {guide.subtitle && (
              <p className="text-base break-words" style={{ color: 'var(--gp-muted)' }}>
                {guide.subtitle}
              </p>
            )}
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

        {/* Section title + blocks */}
        {currentSection && (
          <>
            <h2
              className="text-2xl font-bold mb-6 break-words"
              style={{
                color:         'var(--gp-text)',
                fontFamily:    'var(--gp-font-head), sans-serif',
                borderBottom:  '2px solid var(--gp-primary)',
                paddingBottom: '12px',
              }}
            >
              {currentSection.icon && <span className="me-2">{currentSection.icon}</span>}
              {sectionTitle}
            </h2>

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

        {theme.customCSS && <style>{theme.customCSS}</style>}
      </main>

      {/* ── Drawer overlay (narrow containers) ───────────────────────── */}
      {useDrawer && hasSidebar && drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel — start edge (left in LTR, right in RTL) */}
          <aside
            className="absolute inset-y-0 start-0 z-50 w-64 flex flex-col border-e overflow-hidden"
            style={{
              borderColor:     'var(--gp-border)',
              backgroundColor: 'var(--gp-surface)',
              boxShadow:       isRtl
                ? '-4px 0 24px rgba(0,0,0,0.45)'
                : '4px 0 24px rgba(0,0,0,0.45)',
            }}
          >
            <SidebarInner showClose />
          </aside>
        </>
      )}
    </div>
  );
}
