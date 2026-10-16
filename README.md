# زخرفة اسماء — Next.js Migration

Arabic name-decoration tool website (**زخرفة اسماء**), migrated from vanilla
HTML/CSS/JS to **Next.js (App Router) + TypeScript + React**, fully static
(SSG), frontend-only. Deploys to Vercel as-is.

Live site: <https://zakhraafatasmasa.com>

## Stack

- Next.js 16 (App Router, Cache Components), React 19, TypeScript
- `next/font/google` — Tajawal (weights 400/500/700/800, arabic + latin subsets)
- No backend, no database, no auth, no API routes — pure static output

## Project structure

```
app/
  layout.tsx          Root layout: <html lang="ar" dir="rtl">, Tajawal font,
                      favicons, theme-color, GA4 (homepage-only, see notes)
  page.tsx            Homepage (hand-ported, incl. WebSite + FAQPage JSON-LD)
  [slug]/page.tsx     All 56 generator pages. slug includes ".html"
                      (e.g. /العاب-ببجي.html). generateStaticParams enumerates
                      every page; canonical + og:url are rendered manually as
                      <link>/<meta> tags (see "SEO notes").
  sitemap.ts          /sitemap.xml — 57 canonical URLs, honest lastModified
  robots.ts           /robots.txt — Allow: / + sitemap reference
  globals.css         Ported stylesheet (439 lines from the original)
components/
  SiteHeader.tsx / SiteFooter.tsx   Nav, footer (client islands)
  page-parts.tsx        Breadcrumb, PageHero, Sections, RelatedGrid
  FaqAccordion.tsx      FAQ accordion (SSR HTML, client toggle)
  CopyButton.tsx        Copy-to-clipboard buttons with toast
  ContactForm.tsx       mailto: contact form (CONTACT_EMAIL constant)
  JsonLd.tsx            <script type="application/ld+json"> helper
  tools/                DecoratorTool, FontTool, UsernameTool, StaticTools
                        (symbols/invisible libraries), CardsTool (canvas cards)
lib/
  pages/                Page data registry: p-misc.ts, p-games.ts, p-social.ts,
                        p-fonts.ts + index.ts (path/slug lookup, dup validation)
  zakhrafa.ts           Decoration engine: 27 styles, fonts, username gen,
                        symbol groups, invisible chars, copy helper
  cards.ts              8 canvas name-card templates
  urls.ts               flatHref(), pageUrl(), canonicalUrl(), flattenHrefs()
  site.ts / seo.ts / html.ts / types.ts
public/assets/images/   favicon-32.png, favicon-180.png, favicon.svg
```

## Install / dev / build

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static production build (62 routes)
npm start        # serve the production build
```

Type-check: `npx tsc --noEmit` · Lint: `npx eslint app lib components`

## Routes & URL structure

URLs are preserved exactly from the original site — flat Arabic filenames:

| Route            | Source                | Count |
|------------------|-----------------------|-------|
| `/`              | `app/page.tsx`        | 1     |
| `/<slug>.html`   | `app/[slug]/page.tsx` | 56    |
| `/sitemap.xml`   | `app/sitemap.ts`      | —     |
| `/robots.txt`    | `app/robots.ts`       | —     |

`generateStaticParams()` enumerates all 56 slugs; unknown slugs return the
default 404 page. The route param includes the `.html` suffix, so the
filesystem-style URLs work unchanged.

## Metadata management

- Each page's `title`, `description`, keywords live in its entry under
  `lib/pages/*.ts` (ported 1:1 from the original `_generator/` data).
- `generateMetadata()` in `app/[slug]/page.tsx` sets title, description,
  keywords, robots, Open Graph and Twitter tags.
- **Canonical + `og:url` are rendered manually** as `<link rel="canonical">`
  and `<meta property="og:url">` in the page JSX (Next hoists them to `<head>`).
  Reason: the Metadata API percent-encodes Arabic canonicals and strips the
  homepage trailing slash; manual tags keep them byte-identical to the original.
- Homepage-only extras (matching the deployed site): Google Search Console
  verification meta tag and the GA4 snippet (`G-E59LD041MQ`) via
  `next/script` with `afterInteractive`.

## Adding a page

1. Add a `PageData` entry to the right file in `lib/pages/` (`path` uses the
   logical form, e.g. `العاب/ببجي`; the flat slug is derived automatically).
2. `npm run build` — duplicate paths/slugs fail the build loudly.
3. The sitemap picks it up automatically. Set an honest `lastModified`
   (content date, not build date).

## SEO notes (verified against the original)

- All 57 pages: title/description/canonical/robots/OG/Twitter tags verified
  byte-identical vs the original via automated crawl.
- Sitemap contains only canonical indexable URLs; `lastModified` reflects real
  content dates (homepage 2026-10-16, generator pages 2026-10-11).
- JSON-LD: `WebPage` on every page, `BreadcrumbList` where the original had
  one, `FAQPage` where FAQs exist, `WebSite` on the homepage. Homepage FAQ
  answers were aligned to the visible text.
- Fixed during migration: nested-page hub-card links now flatten to the
  `.html` URLs (the original generator rewrote them globally); the leaked
  internal builder note was removed from the contact page; Google Fonts is no
  longer render-blocking (`next/font` with `display: swap`).
- Known placeholders: contact form mailto is `hello@example.com`
  (`components/ContactForm.tsx` → `CONTACT_EMAIL`) — replace with the real
  address before/after launch. GA4 is homepage-only, as on the deployed site.

## Deploy (Vercel)

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. Vercel → Add New Project → import the repo. Framework preset: Next.js.
   No env vars, no build overrides needed (`npm run build` → static).
3. Add the domain `zakhraafatasmasa.com` in Project → Settings → Domains and
   point DNS to Vercel.

## Google Search Console (after deploy)

1. Property already verified (verification meta tag ships on the homepage).
2. URL Inspection → inspect `https://zakhraafatasmasa.com/` → Request indexing.
3. Sitemaps → submit `https://zakhraafatasmasa.com/sitemap.xml`.
4. Monitor Coverage (all 57 URLs should be "Valid") and Performance over the
   following weeks. URL structure is unchanged, so existing indexed URLs carry
   over; impressions still depend on content and demand, not on the migration
   itself.
