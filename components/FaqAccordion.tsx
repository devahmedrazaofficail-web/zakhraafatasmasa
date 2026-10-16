'use client';

import { useState } from 'react';
import type { Faq } from '@/lib/types';

/* FAQ accordion: same markup/CSS as the original site, React-driven.
   Answers stay in the SSR HTML (hidden by CSS until opened). */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <div className={`faq-item${open === i ? ' open' : ''}`} key={i}>
          <button
            className="faq-q"
            type="button"
            aria-expanded={open === i ? 'true' : 'false'}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
            <span className="plus">+</span>
          </button>
          <div className="faq-a">
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
