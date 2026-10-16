/* Shared TypeScript types for the migrated site.
   Page content is authored data (ported from the original static generator);
   these types describe its shape. */

export interface Faq {
  q: string;
  a: string;
}

export interface BreadcrumbItem {
  label: string;
  /** Logical href like '/العاب/'; rendered through flatHref() to '/العاب.html' */
  href?: string;
}

export type ToolKind =
  | 'decorator'
  | 'font'
  | 'username'
  | 'symbols-static'
  | 'invisible'
  | 'cards'
  | 'names';

export type ToolFilter = 'all' | 'ar' | 'en' | 'game';

export interface SymbolGroup {
  title: string;
  symbols: string[];
}

export interface ToolConfig {
  kind: ToolKind;
  defaultFilter?: ToolFilter;
  placeholder?: string;
  note?: string;
  /** for kind 'font' */
  fontId?: string;
  /** for kind 'cards': 'all' | 'featured' */
  mode?: string;
  /** for kind 'symbols-static' */
  groups?: SymbolGroup[];
  /** for kind 'names' */
  names?: string[];
}

export interface PageSection {
  kicker: string;
  h2: string;
  sub?: string;
  /** Pre-rendered HTML (authored content, trusted) */
  body: string;
  wide?: boolean;
  id?: string;
  faqs?: Faq[];
}

export interface RelatedItem {
  label: string;
  /** Logical href like '/العاب/'; rendered through flatHref() */
  href: string;
  desc?: string;
}

export interface RelatedBlock {
  title?: string;
  items: RelatedItem[];
}

export interface PageData {
  /** Logical path like 'العاب/ببجي' (no .html); the route renders '/العاب-ببجي.html' */
  path: string;
  title: string;
  description: string;
  breadcrumb?: BreadcrumbItem[];
  kicker?: string;
  h1: string;
  intro: string[];
  tool?: ToolConfig;
  sections?: PageSection[];
  /** Top-level FAQs feed the FAQPage JSON-LD (subset shown on page via sections) */
  faqs?: Faq[];
  related?: RelatedBlock;
  scripts?: string[];
  /** Honest last-modified date (YYYY-MM-DD); defaults to the site default */
  lastModified?: string;
}

/* ---------- taxonomy entries (site.ts) ---------- */

export interface TaxonomyEntry {
  slug: string;
  name: string;
  desc: string;
}

export interface FontTaxonomyEntry extends TaxonomyEntry {
  id: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterCol {
  title: string;
  links: NavLink[];
}
