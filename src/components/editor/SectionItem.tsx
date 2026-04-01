import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronRight, Trash2, Copy } from 'lucide-react';
import type { Section } from '../../types';

interface Props {
  section: Section;
  isActive: boolean;
  onSelect(): void;
  onDelete(): void;
  onDuplicate(): void;
  onRename(title: string): void;
}

export function SectionItem({ section, isActive, onSelect, onDelete, onDuplicate, onRename }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-blue-900/30 border border-blue-700/50' : 'hover:bg-gray-800 border border-transparent'
      }`}
      onClick={onSelect}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={14} />
      </button>

      <span className="flex-1 text-sm text-gray-200 truncate"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const val = e.currentTarget.textContent?.trim();
          if (val && val !== section.title) onRename(val);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {section.title}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="text-gray-500 hover:text-white p-0.5 rounded">
          <Copy size={12} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-gray-500 hover:text-red-400 p-0.5 rounded">
          <Trash2 size={12} />
        </button>
      </div>

      {isActive && <ChevronRight size={14} className="text-blue-400 shrink-0" />}
    </div>
  );
}
