import type { RatingBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function RatingBlock({ block, onUpdate, isEditing }: Props) {
  const max = block.maxValue ?? 5;

  if (!isEditing) {
    return (
      <div className="space-y-1">
        {block.label && <p className="text-xs" style={{ color: 'var(--gp-text-muted, #94a3b8)' }}>{block.label}</p>}
        <div className="flex items-center gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <span key={i} className="text-2xl leading-none" style={{ color: i < block.value ? '#facc15' : '#4b5563' }}>
              {i < block.value ? '★' : '☆'}
            </span>
          ))}
          {block.showValue && <span className="text-sm ml-2" style={{ color: 'var(--gp-text-muted, #94a3b8)' }}>{block.value}/{max}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <button key={i} onClick={() => onUpdate({ value: i + 1 })} className="text-2xl leading-none hover:scale-110 transition-transform">
            {i < block.value ? '★' : '☆'}
          </button>
        ))}
        {block.showValue && <span className="text-sm text-gray-300 ml-2">{block.value}/{max}</span>}
      </div>
      <div className="flex gap-2">
        <input value={block.label ?? ''} onChange={e => onUpdate({ label: e.target.value })} placeholder="Rating label" className="flex-1 bg-gray-800 text-xs text-gray-300 rounded px-2 py-1 border border-gray-700 focus:outline-none" />
        <label className="flex items-center gap-1 text-xs text-gray-400">Max:
          <input type="number" value={max} min={1} max={10} onChange={e => onUpdate({ maxValue: Number(e.target.value) })} className="bg-gray-800 w-10 rounded px-1 py-0.5 text-white border border-gray-700 focus:outline-none" />
        </label>
        <label className="flex items-center gap-1 text-xs text-gray-400"><input type="checkbox" checked={block.showValue} onChange={e => onUpdate({ showValue: e.target.checked })} />Show</label>
      </div>
    </div>
  );
}
