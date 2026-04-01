import { useRef } from 'react';
import type { LogoBlock as T } from '../../types';
import { imageToBase64 } from '../../utils/imageToBase64';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function LogoBlock({ block, onUpdate }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpdate({ src: await imageToBase64(file) });
  };
  return (
    <div className="flex flex-col items-center gap-3">
      {block.src ? (
        <img src={block.src} alt={block.alt} style={{ width: block.width ?? 120 }} className="object-contain" />
      ) : (
        <button onClick={() => ref.current?.click()} className="w-32 h-16 border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-500 text-xs">Upload Logo</button>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={upload} className="hidden" />
      <div className="flex gap-2 text-xs">
        <label className="text-gray-400">Width: <input type="number" value={block.width ?? 120} onChange={e => onUpdate({ width: Number(e.target.value) })} className="bg-gray-800 w-16 rounded px-1 py-0.5 text-white border border-gray-700 focus:outline-none" />px</label>
        <input value={block.link ?? ''} onChange={e => onUpdate({ link: e.target.value })} placeholder="Link URL" className="bg-gray-800 rounded px-2 py-0.5 text-gray-300 border border-gray-700 focus:outline-none w-32" />
      </div>
    </div>
  );
}
