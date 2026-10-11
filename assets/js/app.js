'use strict';

/* ============================================================
محرك زخرفة الأسماء — يعمل بالكامل داخل المتصفح
Latin: تحويل عبر كتل يونيكود الرياضية
Arabic: تطويل + تشكيل زخرفي + تأطير بالرموز
============================================================ */

/* ---------- أدوات مساعدة ---------- */
function buildRangeMap(srcStart, dstStart, len, exceptions) {
var m = {};
for (var i = 0; i < len; i++) {
var src = String.fromCodePoint(srcStart + i);
m[src] = (exceptions && exceptions[src]) || String.fromCodePoint(dstStart + i);
}
return m;
}

function applyMap(text, map) {
var out = '';
for (var ch of text) out += map[ch] || ch;
return out;
}

var SCRIPT_CAPS_EXC = { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ'};
var SCRIPT_LOW_EXC = { e: 'ℯ', g: 'ℊ', o: 'ℴ'};
var FRAKTUR_CAPS_EXC = { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ'};
var DS_CAPS_EXC = { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ'};

/* ---------- خطوط لاتينية ---------- */
var LATIN_FONTS = [
{ id: 'bold', label: 'عريض', caps: 0x1D400, low: 0x1D41A, dig: 0x1D7CE, game: true},
{ id: 'italic', label: 'مائل', caps: 0x1D434, low: 0x1D44E, dig: null},
{ id: 'bolditalic', label: 'عريض مائل', caps: 0x1D468, low: 0x1D482, dig: null},
{ id: 'script', label: 'مخطوط أنيق', caps: 0x1D4D0, low: 0x1D4EA, dig: null, capsExc: SCRIPT_CAPS_EXC, lowExc: SCRIPT_LOW_EXC},
{ id: 'fraktur', label: 'قوطي', caps: 0x1D504, low: 0x1D51E, dig: null, capsExc: FRAKTUR_CAPS_EXC},
{ id: 'doublestruck', label: 'مزدوج الخط', caps: 0x1D538, low: 0x1D552, dig: 0x1D7D8, capsExc: DS_CAPS_EXC},
{ id: 'fullwidth', label: 'متباعد عريض', caps: 0xFF21, low: 0xFF41, dig: 0xFF10, game: true},
{ id: 'mono', label: 'آلة كاتبة', caps: 0x1D670, low: 0x1D68A, dig: 0x1D7F6}
];

var CIRCLED_DIGITS = { '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'};

var SMALLCAPS = {
a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', r: 'ʀ',
t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', y: 'ʏ', z: 'ᴢ'
};

var UPSIDE = {
a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
A: '∀', B: 'ᗺ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'ℱ', G: '⅁', H: 'H',
I: 'I', J: 'ᒿ', K: 'ʞ', L: '⅂', M: 'W', N: 'N', O: 'O', P: 'Ԁ',
Q: 'Ό', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X',
Y: '⅄', Z: 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
'5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', ' ': ' '
};

function latinFontTransform(font) {
var map = {};
Object.assign(map, buildRangeMap(0x41, font.caps, 26, font.capsExc));
Object.assign(map, buildRangeMap(0x61, font.low, 26, font.lowExc));
if (font.dig) Object.assign(map, buildRangeMap(0x30, font.dig, 10));
return function (t) { return applyMap(t, map);};
}

function circledTransform(t) {
var map = {};
Object.assign(map, buildRangeMap(0x41, 0x24B6, 26));
Object.assign(map, buildRangeMap(0x61, 0x24D0, 26));
Object.assign(map, CIRCLED_DIGITS);
return applyMap(t, map);
}

function smallcapsTransform(t) {
var out = '';
for (var ch of t.toLowerCase()) out += SMALLCAPS[ch] || ch;
return out;
}

function upsideTransform(t) {
var out = '', changed = false;
for (var ch of t) {
var m = UPSIDE[ch] || UPSIDE[ch.toLowerCase()];
if (m && m !== ch) changed = true;
out += m || ch;
}
if (!changed) return t;
return out.split('').reverse().join('');
}

/* ---------- أنماط عربية ---------- */
var TATWEEL = 'ـ';
function arabicLettersOnly(t) { return t.replace(/\s+/g, '');}

function tatweelTransform(t) {
return t.split('').map(function (ch) {
return /\s/.test(ch)? ch: ch + TATWEEL;
}).join('').replace(new RegExp(TATWEEL + '$'), '');
}

function tatweel2Transform(t) {
return t.split('').map(function (ch) {
return /\s/.test(ch)? ch: ch + TATWEEL + TATWEEL;
}).join('').replace(new RegExp(TATWEEL + TATWEEL + '$'), '');
}

var TASHKEEL_MARKS = ['ُ', 'َ', 'ِ', 'ّ', 'ً', 'ٌ'];
function tashkeelTransform(t) {
var i = 0, out = '';
for (var ch of t) {
if (/\s/.test(ch)) { out += ch; continue;}
out += ch + TASHKEEL_MARKS[i % TASHKEEL_MARKS.length];
i++;
}
return out;
}

var ULYA_MARKS = ['ٰ', 'ٖ', 'ٗ'];
function ulyaTransform(t) {
var i = 0, out = '';
for (var ch of t) {
if (/\s/.test(ch)) { out += ch; continue;}
out += ch + ULYA_MARKS[i % ULYA_MARKS.length];
i++;
}
return out;
}

/* ---------- إطارات ورموز (تعمل مع العربي والإنجليزي) ---------- */
var FRAMES = [
{ label: 'إطار النجوم', open: '✦ ', close: ' ✦'},
{ label: 'إطار ملكي', open: '♔ ', close: ' ♔'},
{ label: 'إطار ياباني', open: '『 ', close: ' 』', game: true},
{ label: 'إطار القوس', open: '༺ ', close: ' ༻'},
{ label: 'إطار التنين', open: '꧁ ', close: ' ꧂'},
{ label: 'إطار الماس', open: '❖ ', close: ' ❖'},
{ label: 'إطار اللمعان', open: '⋆ ', close: ' ⋆'},
{ label: 'إطار الفخامة', open: '☬ ', close: ' ☬'},
{ label: 'إطار الأسهم', open: '➶ ', close: ' ➷'},
{ label: 'إطار الزهرة', open: '❁ ', close: ' ❁'},
{ label: 'إطار النجمة البسيطة', open: '★ ', close: ' ★', game: true},
{ label: 'إطار النقاط', open: '• ', close: ' •', game: true}
];

/* ---------- تجميع كل الأنماط ---------- */
var STYLES = [];

LATIN_FONTS.forEach(function (f) {
STYLES.push({ id: 'lat-' + f.id, label: f.label, lang: 'en', game:!!f.game, fn: latinFontTransform(f)});
});
STYLES.push({ id: 'lat-circled', label: 'داخل دوائر', lang: 'en', game: true, fn: circledTransform});
STYLES.push({ id: 'lat-smallcaps', label: 'أحرف صغيرة أنيقة', lang: 'en', fn: smallcapsTransform});
STYLES.push({ id: 'lat-upside', label: 'مقلوب مرح', lang: 'en', fn: upsideTransform});

STYLES.push({ id: 'ar-tatweel', label: 'تطويل', lang: 'ar', game: true, fn: tatweelTransform});
STYLES.push({ id: 'ar-tatweel2', label: 'تطويل مضاعف', lang: 'ar', fn: tatweel2Transform});
STYLES.push({ id: 'ar-tashkeel', label: 'تشكيل زخرفي', lang: 'ar', alters: true, fn: tashkeelTransform});
STYLES.push({ id: 'ar-ulya', label: 'علامات علوية', lang: 'ar', alters: true, fn: ulyaTransform});

FRAMES.forEach(function (fr, i) {
STYLES.push({
id: 'fr-' + i, label: fr.label, lang: 'both', game:!!fr.game,
fn: function (t) { return fr.open + t + fr.close;}
});
});

/* كشف اللغة */
function detectLang(t) {
var s = t.trim();
if (!s) return 'none';
if (/[\u0600-\u06FF]/.test(s)) return 'ar';
return 'en';
}

/* ---------- واجهة المولد ---------- */
var nameInput, resultsGrid, styleCount, filterBar, copyAllBtn;
var currentFilter = 'all';
var lastResults = [];

function styleMatchesFilter(st, lang) {
if (currentFilter === 'game' &&!st.game) return false;
if (currentFilter === 'ar' &&!(st.lang === 'ar' || st.lang === 'both')) return false;
if (currentFilter === 'en' &&!(st.lang === 'en' || st.lang === 'both')) return false;
return true;
}

function renderResults() {
var raw = nameInput.value;
var text = raw.trim();
var lang = detectLang(raw);
resultsGrid.innerHTML = '';
lastResults = [];

if (!text) {
resultsGrid.innerHTML = '<div class="empty-hint">اكتب اسمك في الحقل بالأعلى لتظهر لك عشرات الأنماط المزخرفة هنا فوراً.</div>';
styleCount.textContent = '0 نمط';
copyAllBtn.disabled = true;
return;
}

var shown = 0;
STYLES.forEach(function (st) {
if (!styleMatchesFilter(st, lang)) return;
var out;
try { out = st.fn(text);} catch (e) { return;}
if (!out || out === text && st.lang!== 'both' && st.lang!== lang) return;
lastResults.push({ label: st.label, text: out});
shown++;

var card = document.createElement('div');
card.className = 'style-card';
card.innerHTML =
'<div class="style-meta"><span class="style-name"></span>' +
(st.alters? '<span class="badge-alters" title="هذا النمط يضيف علامات تغيّر شكل الحروف، فقد لا يظهر اسمك عند البحث عنه">يغيّر الحروف</span>': '') +
(st.game? '<span class="badge-game" title="نمط بسيط وقليل الرموز، مناسب لأسماء الألعاب">للألعاب</span>': '') +
'</div>' +
'<div class="style-out" dir="auto"></div>' +
'<button class="copy-btn" type="button">نسخ</button>';
card.querySelector('.style-name').textContent = st.label;
card.querySelector('.style-out').textContent = out;
(function (txt, btn) {
btn.addEventListener('click', function () { copyText(txt, btn);});
})(out, card.querySelector('.copy-btn'));
resultsGrid.appendChild(card);
});

styleCount.textContent = shown + ' نمط';
copyAllBtn.disabled = shown === 0;
if (shown === 0) {
resultsGrid.innerHTML = '<div class="empty-hint">لا توجد أنماط مطابقة لهذا الفلتر، جرّب فلتراً آخر.</div>';
}
}

function copyText(text, btn) {
function done() {
showToast('تم نسخ الاسم المزخرف');
if (btn) {
var old = btn.textContent;
btn.textContent = 'تم ✓';
btn.classList.add('copied');
setTimeout(function () { btn.textContent = old; btn.classList.remove('copied');}, 1200);
}
}
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done();});
} else { fallbackCopy(text); done();}
}

function fallbackCopy(text) {
var ta = document.createElement('textarea');
ta.value = text;
ta.style.position = 'fixed';
ta.style.opacity = '0';
document.body.appendChild(ta);
ta.select();
try { document.execCommand('copy');} catch (e) {}
document.body.removeChild(ta);
}

function showToast(msg) {
var t = document.getElementById('toast');
t.textContent = msg;
t.classList.add('show');
clearTimeout(t._h);
t._h = setTimeout(function () { t.classList.remove('show');}, 1600);
}

/* ---------- مكتبة الرموز ---------- */
var SYMBOL_GROUPS = [
{ title: 'نجوم', symbols: ['★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '❂', '✶', '✷', '⋆', '✵']},
{ title: 'قلوب وزخارف', symbols: ['♥', '♡', '❥', '❣', '💙', '✿', '❀', '❁', '❃', '✾', '☘', '❄']},
{ title: 'تيجان وسيوف', symbols: ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟', '⚔', '🗡']},
{ title: 'أسهم', symbols: ['➳', '➶', '➷', '➹', '➢', '➤', '→', '←', '↔', '↗', '↘', '➪', '➫']},
{ title: 'إطارات', symbols: ['『', '』', '', '「', '」', '༺', '༻', '꧁', '꧂', '《', '》', '〖', '〗']},
{ title: 'رموز متنوعة', symbols: ['☯', '☮', '☪', '⚜', '❖', '⬥', '⬧', '◈', '◇', '◆', '☬', '꧂', 'ツ', 'ッ']}
];

function renderSymbols() {
var wrap = document.getElementById('symbolsWrap');
SYMBOL_GROUPS.forEach(function (g) {
var box = document.createElement('div');
box.className = 'symbol-group';
var h = document.createElement('h3');
h.textContent = g.title;
box.appendChild(h);
var grid = document.createElement('div');
grid.className = 'symbol-grid';
g.symbols.forEach(function (s) {
var b = document.createElement('button');
b.type = 'button';
b.className = 'symbol-btn';
b.textContent = s;
b.title = 'انسخ ' + s;
b.addEventListener('click', function () { copyText(s, null);});
grid.appendChild(b);
});
box.appendChild(grid);
wrap.appendChild(box);
});
}

/* ---------- الأحرف المخفية ---------- */
var INVISIBLE = [
{ label: 'مسافة مخفية (تعمل في معظم الألعاب)', char: 'ㅤ'},
{ label: 'مسافة برايل الفارغة', char: '⠀'},
{ label: 'مسافة صفرية العرض', char: '​'}
];

function renderInvisible() {
var wrap = document.getElementById('invisibleWrap');
INVISIBLE.forEach(function (it) {
var b = document.createElement('button');
b.type = 'button';
b.className = 'invisible-btn';
b.innerHTML = '<span class="inv-label"></span><span class="inv-hint">اضغط للنسخ</span>';
b.querySelector('.inv-label').textContent = it.label;
b.addEventListener('click', function () { copyText(it.char, null);});
wrap.appendChild(b);
});
}

/* ---------- الأسئلة الشائعة (أكورديون) ---------- */
function initFaq() {
document.querySelectorAll('.faq-item').forEach(function (item) {
var q = item.querySelector('.faq-q');
q.addEventListener('click', function () {
var open = item.classList.contains('open');
document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open');});
if (!open) item.classList.add('open');
});
});
}

/* ---------- التنقل ---------- */
function initNav() {
var toggle = document.getElementById('navToggle');
var links = document.getElementById('navLinks');
toggle.addEventListener('click', function () {
var open = links.classList.toggle('open');
toggle.setAttribute('aria-expanded', open? 'true': 'false');
});
links.querySelectorAll('a').forEach(function (a) {
a.addEventListener('click', function () { links.classList.remove('open');});
});
}

/* ---------- تهيئة ---------- */
document.addEventListener('DOMContentLoaded', function () {
nameInput = document.getElementById('nameInput');
resultsGrid = document.getElementById('resultsGrid');
styleCount = document.getElementById('styleCount');
filterBar = document.getElementById('filterBar');
copyAllBtn = document.getElementById('copyAllBtn');

var timer = null;
nameInput.addEventListener('input', function () {
clearTimeout(timer);
timer = setTimeout(renderResults, 120);
});

filterBar.querySelectorAll('button').forEach(function (b) {
b.addEventListener('click', function () {
filterBar.querySelectorAll('button').forEach(function (x) { x.classList.remove('active');});
b.classList.add('active');
currentFilter = b.getAttribute('data-filter');
renderResults();
});
});

copyAllBtn.addEventListener('click', function () {
if (!lastResults.length) return;
var all = lastResults.map(function (r) { return r.label + ': ' + r.text;}).join('\n');
copyText(all, null);
});

renderSymbols();
renderInvisible();
initFaq();
initNav();
renderResults();
});

/* ============================================================
   إضافات صفحات الموقع متعدد الصفحات
   ============================================================ */

/* خريطة الخطوط اللاتينية للوصول إليها من صفحات الخطوط */
var FONTS_BY_ID = {};
LATIN_FONTS.forEach(function (f) { FONTS_BY_ID[f.id] = latinFontTransform(f); });
FONTS_BY_ID.circled = circledTransform;
FONTS_BY_ID.smallcaps = smallcapsTransform;
FONTS_BY_ID.upside = upsideTransform;

window.Zakhrafa = {
  font: function (id, text) {
    var fn = FONTS_BY_ID[id];
    return fn ? fn(text || '') : (text || '');
  },
  fontIds: Object.keys(FONTS_BY_ID),
  tatweel: tatweelTransform,
  copy: copyText
};

/* نسخ عام لأي زر يحمل data-copy (صفحات المجموعات وغيرها) */
document.addEventListener('click', function (e) {
  var b = e.target && e.target.closest ? e.target.closest('[data-copy]') : null;
  if (b) copyText(b.getAttribute('data-copy'), b);
});

/* ---------- محوّل الخط الواحد (صفحات /خطوط/) ---------- */
(function initFontConverter() {
  var box = document.getElementById('fontTool');
  if (!box) return;
  var fontId = box.getAttribute('data-font');
  var input = document.getElementById('fontInput');
  var output = document.getElementById('fontOutput');
  var copyBtn = document.getElementById('fontCopyBtn');
  function render() {
    var v = input.value;
    output.textContent = v.trim() ? window.Zakhrafa.font(fontId, v) : 'النتيجة ستظهر هنا…';
    output.classList.toggle('placeholder', !v.trim());
  }
  var t = null;
  input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(render, 100); });
  copyBtn.addEventListener('click', function () {
    if (input.value.trim()) copyText(output.textContent, copyBtn);
  });
  render();
})();

/* ---------- مولّد أسماء المستخدمين ---------- */
function genUsernames(base) {
  var b = (base || '').trim().replace(/\s+/g, '_');
  if (!b) return [];
  var out = [];
  var nums = ['07', '24', '99', '007', '123', '01', '77', '2024'];
  var wraps = [['乂', '乂'], ['•', '•'], ['★', '★'], ['『', '』'], ['_', '_'], ['༺', '༻']];
  var pre = ['itx_', 'ii_', 'x_', 'tv_'];
  var fonts = ['bold', 'circled', 'fullwidth', 'smallcaps', 'mono'];

  fonts.forEach(function (fid) {
    var t = window.Zakhrafa.font(fid, b);
    if (t !== b) out.push({ label: 'بخط مزخرف', text: t });
  });
  nums.slice(0, 4).forEach(function (n) {
    out.push({ label: 'مع رقم', text: b + n });
    out.push({ label: 'مع رقم', text: b + '_' + n });
  });
  wraps.forEach(function (w) { out.push({ label: 'بإطار', text: w[0] + b + w[1] }); });
  pre.forEach(function (p) { out.push({ label: 'ببادئة', text: p + b }); });
  out.push({ label: 'للمنصات', text: b + '_official' });
  out.push({ label: 'للمنصات', text: 'the_' + b });

  var seen = {};
  return out.filter(function (o) {
    if (seen[o.text]) return false;
    seen[o.text] = 1;
    return true;
  }).slice(0, 20);
}

(function initUsernameGen() {
  var input = document.getElementById('userBase');
  if (!input) return;
  var grid = document.getElementById('userResults');
  var randomBtn = document.getElementById('userRandom');
  var RANDOM_WORDS = ['sniper', 'shadow', 'wolf', 'king', 'ghost', 'storm', 'falcon', 'zero', 'legend', 'hunter'];

  function render() {
    var base = input.value.trim() || RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
    var list = genUsernames(base);
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = '<div class="empty-hint">اكتب كلمة الأساس لتوليد اقتراحات أسماء المستخدمين.</div>';
      return;
    }
    list.forEach(function (o) {
      var card = document.createElement('div');
      card.className = 'style-card';
      card.innerHTML = '<div class="style-meta"><span class="style-name"></span></div>' +
        '<div class="style-out" dir="auto"></div>' +
        '<button class="copy-btn" type="button">نسخ</button>';
      card.querySelector('.style-name').textContent = o.label;
      card.querySelector('.style-out').textContent = o.text;
      (function (txt, btn) {
        btn.addEventListener('click', function () { copyText(txt, btn); });
      })(o.text, card.querySelector('.copy-btn'));
      grid.appendChild(card);
    });
  }

  var t = null;
  input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(render, 150); });
  if (randomBtn) randomBtn.addEventListener('click', function () {
    input.value = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
    render();
    input.focus();
  });
  render();
})();
