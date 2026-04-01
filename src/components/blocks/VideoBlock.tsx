import { useRef } from 'react';
import { Video } from 'lucide-react';
import type { VideoBlock as T } from '../../types';

function getEmbedUrl(src: string): string | null {
  const yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = src.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function VideoBlock({ block, onUpdate }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const embedUrl = block.src ? getEmbedUrl(block.src) : null;
  const isBase64 = block.src?.startsWith('data:');

  return (
    <div className="space-y-2">
      {block.src ? (
        embedUrl ? (
          <iframe src={embedUrl} className="w-full h-40 rounded-lg" allowFullScreen />
        ) : isBase64 ? (
          <video src={block.src} controls className="w-full rounded-lg max-h-40" />
        ) : (
          <div className="w-full h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs">{block.src}</div>
        )
      ) : (
        <button onClick={() => ref.current?.click()} className="w-full h-24 border border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-blue-500 text-xs">
          <Video size={20} /> Upload video or paste URL below
        </button>
      )}
      <input ref={ref} type="file" accept="video/*" onChange={async e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onUpdate({ src: reader.result as string });
        reader.readAsDataURL(file);
      }} className="hidden" />
      <input value={block.src?.startsWith('data:') ? '' : (block.src ?? '')} onChange={e => onUpdate({ src: e.target.value })} placeholder="YouTube / Vimeo URL" className="w-full bg-gray-800 text-xs text-gray-300 rounded px-2 py-1.5 focus:outline-none border border-gray-700 focus:border-blue-500" />
      <input value={block.caption ?? ''} onChange={e => onUpdate({ caption: e.target.value })} placeholder="Caption (optional)" className="w-full bg-gray-800 text-xs text-gray-400 rounded px-2 py-1 focus:outline-none border border-gray-700" />
    </div>
  );
}
