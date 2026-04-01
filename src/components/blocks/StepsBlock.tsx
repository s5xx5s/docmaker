import { Plus, Trash2 } from 'lucide-react';
import type { StepsBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function StepsBlock({ block, onUpdate, isEditing }: Props) {
  const update = (i: number, patch: Partial<T['steps'][0]>) => {
    const steps = block.steps.map((s, idx) => idx === i ? { ...s, ...patch } : s);
    onUpdate({ steps });
  };
  const add = () => onUpdate({ steps: [...block.steps, { title: `Step ${block.steps.length + 1}`, description: '' }] });
  const remove = (i: number) => onUpdate({ steps: block.steps.filter((_, idx) => idx !== i) });

  if (!isEditing) {
    return (
      <div className="space-y-2">
        {block.steps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{step.title}</p>
              {step.description && <p className="text-xs mt-0.5" style={{ color: 'var(--gp-text-muted, #94a3b8)' }}>{step.description}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {block.steps.map((step, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
          <div className="flex-1 space-y-1">
            <input value={step.title} onChange={e => update(i, { title: e.target.value })} className="w-full bg-transparent text-sm font-medium text-white focus:outline-none border-b border-gray-700 focus:border-blue-500 pb-0.5" />
            <input value={step.description ?? ''} onChange={e => update(i, { description: e.target.value })} placeholder="Description (optional)" className="w-full bg-transparent text-xs text-gray-400 focus:outline-none placeholder-gray-600" />
          </div>
          <button onClick={() => remove(i)} className="text-gray-600 hover:text-red-400 mt-1"><Trash2 size={13} /></button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"><Plus size={12} /> Add Step</button>
    </div>
  );
}
