import { useState, useCallback } from 'react';
import { X, Globe, Plus, Trash2, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import type { Guide, Section, Block } from '../../types';
import { translate, type ProviderKey } from '../../providers/translation';

// ── Common languages ──────────────────────────────────────────────────────────

const COMMON_LANGS = [
  { code: 'en', name: 'English',    dir: 'ltr' as const, flag: '🇺🇸' },
  { code: 'ar', name: 'العربية',    dir: 'rtl' as const, flag: '🇸🇦' },
  { code: 'fr', name: 'Français',   dir: 'ltr' as const, flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch',    dir: 'ltr' as const, flag: '🇩🇪' },
  { code: 'es', name: 'Español',    dir: 'ltr' as const, flag: '🇪🇸' },
  { code: 'it', name: 'Italiano',   dir: 'ltr' as const, flag: '🇮🇹' },
  { code: 'pt', name: 'Português',  dir: 'ltr' as const, flag: '🇵🇹' },
  { code: 'ru', name: 'Русский',    dir: 'ltr' as const, flag: '🇷🇺' },
  { code: 'zh', name: '中文',       dir: 'ltr' as const, flag: '🇨🇳' },
  { code: 'ja', name: '日本語',     dir: 'ltr' as const, flag: '🇯🇵' },
  { code: 'ko', name: '한국어',     dir: 'ltr' as const, flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe',    dir: 'ltr' as const, flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', dir: 'ltr' as const, flag: '🇳🇱' },
  { code: 'pl', name: 'Polski',     dir: 'ltr' as const, flag: '🇵🇱' },
  { code: 'hi', name: 'हिन्दी',    dir: 'ltr' as const, flag: '🇮🇳' },
  { code: 'fa', name: 'فارسی',     dir: 'rtl' as const, flag: '🇮🇷' },
  { code: 'ur', name: 'اردو',      dir: 'rtl' as const, flag: '🇵🇰' },
  { code: 'he', name: 'עברית',     dir: 'rtl' as const, flag: '🇮🇱' },
];

// ── Provider configuration stored in localStorage ─────────────────────────────

const KEYS_STORAGE = 'docmaker_provider_keys';

function loadKeys(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(KEYS_STORAGE) ?? '{}') as Record<string, string>; } catch { return {}; }
}
function saveKeys(keys: Record<string, string>) {
  localStorage.setItem(KEYS_STORAGE, JSON.stringify(keys));
}

// ── Extract translatable strings from a block ────────────────────────────────

function extractBlockStrings(block: Block): string[] {
  const b = block as unknown as Record<string, unknown>;
  const strings: string[] = [];
  const pick = (keys: string[]) => keys.forEach(k => { if (typeof b[k] === 'string' && (b[k] as string).trim()) strings.push(b[k] as string); });

  switch (block.type) {
    case 'text':       pick(['content']); break;
    case 'highlight':  pick(['title', 'content']); break;
    case 'quote':      pick(['content', 'author', 'source']); break;
    case 'alert':      pick(['title', 'content']); break;
    case 'code':       pick(['filename']); break; // don't translate code
    case 'button':     pick(['label']); break;
    case 'divider':    pick(['label']); break;
    case 'image':      pick(['alt', 'caption']); break;
    case 'video':      pick(['caption']); break;
    case 'logo':       pick(['alt']); break;
    case 'embed':      pick(['title']); break;
    case 'image-text': pick(['title', 'content', 'alt']); break;
    case 'compare':    {
      pick(['leftTitle', 'rightTitle']);
      const left = b['leftItems'] as string[] ?? [];
      const right = b['rightItems'] as string[] ?? [];
      strings.push(...left.filter(s => s?.trim()), ...right.filter(s => s?.trim()));
      break;
    }
    case 'steps': {
      const steps = b['steps'] as { title: string; description: string }[] ?? [];
      steps.forEach(s => { if (s.title) strings.push(s.title); if (s.description) strings.push(s.description); });
      break;
    }
    case 'faq': {
      const items = b['items'] as { question: string; answer: string }[] ?? [];
      items.forEach(i => { if (i.question) strings.push(i.question); if (i.answer) strings.push(i.answer); });
      break;
    }
    case 'cards': {
      const cards = b['cards'] as { title: string; description: string }[] ?? [];
      cards.forEach(c => { if (c.title) strings.push(c.title); if (c.description) strings.push(c.description); });
      break;
    }
    case 'table': {
      const headers = b['headers'] as string[] ?? [];
      const rows = b['rows'] as string[][] ?? [];
      strings.push(...headers.filter(h => h?.trim()));
      rows.forEach(r => strings.push(...r.filter(c => c?.trim())));
      break;
    }
    case 'flow': {
      const steps = b['steps'] as { label: string }[] ?? [];
      steps.forEach(s => { if (s.label) strings.push(s.label); });
      break;
    }
    case 'timeline': {
      const items = b['items'] as { date: string; title: string; description: string }[] ?? [];
      items.forEach(i => { if (i.title) strings.push(i.title); if (i.description) strings.push(i.description); });
      break;
    }
    case 'stats': {
      const items = b['items'] as { value: string; label: string; prefix?: string; suffix?: string }[] ?? [];
      items.forEach(i => { if (i.label) strings.push(i.label); });
      break;
    }
    case 'checklist': {
      const items = b['items'] as { label: string }[] ?? [];
      items.forEach(i => { if (i.label) strings.push(i.label); });
      break;
    }
    case 'accordion': {
      const items = b['items'] as { title: string; content: string }[] ?? [];
      items.forEach(i => { if (i.title) strings.push(i.title); if (i.content) strings.push(i.content); });
      break;
    }
    case 'rating': pick(['label']); break;
    case 'gallery': {
      const images = b['images'] as { alt?: string; caption?: string }[] ?? [];
      images.forEach(i => { if (i.alt) strings.push(i.alt); if (i.caption) strings.push(i.caption); });
      break;
    }
  }
  return strings;
}

// ── Rebuild a block with translated strings ───────────────────────────────────

function applyTranslationsToBlock(block: Block, translations: string[]): Block {
  const b = { ...block } as Record<string, unknown>;
  let idx = 0;
  const next = () => translations[idx++] ?? '';

  switch (block.type) {
    case 'text':       b['content'] = next(); break;
    case 'highlight':  b['title'] = next(); b['content'] = next(); break;
    case 'quote':      b['content'] = next(); b['author'] = next(); if (block.source) b['source'] = next(); break;
    case 'alert':      b['title'] = next(); b['content'] = next(); break;
    case 'code':       if (block.filename) b['filename'] = next(); break;
    case 'button':     b['label'] = next(); break;
    case 'divider':    if (block.label) b['label'] = next(); break;
    case 'image':      b['alt'] = next(); if (block.caption) b['caption'] = next(); break;
    case 'video':      if (block.caption) b['caption'] = next(); break;
    case 'logo':       b['alt'] = next(); break;
    case 'embed':      b['title'] = next(); break;
    case 'image-text': b['title'] = next(); b['content'] = next(); b['alt'] = next(); break;
    case 'compare': {
      b['leftTitle'] = next(); b['rightTitle'] = next();
      const left = block.leftItems.map(() => next());
      const right = block.rightItems.map(() => next());
      b['leftItems'] = left; b['rightItems'] = right;
      break;
    }
    case 'steps': {
      b['steps'] = block.steps.map(s => ({ ...s, title: next(), description: s.description ? next() : s.description }));
      break;
    }
    case 'faq': {
      b['items'] = block.items.map(i => ({ ...i, question: next(), answer: next() }));
      break;
    }
    case 'cards': {
      b['cards'] = block.cards.map(c => ({ ...c, title: next(), description: next() }));
      break;
    }
    case 'table': {
      b['headers'] = block.headers.map(() => next());
      b['rows'] = block.rows.map(r => r.map(() => next()));
      break;
    }
    case 'flow': {
      b['steps'] = block.steps.map(s => ({ ...s, label: next() }));
      break;
    }
    case 'timeline': {
      b['items'] = block.items.map(i => ({ ...i, title: next(), description: i.description ? next() : i.description }));
      break;
    }
    case 'stats': {
      b['items'] = block.items.map(i => ({ ...i, label: next() }));
      break;
    }
    case 'checklist': {
      b['items'] = block.items.map(i => ({ ...i, label: next() }));
      break;
    }
    case 'accordion': {
      b['items'] = block.items.map(i => ({ ...i, title: next(), content: next() }));
      break;
    }
    case 'rating': b['label'] = next(); break;
    case 'gallery': {
      b['images'] = block.images.map(i => ({ ...i, alt: i.alt ? next() : i.alt, caption: i.caption ? next() : i.caption }));
      break;
    }
  }
  return b as unknown as Block;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type TranslateStatus = 'idle' | 'loading' | 'done' | 'error';

interface SectionStatus {
  status: TranslateStatus;
  error?: string;
}

interface Props {
  guide: Guide;
  onClose(): void;
  onUpdateGuide(patch: Partial<Pick<Guide, 'sections' | 'availableLangs'>>): void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TranslationPanel({ guide, onClose, onUpdateGuide }: Props) {
  const [keys, setKeys] = useState<Record<string, string>>(loadKeys);
  const [provider, setProvider] = useState<ProviderKey>('gemini');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [targetLang, setTargetLang] = useState<string>(() => {
    const nonDefault = guide.availableLangs.find(l => l.code !== guide.defaultLang);
    return nonDefault?.code ?? (COMMON_LANGS.find(l => l.code !== guide.defaultLang)?.code ?? 'ar');
  });
  const [sectionStatus, setSectionStatus] = useState<Record<string, SectionStatus>>({});
  const [expandedLangAdd, setExpandedLangAdd] = useState(false);

  function updateKey(p: string, v: string) {
    const updated = { ...keys, [p]: v };
    setKeys(updated);
    saveKeys(updated);
  }

  // Add a language to the guide
  function addLang(code: string) {
    const meta = COMMON_LANGS.find(l => l.code === code);
    if (!meta || guide.availableLangs.some(l => l.code === code)) return;
    onUpdateGuide({ availableLangs: [...guide.availableLangs, meta] });
    setExpandedLangAdd(false);
  }

  // Remove a language (non-default)
  function removeLang(code: string) {
    if (code === guide.defaultLang) return;
    onUpdateGuide({ availableLangs: guide.availableLangs.filter(l => l.code !== code) });
  }

  // Translate a single section
  const translateSection = useCallback(async (section: Section) => {
    const apiKey = keys[provider] ?? '';
    if (!apiKey && provider !== 'custom') {
      setSectionStatus(s => ({ ...s, [section.id]: { status: 'error', error: 'No API key configured' } }));
      return;
    }
    setSectionStatus(s => ({ ...s, [section.id]: { status: 'loading' } }));

    try {
      // Gather all texts to translate
      const titleAndSubtitle = [section.title, section.subtitle ?? ''].filter(Boolean);
      const blockStrings: string[][] = section.blocks.map(b => extractBlockStrings(b));
      const allStrings = [...titleAndSubtitle, ...blockStrings.flat()];

      const translated = await translate(provider, {
        texts: allStrings,
        sourceLang: guide.defaultLang,
        targetLang,
        apiKey,
        customEndpoint: provider === 'custom' ? customEndpoint : undefined,
      });

      let idx = 0;
      const translatedTitle = translated[idx++] ?? section.title;
      const translatedSubtitle = section.subtitle ? (translated[idx++] ?? '') : '';
      const translatedBlocks = section.blocks.map((block, bi) => {
        const count = blockStrings[bi].length;
        const slice = translated.slice(idx, idx + count);
        idx += count;
        return count > 0 ? applyTranslationsToBlock(block, slice) : block;
      });

      // Save translation into section.translations[targetLang]
      const updatedSections = guide.sections.map(s => {
        if (s.id !== section.id) return s;
        return {
          ...s,
          translations: {
            ...s.translations,
            [targetLang]: {
              title:    translatedTitle,
              subtitle: translatedSubtitle || undefined,
              blocks:   translatedBlocks,
            },
          },
        };
      });
      onUpdateGuide({ sections: updatedSections });
      setSectionStatus(s => ({ ...s, [section.id]: { status: 'done' } }));
    } catch (err) {
      setSectionStatus(s => ({ ...s, [section.id]: { status: 'error', error: String(err) } }));
    }
  }, [guide, provider, targetLang, keys, customEndpoint, onUpdateGuide]);

  // Translate all sections
  async function translateAll() {
    for (const section of guide.sections) {
      await translateSection(section);
    }
  }

  const targetLangMeta = COMMON_LANGS.find(l => l.code === targetLang) ?? { flag: '🌐', name: targetLang, dir: 'ltr' };
  const availableCodes = new Set(guide.availableLangs.map(l => l.code));
  const notAdded = COMMON_LANGS.filter(l => !availableCodes.has(l.code));

  const PROVIDERS: { key: ProviderKey; label: string; placeholder: string }[] = [
    { key: 'gemini', label: 'Gemini (gemini-1.5-flash)', placeholder: 'AIza...' },
    { key: 'openai', label: 'OpenAI (gpt-4o-mini)',       placeholder: 'sk-...' },
    { key: 'deepl',  label: 'DeepL v2',                   placeholder: 'xxxxxxxx:fx or paid key' },
    { key: 'custom', label: 'Custom Endpoint',             placeholder: 'Bearer token or key' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Translation</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── Languages ─────────────────────────────────────────────── */}
          <section className="px-5 py-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Guide Languages</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {guide.availableLangs.map(l => (
                <div key={l.code} className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-full px-3 py-1.5">
                  <span>{l.flag}</span>
                  <span className="text-xs text-gray-300">{l.name}</span>
                  {l.code === guide.defaultLang && (
                    <span className="text-xs text-blue-400 font-semibold">default</span>
                  )}
                  {l.code !== guide.defaultLang && (
                    <button onClick={() => removeLang(l.code)} className="text-gray-600 hover:text-red-400 ml-0.5">
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setExpandedLangAdd(v => !v)}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-dashed border-blue-800 rounded-full px-3 py-1.5"
              >
                <Plus size={11} /> Add Language
              </button>
            </div>
            {expandedLangAdd && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {notAdded.map(l => (
                  <button
                    key={l.code}
                    onClick={() => addLang(l.code)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg px-2 py-1.5 transition-colors text-left"
                  >
                    <span>{l.flag}</span> {l.name}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ── Provider & API Key ─────────────────────────────────────── */}
          <section className="px-5 py-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Translation Provider</p>
            <div className="space-y-2">
              {PROVIDERS.map(p => (
                <div key={p.key}>
                  <label className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input type="radio" name="provider" value={p.key} checked={provider === p.key} onChange={() => setProvider(p.key)} className="accent-blue-500" />
                    <span className="text-xs text-gray-300">{p.label}</span>
                  </label>
                  {provider === p.key && (
                    <div className={`ml-5 space-y-1.5 ${p.key !== provider ? 'hidden' : ''}`}>
                      {p.key === 'custom' && (
                        <input
                          value={customEndpoint}
                          onChange={e => setCustomEndpoint(e.target.value)}
                          placeholder="https://your-api.example.com/translate"
                          className="w-full bg-gray-800 text-xs text-gray-300 rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
                        />
                      )}
                      <input
                        type="password"
                        value={keys[p.key] ?? ''}
                        onChange={e => updateKey(p.key, e.target.value)}
                        placeholder={p.placeholder}
                        className="w-full bg-gray-800 text-xs text-gray-300 font-mono rounded px-2 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-600">API key stored in localStorage only, never sent to our servers.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Target Language & Translate ───────────────────────────── */}
          <section className="px-5 py-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Translate To</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <select
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value)}
                  className="w-full bg-gray-800 text-sm text-gray-300 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  {COMMON_LANGS.filter(l => l.code !== guide.defaultLang).map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name} ({l.code})</option>
                  ))}
                </select>
              </div>
              {!guide.availableLangs.some(l => l.code === targetLang) && (
                <button
                  onClick={() => addLang(targetLang)}
                  className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800 rounded-lg px-3 py-2 whitespace-nowrap"
                >
                  + Add to guide
                </button>
              )}
            </div>

            <button
              onClick={translateAll}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl py-2.5 transition-colors"
            >
              <Globe size={15} />
              Translate All Sections → {targetLangMeta.flag} {targetLangMeta.name}
            </button>
          </section>

          {/* ── Section-by-section ────────────────────────────────────── */}
          <section className="px-5 py-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Sections</p>
            <div className="space-y-2">
              {guide.sections.map(section => {
                const st = sectionStatus[section.id];
                const hasTranslation = !!section.translations[targetLang];
                return (
                  <div key={section.id} className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">{section.title}</p>
                      <p className="text-xs text-gray-600">{section.blocks.length} blocks</p>
                    </div>
                    {hasTranslation && !st && (
                      <CheckCircle size={14} className="text-green-400 shrink-0" />
                    )}
                    {st?.status === 'loading' && <Loader size={14} className="text-blue-400 animate-spin shrink-0" />}
                    {st?.status === 'done'    && <CheckCircle size={14} className="text-green-400 shrink-0" />}
                    {st?.status === 'error'   && (
                      <span title={st.error}><AlertCircle size={14} className="text-red-400 shrink-0" /></span>
                    )}
                    <button
                      onClick={() => translateSection(section)}
                      disabled={st?.status === 'loading'}
                      className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800/50 rounded-lg px-2.5 py-1 shrink-0 disabled:opacity-50"
                    >
                      {hasTranslation ? 'Re-translate' : 'Translate'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
