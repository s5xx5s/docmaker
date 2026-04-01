import { Plus, Trash2 } from 'lucide-react';
import type { CompareBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function CompareBlock({ block, onUpdate }: Props) {
  const addLeft = () => onUpdate({ leftItems: [...block.leftItems, ''] });
  const addRight = () => onUpdate({ rightItems: [...block.rightItems, ''] });
  const updateLeft = (i: number, v: string) => onUpdate({ leftItems: block.leftItems.map((x, idx) => idx === i ? v : x) });
  const updateRight = (i: number, v: string) => onUpdate({ rightItems: block.rightItems.map((x, idx) => idx === i ? v : x) });

  return (
    <div className="grid grid-cols-2 gap-3">
      {(['left','right'] as const).map(side => {
        const items = side === 'left' ? block.leftItems : block.rightItems;
        const title = side === 'left' ? block.leftTitle : block.rightTitle;
        const addFn = side === 'left' ? addLeft : addRight;
        const updateFn = side === 'left' ? updateLeft : updateRight;
        const removeFn = (i: number) => side === 'left'
          ? onUpdate({ leftItems: block.leftItems.filter((_, idx) => idx !== i) })
          : onUpdate({ rightItems: block.rightItems.filter((_, idx) => idx !== i) });

        return (
          <div key={side} className={`rounded-lg p-3 ${side === 'left' ? 'bg-green-950/20 border border-green-800/40' : 'bg-red-950/20 border border-red-800/40'}`}>
            <input value={title ?? ''} onChange={e => onUpdate(side === 'left' ? { leftTitle: e.target.value } : { rightTitle: e.target.value })}
              className="bg-transparent text-sm font-bold text-white focus:outline-none w-full mb-2 border-b border-gray-700 pb-1" />
            <div className="space-y-1">
              {items.map((item, i) => (
                <div key={i} className="flex gap-1 items-center">
                  <span className="text-xs">{side === 'left' ? '✅' : '❌'}</span>
                  <input value={item} onChange={e => updateFn(i, e.target.value)} className="flex-1 bg-transparent text-xs text-gray-300 focus:outline-none" />
                  <button onClick={() => removeFn(i)} className="text-gray-600 hover:text-red-400"><Trash2 size={11} /></button>
                </div>
              ))}
            </div>
            <button onClick={addFn} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"><Plus size={11} /> Add</button>
          </div>
        );
      })}
    </div>
  );
}
