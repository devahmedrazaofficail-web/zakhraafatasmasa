/* Server-rendered page parts: breadcrumb, hero, content sections, related.
   Mirrors the original generator's tpl.js structure and CSS classes. */

import Link from 'next/link';
import type { BreadcrumbItem, PageSection, RelatedBlock } from '@/lib/types';
import { flatHref, flattenHrefs } from '@/lib/urls';
import { FaqAccordion } from './FaqAccordion';
import { ContactForm } from './ContactForm';

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb" aria-label="مسار التنقل">
      <div className="container">
        <ol>
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${c.label}-${i}`} {...(last ? { 'aria-current': 'page' as const } : {})}>
                {last || !c.href ? c.label : <Link href={flatHref(c.href)}>{c.label}</Link>}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export function PageHero({
  kicker,
  h1,
  intro,
}: {
  kicker?: string;
  h1: string;
  intro: string[];
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="kicker">{kicker}</span>
        <h1>{h1}</h1>
        <div className="intro">
          {intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ section }: { section: PageSection }) {
  const body =
    section.id === 'contact' ? (
      <ContactForm />
    ) : (
      <div dangerouslySetInnerHTML={{ __html: flattenHrefs(section.body) }} />
    );
  return (
    <>
      <hr className="divider" />
      <section className="block" {...(section.id ? { id: section.id } : {})}>
        <div className="container">
          <div className="section-head">
            <span className="kicker">{section.kicker}</span>
            <h2>{section.h2}</h2>
            {section.sub ? <p>{section.sub}</p> : null}
          </div>
          {section.wide ? (
            <>
              {body}
              {section.faqs ? <FaqAccordion faqs={section.faqs} /> : null}
            </>
          ) : (
            <>
              <div className="article">{body}</div>
              {section.faqs ? <FaqAccordion faqs={section.faqs} /> : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export function Sections({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <SectionBlock key={`${s.h2}-${i}`} section={s} />
      ))}
    </>
  );
}

export function RelatedGrid({ related }: { related: RelatedBlock }) {
  if (!related.items.length) return null;
  return (
    <>
      <hr className="divider" />
      <section className="block">
        <div className="container">
          <div className="section-head">
            <span className="kicker">تابع التصفح</span>
            <h2>{related.title || 'صفحات ذات صلة'}</h2>
          </div>
          <div className="related-grid">
            {related.items.map((it) => (
              <Link className="related-card" href={flatHref(it.href)} key={`${it.href}|${it.label}`}>
                <h3>{it.label}</h3>
                <p>{it.desc || ''}</p>
                <span className="go">استكشف ←</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
