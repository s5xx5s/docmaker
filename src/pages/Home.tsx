import { useState, useRef } from 'react';
import { Plus, Search, Upload, BookOpen } from 'lucide-react';
import { useProjectStore } from '../store/project.store';
import { ProjectCard } from '../components/project/ProjectCard';
import { ProjectModal } from '../components/project/ProjectModal';
import type { Project } from '../types';
import { importProjectsJSON } from '../utils/storage';

interface Props {
  onOpenProject(projectId: string): void;
}

export function Home({ onOpenProject }: Props) {
  const { projects, addProject, updateProject, deleteProject, duplicateProject, importProject } = useProjectStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  function handleSave(name: string, description?: string) {
    if (editingProject) {
      updateProject(editingProject.id, { name, description });
    } else {
      addProject(name, description);
    }
    setEditingProject(null);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    importProjectsJSON(file)
      .then((imported) => imported.forEach((p) => importProject(p)))
      .catch((err: unknown) => alert((err as Error).message));
    e.target.value = '';
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Topbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-400" size={22} />
          <span className="font-bold text-lg tracking-tight">docmaker</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 rounded-lg px-3 py-2 transition-colors"
          >
            <Upload size={15} />
            Import
          </button>
          <button
            onClick={() => { setEditingProject(null); setModalOpen(true); }}
            className="flex items-center gap-2 text-sm bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-3 py-2 font-semibold transition-colors"
          >
            <Plus size={15} />
            New Project
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-400 mb-2">
              {search ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              {search ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            {!search && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
              >
                <Plus size={16} />
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => onOpenProject(project.id)}
                onEdit={() => { setEditingProject(project); setModalOpen(true); }}
                onDelete={() => setDeleteConfirmId(project.id)}
                onDuplicate={() => duplicateProject(project.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <ProjectModal
          project={editingProject ?? undefined}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingProject(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <h3 className="font-semibold text-white mb-2">Delete Project?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently delete the project and all its guides.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-gray-700 text-gray-400 hover:text-white rounded-lg py-2 text-sm transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { deleteProject(deleteConfirmId); setDeleteConfirmId(null); }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
