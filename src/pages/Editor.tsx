import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Eye, EyeOff, Save, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useProjectStore } from '../store/project.store';
import { SectionList, makeSectionFromTitle } from '../components/editor/SectionList';
import { BlockList } from '../components/editor/BlockList';
import type { Block, Guide, Section } from '../types';
import { generateId } from '../utils/id';

type SaveStatus = 'saved' | 'saving' | 'unsaved';
type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: 'w-full',
  tablet:  'w-[768px] mx-auto',
  mobile:  'w-[375px] mx-auto',
};

interface Props {
  projectId: string;
  guideId: string;
  onBack(): void;
}

export function Editor({ projectId, guideId, onBack }: Props) {
  const { projects, updateGuide } = useProjectStore();
  const project = projects.find(p => p.id === projectId);
  const guideFromStore = project?.guides.find(g => g.id === guideId);

  const [guide, setGuide] = useState<Guide | null>(guideFromStore ?? null);
  // After null check, guide is guaranteed non-null for all code below
  const [activeSectionId, setActiveSectionId] = useState<string | null>(guideFromStore?.sections[0]?.id ?? null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [previewVisible, setPreviewVisible] = useState(true);
  const [device, setDevice] = useState<Device>('desktop');

  const activeSection = guide?.sections.find(s => s.id === activeSectionId) ?? null;

  // Auto-save every 3 seconds when unsaved
  const persist = useCallback((g: Guide) => {
    setSaveStatus('saving');
    updateGuide(projectId, guideId, {
      title: g.title,
      subtitle: g.subtitle,
      sections: g.sections,
    });
    setTimeout(() => setSaveStatus('saved'), 500);
  }, [projectId, guideId, updateGuide]);

  useEffect(() => {
    if (saveStatus !== 'unsaved' || !guide) return;
    const currentGuide = guide;
    const t = setTimeout(() => persist(currentGuide), 2000);
    return () => clearTimeout(t);
  }, [saveStatus, guide, persist]);

  if (!guide) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Guide not found</p>
    </div>
  );

  function mutate(updater: (g: Guide) => Guide) {
    setGuide(prev => { if (!prev) return prev; const next = updater(prev); setSaveStatus('unsaved'); return next; });
  }

  // ── Section operations ───────────────────────────────────────────────────────

  function addSection() {
    const section = makeSectionFromTitle('New Section', guide!.sections.length);
    mutate(g => ({ ...g, sections: [...g.sections, section] }));
    setActiveSectionId(section.id);
  }

  function deleteSection(id: string) {
    mutate(g => ({ ...g, sections: g.sections.filter(s => s.id !== id) }));
    if (activeSectionId === id) setActiveSectionId(guide!.sections.find(s => s.id !== id)?.id ?? null);
  }

  function duplicateSection(id: string) {
    const original = guide!.sections.find(s => s.id === id);
    if (!original) return;
    const copy: Section = { ...JSON.parse(JSON.stringify(original)) as Section, id: generateId(), title: `${original.title} (copy)` };
    mutate(g => ({ ...g, sections: [...g.sections, copy] }));
    setActiveSectionId(copy.id);
  }

  function renameSection(id: string, title: string) {
    mutate(g => ({ ...g, sections: g.sections.map(s => s.id === id ? { ...s, title } : s) }));
  }

  function reorderSections(sections: Section[]) {
    mutate(g => ({ ...g, sections }));
  }

  // ── Block operations ─────────────────────────────────────────────────────────

  function updateSectionBlocks(blocks: Block[]) {
    if (!activeSectionId) return;
    mutate(g => ({ ...g, sections: g.sections.map(s => s.id === activeSectionId ? { ...s, blocks } : s) }));
  }

  function addBlock(block: Block) {
    updateSectionBlocks([...(activeSection?.blocks ?? []), block]);
    setSelectedBlockId(block.id);
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    updateSectionBlocks((activeSection?.blocks ?? []).map(b => b.id === id ? { ...b, ...patch } as Block : b));
  }

  function deleteBlock(id: string) {
    updateSectionBlocks((activeSection?.blocks ?? []).filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }

  function duplicateBlock(id: string) {
    const blocks = activeSection?.blocks ?? [];
    const original = blocks.find(b => b.id === id);
    if (!original) return;
    const copy = { ...JSON.parse(JSON.stringify(original)) as Block, id: generateId() };
    const idx = blocks.findIndex(b => b.id === id);
    const newBlocks = [...blocks];
    newBlocks.splice(idx + 1, 0, copy);
    updateSectionBlocks(newBlocks);
    setSelectedBlockId(copy.id);
  }

  function moveBlock(id: string, dir: 'up' | 'down') {
    const blocks = [...(activeSection?.blocks ?? [])];
    const idx = blocks.findIndex(b => b.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= blocks.length) return;
    [blocks[idx], blocks[swapIdx]] = [blocks[swapIdx], blocks[idx]];
    updateSectionBlocks(blocks);
  }

  // ── Save status label ────────────────────────────────────────────────────────
  const statusLabel = saveStatus === 'saved' ? '● Saved' : saveStatus === 'saving' ? '◌ Saving...' : '⚠ Unsaved';
  const statusColor = saveStatus === 'saved' ? 'text-green-400' : saveStatus === 'saving' ? 'text-yellow-400' : 'text-orange-400';

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Topbar */}
      <nav className="border-b border-gray-800 px-4 py-3 flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <input
            value={guide.title}
            onChange={e => mutate(g => ({ ...g, title: e.target.value }))}
            className="bg-transparent font-bold text-white text-sm focus:outline-none border-b border-transparent focus:border-gray-600 pb-0.5"
          />
          <input
            value={guide.subtitle ?? ''}
            onChange={e => mutate(g => ({ ...g, subtitle: e.target.value }))}
            placeholder="Subtitle..."
            className="bg-transparent text-xs text-gray-500 focus:outline-none ml-3"
          />
        </div>
        <span className={`text-xs ${statusColor}`}>{statusLabel}</span>
        <div className="flex items-center gap-1 border border-gray-800 rounded-lg p-0.5">
          {(['desktop','tablet','mobile'] as const).map(d => {
            const Icon = d === 'desktop' ? Monitor : d === 'tablet' ? Tablet : Smartphone;
            return (
              <button key={d} onClick={() => setDevice(d)} className={`p-1.5 rounded ${device === d ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <Icon size={14} />
              </button>
            );
          })}
        </div>
        <button onClick={() => setPreviewVisible(v => !v)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 rounded-lg px-2 py-1.5">
          {previewVisible ? <EyeOff size={14} /> : <Eye size={14} />}
          {previewVisible ? 'Hide' : 'Preview'}
        </button>
        <button onClick={() => persist(guide)} className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 font-semibold">
          <Save size={13} /> Save
        </button>
      </nav>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sections panel */}
        <div className="w-52 border-r border-gray-800 shrink-0 overflow-hidden flex flex-col">
          <SectionList
            sections={guide.sections}
            activeSectionId={activeSectionId}
            onSelect={setActiveSectionId}
            onReorder={reorderSections}
            onAdd={addSection}
            onDelete={deleteSection}
            onDuplicate={duplicateSection}
            onRename={renameSection}
          />
        </div>

        {/* Blocks panel */}
        <div className="w-80 border-r border-gray-800 shrink-0 overflow-hidden flex flex-col">
          {activeSection ? (
            <BlockList
              blocks={activeSection.blocks}
              selectedBlockId={selectedBlockId}
              onSelect={setSelectedBlockId}
              onReorder={updateSectionBlocks}
              onAdd={addBlock}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              onDuplicate={duplicateBlock}
              onMoveUp={(id) => moveBlock(id, 'up')}
              onMoveDown={(id) => moveBlock(id, 'down')}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-xs text-center p-4">
              Select a section from the left panel to start adding blocks
            </div>
          )}
        </div>

        {/* Preview panel */}
        {previewVisible && (
          <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
            <div className={`transition-all ${DEVICE_WIDTHS[device]}`}>
              <div className="bg-gray-950 rounded-xl border border-gray-800 min-h-96 p-6">
                <h2 className="text-xl font-bold text-white mb-1">{guide.title}</h2>
                {guide.subtitle && <p className="text-gray-400 text-sm mb-4">{guide.subtitle}</p>}
                {activeSection ? (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-4">{activeSection.title}</h3>
                    {activeSection.blocks.length === 0 ? (
                      <p className="text-gray-600 text-sm">No blocks yet — add some from the panel</p>
                    ) : (
                      <div className="space-y-4">
                        {activeSection.blocks.map(b => (
                          <div key={b.id} className="text-gray-300 text-sm p-3 bg-gray-900 rounded-lg border border-gray-800">
                            <span className="text-xs text-gray-600 uppercase tracking-wider">{b.type}</span>
                            {b.type === 'text' && <p className="mt-1">{b.content}</p>}
                            {b.type === 'highlight' && <p className="mt-1 font-medium">{b.title}: {b.content}</p>}
                            {b.type === 'code' && <pre className="mt-1 text-xs font-mono text-green-400 overflow-x-auto">{b.code}</pre>}
                            {b.type === 'image' && b.src && <img src={b.src} className="mt-2 max-h-32 rounded" />}
                            {b.type === 'quote' && <blockquote className="mt-1 italic text-gray-300">"{b.content}" — {b.author}</blockquote>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">Select a section to preview</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
