import type { AlertBlock as T } from '../../types';

const STYLES = {
  info:    { border: 'border-blue-500',   bg: 'bg-blue-950/30',   icon: 'ℹ️' },
  warning: { border: 'border-yellow-500', bg: 'bg-yellow-950/30', icon: '⚠️' },
  danger:  { border: 'border-red-500',    bg: 'bg-red-950/30',    icon: '🚨' },
  success: { border: 'border-green-500',  bg: 'bg-green-950/30',  icon: '✅' },
  tip:     { border: 'border-purple-500', bg: 'bg-purple-950/30', icon: '💡' },
};

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function AlertBlock({ block, onUpdate, isEditing }: Props) {
  const s = STYLES[block.variant];

  if (!isEditing) {
    return (
      <div className={`border-l-4 ${s.border} ${s.bg} rounded-r-lg p-3`}>
        <div className="flex items-center gap-2 mb-1">
          <span>{s.icon}</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{block.title}</span>
        </div>
        {block.content && <p className="text-sm" style={{ color: 'var(--gp-text-muted, #cbd5e1)' }}>{block.content}</p>}
      </div>
    );
  }

  return (
    <div className={`border-l-4 ${s.border} ${s.bg} rounded-r-lg p-3 space-y-2`}>
      <div className="flex items-center gap-2">
        <span>{s.icon}</span>
        <input value={block.title} onChange={e => onUpdate({ title: e.target.value })} className="flex-1 bg-transparent text-sm font-semibold text-white focus:outline-none" />
        <select value={block.variant} onChange={e => onUpdate({ variant: e.target.value as T['variant'] })} className="bg-gray-800 text-xs text-gray-300 rounded px-1 py-0.5 border border-gray-700 focus:outline-none">
          {Object.keys(STYLES).map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <textarea value={block.content ?? ''} onChange={e => onUpdate({ content: e.target.value })} rows={2} placeholder="Content (optional)" className="w-full bg-transparent text-sm text-gray-300 resize-none focus:outline-none placeholder-gray-600" />
    </div>
  );
}
