import { useRef, useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryBlock as T } from '../../types';
import { imageToBase64 } from '../../utils/imageToBase64';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function GalleryBlock({ block, onUpdate, isEditing }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const remove = (i: number) => onUpdate({ images: block.images.filter((_, idx) => idx !== i) });
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImgs = await Promise.all(files.map(async f => ({ src: await imageToBase64(f), alt: f.name })));
    onUpdate({ images: [...block.images, ...newImgs] });
    e.target.value = '';
  };

  const cols = block.columns ?? 3;
  const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '8px' };

  const openLightbox = (i: number) => { if (block.lightbox !== false) setLightboxIdx(i); };
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setLightboxIdx(i => i != null ? (i - 1 + block.images.length) % block.images.length : null); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setLightboxIdx(i => i != null ? (i + 1) % block.images.length : null); };

  const Lightbox = lightboxIdx != null && (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={() => setLightboxIdx(null)}
    >
      {/* Close */}
      <button className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2 z-10" onClick={() => setLightboxIdx(null)}>
        <X size={20} />
      </button>
      {/* Prev */}
      {block.images.length > 1 && (
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 rounded-full p-3 z-10" onClick={prev}>
          <ChevronLeft size={24} />
        </button>
      )}
      {/* Image */}
      <img
        src={block.images[lightboxIdx].src}
        alt={block.images[lightboxIdx].alt}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
      {/* Next */}
      {block.images.length > 1 && (
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 rounded-full p-3 z-10" onClick={next}>
          <ChevronRight size={24} />
        </button>
      )}
      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/50 px-3 py-1 rounded-full">
        {lightboxIdx + 1} / {block.images.length}
      </div>
    </div>
  );

  if (!isEditing) {
    if (block.images.length === 0) return null;
    return (
      <>
        <div style={gridStyle}>
          {block.images.map((img, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer group/img relative"
              onClick={() => openLightbox(i)}
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-200 group-hover/img:scale-105" />
              {block.lightbox !== false && (
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover/img:opacity-100 text-xs bg-black/50 px-2 py-0.5 rounded">🔍</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {Lightbox}
      </>
    );
  }

  return (
    <div className="space-y-2">
      <div style={gridStyle}>
        {block.images.map((img, i) => (
          <div key={i} className="relative group/img aspect-square overflow-hidden rounded-lg">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openLightbox(i)}
            />
            <button
              onClick={() => remove(i)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
        <button
          onClick={() => ref.current?.click()}
          className="aspect-square border border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple onChange={upload} className="hidden" />
      <div className="flex items-center gap-3 text-xs">
        <span className="text-gray-500">Columns:</span>
        {([2,3,4] as const).map(c => (
          <button key={c} onClick={() => onUpdate({ columns: c })} className={`px-2 py-0.5 rounded ${block.columns === c ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>{c}</button>
        ))}
        <label className="flex items-center gap-1 text-gray-400 ml-auto cursor-pointer">
          <input type="checkbox" checked={block.lightbox !== false} onChange={e => onUpdate({ lightbox: e.target.checked })} />
          Lightbox
        </label>
      </div>
      {Lightbox}
    </div>
  );
}
