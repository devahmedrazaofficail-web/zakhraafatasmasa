// مولّد الموقع: يبني كل الصفحات كـ HTML ثابت
const fs = require('fs');
const path = require('path');
const site = require('./site');
const { renderPage, flatFile, flatHref } = require('./tpl');

const ROOT = path.join(__dirname, '..');
const seen = new Set();

let pages = [];
for (const f of ['p-misc', 'p-games', 'p-social', 'p-fonts']) {
  const list = require('./' + f);
  if (!Array.isArray(list)) throw new Error(f + ' لم يُرجع مصفوفة');
  pages = pages.concat(list);
}

for (const p of pages) {
  if (!p.path || seen.has(p.path)) throw new Error('مسار مكرر أو فارغ: ' + p.path);
  seen.add(p.path);
  const file = path.join(ROOT, flatFile(p.path));
  fs.writeFileSync(file, renderPage(p), 'utf8');
  console.log('✓', flatFile(p.path));
}

// خريطة الموقع (تشمل الرئيسية اليدوية) — روابط مسطحة
const home = { loc: '/', priority: '1.0' };
const urls = [home]
  .concat(pages.map((p) => ({ loc: flatHref('/' + p.path + '/'), priority: p.path.includes('/') ? '0.7' : '0.8' })))
  .map(
    (u) =>
      `  <url>\n    <loc>${site.baseUrl}${u.loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join('\n');
fs.writeFileSync(
  path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8'
);

console.log('\nعدد الصفحات:', pages.length + 1);
