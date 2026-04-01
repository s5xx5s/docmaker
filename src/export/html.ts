// ── HTML Exporter ─────────────────────────────────────────────────────────────
// Produces a single standalone HTML file with:
// - All CSS inlined (no external dependencies)
// - Images as Base64
// - RTL/LTR per language
// - Language switcher (if multiple langs)
// - Accordion JS
// - Lightbox JS
// - Responsive (mobile-first)

import type { Guide, Section, Block, Theme } from '../types';

// ── Block → HTML ──────────────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function blockToHtml(block: Block): string {
  switch (block.type) {
    case 'text':
      return `<p class="gp-text" style="text-align:${block.align ?? 'left'}">${escHtml(block.content)}</p>`;

    case 'highlight': {
      const icons: Record<string, string> = { info: 'ℹ️', warning: '⚠️', success: '✅', danger: '🚨' };
      return `<div class="gp-highlight gp-highlight-${block.variant}">
        <span class="gp-highlight-icon">${icons[block.variant] ?? 'ℹ️'}</span>
        <div><strong>${escHtml(block.title ?? '')}</strong><p>${escHtml(block.content)}</p></div>
      </div>`;
    }

    case 'quote':
      return `<blockquote class="gp-quote">
        <p class="gp-quote-text">"${escHtml(block.content)}"</p>
        <footer>— <cite>${escHtml(block.author ?? '')}${block.source ? `, <a href="${escHtml(block.source ?? '')}" target="_blank">${escHtml(block.source ?? '')}</a>` : ''}</cite></footer>
      </blockquote>`;

    case 'alert': {
      const icons: Record<string, string> = { info: 'ℹ️', warning: '⚠️', danger: '🚨', success: '✅', tip: '💡' };
      return `<div class="gp-alert gp-alert-${block.variant}">
        <span>${icons[block.variant] ?? 'ℹ️'}</span>
        <div><strong>${escHtml(block.title)}</strong>${block.content ? `<p>${escHtml(block.content)}</p>` : ''}</div>
      </div>`;
    }

    case 'divider':
      return `<div class="gp-divider gp-divider-${block.style}">${block.label ? `<span>${escHtml(block.label)}</span>` : ''}</div>`;

    case 'steps':
      return `<ol class="gp-steps">${block.steps.map((s, i) => `
        <li class="gp-step"><span class="gp-step-num">${i + 1}</span>
          <div><strong>${escHtml(s.title)}</strong>${s.description ? `<p>${escHtml(s.description)}</p>` : ''}</div>
        </li>`).join('')}</ol>`;

    case 'checklist':
      return `<ul class="gp-checklist">${block.items.map(item => `
        <li class="gp-checklist-item${item.checked ? ' checked' : ''}">
          <input type="checkbox"${item.checked ? ' checked' : ''}${!block.interactive ? ' disabled' : ''}> <span>${escHtml(item.label)}</span>
        </li>`).join('')}</ul>`;

    case 'faq':
      return `<dl class="gp-faq">${block.items.map(item => `
        <dt class="gp-faq-q">Q: ${escHtml(item.question)}</dt>
        <dd class="gp-faq-a">A: ${escHtml(item.answer)}</dd>`).join('')}</dl>`;

    case 'accordion':
      return `<div class="gp-accordion">${block.items.map((item) => `
        <div class="gp-accordion-item${item.defaultOpen ? ' open' : ''}">
          <button class="gp-accordion-btn" onclick="gpToggleAccordion(this)">${escHtml(item.title)} <span class="gp-accordion-arrow">▾</span></button>
          <div class="gp-accordion-body" style="${item.defaultOpen ? '' : 'display:none'}">${escHtml(item.content)}</div>
        </div>`).join('')}</div>`;

    case 'image':
      if (!block.src) return '';
      return `<figure class="gp-image gp-image-${block.width ?? 'full'}">
        <img src="${block.src}" alt="${escHtml(block.alt ?? '')}" loading="lazy">
        ${block.caption ? `<figcaption>${escHtml(block.caption)}</figcaption>` : ''}
      </figure>`;

    case 'video':
      if (!block.src) return '';
      if (block.src.includes('youtube.com') || block.src.includes('youtu.be')) {
        const id = block.src.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1] ?? '';
        return `<figure class="gp-video"><div class="gp-video-wrap"><iframe src="https://www.youtube.com/embed/${id}" allowfullscreen loading="lazy"></iframe></div>${block.caption ? `<figcaption>${escHtml(block.caption)}</figcaption>` : ''}</figure>`;
      }
      if (block.src.includes('vimeo.com')) {
        const id = block.src.match(/vimeo\.com\/(\d+)/)?.[1] ?? '';
        return `<figure class="gp-video"><div class="gp-video-wrap"><iframe src="https://player.vimeo.com/video/${id}" allowfullscreen loading="lazy"></iframe></div>${block.caption ? `<figcaption>${escHtml(block.caption)}</figcaption>` : ''}</figure>`;
      }
      return `<figure class="gp-video"><video src="${block.src}" controls style="width:100%"></video>${block.caption ? `<figcaption>${escHtml(block.caption)}</figcaption>` : ''}</figure>`;

    case 'gallery':
      if (!block.images.length) return '';
      return `<div class="gp-gallery gp-gallery-cols-${block.columns ?? 3}">${block.images.map((img) => `
        <figure class="gp-gallery-item"${block.lightbox ? ` onclick="gpLightbox('${escHtml(img.src ?? '')}')" style="cursor:pointer"` : ''}>
          <img src="${img.src ?? ''}" alt="${escHtml(img.alt ?? '')}" loading="lazy">
          ${img.caption ? `<figcaption>${escHtml(img.caption)}</figcaption>` : ''}
        </figure>`).join('')}</div>`;

    case 'logo':
      if (!block.src) return '';
      return `<div class="gp-logo">${block.link ? `<a href="${escHtml(block.link)}" target="_blank">` : ''}<img src="${block.src}" alt="${escHtml(block.alt ?? 'Logo')}" style="width:${block.width ?? 120}px">${block.link ? '</a>' : ''}</div>`;

    case 'table':
      return `<div class="gp-table-wrap"><table class="gp-table${block.striped ? ' striped' : ''}">
        <thead><tr>${block.headers.map(h => `<th>${escHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>${block.rows.map(row => `<tr>${row.map(cell => `<td>${escHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`;

    case 'compare':
      return `<div class="gp-compare"><div class="gp-compare-col">
        <h4>${escHtml(block.leftTitle ?? '')}</h4><ul>${block.leftItems.map(i => `<li>${escHtml(i)}</li>`).join('')}</ul>
      </div><div class="gp-compare-col">
        <h4>${escHtml(block.rightTitle ?? '')}</h4><ul>${block.rightItems.map(i => `<li>${escHtml(i)}</li>`).join('')}</ul>
      </div></div>`;

    case 'stats':
      return `<div class="gp-stats gp-stats-cols-${block.columns ?? 3}">${block.items.map(s => `
        <div class="gp-stat-card"><div class="gp-stat-value">${s.prefix ?? ''}${escHtml(s.value)}${s.suffix ?? ''}</div><div class="gp-stat-label">${escHtml(s.label)}</div></div>`).join('')}</div>`;

    case 'cards':
      return `<div class="gp-cards gp-cards-cols-${block.columns ?? 3}">${block.cards.map(c => `
        <div class="gp-card">${c.icon ? `<span class="gp-card-icon">${c.icon}</span>` : ''}<h4>${escHtml(c.title)}</h4><p>${escHtml(c.description ?? '')}</p></div>`).join('')}</div>`;

    case 'image-text': {
      const imgFirst = block.imagePosition !== 'right';
      const imgHtml = block.src ? `<div class="gp-image-text-img"><img src="${block.src}" alt="${escHtml(block.alt ?? '')}"></div>` : '';
      const textHtml = `<div class="gp-image-text-content"><h3>${escHtml(block.title ?? '')}</h3><p>${escHtml(block.content)}</p></div>`;
      return `<div class="gp-image-text">${imgFirst ? imgHtml + textHtml : textHtml + imgHtml}</div>`;
    }

    case 'flow':
      return `<div class="gp-flow gp-flow-${block.direction ?? 'horizontal'}">${block.steps.map(s => `<div class="gp-flow-step">${escHtml(s.label)}</div>`).join('<span class="gp-flow-arrow">→</span>')}</div>`;

    case 'timeline':
      return `<div class="gp-timeline gp-timeline-${block.direction ?? 'vertical'}">${block.items.map(item => `
        <div class="gp-timeline-item"><div class="gp-timeline-date">${escHtml(item.date ?? '')}</div>
          <div class="gp-timeline-content"><strong>${escHtml(item.title)}</strong>${item.description ? `<p>${escHtml(item.description)}</p>` : ''}</div>
        </div>`).join('')}</div>`;

    case 'rating': {
      const full = Math.floor(block.value ?? 0);
      const max = block.maxValue ?? 5;
      const stars = Array.from({ length: max }, (_, i) => i < full ? '★' : '☆').join('');
      return `<div class="gp-rating">${block.label ? `<p>${escHtml(block.label)}</p>` : ''}<span class="gp-stars">${stars}</span>${block.showValue ? `<span class="gp-rating-val">${block.value}/${max}</span>` : ''}</div>`;
    }

    case 'button': {
      const align = block.align === 'center' ? 'center' : block.align === 'right' ? 'flex-end' : 'flex-start';
      return `<div style="display:flex;justify-content:${align}"><a href="${escHtml(block.href ?? '#')}" class="gp-btn gp-btn-${block.variant ?? 'primary'} gp-btn-${block.size ?? 'md'}" target="_blank">${escHtml(block.label)}</a></div>`;
    }

    case 'embed':
      if (!block.src) return '';
      return `<div class="gp-embed" style="height:${block.height ?? 400}px"><iframe src="${escHtml(block.src)}" title="${escHtml(block.title ?? '')}" allowfullscreen loading="lazy" style="width:100%;height:100%;border:0"></iframe></div>`;

    case 'code':
      return `<div class="gp-code-block">${block.filename ? `<div class="gp-code-filename">${escHtml(block.filename)}</div>` : ''}
        <pre class="gp-code" data-lang="${escHtml(block.language ?? '')}"><code>${escHtml(block.code ?? '')}</code></pre>
      </div>`;

    default:
      return '';
  }
}

// ── Section → HTML ────────────────────────────────────────────────────────────

function sectionToHtml(section: Section, lang: string): string {
  const tr = section.translations[lang];
  const title = tr?.title ?? section.title;
  const blocks = tr?.blocks ?? section.blocks;
  return `<section id="section-${section.id}" class="gp-section">
    <h2 class="gp-section-title">${section.icon ? `<span>${section.icon}</span> ` : ''}${escHtml(title)}</h2>
    <div class="gp-blocks">${blocks.map(blockToHtml).join('\n')}</div>
  </section>`;
}

// ── Theme → CSS ───────────────────────────────────────────────────────────────

function themeToCSS(theme: Theme): string {
  const shadowMap = { none: 'none', light: '0 1px 3px rgba(0,0,0,0.12)', medium: '0 4px 12px rgba(0,0,0,0.2)', heavy: '0 8px 24px rgba(0,0,0,0.35)' };
  return `
:root {
  --gp-primary:   ${theme.colors.primary};
  --gp-secondary: ${theme.colors.secondary};
  --gp-accent:    ${theme.colors.accent};
  --gp-bg:        ${theme.colors.background};
  --gp-surface:   ${theme.colors.surface};
  --gp-text:      ${theme.colors.text};
  --gp-muted:     ${theme.colors.textMuted};
  --gp-border:    ${theme.colors.border};
  --gp-success:   ${theme.colors.success};
  --gp-warning:   ${theme.colors.warning};
  --gp-danger:    ${theme.colors.danger};
  --gp-font-head: '${theme.fonts.heading}', sans-serif;
  --gp-font-body: '${theme.fonts.body}', sans-serif;
  --gp-font-code: '${theme.fonts.code}', monospace;
  --gp-size:      ${theme.fonts.sizeBase}px;
  --gp-pad:       ${theme.spacing.sectionPadding}px;
  --gp-gap:       ${theme.spacing.blockGap}px;
  --gp-radius:    ${theme.spacing.borderRadius}px;
  --gp-shadow:    ${shadowMap[theme.shadows]};
}`;
}

// ── Core CSS ──────────────────────────────────────────────────────────────────

const CORE_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--gp-bg);color:var(--gp-text);font-family:var(--gp-font-body);font-size:var(--gp-size);line-height:1.6}
h1,h2,h3,h4{font-family:var(--gp-font-head)}
a{color:var(--gp-primary);text-decoration:none}
a:hover{text-decoration:underline}

/* Layout */
.gp-shell{display:flex;min-height:100vh}
.gp-sidebar{width:240px;background:var(--gp-surface);border-inline-end:1px solid var(--gp-border);position:sticky;top:0;height:100vh;overflow-y:auto;padding:1rem 0;display:flex;flex-direction:column;shrink:0}
.gp-sidebar-header{padding:1rem 1.25rem .75rem;border-block-end:1px solid var(--gp-border)}
.gp-guide-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gp-muted);margin-block-end:.25rem}
.gp-guide-title{font-size:.875rem;font-weight:700;color:var(--gp-text);font-family:var(--gp-font-head)}
.gp-nav{flex:1;padding:.5rem 0}
.gp-nav a{display:block;padding:.5rem 1.25rem;font-size:.875rem;color:var(--gp-muted);border-inline-start:3px solid transparent;transition:all .15s}
.gp-nav a:hover,.gp-nav a.active{color:var(--gp-primary);background:color-mix(in srgb,var(--gp-primary) 10%,transparent);border-inline-start-color:var(--gp-primary);font-weight:600;text-decoration:none}
.gp-main{flex:1;max-width:860px;padding:var(--gp-pad)}
.gp-section{margin-block-end:calc(var(--gp-pad) * 1.5)}
.gp-section-title{font-size:1.5rem;font-weight:700;color:var(--gp-text);border-block-end:2px solid var(--gp-primary);padding-block-end:.75rem;margin-block-end:var(--gp-gap)}
.gp-blocks{display:flex;flex-direction:column;gap:var(--gp-gap)}

/* Lang bar */
.gp-lang-bar{padding:.5rem 1.25rem;border-block-start:1px solid var(--gp-border);margin-block-start:auto}
.gp-lang-bar select{width:100%;background:var(--gp-bg);color:var(--gp-text);border:1px solid var(--gp-border);border-radius:var(--gp-radius);padding:.3rem .5rem;font-size:.75rem;cursor:pointer}

/* Text */
.gp-text{color:var(--gp-text);line-height:1.7}

/* Highlight */
.gp-highlight{display:flex;gap:.75rem;align-items:flex-start;padding:1rem;border-radius:var(--gp-radius);border-inline-start:4px solid}
.gp-highlight-info{background:color-mix(in srgb,var(--gp-accent) 12%,transparent);border-color:var(--gp-accent)}
.gp-highlight-warning{background:color-mix(in srgb,var(--gp-warning) 12%,transparent);border-color:var(--gp-warning)}
.gp-highlight-success{background:color-mix(in srgb,var(--gp-success) 12%,transparent);border-color:var(--gp-success)}
.gp-highlight-danger{background:color-mix(in srgb,var(--gp-danger) 12%,transparent);border-color:var(--gp-danger)}
.gp-highlight-icon{font-size:1.25rem;line-height:1}
.gp-highlight strong{display:block;margin-block-end:.25rem}

/* Quote */
.gp-quote{border-inline-start:4px solid var(--gp-primary);padding:1rem 1.25rem;background:var(--gp-surface);border-radius:0 var(--gp-radius) var(--gp-radius) 0}
.gp-quote-text{font-style:italic;font-size:1.1em;color:var(--gp-text);margin-block-end:.5rem}
.gp-quote footer{color:var(--gp-muted);font-size:.875rem}

/* Alert */
.gp-alert{display:flex;gap:.75rem;padding:1rem;border-radius:var(--gp-radius);border:1px solid}
.gp-alert-info{background:color-mix(in srgb,var(--gp-accent) 10%,transparent);border-color:color-mix(in srgb,var(--gp-accent) 40%,transparent)}
.gp-alert-warning{background:color-mix(in srgb,var(--gp-warning) 10%,transparent);border-color:color-mix(in srgb,var(--gp-warning) 40%,transparent)}
.gp-alert-danger{background:color-mix(in srgb,var(--gp-danger) 10%,transparent);border-color:color-mix(in srgb,var(--gp-danger) 40%,transparent)}
.gp-alert-success{background:color-mix(in srgb,var(--gp-success) 10%,transparent);border-color:color-mix(in srgb,var(--gp-success) 40%,transparent)}
.gp-alert-tip{background:color-mix(in srgb,var(--gp-primary) 10%,transparent);border-color:color-mix(in srgb,var(--gp-primary) 40%,transparent)}

/* Divider */
.gp-divider{border:none;border-block-start:1px solid var(--gp-border);margin:1rem 0;position:relative;display:flex;align-items:center;justify-content:center}
.gp-divider span{background:var(--gp-bg);padding:0 .75rem;color:var(--gp-muted);font-size:.875rem}
.gp-divider-dashed{border-block-start-style:dashed}
.gp-divider-dotted{border-block-start-style:dotted}

/* Steps */
.gp-steps{list-style:none;counter-reset:none;display:flex;flex-direction:column;gap:1rem}
.gp-step{display:flex;gap:1rem;align-items:flex-start}
.gp-step-num{min-width:2rem;height:2rem;border-radius:50%;background:var(--gp-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:700;shrink:0}
.gp-step strong{display:block;margin-block-end:.25rem}

/* Checklist */
.gp-checklist{list-style:none;display:flex;flex-direction:column;gap:.5rem}
.gp-checklist-item{display:flex;align-items:center;gap:.75rem;color:var(--gp-text)}
.gp-checklist-item.checked{color:var(--gp-muted);text-decoration:line-through}
.gp-checklist-item input{width:1rem;height:1rem;accent-color:var(--gp-primary)}

/* FAQ */
.gp-faq{display:flex;flex-direction:column;gap:1rem}
.gp-faq-q{font-weight:700;color:var(--gp-primary);margin-block-end:.25rem}
.gp-faq-a{color:var(--gp-text);padding-inline-start:1rem;border-inline-start:3px solid var(--gp-border)}

/* Accordion */
.gp-accordion{display:flex;flex-direction:column;gap:.5rem}
.gp-accordion-btn{width:100%;display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;background:var(--gp-surface);border:1px solid var(--gp-border);border-radius:var(--gp-radius);cursor:pointer;font-size:1rem;font-weight:600;color:var(--gp-text);text-align:start}
.gp-accordion-btn:hover{background:color-mix(in srgb,var(--gp-primary) 8%,var(--gp-surface))}
.gp-accordion-body{padding:.75rem 1rem;background:var(--gp-surface);border:1px solid var(--gp-border);border-block-start:none;border-radius:0 0 var(--gp-radius) var(--gp-radius)}
.gp-accordion-arrow{transition:transform .2s}
.gp-accordion-item.open .gp-accordion-arrow{transform:rotate(180deg)}

/* Image */
.gp-image{margin:0}
.gp-image img{max-width:100%;border-radius:var(--gp-radius);display:block}
.gp-image figcaption{text-align:center;color:var(--gp-muted);font-size:.875rem;margin-block-start:.5rem}
.gp-image-small img{max-width:320px}
.gp-image-medium img{max-width:560px}
.gp-image-large img{max-width:760px}

/* Video */
.gp-video-wrap{position:relative;padding-block-end:56.25%;height:0}
.gp-video-wrap iframe{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:var(--gp-radius)}

/* Gallery */
.gp-gallery{display:grid;gap:.75rem}
.gp-gallery-cols-2{grid-template-columns:repeat(2,1fr)}
.gp-gallery-cols-3{grid-template-columns:repeat(3,1fr)}
.gp-gallery-cols-4{grid-template-columns:repeat(4,1fr)}
.gp-gallery-item img{width:100%;border-radius:var(--gp-radius);aspect-ratio:4/3;object-fit:cover}

/* Logo */
.gp-logo{display:flex;justify-content:center;padding:1rem 0}
.gp-logo img{display:block}

/* Table */
.gp-table-wrap{overflow-x:auto}
.gp-table{width:100%;border-collapse:collapse;font-size:.9rem}
.gp-table th{background:var(--gp-surface);color:var(--gp-primary);font-weight:700;padding:.6rem .75rem;border:1px solid var(--gp-border);text-align:start}
.gp-table td{padding:.55rem .75rem;border:1px solid var(--gp-border);color:var(--gp-text)}
.gp-table.striped tbody tr:nth-child(odd) td{background:color-mix(in srgb,var(--gp-surface) 60%,transparent)}

/* Compare */
.gp-compare{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.gp-compare-col{background:var(--gp-surface);border:1px solid var(--gp-border);border-radius:var(--gp-radius);padding:1rem}
.gp-compare-col h4{margin-block-end:.75rem;font-size:1rem;font-weight:700}
.gp-compare-col ul{list-style:none;display:flex;flex-direction:column;gap:.4rem}
.gp-compare-col li::before{content:'• ';color:var(--gp-primary)}

/* Stats */
.gp-stats{display:grid;gap:1rem}
.gp-stats-cols-2{grid-template-columns:repeat(2,1fr)}
.gp-stats-cols-3{grid-template-columns:repeat(3,1fr)}
.gp-stats-cols-4{grid-template-columns:repeat(4,1fr)}
.gp-stat-card{background:var(--gp-surface);border:1px solid var(--gp-border);border-radius:var(--gp-radius);padding:1.5rem;text-align:center}
.gp-stat-value{font-size:2rem;font-weight:700;color:var(--gp-primary);font-family:var(--gp-font-head)}
.gp-stat-label{color:var(--gp-muted);font-size:.875rem;margin-block-start:.25rem}

/* Cards */
.gp-cards{display:grid;gap:1rem}
.gp-cards-cols-2{grid-template-columns:repeat(2,1fr)}
.gp-cards-cols-3{grid-template-columns:repeat(3,1fr)}
.gp-cards-cols-4{grid-template-columns:repeat(4,1fr)}
.gp-card{background:var(--gp-surface);border:1px solid var(--gp-border);border-radius:var(--gp-radius);padding:1.25rem;box-shadow:var(--gp-shadow)}
.gp-card-icon{font-size:1.75rem;display:block;margin-block-end:.5rem}
.gp-card h4{margin-block-end:.5rem;font-size:1rem;color:var(--gp-text)}
.gp-card p{color:var(--gp-muted);font-size:.875rem}

/* Image + Text */
.gp-image-text{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:center}
.gp-image-text img{width:100%;border-radius:var(--gp-radius)}
.gp-image-text-content h3{margin-block-end:.5rem;color:var(--gp-text)}
.gp-image-text-content p{color:var(--gp-muted)}

/* Flow */
.gp-flow{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
.gp-flow-vertical{flex-direction:column;align-items:flex-start}
.gp-flow-step{background:var(--gp-surface);border:1px solid var(--gp-border);border-radius:var(--gp-radius);padding:.5rem 1rem;font-size:.875rem;font-weight:600;color:var(--gp-text)}
.gp-flow-arrow{color:var(--gp-muted);font-size:1.2rem;line-height:1}

/* Timeline */
.gp-timeline{display:flex;flex-direction:column;gap:1rem;border-inline-start:2px solid var(--gp-border);padding-inline-start:1.5rem}
.gp-timeline-item{position:relative}
.gp-timeline-item::before{content:'';position:absolute;inset-inline-start:-1.85rem;top:.4rem;width:.8rem;height:.8rem;background:var(--gp-primary);border-radius:50%}
.gp-timeline-date{font-size:.75rem;color:var(--gp-muted);font-weight:600;margin-block-end:.15rem}
.gp-timeline-content strong{color:var(--gp-text)}
.gp-timeline-content p{color:var(--gp-muted);font-size:.875rem}

/* Rating */
.gp-rating{display:flex;align-items:center;gap:.75rem}
.gp-stars{font-size:1.5rem;color:var(--gp-warning);line-height:1}
.gp-rating-val{color:var(--gp-muted);font-size:.875rem}

/* Button */
.gp-btn{display:inline-block;border-radius:var(--gp-radius);font-weight:600;cursor:pointer;text-decoration:none;transition:opacity .15s}
.gp-btn:hover{opacity:.85;text-decoration:none}
.gp-btn-primary{background:var(--gp-primary);color:#fff;border:none}
.gp-btn-secondary{background:var(--gp-secondary);color:#fff;border:none}
.gp-btn-outline{background:transparent;color:var(--gp-primary);border:2px solid var(--gp-primary)}
.gp-btn-ghost{background:transparent;color:var(--gp-primary);border:none}
.gp-btn-sm{padding:.35rem .75rem;font-size:.75rem}
.gp-btn-md{padding:.55rem 1.25rem;font-size:.875rem}
.gp-btn-lg{padding:.75rem 1.75rem;font-size:1rem}

/* Code */
.gp-code-block{border-radius:var(--gp-radius);overflow:hidden;border:1px solid var(--gp-border)}
.gp-code-filename{background:var(--gp-surface);padding:.35rem .75rem;font-size:.75rem;color:var(--gp-muted);border-block-end:1px solid var(--gp-border);font-family:var(--gp-font-code)}
.gp-code{background:#0d1117;padding:1rem;overflow-x:auto;margin:0}
.gp-code code{font-family:var(--gp-font-code);font-size:.875rem;color:#e6edf3;line-height:1.6}

/* Embed */
.gp-embed{border-radius:var(--gp-radius);overflow:hidden;border:1px solid var(--gp-border)}

/* Lightbox */
#gp-lightbox{display:none;position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:9999;align-items:center;justify-content:center;cursor:pointer}
#gp-lightbox.open{display:flex}
#gp-lightbox img{max-width:90vw;max-height:90vh;border-radius:var(--gp-radius)}

/* Responsive */
@media(max-width:768px){
  .gp-shell{flex-direction:column}
  .gp-sidebar{width:100%;height:auto;position:relative;overflow:hidden}
  .gp-nav{display:flex;flex-wrap:wrap;padding:.25rem}
  .gp-nav a{border-inline-start:none;border-block-end:2px solid transparent;padding:.4rem .75rem}
  .gp-main{padding:1.5rem}
  .gp-gallery-cols-3,.gp-gallery-cols-4{grid-template-columns:repeat(2,1fr)}
  .gp-cards-cols-3,.gp-cards-cols-4{grid-template-columns:repeat(2,1fr)}
  .gp-stats-cols-3,.gp-stats-cols-4{grid-template-columns:repeat(2,1fr)}
  .gp-compare{grid-template-columns:1fr}
  .gp-image-text{grid-template-columns:1fr}
  .gp-flow{flex-direction:column;align-items:flex-start}
}
@media(max-width:480px){
  .gp-gallery-cols-2,.gp-gallery-cols-3,.gp-gallery-cols-4{grid-template-columns:1fr}
  .gp-cards-cols-2,.gp-cards-cols-3,.gp-cards-cols-4{grid-template-columns:1fr}
  .gp-stats-cols-2,.gp-stats-cols-3,.gp-stats-cols-4{grid-template-columns:1fr}
}`;

// ── JS (accordion + lightbox + lang switcher) ─────────────────────────────────

const INLINE_JS = `
function gpToggleAccordion(btn){
  var item=btn.parentElement;
  var body=btn.nextElementSibling;
  if(body.style.display==='none'){body.style.display='';item.classList.add('open');}
  else{body.style.display='none';item.classList.remove('open');}
}
function gpLightbox(src){
  var lb=document.getElementById('gp-lightbox');
  var img=lb.querySelector('img');
  img.src=src;
  lb.classList.add('open');
}
document.addEventListener('DOMContentLoaded',function(){
  var lb=document.getElementById('gp-lightbox');
  if(lb){lb.addEventListener('click',function(){lb.classList.remove('open');});}
  // Lang switcher
  var sel=document.getElementById('gp-lang-sel');
  if(sel){sel.addEventListener('change',function(){
    var lang=this.value;
    document.querySelectorAll('[data-lang]').forEach(function(el){
      el.style.display=el.dataset.lang===lang?'':'none';
    });
    // Update nav links
    document.querySelectorAll('.gp-nav a').forEach(function(a){
      a.textContent=a.dataset.titles?JSON.parse(a.dataset.titles)[lang]||a.textContent:a.textContent;
    });
  });}
  // Active nav on scroll
  var sections=document.querySelectorAll('.gp-section');
  var links=document.querySelectorAll('.gp-nav a');
  window.addEventListener('scroll',function(){
    var scrollY=window.scrollY+120;
    sections.forEach(function(sec){
      if(sec.offsetTop<=scrollY&&sec.offsetTop+sec.offsetHeight>scrollY){
        links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+sec.id);});
      }
    });
  },{passive:true});
});`;

// ── Main export function ──────────────────────────────────────────────────────

export function exportGuideAsHTML(guide: Guide, theme: Theme, lang?: string): string {
  const activeLang = lang ?? guide.defaultLang;
  const isRtl = guide.availableLangs.find(l => l.code === activeLang)?.dir === 'rtl';
  const hasMultipleLangs = guide.availableLangs.length > 1;
  const activeSections = guide.sections.filter(s => s.isActive);

  const langBar = hasMultipleLangs ? `
    <div class="gp-lang-bar">
      <select id="gp-lang-sel">
        ${guide.availableLangs.map(l => `<option value="${l.code}"${l.code === activeLang ? ' selected' : ''}>${l.flag} ${l.name}</option>`).join('')}
      </select>
    </div>` : '';

  const navLinks = activeSections.map(s => {
    const tr = s.translations[activeLang];
    const title = tr?.title ?? s.title;
    const titlesByLang = Object.fromEntries(
      guide.availableLangs.map(l => [l.code, (s.translations[l.code]?.title ?? s.title)])
    );
    return `<a href="#section-${s.id}" data-titles='${JSON.stringify(titlesByLang)}'>${escHtml(title)}</a>`;
  }).join('\n');

  const sectionsHtml = activeSections.map(s => sectionToHtml(s, activeLang)).join('\n');

  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.fonts.heading)}:wght@400;600;700&family=${encodeURIComponent(theme.fonts.body)}:wght@400;600&display=swap`;

  return `<!DOCTYPE html>
<html lang="${activeLang}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(guide.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${googleFontUrl}" rel="stylesheet">
<style>
${themeToCSS(theme)}
${CORE_CSS}
${theme.customCSS ?? ''}
</style>
</head>
<body>
<div class="gp-shell">
  <aside class="gp-sidebar">
    <div class="gp-sidebar-header">
      ${guide.subtitle ? `<p class="gp-guide-label">${escHtml(guide.subtitle)}</p>` : ''}
      <p class="gp-guide-title">${escHtml(guide.title)}</p>
    </div>
    <nav class="gp-nav">${navLinks}</nav>
    ${langBar}
  </aside>
  <main class="gp-main">${sectionsHtml}</main>
</div>
<div id="gp-lightbox"><img src="" alt=""></div>
<script>${INLINE_JS}</script>
</body>
</html>`;
}

// ── Download helper ───────────────────────────────────────────────────────────

export function downloadHTML(guide: Guide, theme: Theme) {
  const html = exportGuideAsHTML(guide, theme);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${guide.title.replace(/\s+/g, '-').toLowerCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
