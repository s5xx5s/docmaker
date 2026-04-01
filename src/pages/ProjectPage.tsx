import { useState } from 'react';
import { ArrowLeft, Plus, BookOpen, MoreVertical, Edit2, Trash2, Clock } from 'lucide-react';
import { useProjectStore } from '../store/project.store';
import type { Guide } from '../types';

interface Props {
  projectId: string;
  onBack(): void;
  onOpenGuide(guideId: string): void;
}

function GuideModal({ onSave, onClose }: { onSave(title: string): void; onClose(): void }) {
  const [title, setTitle] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">New Guide</h2>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (title.trim()) { onSave(title.trim()); onClose(); } }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
            <input
              autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Customer Guide"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-700 text-gray-400 rounded-lg py-2 text-sm">Cancel</button>
            <button type="submit" disabled={!title.trim()} className="flex-1 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-white rounded-lg py-2 text-sm font-semibold">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GuideCard({ guide, onOpen, onDelete }: { guide: Guide; onOpen(): void; onDelete(): void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const updatedAt = new Date(guide.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 bg-purple-900/40 rounded-lg flex items-center justify-center">
          <BookOpen size={18} className="text-purple-400" />
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(v => !v)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-36 py-1 text-sm">
                <button onClick={() => { onOpen(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700">
                  <Edit2 size={14} /> Open
                </button>
                <hr className="border-gray-700 my-1" />
                <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-gray-700">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <button onClick={onOpen} className="text-left w-full">
        <h3 className="font-semibold text-white mb-1 truncate">{guide.title}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
          <Clock size={11} />
          <span>{updatedAt}</span>
          <span className="ml-2">{guide.sections.length} sections</span>
        </div>
      </button>
      <button onClick={onOpen} className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 border border-purple-800/50 hover:border-purple-700 rounded-lg py-2 transition-colors">
        Open Editor
      </button>
    </div>
  );
}

export function ProjectPage({ projectId, onBack, onOpenGuide }: Props) {
  const { projects, addGuide, deleteGuide } = useProjectStore();
  const project = projects.find(p => p.id === projectId);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!project) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"><p className="text-gray-400">Project not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="font-bold text-white">{project.name}</h1>
            {project.description && <p className="text-xs text-gray-500">{project.description}</p>}
          </div>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 text-sm bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-3 py-2 font-semibold transition-colors">
          <Plus size={15} /> New Guide
        </button>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Guides</h2>
            <p className="text-gray-400 text-sm mt-1">{project.guides.length} guide{project.guides.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {project.guides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-400 mb-2">No guides yet</h3>
            <p className="text-gray-600 text-sm mb-6">Create your first guide for this project</p>
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-4 py-2 text-sm font-semibold">
              <Plus size={16} /> Create Guide
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {project.guides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onOpen={() => onOpenGuide(guide.id)}
                onDelete={() => setDeleteId(guide.id)}
              />
            ))}
          </div>
        )}
      </main>
      {modalOpen && (
        <GuideModal
          onSave={(title) => addGuide(projectId, title)}
          onClose={() => setModalOpen(false)}
        />
      )}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <h3 className="font-semibold text-white mb-2">Delete Guide?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently delete the guide and all its content.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-700 text-gray-400 rounded-lg py-2 text-sm">Cancel</button>
              <button onClick={() => { deleteGuide(projectId, deleteId); setDeleteId(null); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg py-2 text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
