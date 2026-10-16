/* Small SEO helpers. */

/** Strip HTML tags (for JSON-LD FAQ text, mirroring the original generator). */
export function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, '');
}
