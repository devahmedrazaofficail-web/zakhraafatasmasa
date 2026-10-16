/* URL helpers: the site keeps its original flat ".html" URL structure.
   Logical paths like 'العاب/ببجي' map to public URLs '/العاب-ببجي.html'. */

import { site } from './site';

/** 'العاب/ببجي' -> '/العاب-ببجي.html' ; '/' stays '/' */
export function flatHref(href: string | undefined): string {
  if (!href || href === '/') return '/';
  const p = href.replace(/^\/|\/$/g, '');
  return '/' + p.replace(/\//g, '-') + '.html';
}

/** Rewrite logical hrefs inside pre-rendered HTML strings to flat .html URLs
    (mirrors the original generator's global href rewrite). */
export function flattenHrefs(html: string): string {
  return html.replace(/href="(\/[^"]*)"/g, (_m, href: string) => `href="${flatHref(href)}"`);
}

/** Recursively flatten a nav tree's logical hrefs (for dropdown menus) */
export function flatNav<T extends { href: string; children?: T[] }>(items: T[]): T[] {
  return items.map((it) => ({
    ...it,
    href: flatHref(it.href),
    ...(it.children ? { children: flatNav(it.children) } : {}),
  }));
}

/** 'العاب/ببجي' -> '/العاب-ببجي.html' */
export function pageUrl(path: string): string {
  return '/' + path.replace(/\//g, '-') + '.html';
}

/** Absolute canonical URL for a logical page path */
export function canonicalUrl(path: string | null): string {
  if (!path) return site.baseUrl + '/';
  return site.baseUrl + pageUrl(path);
}
