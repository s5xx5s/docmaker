import { X } from 'lucide-react';
import type { BlockType } from '../../types';

interface BlockDef {
  type: BlockType;
  label: string;
  icon: string;
  desc: string;
}

const CATEGORIES: { name: string; blocks: BlockDef[] }[] = [
  {
    name: 'Content',
    blocks: [
      { type: 'text', label: 'Text', icon: '¶', desc: 'Rich text paragraph' },
      { type: 'highlight', label: 'Highlight', icon: '💡', desc: 'Colored callout box' },
      { type: 'quote', label: 'Quote', icon: '"', desc: 'Blockquote with author' },
      { type: 'alert', label: 'Alert', icon: '⚠️', desc: 'Info, warning, danger, tip' },
      { type: 'divider', label: 'Divider', icon: '—', desc: 'Section separator' },
    ],
  },
  {
    name: 'Lists',
    blocks: [
      { type: 'steps', label: 'Steps', icon: '①', desc: 'Numbered steps' },
      { type: 'checklist', label: 'Checklist', icon: '✓', desc: 'Interactive checkboxes' },
      { type: 'faq', label: 'FAQ', icon: '?', desc: 'Questions & answers' },
      { type: 'accordion', label: 'Accordion', icon: '▸', desc: 'Collapsible sections' },
    ],
  },
  {
    name: 'Media',
    blocks: [
      { type: 'image', label: 'Image', icon: '🖼', desc: 'Base64 or URL' },
      { type: 'video', label: 'Video', icon: '▶', desc: 'Upload or YouTube/Vimeo' },
      { type: 'gallery', label: 'Gallery', icon: '⊞', desc: 'Image grid with lightbox' },
      { type: 'logo', label: 'Logo', icon: '◈', desc: 'Brand logo' },
    ],
  },
  {
    name: 'Data',
    blocks: [
      { type: 'table', label: 'Table', icon: '⊟', desc: 'Data table' },
      { type: 'compare', label: 'Compare', icon: '⇔', desc: 'Side-by-side comparison' },
      { type: 'stats', label: 'Stats', icon: '#', desc: 'Key metrics & numbers' },
      { type: 'rating', label: 'Rating', icon: '★', desc: 'Star rating display' },
    ],
  },
  {
    name: 'Layout',
    blocks: [
      { type: 'cards', label: 'Cards', icon: '⊡', desc: 'Info cards grid' },
      { type: 'image-text', label: 'Image + Text', icon: '⊞', desc: 'Side-by-side layout' },
      { type: 'flow', label: 'Flow', icon: '→', desc: 'Process flow diagram' },
      { type: 'timeline', label: 'Timeline', icon: '⋯', desc: 'Chronological events' },
    ],
  },
  {
    name: 'Interactive',
    blocks: [
      { type: 'button', label: 'Button', icon: '⊕', desc: 'Call-to-action button' },
      { type: 'embed', label: 'Embed', icon: '</>', desc: 'iframe embed' },
      { type: 'code', label: 'Code', icon: '{ }', desc: 'Syntax highlighted code' },
    ],
  },
];

interface Props {
  onSelect(type: BlockType): void;
  onClose(): void;
}

export function BlockPicker({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
          <h2 className="font-semibold text-white">Add Block</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-4 space-y-5">
          {CATEGORIES.map(cat => (
            <div key={cat.name}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">{cat.name}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cat.blocks.map(b => (
                  <button
                    key={b.type}
                    onClick={() => { onSelect(b.type); onClose(); }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-colors text-left"
                  >
                    <span className="text-lg leading-none mt-0.5 w-6 text-center shrink-0">{b.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{b.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
