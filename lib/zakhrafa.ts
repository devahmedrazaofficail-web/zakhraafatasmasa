/* Name-decoration engine — runs entirely in the browser.
   Ported from the original assets/js/app.js (logic identical, typed).
   Latin: mapping through mathematical Unicode blocks.
   Arabic: tatweel + decorative tashkeel + symbol framing. */

import type { SymbolGroup } from './types';

/* ---------- helpers ---------- */
function buildRangeMap(
  srcStart: number,
  dstStart: number,
  len: number,
  exceptions?: Record<string, string>
): Record<string, string> {
  const m: Record<string, string> = {};
  for (let i = 0; i < len; i++) {
    const src = String.fromCodePoint(srcStart + i);
    m[src] = (exceptions && exceptions[src]) || String.fromCodePoint(dstStart + i);
  }
  return m;
}

function applyMap(text: string, map: Record<string, string>): string {
  let out = '';
  for (const ch of text) out += map[ch] || ch;
  return out;
}

const SCRIPT_CAPS_EXC: Record<string, string> = {
  B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
};
const SCRIPT_LOW_EXC: Record<string, string> = { e: 'ℯ', g: 'ℊ', o: 'ℴ' };
const FRAKTUR_CAPS_EXC: Record<string, string> = {
  C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ',
};
const DS_CAPS_EXC: Record<string, string> = {
  C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ',
};

/* ---------- Latin fonts ---------- */
export interface LatinFont {
  id: string;
  label: string;
  caps: number;
  low: number;
  dig: number | null;
  game?: boolean;
  capsExc?: Record<string, string>;
  lowExc?: Record<string, string>;
}

export const LATIN_FONTS: LatinFont[] = [
  { id: 'bold', label: 'عريض', caps: 0x1d400, low: 0x1d41a, dig: 0x1d7ce, game: true },
  { id: 'italic', label: 'مائل', caps: 0x1d434, low: 0x1d44e, dig: null },
  { id: 'bolditalic', label: 'عريض مائل', caps: 0x1d468, low: 0x1d482, dig: null },
  { id: 'script', label: 'مخطوط أنيق', caps: 0x1d4d0, low: 0x1d4ea, dig: null, capsExc: SCRIPT_CAPS_EXC, lowExc: SCRIPT_LOW_EXC },
  { id: 'fraktur', label: 'قوطي', caps: 0x1d504, low: 0x1d51e, dig: null, capsExc: FRAKTUR_CAPS_EXC },
  { id: 'doublestruck', label: 'مزدوج الخط', caps: 0x1d538, low: 0x1d552, dig: 0x1d7d8, capsExc: DS_CAPS_EXC },
  { id: 'fullwidth', label: 'متباعد عريض', caps: 0xff21, low: 0xff41, dig: 0xff10, game: true },
  { id: 'mono', label: 'آلة كاتبة', caps: 0x1d670, low: 0x1d68a, dig: 0x1d7f6 },
];

const CIRCLED_DIGITS: Record<string, string> = {
  '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④',
  '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
};

const SMALLCAPS: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', r: 'ʀ',
  t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', y: 'ʏ', z: 'ᴢ',
};

const UPSIDE: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
  j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
  s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'ᗺ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'ℱ', G: '⅁', H: 'H',
  I: 'I', J: 'ᒿ', K: 'ʞ', L: '⅂', M: 'W', N: 'N', O: 'O', P: 'Ԁ',
  Q: 'Ό', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X',
  Y: '⅄', Z: 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
  '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', ' ': ' ',
};

export function latinFontTransform(font: LatinFont): (t: string) => string {
  const map: Record<string, string> = {};
  Object.assign(map, buildRangeMap(0x41, font.caps, 26, font.capsExc));
  Object.assign(map, buildRangeMap(0x61, font.low, 26, font.lowExc));
  if (font.dig) Object.assign(map, buildRangeMap(0x30, font.dig, 10));
  return (t: string) => applyMap(t, map);
}

export function circledTransform(t: string): string {
  const map: Record<string, string> = {};
  Object.assign(map, buildRangeMap(0x41, 0x24b6, 26));
  Object.assign(map, buildRangeMap(0x61, 0x24d0, 26));
  Object.assign(map, CIRCLED_DIGITS);
  return applyMap(t, map);
}

export function smallcapsTransform(t: string): string {
  let out = '';
  for (const ch of t.toLowerCase()) out += SMALLCAPS[ch] || ch;
  return out;
}

export function upsideTransform(t: string): string {
  let out = '';
  let changed = false;
  for (const ch of t) {
    const m = UPSIDE[ch] || UPSIDE[ch.toLowerCase()];
    if (m && m !== ch) changed = true;
    out += m || ch;
  }
  if (!changed) return t;
  return out.split('').reverse().join('');
}

/* ---------- Arabic styles ---------- */
const TATWEEL = 'ـ';

export function tatweelTransform(t: string): string {
  return t
    .split('')
    .map((ch) => (/\s/.test(ch) ? ch : ch + TATWEEL))
    .join('')
    .replace(new RegExp(TATWEEL + '$'), '');
}

export function tatweel2Transform(t: string): string {
  return t
    .split('')
    .map((ch) => (/\s/.test(ch) ? ch : ch + TATWEEL + TATWEEL))
    .join('')
    .replace(new RegExp(TATWEEL + TATWEEL + '$'), '');
}

const TASHKEEL_MARKS = ['ُ', 'َ', 'ِ', 'ّ', 'ً', 'ٌ'];

export function tashkeelTransform(t: string): string {
  let i = 0;
  let out = '';
  for (const ch of t) {
    if (/\s/.test(ch)) {
      out += ch;
      continue;
    }
    out += ch + TASHKEEL_MARKS[i % TASHKEEL_MARKS.length];
    i++;
  }
  return out;
}

const ULYA_MARKS = ['ٰ', 'ٖ', 'ٗ'];

export function ulyaTransform(t: string): string {
  let i = 0;
  let out = '';
  for (const ch of t) {
    if (/\s/.test(ch)) {
      out += ch;
      continue;
    }
    out += ch + ULYA_MARKS[i % ULYA_MARKS.length];
    i++;
  }
  return out;
}

/* ---------- frames & symbols (work for Arabic and Latin) ---------- */
interface Frame {
  label: string;
  open: string;
  close: string;
  game?: boolean;
}

const FRAMES: Frame[] = [
  { label: 'إطار النجوم', open: '✦ ', close: ' ✦' },
  { label: 'إطار ملكي', open: '♔ ', close: ' ♔' },
  { label: 'إطار ياباني', open: '『 ', close: ' 』', game: true },
  { label: 'إطار القوس', open: '༺ ', close: ' ༻' },
  { label: 'إطار التنين', open: '꧁ ', close: ' ꧂' },
  { label: 'إطار الماس', open: '❖ ', close: ' ❖' },
  { label: 'إطار اللمعان', open: '⋆ ', close: ' ⋆' },
  { label: 'إطار الفخامة', open: '☬ ', close: ' ☬' },
  { label: 'إطار الأسهم', open: '➶ ', close: ' ➷' },
  { label: 'إطار الزهرة', open: '❁ ', close: ' ❁' },
  { label: 'إطار النجمة البسيطة', open: '★ ', close: ' ★', game: true },
  { label: 'إطار النقاط', open: '• ', close: ' •', game: true },
];

/* ---------- all styles combined ---------- */
export type StyleLang = 'ar' | 'en' | 'both';

export interface DecoStyle {
  id: string;
  label: string;
  lang: StyleLang;
  game?: boolean;
  /** adds marks that change the letters' searchability */
  alters?: boolean;
  fn: (t: string) => string;
}

export const STYLES: DecoStyle[] = [];

for (const f of LATIN_FONTS) {
  STYLES.push({ id: 'lat-' + f.id, label: f.label, lang: 'en', game: !!f.game, fn: latinFontTransform(f) });
}
STYLES.push({ id: 'lat-circled', label: 'داخل دوائر', lang: 'en', game: true, fn: circledTransform });
STYLES.push({ id: 'lat-smallcaps', label: 'أحرف صغيرة أنيقة', lang: 'en', fn: smallcapsTransform });
STYLES.push({ id: 'lat-upside', label: 'مقلوب مرح', lang: 'en', fn: upsideTransform });

STYLES.push({ id: 'ar-tatweel', label: 'تطويل', lang: 'ar', game: true, fn: tatweelTransform });
STYLES.push({ id: 'ar-tatweel2', label: 'تطويل مضاعف', lang: 'ar', fn: tatweel2Transform });
STYLES.push({ id: 'ar-tashkeel', label: 'تشكيل زخرفي', lang: 'ar', alters: true, fn: tashkeelTransform });
STYLES.push({ id: 'ar-ulya', label: 'علامات علوية', lang: 'ar', alters: true, fn: ulyaTransform });

FRAMES.forEach((fr, i) => {
  STYLES.push({
    id: 'fr-' + i,
    label: fr.label,
    lang: 'both',
    game: !!fr.game,
    fn: (t: string) => fr.open + t + fr.close,
  });
});

/* ---------- language detection ---------- */
export type DetectedLang = 'ar' | 'en' | 'none';

export function detectLang(t: string): DetectedLang {
  const s = t.trim();
  if (!s) return 'none';
  if (/[؀-ۿ]/.test(s)) return 'ar';
  return 'en';
}

/* ---------- single-font converter (font pages + username generator) ---------- */
const FONTS_BY_ID: Record<string, (t: string) => string> = {};
for (const f of LATIN_FONTS) FONTS_BY_ID[f.id] = latinFontTransform(f);
FONTS_BY_ID.circled = circledTransform;
FONTS_BY_ID.smallcaps = smallcapsTransform;
FONTS_BY_ID.upside = upsideTransform;

export const fontIds = Object.keys(FONTS_BY_ID);

export function convertFont(id: string, text: string): string {
  const fn = FONTS_BY_ID[id];
  return fn ? fn(text || '') : text || '';
}

/* ---------- symbol library ---------- */
export const SYMBOL_GROUPS: SymbolGroup[] = [
  { title: 'نجوم', symbols: ['★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '❂', '✶', '✷', '⋆', '✵'] },
  { title: 'قلوب وزخارف', symbols: ['♥', '♡', '❥', '❣', '💙', '✿', '❀', '❁', '❃', '✾', '☘', '❄'] },
  { title: 'تيجان وسيوف', symbols: ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟', '⚔', '🗡'] },
  { title: 'أسهم', symbols: ['➳', '➶', '➷', '➹', '➢', '➤', '→', '←', '↔', '↗', '↘', '➪', '➫'] },
  { title: 'إطارات', symbols: ['『', '』', '', '「', '」', '༺', '༻', '꧁', '꧂', '《', '》', '〖', '〗'] },
  { title: 'رموز متنوعة', symbols: ['☯', '☮', '☪', '⚜', '❖', '⬥', '⬧', '◈', '◇', '◆', '☬', '꧂', 'ツ', 'ッ'] },
];

/* ---------- invisible characters ---------- */
export interface InvisibleChar {
  label: string;
  char: string;
}

export const INVISIBLE: InvisibleChar[] = [
  { label: 'مسافة مخفية (تعمل في معظم الألعاب)', char: 'ㅤ' },
  { label: 'مسافة برايل الفارغة', char: '⠀' },
  { label: 'مسافة صفرية العرض', char: '​' },
];

/* ---------- username generator ---------- */
export interface UsernameSuggestion {
  label: string;
  text: string;
}

export function genUsernames(base: string): UsernameSuggestion[] {
  const b = (base || '').trim().replace(/\s+/g, '_');
  if (!b) return [];
  const out: UsernameSuggestion[] = [];
  const nums = ['07', '24', '99', '007', '123', '01', '77', '2024'];
  const wraps: [string, string][] = [
    ['乂', '乂'], ['•', '•'], ['★', '★'], ['『', '』'], ['_', '_'], ['༺', '༻'],
  ];
  const pre = ['itx_', 'ii_', 'x_', 'tv_'];
  const fonts = ['bold', 'circled', 'fullwidth', 'smallcaps', 'mono'];

  for (const fid of fonts) {
    const t = convertFont(fid, b);
    if (t !== b) out.push({ label: 'بخط مزخرف', text: t });
  }
  for (const n of nums.slice(0, 4)) {
    out.push({ label: 'مع رقم', text: b + n });
    out.push({ label: 'مع رقم', text: b + '_' + n });
  }
  for (const w of wraps) out.push({ label: 'بإطار', text: w[0] + b + w[1] });
  for (const p of pre) out.push({ label: 'ببادئة', text: p + b });
  out.push({ label: 'للمنصات', text: b + '_official' });
  out.push({ label: 'للمنصات', text: 'the_' + b });

  const seen: Record<string, boolean> = {};
  return out
    .filter((o) => {
      if (seen[o.text]) return false;
      seen[o.text] = true;
      return true;
    })
    .slice(0, 20);
}

export const RANDOM_WORDS = [
  'sniper', 'shadow', 'wolf', 'king', 'ghost',
  'storm', 'falcon', 'zero', 'legend', 'hunter',
];

/* ---------- clipboard + toast helpers (client-side) ---------- */
export function copyText(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  }
  fallbackCopy(text);
  return Promise.resolve();
}

function fallbackCopy(text: string): void {
  if (typeof document === 'undefined') return;
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } catch {
    /* noop */
  }
  document.body.removeChild(ta);
}
