import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { SectionItem } from './SectionItem';
import type { Section } from '../../types';
import { generateId } from '../../utils/id';

interface Props {
  sections: Section[];
  activeSectionId: string | null;
  editLang?: string;
  onSelect(id: string): void;
  onReorder(sections: Section[]): void;
  onAdd(): void;
  onDelete(id: string): void;
  onDuplicate(id: string): void;
  onRename(id: string, title: string): void;
}

export function SectionList({ sections, activeSectionId, editLang, onSelect, onReorder, onAdd, onDelete, onDuplicate, onRename }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sections.findIndex(s => s.id === active.id);
    const newIdx = sections.findIndex(s => s.id === over.id);
    onReorder(arrayMove(sections, oldIdx, newIdx).map((s, i) => ({ ...s, order: i })));
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sections</span>
        <button onClick={onAdd} className="text-gray-400 hover:text-white transition-colors">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <p className="text-gray-600 text-xs mb-3">No sections yet</p>
            <button onClick={onAdd} className="text-blue-400 hover:text-blue-300 text-xs border border-blue-800/50 rounded px-3 py-1.5">
              + Add Section
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {sections.map(section => (
                  <SectionItem
                    key={section.id}
                    section={section}
                    isActive={section.id === activeSectionId}
                    editLang={editLang}
                    onSelect={() => onSelect(section.id)}
                    onDelete={() => onDelete(section.id)}
                    onDuplicate={() => onDuplicate(section.id)}
                    onRename={(title) => onRename(section.id, title)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export function makeSectionFromTitle(title: string, order: number): Section {
  return { id: generateId(), title, order, isActive: true, blocks: [], translations: {} };
}
