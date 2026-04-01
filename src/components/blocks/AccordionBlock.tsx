import { useState } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import type { AccordionBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function AccordionBlock({ block, onUpdate, isEditing }: Props) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const update = (i: number, patch: Partial<T['items'][0]>) => onUpdate({ items: block.items.map((x, idx) => idx === i ? { ...x, ...patch } : x) });
  const add = () => onUpdate({ items: [...block.items, { title: 'New Section', content: 'Content here...' }] });
  const remove = (i: number) => onUpdate({ items: block.items.filter((_, idx) => idx !== i) });
  const toggle = (i: number) => setOpen(o => ({ ...o, [i]: !o[i] }));

  if (!isEditing) {
    return (
      <div className="space-y-1.5">
        {block.items.map((item, i) => {
          const isOpen = open[i] ?? item.defaultOpen;
          return (
            <div key={i} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 text-left"
              >
                <ChevronDown size={14} className={`transition-transform text-gray-400 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                <span className="flex-1 text-sm font-medium" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{item.title}</span>
              </button>
              {isOpen && (
                <div className="px-3 py-2 bg-gray-900">
                  <p className="text-xs" style={{ color: 'var(--gp-text-muted, #cbd5e1)' }}>{item.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {block.items.map((item, i) => {
        const isOpen = open[i] ?? item.defaultOpen;
        return (
          <div key={i} className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800">
              <button onClick={() => toggle(i)} className="text-gray-400"><ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
              <input value={item.title} onChange={e => update(i, { title: e.target.value })} className="flex-1 bg-transparent text-sm font-medium text-white focus:outline-none" />
              <button onClick={() => remove(i)} className="text-gray-600 hover:text-red-400"><Trash2 size={13} /></button>
            </div>
            {isOpen && (
              <div className="px-3 py-2 bg-gray-900">
                <textarea value={item.content} onChange={e => update(i, { content: e.target.value })} rows={2} className="w-full bg-transparent text-xs text-gray-300 resize-none focus:outline-none" />
              </div>
            )}
          </div>
        );
      })}
      <button onClick={add} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Plus size={12} /> Add Section</button>
    </div>
  );
}
