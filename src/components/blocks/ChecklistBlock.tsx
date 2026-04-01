import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ChecklistBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function ChecklistBlock({ block, onUpdate, isEditing }: Props) {
  const update = (i: number, patch: Partial<T['items'][0]>) => onUpdate({ items: block.items.map((x, idx) => idx === i ? { ...x, ...patch } : x) });
  const add = () => onUpdate({ items: [...block.items, { label: 'New item', checked: false }] });
  const remove = (i: number) => onUpdate({ items: block.items.filter((_, idx) => idx !== i) });
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  if (!isEditing) {
    return (
      <div className="space-y-2">
        {block.items.map((item, i) => {
          const isChecked = block.interactive ? (checked[i] ?? item.checked) : item.checked;
          return (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={e => block.interactive ? setChecked(c => ({ ...c, [i]: e.target.checked })) : undefined}
                readOnly={!block.interactive}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className={`text-sm ${isChecked ? 'line-through' : ''}`} style={{ color: isChecked ? 'var(--gp-text-muted, #64748b)' : 'var(--gp-text, #f1f5f9)' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {block.items.map((item, i) => {
        const isChecked = block.interactive ? (checked[i] ?? item.checked) : item.checked;
        return (
          <div key={i} className="flex items-center gap-2">
            <input type="checkbox" checked={isChecked}
              onChange={e => block.interactive ? setChecked(c => ({ ...c, [i]: e.target.checked })) : update(i, { checked: e.target.checked })}
              className="w-4 h-4 rounded accent-blue-500" />
            <input value={item.label} onChange={e => update(i, { label: e.target.value })}
              className={`flex-1 bg-transparent text-sm focus:outline-none ${isChecked ? 'line-through text-gray-500' : 'text-gray-200'}`} />
            <button onClick={() => remove(i)} className="text-gray-600 hover:text-red-400"><Trash2 size={13} /></button>
          </div>
        );
      })}
      <div className="flex items-center gap-3 mt-1">
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Plus size={12} /> Add Item</button>
        <label className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
          <input type="checkbox" checked={block.interactive} onChange={e => onUpdate({ interactive: e.target.checked })} />
          Interactive (preview)
        </label>
      </div>
    </div>
  );
}
