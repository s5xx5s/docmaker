import type { CodeBlock as T } from '../../types';

const LANGS = ['javascript','typescript','python','bash','json','html','css','sql','go','rust','java','php','yaml'];

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function CodeBlock({ block, onUpdate, isEditing }: Props) {
  if (!isEditing) {
    return (
      // Code is always LTR regardless of guide direction
      <div className="bg-gray-950 rounded-lg p-3 border border-gray-800" dir="ltr">
        {(block.filename || block.language) && (
          <div className="flex items-center gap-2 mb-2">
            {block.filename && <span className="text-xs text-gray-500 font-mono">{block.filename}</span>}
            {block.language && <span className="text-xs text-gray-600 font-mono ml-auto">{block.language}</span>}
          </div>
        )}
        <pre className="text-green-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre" dir="ltr">
          {block.showLineNumbers
            ? block.code.split('\n').map((line, i) => (
                <span key={i} className="block">
                  <span className="text-gray-600 select-none mr-3 text-right inline-block w-5">{i + 1}</span>{line}
                </span>
              ))
            : block.code
          }
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-2" dir="ltr">
      <div className="flex items-center gap-2">
        <select value={block.language} onChange={e => onUpdate({ language: e.target.value })} className="bg-gray-800 text-xs text-gray-300 rounded px-2 py-1 border border-gray-700 focus:outline-none">
          {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <input value={block.filename ?? ''} onChange={e => onUpdate({ filename: e.target.value })} placeholder="filename.js" className="bg-gray-800 text-xs text-gray-400 rounded px-2 py-1 border border-gray-700 focus:outline-none flex-1" />
        <label className="flex items-center gap-1 text-xs text-gray-400">
          <input type="checkbox" checked={block.showLineNumbers} onChange={e => onUpdate({ showLineNumbers: e.target.checked })} />
          Lines
        </label>
      </div>
      <div className="bg-gray-950 rounded-lg p-3 border border-gray-800">
        {block.filename && <div className="text-xs text-gray-500 mb-2 font-mono">{block.filename}</div>}
        <textarea
          value={block.code}
          onChange={e => onUpdate({ code: e.target.value })}
          rows={8}
          spellCheck={false}
          dir="ltr"
          className="w-full bg-transparent text-green-300 font-mono text-xs resize-y focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
}
