import type { DividerBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function DividerBlock({ block, onUpdate, isEditing }: Props) {
  const borderStyle = block.style === 'dashed' ? 'border-dashed' : block.style === 'dotted' ? 'border-dotted' : '';

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3">
        {block.label ? (
          <>
            <div className={`flex-1 border-t border-gray-600 ${borderStyle}`} />
            <span className="text-xs" style={{ color: 'var(--gp-text-muted, #94a3b8)' }}>{block.label}</span>
            <div className={`flex-1 border-t border-gray-600 ${borderStyle}`} />
          </>
        ) : (
          <div className={`flex-1 border-t border-gray-600 ${borderStyle}`} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {block.label ? (
          <>
            <div className="flex-1 border-t border-gray-600" />
            <input value={block.label} onChange={e => onUpdate({ label: e.target.value })} className="bg-transparent text-xs text-gray-400 text-center focus:outline-none" />
            <div className="flex-1 border-t border-gray-600" />
          </>
        ) : (
          <div className={`flex-1 border-t border-gray-600 ${borderStyle}`} />
        )}
      </div>
      <div className="flex gap-2">
        {(['solid','dashed','dotted'] as const).map(s => (
          <button key={s} onClick={() => onUpdate({ style: s })} className={`text-xs px-2 py-0.5 rounded ${block.style === s ? 'bg-blue-700 text-white' : 'text-gray-500'}`}>{s}</button>
        ))}
        <input value={block.label ?? ''} onChange={e => onUpdate({ label: e.target.value })} placeholder="Label (optional)" className="ml-auto bg-gray-800 text-xs text-gray-300 rounded px-2 py-0.5 focus:outline-none border border-gray-700 w-32" />
      </div>
    </div>
  );
}
