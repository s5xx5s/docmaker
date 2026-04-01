import type { TextBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function TextBlock({ block, onUpdate }: Props) {
  return (
    <div>
      <textarea
        value={block.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        rows={4}
        placeholder="Write your text here..."
        className="w-full bg-transparent text-gray-200 text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-600"
      />
      <div className="flex gap-2 mt-1">
        {(['left', 'center', 'right'] as const).map(a => (
          <button key={a} onClick={() => onUpdate({ align: a })}
            className={`text-xs px-2 py-0.5 rounded ${block.align === a ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}
