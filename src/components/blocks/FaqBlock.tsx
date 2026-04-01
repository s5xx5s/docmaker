import { Plus, Trash2 } from 'lucide-react';
import type { FaqBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function FaqBlock({ block, onUpdate, isEditing }: Props) {
  const update = (i: number, patch: Partial<T['items'][0]>) => onUpdate({ items: block.items.map((x, idx) => idx === i ? { ...x, ...patch } : x) });
  const add = () => onUpdate({ items: [...block.items, { question: 'New Question?', answer: 'Answer here...' }] });
  const remove = (i: number) => onUpdate({ items: block.items.filter((_, idx) => idx !== i) });

  if (!isEditing) {
    return (
      <div className="space-y-3">
        {block.items.map((item, i) => (
          <div key={i} className="border border-gray-700 rounded-lg p-3 space-y-1.5">
            <div className="flex gap-2 items-start">
              <span className="text-blue-400 font-bold text-sm shrink-0">Q</span>
              <p className="text-sm font-medium" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{item.question}</p>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-green-400 font-bold text-sm shrink-0">A</span>
              <p className="text-sm" style={{ color: 'var(--gp-text-muted, #cbd5e1)' }}>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {block.items.map((item, i) => (
        <div key={i} className="border border-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <span className="text-blue-400 font-bold text-sm">Q</span>
            <input value={item.question} onChange={e => update(i, { question: e.target.value })} className="flex-1 bg-transparent text-sm font-medium text-white focus:outline-none" />
            <button onClick={() => remove(i)} className="text-gray-600 hover:text-red-400"><Trash2 size={13} /></button>
          </div>
          <div className="flex gap-2">
            <span className="text-green-400 font-bold text-sm">A</span>
            <textarea value={item.answer} onChange={e => update(i, { answer: e.target.value })} rows={2} className="flex-1 bg-transparent text-sm text-gray-300 resize-none focus:outline-none" />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Plus size={12} /> Add Question</button>
    </div>
  );
}
