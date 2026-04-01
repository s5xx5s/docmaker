// ── Markdown Exporter ─────────────────────────────────────────────────────────
// GitHub-flavored Markdown with automatic TOC and Base64 image URIs

import type { Guide, Section, Block } from '../types';

function escMd(s: string): string {
  return s.replace(/[*_`~[\]]/g, '\\$&');
}

function blockToMd(block: Block): string {
  switch (block.type) {
    case 'text':
      return block.content + '\n';

    case 'highlight':
      return `> **${escMd(block.title)}**\n>\n> ${block.content}\n`;

    case 'quote':
      return `> *"${escMd(block.content)}"*\n>\n> — ${escMd(block.author)}${block.source ? ` ([source](${block.source}))` : ''}\n`;

    case 'alert':
      return `> [!${block.variant.toUpperCase()}]\n> **${escMd(block.title)}**${block.content ? `\n>\n> ${block.content}` : ''}\n`;

    case 'divider':
      return block.label ? `\n---\n*${escMd(block.label)}*\n---\n` : '\n---\n';

    case 'steps':
      return block.steps.map((s, i) => `${i + 1}. **${escMd(s.title)}**${s.description ? `\n   ${s.description}` : ''}`).join('\n') + '\n';

    case 'checklist':
      return block.items.map(i => `- [${i.checked ? 'x' : ' '}] ${escMd(i.label)}`).join('\n') + '\n';

    case 'faq':
      return block.items.map(i => `**Q:** ${escMd(i.question)}\n\n**A:** ${i.answer}`).join('\n\n') + '\n';

    case 'accordion':
      return block.items.map(i => `<details${i.defaultOpen ? ' open' : ''}>\n<summary>${escMd(i.title)}</summary>\n\n${i.content}\n\n</details>`).join('\n\n') + '\n';

    case 'image':
      return block.src ? `![${escMd(block.alt ?? '')}](${block.src})${block.caption ? `\n*${escMd(block.caption)}*` : ''}\n` : '';

    case 'video':
      return block.src ? `🎬 [Watch video](${block.src})${block.caption ? ` — *${escMd(block.caption)}*` : ''}\n` : '';

    case 'gallery':
      return block.images.filter(i => i.src).map(i => `![${escMd(i.alt ?? '')}](${i.src})${i.caption ? ` *${escMd(i.caption)}*` : ''}`).join('\n') + '\n';

    case 'logo':
      return block.src ? (block.link ? `[![${escMd(block.alt ?? 'Logo')}](${block.src})](${block.link})\n` : `![${escMd(block.alt ?? 'Logo')}](${block.src})\n`) : '';

    case 'table': {
      const header = `| ${block.headers.join(' | ')} |`;
      const sep = `| ${block.headers.map(() => '---').join(' | ')} |`;
      const rows = block.rows.map(r => `| ${r.join(' | ')} |`).join('\n');
      return `${header}\n${sep}\n${rows}\n`;
    }

    case 'compare':
      return `| ${escMd(block.leftTitle)} | ${escMd(block.rightTitle)} |\n| --- | --- |\n` +
        Array.from({ length: Math.max(block.leftItems.length, block.rightItems.length) }, (_, i) =>
          `| ${escMd(block.leftItems[i] ?? '')} | ${escMd(block.rightItems[i] ?? '')} |`
        ).join('\n') + '\n';

    case 'stats':
      return block.items.map(s => `**${s.value}** — ${escMd(s.label)}`).join(' | ') + '\n';

    case 'cards':
      return block.cards.map(c => `### ${c.icon ?? ''} ${escMd(c.title)}\n${c.description}`).join('\n\n') + '\n';

    case 'image-text':
      return `${block.src ? `![${escMd(block.alt ?? '')}](${block.src})\n\n` : ''}### ${escMd(block.title)}\n${block.content}\n`;

    case 'flow':
      return block.steps.map(s => escMd(s.label)).join(block.direction === 'vertical' ? '\n↓\n' : ' → ') + '\n';

    case 'timeline':
      return block.items.map(i => `- **${escMd(i.date)}** — **${escMd(i.title)}**${i.description ? `\n  ${i.description}` : ''}`).join('\n') + '\n';

    case 'rating': {
      const stars = '★'.repeat(Math.floor(block.value ?? 0)) + '☆'.repeat((block.maxValue ?? 5) - Math.floor(block.value ?? 0));
      return `${block.label ? `**${escMd(block.label)}**: ` : ''}${stars}\n`;
    }

    case 'button':
      return `[${escMd(block.label)}](${block.href ?? '#'})\n`;

    case 'embed':
      return block.src ? `[${escMd(block.title ?? 'Embedded content')}](${block.src})\n` : '';

    case 'code':
      return `\`\`\`${block.language ?? ''}\n${block.code ?? ''}\n\`\`\`\n`;

    default:
      return '';
  }
}

function sectionToMd(section: Section, lang: string, level: number): string {
  const tr = section.translations[lang];
  const title = tr?.title ?? section.title;
  const blocks = tr?.blocks ?? section.blocks;
  const heading = '#'.repeat(level);
  return `${heading} ${section.icon ? section.icon + ' ' : ''}${title}\n\n${blocks.map(blockToMd).join('\n')}\n`;
}

export function exportGuideAsMarkdown(guide: Guide, lang?: string): string {
  const activeLang = lang ?? guide.defaultLang;
  const activeSections = guide.sections.filter(s => s.isActive);

  // Table of contents
  const toc = activeSections.map(s => {
    const tr = s.translations[activeLang];
    const title = tr?.title ?? s.title;
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `- [${title}](#${slug})`;
  }).join('\n');

  const body = activeSections.map(s => sectionToMd(s, activeLang, 2)).join('\n---\n\n');

  return `# ${guide.title}${guide.subtitle ? '\n\n' + guide.subtitle : ''}

## Table of Contents
${toc}

---

${body}`;
}

export function downloadMarkdown(guide: Guide) {
  const md = exportGuideAsMarkdown(guide);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${guide.title.replace(/\s+/g, '-').toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
