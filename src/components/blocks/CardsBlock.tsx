import { Plus, Trash2 } from 'lucide-react';
import type { CardsBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function CardsBlock({ block, onUpdate, isEditing }: Props) {
  const update = (i: number, patch: Partial<T['cards'][0]>) => onUpdate({ cards: block.cards.map((c, idx) => idx === i ? { ...c, ...patch } : c) });
  const add = () => onUpdate({ cards: [...block.cards, { title: 'New Card', description: '', icon: '⭐' }] });
  const remove = (i: number) => onUpdate({ cards: block.cards.filter((_, idx) => idx !== i) });

  if (!isEditing) {
    const cols = block.columns ?? 3;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '12px' }}>
        {block.cards.map((card, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-3 space-y-1">
            {card.icon && <div className="text-2xl">{card.icon}</div>}
            <p className="text-sm font-medium" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{card.title}</p>
            {card.description && <p className="text-xs" style={{ color: 'var(--gp-muted, #94a3b8)' }}>{card.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">Columns:</span>
        {([2,3,4] as const).map(c => (
          <button key={c} onClick={() => onUpdate({ columns: c })} className={`text-xs px-2 py-0.5 rounded ${block.columns === c ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-2">
        {block.cards.map((card, i) => (
          <div key={i} className="flex gap-2 items-start bg-gray-800 rounded-lg p-2">
            <input value={card.icon ?? ''} onChange={e => update(i, { icon: e.target.value })} className="w-8 bg-transparent text-center text-lg focus:outline-none" />
            <div className="flex-1 space-y-1">
              <input value={card.title} onChange={e => update(i, { title: e.target.value })} className="w-full bg-transparent text-sm font-medium text-white focus:outline-none" />
              <input value={card.description ?? ''} onChange={e => update(i, { description: e.target.value })} placeholder="Description" className="w-full bg-transparent text-xs text-gray-400 focus:outline-none placeholder-gray-600" />
            </div>
            <button onClick={() => remove(i)} className="text-gray-600 hover:text-red-400"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
      <button onClick={add} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"><Plus size={12} /> Add Card</button>
    </div>
  );
}
