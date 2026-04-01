import { BookOpen, MoreVertical, Edit2, Trash2, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../../types';

interface Props {
  project: Project;
  onOpen(): void;
  onEdit(): void;
  onDelete(): void;
  onDuplicate(): void;
}

export function ProjectCard({ project, onOpen, onEdit, onDelete, onDuplicate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const guideCount = project.guides.length;
  const updatedAt = new Date(project.updatedAt).toLocaleDateString('en', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 bg-blue-900/40 rounded-lg flex items-center justify-center">
          <BookOpen size={18} className="text-blue-400" />
        </div>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-40 py-1 text-sm">
                <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => { onDuplicate(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                  <Copy size={14} /> Duplicate
                </button>
                <hr className="border-gray-700 my-1" />
                <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <button onClick={onOpen} className="text-left w-full">
        <h3 className="font-semibold text-white mb-1 truncate">{project.name}</h3>
        {project.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{project.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
          <span>{guideCount} {guideCount === 1 ? 'guide' : 'guides'}</span>
          <span>{updatedAt}</span>
        </div>
      </button>

      {/* Open button */}
      <button
        onClick={onOpen}
        className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 border border-blue-800/50 hover:border-blue-700 rounded-lg py-2 transition-colors"
      >
        <ExternalLink size={14} />
        Open
      </button>
    </div>
  );
}
