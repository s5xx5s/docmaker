import type { ButtonBlock as T } from '../../types';

const VARIANT_STYLES = {
  primary:   'bg-blue-600 hover:bg-blue-500 text-white',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
  outline:   'border border-blue-500 text-blue-400 hover:bg-blue-950',
  ghost:     'text-blue-400 hover:bg-blue-950',
};
const SIZE_STYLES = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2 text-sm', lg: 'px-7 py-3 text-base' };

interface Props { block: T; onUpdate(p: Partial<T>): void; isEditing: boolean }

export function ButtonBlock({ block, onUpdate, isEditing }: Props) {
  const alignClass = block.align === 'center' ? 'justify-center' : block.align === 'right' ? 'justify-end' : 'justify-start';

  if (!isEditing) {
    return (
      <div className={`flex ${alignClass}`}>
        <a
          href={block.href || '#'}
          target={block.href && block.href !== '#' ? '_blank' : undefined}
          rel="noopener noreferrer"
          className={`rounded-lg font-semibold transition-colors inline-block ${VARIANT_STYLES[block.variant ?? 'primary']} ${SIZE_STYLES[block.size ?? 'md']}`}
        >
          {block.label || 'Button'}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`flex ${alignClass}`}>
        <a
          href={block.href || '#'}
          target={block.href && block.href !== '#' ? '_blank' : undefined}
          rel="noopener noreferrer"
          className={`rounded-lg font-semibold transition-colors inline-block ${VARIANT_STYLES[block.variant ?? 'primary']} ${SIZE_STYLES[block.size ?? 'md']}`}
          onClick={e => e.preventDefault()}
        >
          {block.label || 'Button'}
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input value={block.label} onChange={e => onUpdate({ label: e.target.value })} placeholder="Button text" className="bg-gray-800 text-xs text-white rounded px-2 py-1 border border-gray-700 focus:outline-none focus:border-blue-500" />
        <input value={block.href ?? ''} onChange={e => onUpdate({ href: e.target.value })} placeholder="https://..." className="bg-gray-800 text-xs text-gray-300 rounded px-2 py-1 border border-gray-700 focus:outline-none" />
      </div>
      <div className="flex gap-2 text-xs">
        {(['primary','secondary','outline','ghost'] as const).map(v => <button key={v} onClick={() => onUpdate({ variant: v })} className={`px-2 py-0.5 rounded ${block.variant === v ? 'bg-blue-700 text-white' : 'text-gray-500'}`}>{v}</button>)}
        <span className="mx-1 text-gray-700">|</span>
        {(['sm','md','lg'] as const).map(s => <button key={s} onClick={() => onUpdate({ size: s })} className={`px-2 py-0.5 rounded ${block.size === s ? 'bg-gray-600 text-white' : 'text-gray-500'}`}>{s}</button>)}
        <span className="mx-1 text-gray-700">|</span>
        {(['left','center','right'] as const).map(a => <button key={a} onClick={() => onUpdate({ align: a })} className={`px-2 py-0.5 rounded ${block.align === a ? 'bg-gray-600 text-white' : 'text-gray-500'}`}>{a}</button>)}
      </div>
    </div>
  );
}
