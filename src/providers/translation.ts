// ── Translation Providers ────────────────────────────────────────────────────
// Each provider translates an array of strings from sourceLang → targetLang.
// Returns the translated strings in the same order.

export interface TranslateOptions {
  texts: string[];
  sourceLang: string;
  targetLang: string;
  apiKey: string;
  customEndpoint?: string;
  customHeaders?: Record<string, string>;
}

// ── Gemini (gemini-1.5-flash) ─────────────────────────────────────────────────

export async function translateWithGemini(opts: TranslateOptions): Promise<string[]> {
  const { texts, sourceLang, targetLang, apiKey } = opts;
  if (!texts.length) return [];

  const prompt = [
    `Translate the following ${texts.length} text segment(s) from "${sourceLang}" to "${targetLang}".`,
    'Return ONLY a valid JSON array of translated strings, in the same order, with no extra explanation.',
    'Input:',
    JSON.stringify(texts),
  ].join('\n');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
  const data = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] };
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned) as string[];
}

// ── OpenAI (gpt-4o-mini) ──────────────────────────────────────────────────────

export async function translateWithOpenAI(opts: TranslateOptions): Promise<string[]> {
  const { texts, sourceLang, targetLang, apiKey } = opts;
  if (!texts.length) return [];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate from "${sourceLang}" to "${targetLang}". Return ONLY a valid JSON array of translated strings in the same order as input.`,
        },
        { role: 'user', content: JSON.stringify(texts) },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
  const data = await res.json() as { choices: { message: { content: string } }[] };
  const raw = data.choices?.[0]?.message?.content ?? '[]';
  const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned) as string[];
}

// ── DeepL (v2) ────────────────────────────────────────────────────────────────

export async function translateWithDeepL(opts: TranslateOptions): Promise<string[]> {
  const { texts, targetLang, apiKey } = opts;
  if (!texts.length) return [];

  // DeepL uses uppercase language codes (EN-US, DE, FR, AR, etc.)
  const dlTarget = targetLang.toUpperCase().replace('-', '_');

  const body = new URLSearchParams();
  texts.forEach(t => body.append('text', t));
  body.append('target_lang', dlTarget);

  // Free API uses api-free.deepl.com, paid uses api.deepl.com
  const base = apiKey.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
  const res = await fetch(`${base}/v2/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `DeepL-Auth-Key ${apiKey}` },
    body: body.toString(),
  });

  if (!res.ok) throw new Error(`DeepL API error ${res.status}: ${await res.text()}`);
  const data = await res.json() as { translations: { text: string }[] };
  return data.translations.map(t => t.text);
}

// ── Custom endpoint ────────────────────────────────────────────────────────────

export async function translateWithCustom(opts: TranslateOptions): Promise<string[]> {
  const { texts, sourceLang, targetLang, apiKey, customEndpoint, customHeaders } = opts;
  if (!texts.length || !customEndpoint) return texts;

  const res = await fetch(customEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...customHeaders,
    },
    body: JSON.stringify({ texts, sourceLang, targetLang }),
  });

  if (!res.ok) throw new Error(`Custom API error ${res.status}: ${await res.text()}`);
  const data = await res.json() as { translations: string[] } | string[];
  return Array.isArray(data) ? data : data.translations;
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

export type ProviderKey = 'gemini' | 'openai' | 'deepl' | 'custom';

export async function translate(provider: ProviderKey, opts: TranslateOptions): Promise<string[]> {
  switch (provider) {
    case 'gemini': return translateWithGemini(opts);
    case 'openai': return translateWithOpenAI(opts);
    case 'deepl':  return translateWithDeepL(opts);
    case 'custom': return translateWithCustom(opts);
  }
}
