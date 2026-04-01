import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import type { Block } from '../../types';

interface Props {
  block: Block;
  isSelected: boolean;
  onSelect(): void;
  onDelete(): void;
  onDuplicate(): void;
  onMoveUp(): void;
  onMoveDown(): void;
  children: React.ReactNode;
}

export function BlockWrapper({ block, isSelected, onSelect, onDelete, onDuplicate, onMoveUp, onMoveDown, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative border rounded-xl transition-colors ${
        isSelected ? 'border-blue-600 bg-blue-950/10' : 'border-transparent hover:border-gray-700'
      }`}
      onClick={onSelect}
    >
      {/* Toolbar */}
      <div className={`absolute -top-3 right-2 z-10 flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg px-1.5 py-1 shadow-lg transition-opacity ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <button {...attributes} {...listeners} onClick={e => e.stopPropagation()} className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing p-0.5">
          <GripVertical size={13} />
        </button>
        <div className="w-px h-3 bg-gray-700" />
        <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="text-gray-400 hover:text-white p-0.5"><ChevronUp size={13} /></button>
        <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="text-gray-400 hover:text-white p-0.5"><ChevronDown size={13} /></button>
        <div className="w-px h-3 bg-gray-700" />
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="text-gray-400 hover:text-white p-0.5"><Copy size={13} /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-gray-400 hover:text-red-400 p-0.5"><Trash2 size={13} /></button>
      </div>

      <div className="p-3">{children}</div>
    </div>
  );
}
