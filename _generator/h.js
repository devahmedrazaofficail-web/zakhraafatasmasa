// دوال مساعدة لبناء HTML
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function paras(list) {
  return list.map((p) => `<p>${p}</p>`).join('\n');
}

function ulist(items) {
  return `<ul>\n${items.map((i) => `<li>${i}</li>`).join('\n')}\n</ul>`;
}

function olist(items) {
  return `<ol>\n${items.map((i) => `<li>${i}</li>`).join('\n')}\n</ol>`;
}

function steps(steps) {
  return `<div class="steps">\n${steps
    .map((s) => `<div class="step">\n<h3>${s.h}</h3>\n<p>${s.p}</p>\n</div>`)
    .join('\n')}\n</div>`;
}

function cards(cards) {
  return `<div class="cards">\n${cards
    .map((c) => `<div class="info-card">\n${c.icon ? `<span class="icon">${c.icon}</span>` : ''}<h3>${c.h}</h3>\n<p>${c.p}</p>\n</div>`)
    .join('\n')}\n</div>`;
}

function styleTable(rows) {
  return `<div class="table-wrap">\n<table class="style-table">\n<thead><tr><th>النمط</th><th>مثال</th><th>أين يناسب</th></tr></thead>\n<tbody>\n${rows
    .map((r) => `<tr><td><strong>${r[0]}</strong></td><td class="example" dir="auto">${esc(r[1])}</td><td>${r[2]}</td></tr>`)
    .join('\n')}\n</tbody>\n</table>\n</div>`;
}

function section(kicker, h2, bodyHtml, id) {
  return `<section class="block"${id ? ` id="${id}"` : ''}>\n<div class="container">\n<div class="section-head">\n<span class="kicker">${kicker}</span>\n<h2>${h2}</h2>\n</div>\n<div class="article">\n${bodyHtml}\n</div>\n</div>\n</section>`;
}

function faqsHtml(faqs) {
  return `<div class="faq-list">\n${faqs
    .map(
      (f) => `<div class="faq-item">\n<button class="faq-q" type="button">${f.q}<span class="plus">+</span></button>\n<div class="faq-a"><p>${f.a}</p></div>\n</div>`
    )
    .join('\n')}\n</div>`;
}

function namesList(names) {
  return `<div class="names-list">\n${names
    .map((n) => `<div class="name-row">\n<span class="nm" dir="auto">${esc(n)}</span>\n<button type="button" data-copy="${esc(n)}">نسخ</button>\n</div>`)
    .join('\n')}\n</div>`;
}

function symbolsStatic(groups) {
  return groups
    .map(
      (g) => `<div class="symbol-group">\n<h3>${g.title}</h3>\n<div class="symbol-grid">\n${g.symbols
        .map((s) => `<button type="button" class="symbol-btn" data-copy="${esc(s)}" title="انسخ ${esc(s)}">${esc(s)}</button>`)
        .join('\n')}\n</div>\n</div>`
    )
    .join('\n');
}

function relatedCards(items) {
  return `<div class="related-grid">\n${items
    .map(
      (it) => `<a class="related-card" href="${it.href}">\n<h3>${it.label}</h3>\n<p>${it.desc || ''}</p>\n<span class="go">استكشف ←</span>\n</a>`
    )
    .join('\n')}\n</div>`;
}

function notice(html) {
  return `<div class="notice">${html}</div>`;
}

function tipbox(html) {
  return `<div class="tip-box">${html}</div>`;
}

module.exports = { esc, paras, ulist, olist, steps, cards, styleTable, section, faqsHtml, namesList, symbolsStatic, relatedCards, notice, tipbox };
