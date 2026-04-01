import { useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import type { ImageBlock as T } from '../../types';
import { imageToBase64 } from '../../utils/imageToBase64';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function ImageBlock({ block, onUpdate }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpdate({ src: await imageToBase64(file) });
  };

  return (
    <div className="space-y-2">
      {block.src ? (
        <div className="relative group/img">
          <img src={block.src} alt={block.alt} className="w-full rounded-lg max-h-48 object-contain bg-gray-800" />
          <button onClick={() => onUpdate({ src: '' })} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover/img:opacity-100">Remove</button>
        </div>
      ) : (
        <button onClick={() => ref.current?.click()} className="w-full h-24 border border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-blue-500 hover:text-blue-400 transition-colors">
          <ImageIcon size={20} />
          <span className="text-xs">Click to upload image</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={upload} className="hidden" />
      <div className="flex gap-2">
        <input value={block.alt ?? ''} onChange={e => onUpdate({ alt: e.target.value })} placeholder="Alt text" className="flex-1 bg-gray-800 text-xs text-gray-300 rounded px-2 py-1 focus:outline-none border border-gray-700 focus:border-blue-500" />
        <input value={block.caption ?? ''} onChange={e => onUpdate({ caption: e.target.value })} placeholder="Caption" className="flex-1 bg-gray-800 text-xs text-gray-300 rounded px-2 py-1 focus:outline-none border border-gray-700 focus:border-blue-500" />
      </div>
      <div className="flex gap-1">
        {(['small','medium','large','full'] as const).map(w => (
          <button key={w} onClick={() => onUpdate({ width: w })} className={`text-xs px-2 py-0.5 rounded ${block.width === w ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{w}</button>
        ))}
      </div>
    </div>
  );
}
