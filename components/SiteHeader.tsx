'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { NavItem } from '@/lib/types';

export function SiteHeader({ links, logoHref }: { links: NavItem[]; logoHref: string }) {
  const [open, setOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<number | null>(null);
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
            {links.map((l, i) => (
              <li key={`${l.href}|${l.label}`} className={l.children ? 'nav-item has-drop' : 'nav-item'}>
                <span className="nav-row">
                  <Link href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                  {l.children && (
                    <button
                      className="nav-caret"
                      aria-expanded={openDrop === i ? 'true' : 'false'}
                      aria-label={`عرض أقسام ${l.label}`}
                      onClick={() => setOpenDrop((d) => (d === i ? null : i))}
                    >
                      ▾
                    </button>
                  )}
                </span>
                {l.children && (
                  <ul className={`nav-drop${openDrop === i ? ' open' : ''}`}>
                    {l.children.map((c) => (
                      <li key={`${c.href}|${c.label}`}>
                        <Link href={c.href} onClick={() => { setOpen(false); setOpenDrop(null); }}>
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
