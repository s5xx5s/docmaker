import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { BlockWrapper } from './BlockWrapper';
import { BlockPicker } from './BlockPicker';
import { BlockRenderer } from '../blocks/BlockRenderer';
import type { Block, BlockType } from '../../types';
import { generateId } from '../../utils/id';
import { getDefaultBlock } from '../blocks/defaultBlocks';

interface Props {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelect(id: string): void;
  onReorder(blocks: Block[]): void;
  onAdd(block: Block): void;
  onUpdate(id: string, patch: Partial<Block>): void;
  onDelete(id: string): void;
  onDuplicate(id: string): void;
  onMoveUp(id: string): void;
  onMoveDown(id: string): void;
}

export function BlockList({ blocks, selectedBlockId, onSelect, onReorder, onAdd, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = blocks.findIndex(b => b.id === active.id);
    const newIdx = blocks.findIndex(b => b.id === over.id);
    onReorder(arrayMove(blocks, oldIdx, newIdx));
  }

  function handleAddBlock(type: BlockType) {
    const block = { ...getDefaultBlock(type), id: generateId() } as Block;
    onAdd(block);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Blocks</span>
        <button onClick={() => setPickerOpen(true)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-blue-800/50 rounded px-2 py-1">
          <Plus size={12} /> Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-gray-600 text-xs mb-3">No blocks yet</p>
            <button onClick={() => setPickerOpen(true)} className="text-blue-400 hover:text-blue-300 text-xs border border-blue-800/50 rounded px-3 py-1.5">
              + Add Block
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {blocks.map(block => (
                  <BlockWrapper
                    key={block.id}
                    block={block}
                    isSelected={block.id === selectedBlockId}
                    onSelect={() => onSelect(block.id)}
                    onDelete={() => onDelete(block.id)}
                    onDuplicate={() => onDuplicate(block.id)}
                    onMoveUp={() => onMoveUp(block.id)}
                    onMoveDown={() => onMoveDown(block.id)}
                  >
                    <BlockRenderer block={block} onUpdate={(patch) => onUpdate(block.id, patch)} isEditing={block.id === selectedBlockId} />
                  </BlockWrapper>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add Block Button */}
      <div className="p-3 border-t border-gray-800 shrink-0">
        <button
          onClick={() => setPickerOpen(true)}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-700 hover:border-blue-600 text-gray-500 hover:text-blue-400 rounded-lg py-2.5 text-sm transition-colors"
        >
          <Plus size={15} /> Add Block
        </button>
      </div>

      {pickerOpen && <BlockPicker onSelect={handleAddBlock} onClose={() => setPickerOpen(false)} />}
    </div>
  );
}
