import { useRef, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { GalleryBlock as T } from '../../types';
import { imageToBase64 } from '../../utils/imageToBase64';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function GalleryBlock({ block, onUpdate }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const remove = (i: number) => onUpdate({ images: block.images.filter((_, idx) => idx !== i) });
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImgs = await Promise.all(files.map(async f => ({ src: await imageToBase64(f), alt: f.name })));
    onUpdate({ images: [...block.images, ...newImgs] });
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <div className={`grid grid-cols-${block.columns ?? 3} gap-2`}>
        {block.images.map((img, i) => (
          <div key={i} className="relative group/img aspect-square">
            <img src={img.src} alt={img.alt} onClick={() => block.lightbox && setLightboxSrc(img.src)}
              className={`w-full h-full object-cover rounded-lg ${block.lightbox ? 'cursor-pointer' : ''}`} />
            <button onClick={() => remove(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover/img:opacity-100">
              <Trash2 size={10} />
            </button>
          </div>
        ))}
        <button onClick={() => ref.current?.click()} className="aspect-square border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400">
          <Plus size={20} />
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple onChange={upload} className="hidden" />
      <div className="flex items-center gap-3 text-xs">
        <span className="text-gray-500">Columns:</span>
        {([2,3,4] as const).map(c => <button key={c} onClick={() => onUpdate({ columns: c })} className={`px-2 py-0.5 rounded ${block.columns === c ? 'bg-blue-700 text-white' : 'text-gray-500'}`}>{c}</button>)}
        <label className="flex items-center gap-1 text-gray-400 ml-auto"><input type="checkbox" checked={block.lightbox} onChange={e => onUpdate({ lightbox: e.target.checked })} />Lightbox</label>
      </div>
      {lightboxSrc && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} className="max-w-full max-h-full rounded-lg" />
          <button className="absolute top-4 right-4 text-white"><X size={24} /></button>
        </div>
      )}
    </div>
  );
}
