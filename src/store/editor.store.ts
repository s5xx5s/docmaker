import { create } from 'zustand';
import type { Block, Section } from '../types';
import { generateId } from '../utils/id';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface EditorStore {
  activeSection: Section | null;
  saveStatus: SaveStatus;
  previewVisible: boolean;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  selectedBlockId: string | null;

  setActiveSection(section: Section | null): void;
  setSaveStatus(status: SaveStatus): void;
  togglePreview(): void;
  setPreviewDevice(device: 'mobile' | 'tablet' | 'desktop'): void;
  setSelectedBlock(id: string | null): void;

  // Block operations (within active section)
  addBlock(block: Omit<Block, 'id'>): Block;
  updateBlock(id: string, patch: Partial<Block>): void;
  deleteBlock(id: string): void;
  duplicateBlock(id: string): Block;
  moveBlock(id: string, direction: 'up' | 'down'): void;
  reorderBlocks(blocks: Block[]): void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  activeSection: null,
  saveStatus: 'saved',
  previewVisible: true,
  previewDevice: 'desktop',
  selectedBlockId: null,

  setActiveSection(section) {
    set({ activeSection: section, selectedBlockId: null });
  },

  setSaveStatus(status) {
    set({ saveStatus: status });
  },

  togglePreview() {
    set((s) => ({ previewVisible: !s.previewVisible }));
  },

  setPreviewDevice(device) {
    set({ previewDevice: device });
  },

  setSelectedBlock(id) {
    set({ selectedBlockId: id });
  },

  addBlock(blockData) {
    const block = { ...blockData, id: generateId() } as Block;
    set((s) => ({
      activeSection: s.activeSection
        ? { ...s.activeSection, blocks: [...s.activeSection.blocks, block] }
        : null,
      saveStatus: 'unsaved',
    }));
    return block;
  },

  updateBlock(id, patch) {
    set((s) => ({
      activeSection: s.activeSection
        ? {
            ...s.activeSection,
            blocks: s.activeSection.blocks.map((b) =>
              b.id === id ? { ...b, ...patch } as Block : b
            ),
          }
        : null,
      saveStatus: 'unsaved',
    }));
  },

  deleteBlock(id) {
    set((s) => ({
      activeSection: s.activeSection
        ? {
            ...s.activeSection,
            blocks: s.activeSection.blocks.filter((b) => b.id !== id),
          }
        : null,
      selectedBlockId: s.selectedBlockId === id ? null : s.selectedBlockId,
      saveStatus: 'unsaved',
    }));
  },

  duplicateBlock(id) {
    const section = get().activeSection;
    if (!section) throw new Error('No active section');
    const original = section.blocks.find((b) => b.id === id);
    if (!original) throw new Error('Block not found');
    const copy = { ...JSON.parse(JSON.stringify(original)) as Block, id: generateId() };
    const idx = section.blocks.findIndex((b) => b.id === id);
    const newBlocks = [...section.blocks];
    newBlocks.splice(idx + 1, 0, copy);
    set({ activeSection: { ...section, blocks: newBlocks }, saveStatus: 'unsaved' });
    return copy;
  },

  moveBlock(id, direction) {
    const section = get().activeSection;
    if (!section) return;
    const idx = section.blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const newBlocks = [...section.blocks];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[idx]];
    set({ activeSection: { ...section, blocks: newBlocks }, saveStatus: 'unsaved' });
  },

  reorderBlocks(blocks) {
    set((s) => ({
      activeSection: s.activeSection ? { ...s.activeSection, blocks } : null,
      saveStatus: 'unsaved',
    }));
  },
}));
