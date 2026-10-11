// قالب الصفحة المشترك
const site = require('./site');
const h = require('./h');

/* تحويل المسار المجلدي إلى ملف مسطّح: 'العاب/ببجي' -> '/العاب-ببجي.html' */
function flatHref(href) {
  if (!href || href === '/') return '/';
  const p = href.replace(/^\/|\/$/g, '');
  return '/' + p.replace(/\//g, '-') + '.html';
}
function flatFile(path) {
  return path.replace(/\//g, '-') + '.html';
}

function head(page, rel) {
  const canonical = site.baseUrl + (page.path ? '/' + flatFile(page.path) : '/');
  const faqJson = page.faqs && page.faqs.length
    ? `<script type="application/ld+json">\n${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: 'ar',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q.replace(/<[^>]+>/g, ''),
          acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
        })),
      })}\n</script>`
    : '';
  const crumbs = (page.breadcrumb || []).map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: site.baseUrl + flatHref(c.href) } : {}),
  }));
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${h.esc(page.title)}</title>
<meta name="description" content="${h.esc(page.description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#0a0e17">
<link rel="icon" type="image/svg+xml" href="./assets/images/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="./assets/images/favicon-32.png">
<link rel="apple-touch-icon" href="./assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="ar_AR">
<meta property="og:title" content="${h.esc(page.title)}">
<meta property="og:description" content="${h.esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${h.esc(page.title)}">
<meta name="twitter:description" content="${h.esc(page.description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${rel}assets/css/style.css">
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: page.title,
  url: canonical,
  inLanguage: 'ar',
  description: page.description,
  breadcrumb: { '@type': 'BreadcrumbList', itemListElement: crumbs },
})}
</script>
${faqJson}
</head>`;
}

function header(rel) {
  const links = site.nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('\n');
  return `<body>
<header class="site-header">
<div class="container header-inner">
<a class="logo" href="/" aria-label="${site.brand} - الرئيسية"><span class="logo-mark">ز</span><span>${site.brand}</span></a>
<nav aria-label="التنقل الرئيسي">
<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="فتح القائمة">☰</button>
<ul class="nav-links" id="navLinks">
${links}
</ul>
</nav>
</div>
</header>
<main>`;
}

function breadcrumbHtml(items, rel) {
  const lis = items
    .map((c, i) => {
      const last = i === items.length - 1;
      if (last || !c.href) return `<li${last ? ' aria-current="page"' : ''}>${c.label}</li>`;
      return `<li><a href="${c.href}">${c.label}</a></li>`;
    })
    .join('\n');
  return `<nav class="breadcrumb" aria-label="مسار التنقل"><div class="container"><ol>\n${lis}\n</ol></div></nav>`;
}

function hero(page) {
  return `<section class="page-hero"><div class="container">
<span class="kicker">${page.kicker || site.brand}</span>
<h1>${page.h1}</h1>
<div class="intro">
${page.intro.map((p) => `<p>${p}</p>`).join('\n')}
</div>
</div></section>`;
}

function toolBlock(tool) {
  if (!tool) return '';
  if (tool.kind === 'decorator') {
    return `<section class="block" style="padding-top:0"><div class="container">
<div class="tool-card">
<div class="tool-input-row">
<input type="text" id="nameInput" placeholder="${tool.placeholder || 'اكتب اسمك هنا…'}" autocomplete="off" aria-label="اكتب اسمك لزخرفته">
<button class="btn-primary" id="copyAllBtn" type="button" disabled>نسخ كل الأنماط</button>
</div>
<div class="tool-meta">
<div class="filter-bar" id="filterBar" role="group" aria-label="تصفية الأنماط">
<button type="button" data-filter="all" class="${tool.defaultFilter === 'all' ? 'active' : ''}">الكل</button>
<button type="button" data-filter="ar" class="${tool.defaultFilter === 'ar' ? 'active' : ''}">عربي</button>
<button type="button" data-filter="en" class="${tool.defaultFilter === 'en' ? 'active' : ''}">إنجليزي</button>
<button type="button" data-filter="game" class="${tool.defaultFilter === 'game' ? 'active' : ''}">مناسب للألعاب</button>
</div>
<span id="styleCount">0 نمط</span>
</div>
<div class="results-grid" id="resultsGrid" aria-live="polite"></div>
<p class="tool-note">${tool.note || 'كل نمط أعلاه نص يونيكود حقيقي: انسخه والصقه مباشرة في اللعبة أو التطبيق دون أي برنامج إضافي.'}</p>
</div>
</div></section>`;
  }
  if (tool.kind === 'font') {
    return `<section class="block" style="padding-top:0"><div class="container">
<div class="tool-card" id="fontTool" data-font="${tool.fontId}">
<div class="tool-input-row">
<input type="text" id="fontInput" placeholder="اكتب النص هنا لتحويله…" autocomplete="off" aria-label="اكتب النص لتحويله">
<button class="btn-primary" id="fontCopyBtn" type="button">نسخ النتيجة</button>
</div>
<div class="font-output placeholder" id="fontOutput" dir="auto">النتيجة ستظهر هنا…</div>
<p class="tool-note">النتيجة نص يونيكود حقيقي يعمل في الألعاب والنبذات والمحادثات.</p>
</div>
</div></section>`;
  }
  if (tool.kind === 'username') {
    return `<section class="block" style="padding-top:0"><div class="container">
<div class="tool-card">
<div class="tool-input-row">
<input type="text" id="userBase" placeholder="اكتب كلمة الأساس… مثال: sniper" autocomplete="off" aria-label="كلمة الأساس لاسم المستخدم" dir="ltr" style="text-align:left">
<button class="btn-primary" id="userRandom" type="button">اقتراح عشوائي</button>
</div>
<div class="results-grid" id="userResults" aria-live="polite"></div>
<p class="tool-note">أسماء المستخدمين تقبل الحروف اللاتينية والأرقام والشرطة السفلية في معظم المنصات.</p>
</div>
</div></section>`;
  }
  if (tool.kind === 'symbols-static') {
    return `<section class="block" style="padding-top:0"><div class="container">
<div class="tool-card">
${h.symbolsStatic(tool.groups)}
<p class="tool-note">اضغط على أي رمز لنسخه فوراً ثم الصقه حول اسمك.</p>
</div>
</div></section>`;
  }
  if (tool.kind === 'invisible') {
    const items = [
      { label: 'حرف مخفي — يعمل في معظم الألعاب', char: 'ㅤ' },
      { label: 'مسافة برايل الفارغة', char: '⠀' },
      { label: 'مسافة صفرية العرض', char: '​' },
    ];
    return `<section class="block" style="padding-top:0"><div class="container">
<div class="tool-card">
<div class="invisible-wrap">
${items.map((it) => `<button type="button" class="invisible-btn" data-copy="${it.char}"><span class="inv-label">${it.label}</span><span class="inv-hint">اضغط للنسخ</span></button>`).join('\n')}
</div>
<p class="tool-note">انسخ الحرف والصقه في خانة الاسم للحصول على اسم فارغ. تحقق من شروط لعبتك أولاً.</p>
</div>
</div></section>`;
  }
  if (tool.kind === 'cards') {
    return `<section class="block" style="padding-top:0"><div class="container">
<div class="cards-tool" data-templates="${tool.mode || 'all'}">
<div class="tool-card">
<div class="tool-input-row">
<input type="text" class="card-name-input" placeholder="اكتب اسمك لمعاينته على كل التصاميم…" autocomplete="off" aria-label="اكتب اسمك لمعاينته على التصاميم">
</div>
<div class="cards-grid"></div>
<p class="tool-note">اكتب اسمك مرة واحدة فيظهر فوراً على جميع التصاميم. اضغط «تحميل PNG» لحفظ أي تصميم كصورة.</p>
</div>
</div>
</div></section>`;
  }
  if (tool.kind === 'names') {
    return `<section class="block" style="padding-top:0"><div class="container">
<div class="tool-card">
${h.namesList(tool.names)}
<p class="tool-note">اضغط «نسخ» بجانب أي اسم لاستخدامه مباشرة.</p>
</div>
</div></section>`;
  }
  return '';
}

function sectionsHtml(sections) {
  return sections
    .map((s, i) => {
      const faqPart = s.faqs ? h.faqsHtml(s.faqs) : '';
      return `<hr class="divider">\n<section class="block"${s.id ? ` id="${s.id}"` : ''}>\n<div class="container">\n<div class="section-head">\n<span class="kicker">${s.kicker}</span>\n<h2>${s.h2}</h2>\n${s.sub ? `<p>${s.sub}</p>` : ''}\n</div>\n${s.wide ? s.body + faqPart : `<div class="article">\n${s.body}\n</div>` + faqPart}\n</div>\n</section>`;
    })
    .join('\n');
}

function relatedHtml(related) {
  if (!related || !related.items.length) return '';
  return `<hr class="divider">\n<section class="block"><div class="container">\n<div class="section-head">\n<span class="kicker">تابع التصفح</span>\n<h2>${related.title || 'صفحات ذات صلة'}</h2>\n</div>\n${h.relatedCards(related.items)}\n</div></section>`;
}

function footer(page, rel) {
  const extraScripts = (page.scripts || []).map((s) => `<script src="${rel}${s}" defer></script>`).join('\n');
  const cols = site.footerCols
    .map(
      (c) => `<div>\n<h4>${c.title}</h4>\n<ul>\n${c.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('\n')}\n</ul>\n</div>`
    )
    .join('\n');
  return `</main>
<footer class="site-footer"><div class="container">
<div class="footer-grid">
<div><h4>عن الموقع</h4><p>منصة ${site.brand} مجانية تجمع مولّدات الزخرفة الفورية ومكتبة الرموز والأحرف المخفية في مكان واحد سريع بالعربية، لكل لاعب ومبدع يريد لاسمه أن يليق به.</p></div>
${cols}
</div>
<div class="footer-bottom"><p>© 2026 ${site.brand} — جميع الأنماط نصوص يونيكود حرة الاستخدام.</p></div>
</div></footer>
<div id="toast" role="status" aria-live="polite"></div>
<script src="${rel}assets/js/app.js" defer></script>
${extraScripts}
</body>
</html>`;
}

function renderPage(page) {
  const rel = './'; /* كل الصفحات في المجلد الرئيسي */
  const html =
    head(page, rel) +
    header(rel) +
    (page.breadcrumb ? breadcrumbHtml(page.breadcrumb, rel) : '') +
    hero(page) +
    toolBlock(page.tool) +
    sectionsHtml(page.sections || []) +
    relatedHtml(page.related) +
    footer(page, rel);
  /* تحويل كل الروابط الداخلية إلى ملفات مسطحة */
  return html.replace(/href="(\/[^"]*)"/g, (m, href) => `href="${flatHref(href)}"`);
}

module.exports = { renderPage, flatHref, flatFile };
