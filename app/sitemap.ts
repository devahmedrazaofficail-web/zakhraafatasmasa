import type { MetadataRoute } from 'next';
import { allPages } from '@/lib/pages';
import { canonicalUrl } from '@/lib/urls';

/* XML sitemap: same URLs, priorities and changefreq as the deployed sitemap.xml.
   lastModified uses honest per-page dates (content reality, not build time). */
export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: canonicalUrl(null),
    lastModified: '2026-10-16',
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };
  const pages = allPages.map((p) => ({
    url: canonicalUrl(p.path),
    lastModified: p.lastModified ?? '2026-10-11',
    changeFrequency: 'weekly' as const,
    priority: p.path.includes('/') ? 0.7 : 0.8,
  }));
  return [home, ...pages];
}
