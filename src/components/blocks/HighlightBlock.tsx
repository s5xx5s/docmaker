import type { HighlightBlock as T } from '../../types';

const COLORS = { info: 'border-blue-500 bg-blue-950/30', warning: 'border-yellow-500 bg-yellow-950/30', success: 'border-green-500 bg-green-950/30', danger: 'border-red-500 bg-red-950/30' };
const ICONS = { info: 'ℹ️', warning: '⚠️', success: '✅', danger: '🚨' };

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function HighlightBlock({ block, onUpdate, isEditing }: Props) {
  if (!isEditing) {
    return (
      <div className={`border-l-4 rounded-r-lg p-3 ${COLORS[block.variant]}`}>
        <div className="flex items-center gap-2 mb-1">
          <span>{ICONS[block.variant]}</span>
          {block.title && <span className="text-sm font-semibold" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{block.title}</span>}
        </div>
        <p className="text-sm" style={{ color: 'var(--gp-text-muted, #cbd5e1)' }}>{block.content}</p>
      </div>
    );
  }
  return (
    <div className={`border-l-4 rounded-r-lg p-3 ${COLORS[block.variant]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{ICONS[block.variant]}</span>
        <input value={block.title ?? ''} onChange={e => onUpdate({ title: e.target.value })} placeholder="Title" className="bg-transparent text-sm font-semibold text-white focus:outline-none flex-1" />
        <select value={block.variant} onChange={e => onUpdate({ variant: e.target.value as T['variant'] })} className="bg-gray-800 text-xs text-gray-300 rounded px-1 py-0.5 focus:outline-none border border-gray-700">
          {['info','warning','success','danger'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <textarea value={block.content} onChange={e => onUpdate({ content: e.target.value })} rows={2} placeholder="Content..." className="w-full bg-transparent text-sm text-gray-300 resize-none focus:outline-none placeholder-gray-600" />
    </div>
  );
}
