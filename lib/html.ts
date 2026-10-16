/* Content-building helpers (ported from the original generator's h.js).
   These produce pre-rendered HTML strings from authored Arabic content.
   The content is authored and trusted (not user input). */

import type { Faq, RelatedItem, SymbolGroup } from './types';

/** Escape text for safe HTML embedding */
export function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function paras(list: string[]): string {
  return list.map((p) => `<p>${p}</p>`).join('\n');
}

export function ulist(items: string[]): string {
  return `<ul>\n${items.map((i) => `<li>${i}</li>`).join('\n')}\n</ul>`;
}

export function olist(items: string[]): string {
  return `<ol>\n${items.map((i) => `<li>${i}</li>`).join('\n')}\n</ol>`;
}

export interface Step {
  h: string;
  p: string;
}

export function steps(list: Step[]): string {
  return `<div class="steps">\n${list
    .map((s) => `<div class="step">\n<h3>${s.h}</h3>\n<p>${s.p}</p>\n</div>`)
    .join('\n')}\n</div>`;
}

export interface InfoCard {
  icon?: string;
  h: string;
  p: string;
}

export function cards(list: InfoCard[]): string {
  return `<div class="cards">\n${list
    .map(
      (c) =>
        `<div class="info-card">\n${c.icon ? `<span class="icon">${c.icon}</span>` : ''}<h3>${c.h}</h3>\n<p>${c.p}</p>\n</div>`
    )
    .join('\n')}\n</div>`;
}

export function styleTable(rows: [string, string, string][]): string {
  return `<div class="table-wrap">\n<table class="style-table">\n<thead><tr><th>النمط</th><th>مثال</th><th>أين يناسب</th></tr></thead>\n<tbody>\n${rows
    .map(
      (r) =>
        `<tr><td><strong>${r[0]}</strong></td><td class="example" dir="auto">${esc(r[1])}</td><td>${r[2]}</td></tr>`
    )
    .join('\n')}\n</tbody>\n</table>\n</div>`;
}

export function faqsHtml(faqs: Faq[]): string {
  return `<div class="faq-list">\n${faqs
    .map(
      (f) =>
        `<div class="faq-item">\n<button class="faq-q" type="button">${f.q}<span class="plus">+</span></button>\n<div class="faq-a"><p>${f.a}</p></div>\n</div>`
    )
    .join('\n')}\n</div>`;
}

export function namesList(names: string[]): string {
  return `<div class="names-list">\n${names
    .map(
      (n) =>
        `<div class="name-row">\n<span class="nm" dir="auto">${esc(n)}</span>\n<button type="button" data-copy="${esc(n)}">نسخ</button>\n</div>`
    )
    .join('\n')}\n</div>`;
}

export function symbolsStatic(groups: SymbolGroup[]): string {
  return groups
    .map(
      (g) => `<div class="symbol-group">\n<h3>${g.title}</h3>\n<div class="symbol-grid">\n${g.symbols
        .map(
          (s) =>
            `<button type="button" class="symbol-btn" data-copy="${esc(s)}" title="انسخ ${esc(s)}">${esc(s)}</button>`
        )
        .join('\n')}\n</div>\n</div>`
    )
    .join('\n');
}

export function relatedCards(items: RelatedItem[]): string {
  return `<div class="related-grid">\n${items
    .map(
      (it) => `<a class="related-card" href="${it.href}">\n<h3>${it.label}</h3>\n<p>${it.desc || ''}</p>\n<span class="go">استكشف ←</span>\n</a>`
    )
    .join('\n')}\n</div>`;
}

export function notice(html: string): string {
  return `<div class="notice">${html}</div>`;
}

export function tipbox(html: string): string {
  return `<div class="tip-box">${html}</div>`;
}
