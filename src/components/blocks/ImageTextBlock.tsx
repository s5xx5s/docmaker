import { useRef } from 'react';
import type { ImageTextBlock as T } from '../../types';
import { imageToBase64 } from '../../utils/imageToBase64';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function ImageTextBlock({ block, onUpdate }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpdate({ src: await imageToBase64(file) });
  };
  const isLeft = block.imagePosition !== 'right';
  return (
    <div className="space-y-2">
      <div className={`flex gap-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
        <div className="w-1/3 shrink-0">
          {block.src ? (
            <img src={block.src} alt={block.alt} className="w-full rounded-lg h-28 object-cover" />
          ) : (
            <button onClick={() => ref.current?.click()} className="w-full h-28 border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-500 text-xs">Upload</button>
          )}
          <input ref={ref} type="file" accept="image/*" onChange={upload} className="hidden" />
        </div>
        <div className="flex-1 space-y-1">
          <input value={block.title ?? ''} onChange={e => onUpdate({ title: e.target.value })} placeholder="Title" className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none border-b border-gray-700 pb-0.5" />
          <textarea value={block.content} onChange={e => onUpdate({ content: e.target.value })} rows={3} className="w-full bg-transparent text-xs text-gray-300 resize-none focus:outline-none" />
        </div>
      </div>
      <div className="flex gap-2">
        {(['left','right'] as const).map(p => (
          <button key={p} onClick={() => onUpdate({ imagePosition: p })} className={`text-xs px-2 py-0.5 rounded ${block.imagePosition === p ? 'bg-blue-700 text-white' : 'text-gray-500'}`}>Image {p}</button>
        ))}
      </div>
    </div>
  );
}
