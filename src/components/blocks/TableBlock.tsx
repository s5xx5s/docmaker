import type { TableBlock as T } from '../../types';

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function TableBlock({ block, onUpdate, isEditing }: Props) {
  const updateHeader = (i: number, val: string) => onUpdate({ headers: block.headers.map((h, idx) => idx === i ? val : h) });
  const updateCell = (r: number, c: number, val: string) => onUpdate({ rows: block.rows.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? val : cell) : row) });
  const addRow = () => onUpdate({ rows: [...block.rows, block.headers.map(() => '')] });
  const addCol = () => onUpdate({ headers: [...block.headers, `Col ${block.headers.length + 1}`], rows: block.rows.map(r => [...r, '']) });

  if (!isEditing) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              {block.headers.map((h, i) => (
                <th key={i} className="border border-gray-700 bg-gray-800 p-2 text-center font-semibold" style={{ color: 'var(--gp-text, #f1f5f9)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r} className={block.striped && r % 2 === 1 ? 'bg-gray-800/50' : ''}>
                {row.map((cell, c) => (
                  <td key={c} className="border border-gray-700 p-2" style={{ color: 'var(--gp-text-muted, #cbd5e1)' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>{block.headers.map((h, i) => (
            <th key={i} className="border border-gray-700 bg-gray-800 p-1">
              <input value={h} onChange={e => updateHeader(i, e.target.value)} className="bg-transparent text-white font-semibold focus:outline-none w-full text-center" />
            </th>
          ))}</tr>
        </thead>
        <tbody>
          {block.rows.map((row, r) => (
            <tr key={r} className={block.striped && r % 2 === 1 ? 'bg-gray-800/50' : ''}>
              {row.map((cell, c) => (
                <td key={c} className="border border-gray-700 p-1">
                  <input value={cell} onChange={e => updateCell(r, c, e.target.value)} className="bg-transparent text-gray-300 focus:outline-none w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-2">
        <button onClick={addRow} className="text-xs text-blue-400 hover:text-blue-300">+ Row</button>
        <button onClick={addCol} className="text-xs text-blue-400 hover:text-blue-300">+ Column</button>
        <label className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
          <input type="checkbox" checked={block.striped} onChange={e => onUpdate({ striped: e.target.checked })} />
          Striped
        </label>
      </div>
    </div>
  );
}
