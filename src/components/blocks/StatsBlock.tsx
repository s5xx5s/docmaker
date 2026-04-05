import { Plus, Trash2 } from 'lucide-react';
import type { StatsBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function StatsBlock({ block, onUpdate, isEditing }: Props) {
  const update = (i: number, patch: Partial<T['items'][0]>) => onUpdate({ items: block.items.map((x, idx) => idx === i ? { ...x, ...patch } : x) });
  const add = () => onUpdate({ items: [...block.items, { value: '0', label: 'Metric' }] });
  const remove = (i: number) => onUpdate({ items: block.items.filter((_, idx) => idx !== i) });

  if (!isEditing) {
    const cols = block.columns ?? 3;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '12px' }}>
        {block.items.map((item, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-3 text-center">
            <div className="flex items-baseline justify-center gap-0.5">
              {item.prefix && <span className="text-blue-400 text-sm font-bold">{item.prefix}</span>}
              <span className="text-2xl font-bold" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{item.value}</span>
              {item.suffix && <span className="text-blue-400 text-sm font-bold">{item.suffix}</span>}
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--gp-text-muted, #94a3b8)' }}>{item.label}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${block.columns ?? 3}, 1fr)`, gap: '12px', marginBottom: '12px' }}>
        {block.items.map((item, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-3 text-center relative group/stat">
            <button onClick={() => remove(i)} className="absolute top-1 right-1 text-gray-600 hover:text-red-400 opacity-0 group-hover/stat:opacity-100"><Trash2 size={11} /></button>
            <div className="flex items-baseline justify-center gap-0.5">
              <input value={item.prefix ?? ''} onChange={e => update(i, { prefix: e.target.value })} placeholder="$" className="bg-transparent text-blue-400 text-sm font-bold w-5 text-center focus:outline-none" />
              <input value={item.value} onChange={e => update(i, { value: e.target.value })} className="bg-transparent text-2xl font-bold text-white focus:outline-none text-center w-16" />
              <input value={item.suffix ?? ''} onChange={e => update(i, { suffix: e.target.value })} placeholder="+" className="bg-transparent text-blue-400 text-sm font-bold w-5 text-center focus:outline-none" />
            </div>
            <input value={item.label} onChange={e => update(i, { label: e.target.value })} className="bg-transparent text-xs text-gray-400 text-center w-full focus:outline-none mt-1" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Plus size={12} /> Add Stat</button>
        <span className="text-xs text-gray-500">Columns:</span>
        {([2,3,4] as const).map(c => (
          <button key={c} onClick={() => onUpdate({ columns: c })} className={`text-xs px-2 py-0.5 rounded ${block.columns === c ? 'bg-blue-700 text-white' : 'text-gray-500'}`}>{c}</button>
        ))}
      </div>
    </div>
  );
}
