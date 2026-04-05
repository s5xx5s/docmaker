import type { QuoteBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function QuoteBlock({ block, onUpdate, isEditing }: Props) {
  if (!isEditing) {
    return (
      <blockquote className="border-s-4 border-blue-500 ps-4 py-1 space-y-1">
        <span className="text-4xl text-blue-400 leading-none">"</span>
        <p className="text-sm italic leading-relaxed" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{block.content}</p>
        {(block.author || block.source) && (
          <footer className="flex gap-2 text-xs mt-1">
            {block.author && <cite className="text-blue-300 not-italic">— {block.author}</cite>}
            {block.source && <span style={{ color: 'var(--gp-text-muted, #64748b)' }}>{block.source}</span>}
          </footer>
        )}
      </blockquote>
    );
  }

  return (
    <div className="border-s-4 border-blue-500 ps-4 py-1 space-y-2">
      <span className="text-4xl text-blue-400 leading-none">"</span>
      <textarea value={block.content} onChange={e => onUpdate({ content: e.target.value })} rows={3} className="w-full bg-transparent text-gray-200 text-sm italic leading-relaxed resize-none focus:outline-none" />
      <div className="flex gap-2">
        <input value={block.author ?? ''} onChange={e => onUpdate({ author: e.target.value })} placeholder="— Author" className="flex-1 bg-transparent text-xs text-blue-300 focus:outline-none border-b border-gray-700 pb-0.5" />
        <input value={block.source ?? ''} onChange={e => onUpdate({ source: e.target.value })} placeholder="Source" className="flex-1 bg-transparent text-xs text-gray-500 focus:outline-none border-b border-gray-700 pb-0.5" />
      </div>
    </div>
  );
}
