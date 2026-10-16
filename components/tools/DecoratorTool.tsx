'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  STYLES,
  copyText,
  detectLang,
  type DecoStyle,
  type DetectedLang,
} from '@/lib/zakhrafa';
import type { ToolFilter } from '@/lib/types';
import { showToast } from '../toast';
import { CopyButton } from '../CopyButton';

const FILTERS: { id: ToolFilter; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'ar', label: 'عربي' },
  { id: 'en', label: 'إنجليزي' },
  { id: 'game', label: 'مناسب للألعاب' },
];

function styleMatchesFilter(st: DecoStyle, lang: DetectedLang, filter: ToolFilter): boolean {
  if (filter === 'game' && !st.game) return false;
  if (filter === 'ar' && !(st.lang === 'ar' || st.lang === 'both')) return false;
  if (filter === 'en' && !(st.lang === 'en' || st.lang === 'both')) return false;
  return true;
}

interface Result {
  label: string;
  text: string;
  alters?: boolean;
  game?: boolean;
}

/* Main name-decoration generator (ported from assets/js/app.js). */
export function DecoratorTool({
  defaultFilter = 'all',
  placeholder,
  note,
  srHeading,
}: {
  defaultFilter?: ToolFilter;
  placeholder?: string;
  note?: string;
  /** Screen-reader heading rendered at the top of the tool card (homepage) */
  srHeading?: string;
}) {
  const [value, setValue] = useState('');
  const [filter, setFilter] = useState<ToolFilter>(defaultFilter);
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 120);
    return () => clearTimeout(t);
  }, [value]);

  const results = useMemo<Result[]>(() => {
    const text = debounced.trim();
    if (!text) return [];
    const lang = detectLang(debounced);
    const out: Result[] = [];
    for (const st of STYLES) {
      if (!styleMatchesFilter(st, lang, filter)) continue;
      let res: string;
      try {
        res = st.fn(text);
      } catch {
        continue;
      }
      if (!res || (res === text && st.lang !== 'both' && st.lang !== lang)) continue;
      out.push({ label: st.label, text: res, alters: st.alters, game: st.game });
    }
    return out;
  }, [debounced, filter]);

  const empty = value.trim() === '';

  return (
    <div className="tool-card">
      {srHeading ? <h2 className="sr-only">{srHeading}</h2> : null}
      <div className="tool-input-row">
        <input
          type="text"
          id="nameInput"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || 'اكتب اسمك هنا…'}
          autoComplete="off"
          aria-label="اكتب اسمك لزخرفته"
        />
        <button
          className="btn-primary"
          id="copyAllBtn"
          type="button"
          disabled={results.length === 0}
          onClick={async () => {
            if (!results.length) return;
            await copyText(results.map((r) => `${r.label}: ${r.text}`).join('\n'));
            showToast('تم نسخ الاسم المزخرف');
          }}
        >
          نسخ كل الأنماط
        </button>
      </div>
      <div className="tool-meta">
        <div className="filter-bar" id="filterBar" role="group" aria-label="تصفية الأنماط">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              data-filter={f.id}
              className={filter === f.id ? 'active' : ''}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span id="styleCount">{results.length} نمط</span>
      </div>
      <div className="results-grid" id="resultsGrid" aria-live="polite">
        {empty ? (
          <div className="empty-hint">
            اكتب اسمك في الحقل بالأعلى لتظهر لك عشرات الأنماط المزخرفة هنا فوراً.
          </div>
        ) : results.length === 0 ? (
          <div className="empty-hint">لا توجد أنماط مطابقة لهذا الفلتر، جرّب فلتراً آخر.</div>
        ) : (
          results.map((r) => (
            <div className="style-card" key={`${r.label}::${r.text}`}>
              <div className="style-meta">
                <span className="style-name">{r.label}</span>
                {r.alters ? (
                  <span
                    className="badge-alters"
                    title="هذا النمط يضيف علامات تغيّر شكل الحروف، فقد لا يظهر اسمك عند البحث عنه"
                  >
                    يغيّر الحروف
                  </span>
                ) : null}
                {r.game ? (
                  <span
                    className="badge-game"
                    title="نمط بسيط وقليل الرموز، مناسب لأسماء الألعاب"
                  >
                    للألعاب
                  </span>
                ) : null}
              </div>
              <div className="style-out" dir="auto">
                {r.text}
              </div>
              <CopyButton text={r.text} className="copy-btn" />
            </div>
          ))
        )}
      </div>
      <p className="tool-note">
        {note ||
          'كل نمط أعلاه نص يونيكود حقيقي: انسخه والصقه مباشرة في اللعبة أو التطبيق دون أي برنامج إضافي.'}
      </p>
    </div>
  );
}
