'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface HeaderLink {
  label: string;
  href: string;
}

export function SiteHeader({ links, logoHref }: { links: HeaderLink[]; logoHref: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href={logoHref} aria-label="زخرفة أسماء - الرئيسية">
          <span className="logo-mark">ز</span>
          <span>زخرفة أسماء</span>
        </Link>
        <nav aria-label="التنقل الرئيسي">
          <button
            className="nav-toggle"
            aria-expanded={open ? 'true' : 'false'}
            aria-controls="navLinks"
            aria-label="فتح القائمة"
            onClick={() => setOpen((o) => !o)}
          >
            ☰
          </button>
          <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
            {links.map((l) => (
              <li key={`${l.href}|${l.label}`}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
