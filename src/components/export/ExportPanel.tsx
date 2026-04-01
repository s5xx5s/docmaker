import { X, Download, FileCode, FileText, FileJson, Printer } from 'lucide-react';
import type { Guide, Theme } from '../../types';
import { downloadHTML } from '../../export/html';
import { downloadMarkdown } from '../../export/markdown';
import { downloadJSON } from '../../export/json';
import { exportGuideAsPDF } from '../../export/pdf';

interface Props {
  guide: Guide;
  theme: Theme;
  onClose(): void;
}

const EXPORTS = [
  {
    key: 'html',
    icon: FileCode,
    label: 'HTML',
    description: 'Standalone page — zero dependencies, embeds images, CSS & JS',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30',
  },
  {
    key: 'markdown',
    icon: FileText,
    label: 'Markdown',
    description: 'GitHub-flavored with auto-generated table of contents',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  {
    key: 'json',
    icon: FileJson,
    label: 'JSON',
    description: 'Full guide data — import back into docmaker',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
  },
  {
    key: 'pdf',
    icon: Printer,
    label: 'PDF',
    description: 'Opens print dialog — save as PDF from your browser',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
] as const;

export function ExportPanel({ guide, theme, onClose }: Props) {
  function handleExport(key: string) {
    switch (key) {
      case 'html':     downloadHTML(guide, theme); break;
      case 'markdown': downloadMarkdown(guide); break;
      case 'json':     downloadJSON(guide); break;
      case 'pdf':      exportGuideAsPDF(guide, theme); break;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Download size={15} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Export Guide</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16} /></button>
        </div>

        {/* Guide info */}
        <div className="px-5 py-3 border-b border-gray-800">
          <p className="text-xs text-gray-400">
            <span className="text-white font-medium">{guide.title}</span>
            {' · '}{guide.sections.filter(s => s.isActive).length} sections
            {' · '}{guide.availableLangs.length} language{guide.availableLangs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Export options */}
        <div className="p-4 space-y-3">
          {EXPORTS.map(({ key, icon: Icon, label, description, color, bg }) => (
            <button
              key={key}
              onClick={() => handleExport(key)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all hover:scale-[1.01] ${bg}`}
            >
              <div className={`shrink-0 ${color}`}>
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-0.5">{label}</p>
                <p className="text-xs text-gray-400 leading-snug">{description}</p>
              </div>
              <Download size={14} className="text-gray-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
