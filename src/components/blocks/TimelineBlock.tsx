import { Plus, Trash2 } from 'lucide-react';
import type { TimelineBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function TimelineBlock({ block, onUpdate, isEditing }: Props) {
  const update = (i: number, patch: Partial<T['items'][0]>) => onUpdate({ items: block.items.map((x, idx) => idx === i ? { ...x, ...patch } : x) });
  const add = () => onUpdate({ items: [...block.items, { title: 'New Event', description: '' }] });
  const remove = (i: number) => onUpdate({ items: block.items.filter((_, idx) => idx !== i) });

  if (!isEditing) {
    return (
      <div className="space-y-2">
        {block.items.map((item, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
            <div className="flex-1">
              {item.date && <p className="text-xs text-blue-400 mb-0.5">{item.date}</p>}
              <p className="text-sm font-medium" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{item.title}</p>
              {item.description && <p className="text-xs mt-0.5" style={{ color: 'var(--gp-text-muted, #94a3b8)' }}>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        {(['vertical','horizontal'] as const).map(d => (
          <button key={d} onClick={() => onUpdate({ direction: d })} className={`text-xs px-2 py-0.5 rounded ${block.direction === d ? 'bg-blue-700 text-white' : 'text-gray-500'}`}>{d}</button>
        ))}
      </div>
      {block.items.map((item, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <input value={item.date ?? ''} onChange={e => update(i, { date: e.target.value })} placeholder="Date" className="bg-transparent text-xs text-blue-400 focus:outline-none w-24" />
            <input value={item.title} onChange={e => update(i, { title: e.target.value })} className="w-full bg-transparent text-sm font-medium text-white focus:outline-none border-b border-gray-700 pb-0.5" />
            <input value={item.description ?? ''} onChange={e => update(i, { description: e.target.value })} placeholder="Description" className="w-full bg-transparent text-xs text-gray-400 focus:outline-none" />
          </div>
          <button onClick={() => remove(i)} className="text-gray-600 hover:text-red-400 mt-1"><Trash2 size={13} /></button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Plus size={12} /> Add Event</button>
    </div>
  );
}
