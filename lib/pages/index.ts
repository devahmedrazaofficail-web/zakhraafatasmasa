/* Page registry: combines all page-data modules, validates uniqueness,
   and exposes lookup by logical path (e.g. 'العاب/ببجي'). */

import type { PageData } from '../types';
import { pages as miscPages } from './p-misc';
import { pages as gamePages } from './p-games';
import { pages as socialPages } from './p-social';
import { pages as fontPages } from './p-fonts';

export const allPages: PageData[] = [
  ...miscPages,
  ...gamePages,
  ...socialPages,
  ...fontPages,
];

/* Honest last-modified dates (content reality, not build time):
   - generator pages were authored in the Oct 2026 site build
   - the contact-page builder note was removed in this migration */
const DEFAULT_LAST_MODIFIED = '2026-10-11';

const byPath = new Map<string, PageData>();
/** Lookup by flat URL slug, e.g. 'العاب-ببجي.html' (decoded, with suffix) */
const bySlug = new Map<string, PageData>();
for (const p of allPages) {
  if (!p.path || byPath.has(p.path)) {
    throw new Error(`Duplicate or empty page path: ${p.path}`);
  }
  if (!p.lastModified) p.lastModified = DEFAULT_LAST_MODIFIED;
  byPath.set(p.path, p);
  const slug = pageSlug(p);
  if (bySlug.has(slug)) {
    throw new Error(`Duplicate flat slug: ${slug}`);
  }
  bySlug.set(slug, p);
}

export function getPage(path: string): PageData | undefined {
  return byPath.get(path);
}

/** Flat slug used in the route, e.g. 'العاب-ببجي.html' */
export function pageSlug(p: PageData): string {
  return p.path.replace(/\//g, '-') + '.html';
}

/** Find a page by its URL slug (percent-decoding handled). */
export function getPageBySlug(slug: string): PageData | undefined {
  let s = slug;
  try {
    s = decodeURIComponent(slug);
  } catch {
    /* keep raw */
  }
  return bySlug.get(s);
}

export function pageCount(): number {
  return allPages.length;
}
