import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, ChevronUp, ChevronDown, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import type { Block } from '../../types';

interface Props {
  block: Block;
  isSelected: boolean;
  onSelect(): void;
  onDelete(): void;
  onDuplicate(): void;
  onMoveUp(): void;
  onMoveDown(): void;
  onUpdate(patch: Partial<Block>): void;
  children: React.ReactNode;
}

const FONT_SIZE_LABELS: Array<{ key: 'xs' | 'sm' | 'base' | 'lg' | 'xl'; label: string }> = [
  { key: 'xs',   label: 'XS' },
  { key: 'sm',   label: 'S'  },
  { key: 'base', label: 'M'  },
  { key: 'lg',   label: 'L'  },
  { key: 'xl',   label: 'XL' },
];

export function BlockWrapper({ block, isSelected, onSelect, onDelete, onDuplicate, onMoveUp, onMoveDown, onUpdate, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  // Read current values — check block's own `align` field first (e.g. TextBlock), then blockAlign
  const currentAlign = (block as unknown as Record<string, unknown>).align as string | undefined ?? block.blockAlign ?? 'left';
  const currentDir   = block.blockDir ?? 'ltr';
  const currentSize  = block.blockFontSize;

  // When alignment changes, update BOTH blockAlign (wrapper) AND align (TextBlock / ButtonBlock own field)
  function handleAlign(e: React.MouseEvent, value: 'left' | 'center' | 'right') {
    e.stopPropagation();
    onUpdate({ blockAlign: value, align: value } as Partial<Block>);
  }

  // No need to apply styles here — BlockRenderer handles them so they show in preview + export too

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative border rounded-xl transition-colors ${
        isSelected ? 'border-blue-600 bg-blue-950/10' : 'border-transparent hover:border-gray-700'
      }`}
      onClick={onSelect}
    >
      {/* ── Toolbar ── */}
      <div className={`absolute -top-3 right-2 z-10 flex items-center gap-0.5 bg-gray-800 border border-gray-700 rounded-lg px-1.5 py-1 shadow-lg transition-opacity ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>

        {/* Drag */}
        <button {...attributes} {...listeners} onClick={e => e.stopPropagation()} className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing p-0.5">
          <GripVertical size={13} />
        </button>

        <div className="w-px h-3 bg-gray-700 mx-0.5" />

        {/* Move up / down */}
        <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }}   className="text-gray-400 hover:text-white p-0.5"><ChevronUp   size={13} /></button>
        <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="text-gray-400 hover:text-white p-0.5"><ChevronDown size={13} /></button>

        <div className="w-px h-3 bg-gray-700 mx-0.5" />

        {/* Alignment */}
        <button onClick={(e) => handleAlign(e, 'left')}   title="Align left"   className={`p-0.5 ${currentAlign === 'left'   ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}><AlignLeft   size={13} /></button>
        <button onClick={(e) => handleAlign(e, 'center')} title="Align center" className={`p-0.5 ${currentAlign === 'center' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}><AlignCenter size={13} /></button>
        <button onClick={(e) => handleAlign(e, 'right')}  title="Align right"  className={`p-0.5 ${currentAlign === 'right'  ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}><AlignRight  size={13} /></button>

        <div className="w-px h-3 bg-gray-700 mx-0.5" />

        {/* Text direction */}
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate({ blockDir: currentDir === 'rtl' ? 'ltr' : 'rtl' } as Partial<Block>); }}
          title={currentDir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL'}
          className={`text-[10px] font-bold px-1 py-0.5 rounded ${block.blockDir ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
        >{currentDir === 'rtl' ? 'RTL' : 'LTR'}</button>

        <div className="w-px h-3 bg-gray-700 mx-0.5" />

        {/* Bold */}
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate({ blockBold: !block.blockBold } as Partial<Block>); }}
          title="Bold"
          className={`text-xs font-extrabold px-1 py-0.5 rounded ${block.blockBold ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
        >B</button>

        {/* Italic */}
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate({ blockItalic: !block.blockItalic } as Partial<Block>); }}
          title="Italic"
          className={`text-xs italic px-1 py-0.5 rounded ${block.blockItalic ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
        >I</button>

        <div className="w-px h-3 bg-gray-700 mx-0.5" />

        {/* Font size */}
        {FONT_SIZE_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={(e) => { e.stopPropagation(); onUpdate({ blockFontSize: currentSize === key ? undefined : key } as Partial<Block>); }}
            title={`Font size ${key}`}
            className={`text-[10px] px-0.5 py-0.5 rounded leading-none ${currentSize === key ? 'text-blue-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
          >{label}</button>
        ))}

        <div className="w-px h-3 bg-gray-700 mx-0.5" />

        {/* Duplicate / Delete */}
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="text-gray-400 hover:text-white p-0.5"><Copy   size={13} /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}    className="text-gray-400 hover:text-red-400 p-0.5"><Trash2 size={13} /></button>
      </div>

      {/* Block content */}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}
