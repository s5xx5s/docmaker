import { Plus, Trash2 } from 'lucide-react';
import type { FlowBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function FlowBlock({ block, onUpdate, isEditing }: Props) {
  const update = (i: number, patch: Partial<T['steps'][0]>) => onUpdate({ steps: block.steps.map((s, idx) => idx === i ? { ...s, ...patch } : s) });
  const add = () => onUpdate({ steps: [...block.steps, { label: 'Step' }] });
  const remove = (i: number) => onUpdate({ steps: block.steps.filter((_, idx) => idx !== i) });

  if (!isEditing) {
    return (
      <div className={`flex ${block.direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'} gap-2 items-center`}>
        {block.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="bg-blue-700 rounded-lg px-3 py-1.5">
              <span className="text-white text-xs font-medium">{step.label}</span>
            </div>
            {i < block.steps.length - 1 && <span className="text-gray-500 text-sm">{block.direction === 'vertical' ? '↓' : '→'}</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">Direction:</span>
        {(['horizontal','vertical'] as const).map(d => (
          <button key={d} onClick={() => onUpdate({ direction: d })} className={`text-xs px-2 py-0.5 rounded ${block.direction === d ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{d}</button>
        ))}
      </div>
      <div className={`flex ${block.direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'} gap-2 items-center`}>
        {block.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-blue-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <input value={step.label} onChange={e => update(i, { label: e.target.value })} className="bg-transparent text-white text-xs font-medium focus:outline-none w-16 text-center" />
                <button onClick={() => remove(i)} className="text-blue-300 hover:text-red-400"><Trash2 size={11} /></button>
              </div>
            </div>
            {i < block.steps.length - 1 && <span className="text-gray-500 text-sm">{block.direction === 'vertical' ? '↓' : '→'}</span>}
          </div>
        ))}
        <button onClick={add} className="text-xs text-blue-400 hover:text-blue-300 border border-dashed border-blue-800 rounded px-2 py-1"><Plus size={11} /></button>
      </div>
    </div>
  );
}
