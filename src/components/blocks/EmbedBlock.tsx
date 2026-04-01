import type { EmbedBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function EmbedBlock({ block, onUpdate }: Props) {
  return (
    <div className="space-y-2">
      <input value={block.src} onChange={e => onUpdate({ src: e.target.value })} placeholder="https://..." className="w-full bg-gray-800 text-xs text-gray-300 rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500" />
      <input value={block.title ?? ''} onChange={e => onUpdate({ title: e.target.value })} placeholder="Title" className="w-full bg-gray-800 text-xs text-gray-400 rounded px-2 py-1 border border-gray-700 focus:outline-none" />
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>Height:</span>
        <input type="number" value={block.height ?? 400} onChange={e => onUpdate({ height: Number(e.target.value) })} className="bg-gray-800 w-20 rounded px-2 py-0.5 text-white border border-gray-700 focus:outline-none" />
        <span>px</span>
      </div>
      {block.src && (
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <iframe src={block.src} title={block.title} height={block.height ?? 400} className="w-full" allowFullScreen />
        </div>
      )}
    </div>
  );
}
