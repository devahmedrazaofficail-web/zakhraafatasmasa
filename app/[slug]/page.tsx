import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allPages, getPageBySlug, pageSlug } from '@/lib/pages';
import { canonicalUrl, flatHref } from '@/lib/urls';
import { site } from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumb, PageHero, RelatedGrid, Sections } from '@/components/page-parts';
import { ToolBlock } from '@/components/tools/ToolBlock';
import { JsonLd } from '@/components/JsonLd';
import { stripTags } from '@/lib/seo';

/* Note: with Next 16 "Cache Components", unknown slugs are handled by
   notFound() below (dynamicParams is not compatible with cacheComponents). */

export async function generateStaticParams() {
  return allPages.map((p) => ({ slug: pageSlug(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    /* canonical + og:url are rendered manually below to preserve the exact
       raw-Arabic URL form of the original site (Next's Metadata API would
       percent-encode them). */
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'ar_AR',
      title: page.title,
      description: page.description,
    },
    twitter: { card: 'summary', title: page.title, description: page.description },
  };
}

function breadcrumbJsonLd(page: NonNullable<ReturnType<typeof getPageBySlug>>) {
  const items = (page.breadcrumb ?? []).map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: site.baseUrl + flatHref(c.href) } : {}),
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: canonicalUrl(page.path),
    inLanguage: 'ar',
    description: page.description,
    breadcrumb: { '@type': 'BreadcrumbList', itemListElement: items },
  };
}

function faqJsonLd(page: NonNullable<ReturnType<typeof getPageBySlug>>) {
  if (!page.faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'ar',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: stripTags(f.q),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
    })),
  };
}

const FOOTER_ABOUT =
  'منصة زخرفة أسماء مجانية تجمع مولّدات الزخرفة الفورية ومكتبة الرموز والأحرف المخفية في مكان واحد سريع بالعربية، لكل لاعب ومبدع يريد لاسمه أن يليق به.';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  const faqLd = faqJsonLd(page);
  const canonical = canonicalUrl(page.path);

  return (
    <>
      {/* Exact canonical / og:url (raw-Arabic form, as on the original site) */}
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      <JsonLd data={breadcrumbJsonLd(page)} />
      {faqLd ? <JsonLd data={faqLd} /> : null}

      <SiteHeader links={site.nav.map((n) => ({ label: n.label, href: flatHref(n.href) }))} logoHref="/" />

      <main>
        {page.breadcrumb ? <Breadcrumb items={page.breadcrumb} /> : null}
        <PageHero kicker={page.kicker ?? site.brand} h1={page.h1} intro={page.intro} />
        {page.tool ? <ToolBlock tool={page.tool} /> : null}
        {page.sections ? <Sections sections={page.sections} /> : null}
        {page.related ? <RelatedGrid related={page.related} /> : null}
      </main>

      <SiteFooter about={FOOTER_ABOUT} columns={site.footerCols} />
    </>
  );
}
