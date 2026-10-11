// swap-domain.js — يستبدل الدومين والبريد المؤقتين بالقيم الحقيقية ثم يعيد البناء والضغط
// الاستخدام:
//   node swap-domain.js <domain> <email>
// مثال:
//   node swap-domain.js zakhrafa-asma.com salam@zakhrafa-asma.com
// ملاحظة: اكتب الدومين كما تريده أن يظهر (مع www أو بدونها).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const [domain, email] = process.argv.slice(2);

if (!domain || !email) {
  console.error('الاستخدام: node swap-domain.js <domain> <email>');
  process.exit(1);
}
if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(domain)) {
  console.error('الدومين غير صالح: ' + domain);
  process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('البريد غير صالح: ' + email);
  process.exit(1);
}

const NEW_BASE = 'https://' + domain;
let changed = [];

function patchFile(rel, replacements) {
  const file = path.join(ROOT, rel);
  let text = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const [from, to] of replacements) {
    const count = text.split(from).length - 1;
    if (count > 0) {
      text = text.split(from).join(to);
      n += count;
    }
  }
  if (n > 0) {
    fs.writeFileSync(file, text, 'utf8');
    changed.push(`${rel}: ${n} استبدال`);
  }
  return n;
}

// 1) baseUrl في مولّد الموقع (المصدر الوحيد للدومين في الصفحات المولّدة)
patchFile('_generator/site.js', [
  ["baseUrl: 'https://www.example.com'", `baseUrl: '${NEW_BASE}'`],
]);

// 2) صفحة اتصل بنا: بريد mailto الحقيقي + placeholder محايد + حذف ملاحظة الاستبدال
const miscFile = path.join(ROOT, '_generator', 'p-misc.js');
let misc = fs.readFileSync(miscFile, 'utf8');
misc = misc.split('mailto:hello@example.com').join('mailto:' + email);
misc = misc.split('placeholder="you@example.com"').join('placeholder="name@email.com"');
const tipboxLine = misc.split('\n').find((l) => l.includes('استبدل') && l.includes('hello@example.com') && l.includes('tipbox'));
if (tipboxLine) misc = misc.split(tipboxLine + '\n').join('');
fs.writeFileSync(miscFile, misc, 'utf8');
changed.push('_generator/p-misc.js: بريد + placeholder + حذف الملاحظة');

// 3) الصفحة الرئيسية اليدوية + robots.txt
patchFile('index.html', [['https://www.example.com', NEW_BASE]]);
patchFile('robots.txt', [['https://www.example.com', NEW_BASE]]);

// 4) إعادة بناء كل الصفحات وخريطة الموقع
console.log('— إعادة البناء…');
execSync('node build.js', { cwd: path.join(ROOT, '_generator'), stdio: 'inherit' });

// 5) تحقق: لا يبقى أي example.com في المخرجات (باستثناء هذا السكربت و README)
const leftovers = execSync(
  `grep -rl "example\\.com" --include="*.html" --include="*.xml" --include="*.txt" --exclude="swap-domain.js" . || true`,
  { cwd: ROOT, encoding: 'utf8' }
).trim().split('\n').filter((f) => f && !f.endsWith('README.md'));
if (leftovers.length > 0) {
  console.error('⚠️ ما زالت هناك إشارات إلى example.com في:');
  leftovers.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}

// 6) إعادة الضغط
console.log('— إعادة الضغط…');
execSync('zip -qr zakhrafa-names.zip zakhrafa-names', { cwd: path.dirname(ROOT), stdio: 'inherit' });

console.log('\n✓ تم بنجاح:');
changed.forEach((c) => console.log('  - ' + c));
console.log(`  - الدومين الجديد: ${NEW_BASE}`);
console.log(`  - البريد الجديد: ${email}`);
console.log('  - الملف المضغوط: ~/workspace/zakhrafa-names.zip');
