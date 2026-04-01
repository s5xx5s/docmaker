import type { BlockType } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDefaultBlock(type: BlockType): any {
  switch (type) {
    case 'text':        return { type, content: '', align: 'left' };
    case 'highlight':   return { type, variant: 'info', title: 'Note', content: 'Add your note here.' };
    case 'steps':       return { type, steps: [{ title: 'Step 1', description: 'Describe this step' }, { title: 'Step 2', description: '' }] };
    case 'cards':       return { type, columns: 3, cards: [{ title: 'Card 1', description: 'Description', icon: '⭐' }, { title: 'Card 2', description: 'Description', icon: '🚀' }] };
    case 'faq':         return { type, items: [{ question: 'How does it work?', answer: 'Explain here...' }] };
    case 'table':       return { type, headers: ['Column 1', 'Column 2', 'Column 3'], rows: [['Row 1', 'Data', 'Data'], ['Row 2', 'Data', 'Data']], striped: true };
    case 'flow':        return { type, steps: [{ label: 'Start' }, { label: 'Process' }, { label: 'End' }], direction: 'horizontal' };
    case 'image':       return { type, src: '', alt: '', caption: '', width: 'full' };
    case 'compare':     return { type, leftTitle: '✅ Pros', rightTitle: '❌ Cons', leftItems: ['Fast', 'Easy'], rightItems: ['Expensive'] };
    case 'image-text':  return { type, src: '', alt: '', title: 'Title', content: 'Content here...', imagePosition: 'left' };
    case 'divider':     return { type, style: 'solid', label: '' };
    case 'logo':        return { type, src: '', alt: 'Logo', width: 120 };
    case 'video':       return { type, src: '', caption: '' };
    case 'code':        return { type, code: '// Write your code here\nconsole.log("Hello, World!");', language: 'javascript', showLineNumbers: true };
    case 'quote':       return { type, content: 'Your quote here...', author: 'Author Name', source: '' };
    case 'timeline':    return { type, direction: 'vertical', items: [{ date: '2024-01', title: 'Event 1', description: 'Description' }, { date: '2024-06', title: 'Event 2', description: '' }] };
    case 'stats':       return { type, items: [{ value: '99%', label: 'Uptime' }, { value: '10K+', label: 'Users' }, { value: '4.9', label: 'Rating', suffix: '★' }], columns: 3 };
    case 'alert':       return { type, variant: 'info', title: 'Alert Title', content: 'Alert content here.' };
    case 'checklist':   return { type, items: [{ label: 'First item', checked: false }, { label: 'Second item', checked: true }], interactive: true };
    case 'gallery':     return { type, images: [], columns: 3, lightbox: true };
    case 'button':      return { type, label: 'Click Here', href: '#', variant: 'primary', size: 'md', align: 'center' };
    case 'embed':       return { type, src: '', title: 'Embedded content', height: 400 };
    case 'accordion':   return { type, items: [{ title: 'Section 1', content: 'Content here...', defaultOpen: true }, { title: 'Section 2', content: 'More content...' }] };
    case 'rating':      return { type, value: 4, maxValue: 5, label: 'Overall Rating', showValue: true };
  }
}
