import Link from 'next/link';
import type { FooterCol } from '@/lib/types';
import { flatHref } from '@/lib/urls';

export function SiteFooter({ about, columns }: { about: string; columns: FooterCol[] }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>عن الموقع</h4>
            <p>{about}</p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={`${l.href}|${l.label}`}>
                    <Link href={flatHref(l.href)}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2026 زخرفة أسماء — جميع الأنماط نصوص يونيكود حرة الاستخدام.</p>
        </div>
      </div>
    </footer>
  );
}
