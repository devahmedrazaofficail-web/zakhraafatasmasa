'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RANDOM_WORDS, genUsernames } from '@/lib/zakhrafa';
import { CopyButton } from '../CopyButton';

/* Username idea generator. */
export function UsernameTool() {
  const [value, setValue] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 150);
    return () => clearTimeout(t);
  }, [value]);

  /* Deterministic initial word so SSR and client render identically. */
  const effective = debounced.trim() || 'sniper';
  const list = useMemo(() => genUsernames(effective), [effective]);

  return (
    <div className="tool-card">
      <div className="tool-input-row">
        <input
          type="text"
          id="userBase"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="اكتب كلمة الأساس… مثال: sniper"
          autoComplete="off"
          aria-label="كلمة الأساس لاسم المستخدم"
          dir="ltr"
          style={{ textAlign: 'left' }}
        />
        <button
          className="btn-primary"
          id="userRandom"
          type="button"
          onClick={() => {
            setValue(RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)]);
            inputRef.current?.focus();
          }}
        >
          اقتراح عشوائي
        </button>
      </div>
      <div className="results-grid" id="userResults" aria-live="polite">
        {list.length === 0 ? (
          <div className="empty-hint">اكتب كلمة الأساس لتوليد اقتراحات أسماء المستخدمين.</div>
        ) : (
          list.map((o) => (
            <div className="style-card" key={o.text}>
              <div className="style-meta">
                <span className="style-name">{o.label}</span>
              </div>
              <div className="style-out" dir="auto">
                {o.text}
              </div>
              <CopyButton text={o.text} className="copy-btn" />
            </div>
          ))
        )}
      </div>
      <p className="tool-note">
        أسماء المستخدمين تقبل الحروف اللاتينية والأرقام والشرطة السفلية في معظم المنصات.
      </p>
    </div>
  );
}
