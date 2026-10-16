'use client';

import { useState } from 'react';
import { convertFont, copyText } from '@/lib/zakhrafa';
import { showToast } from '../toast';

/* Single-font live converter (font pages). */
export function FontTool({ fontId }: { fontId: string }) {
  const [value, setValue] = useState('');
  const hasText = value.trim() !== '';
  const out = hasText ? convertFont(fontId, value) : '';

  return (
    <div className="tool-card" id="fontTool" data-font={fontId}>
      <div className="tool-input-row">
        <input
          type="text"
          id="fontInput"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="اكتب النص هنا لتحويله…"
          autoComplete="off"
          aria-label="اكتب النص لتحويله"
        />
        <button
          className="btn-primary"
          id="fontCopyBtn"
          type="button"
          onClick={async () => {
            if (!hasText) return;
            await copyText(out);
            showToast('تم نسخ الاسم المزخرف');
          }}
        >
          نسخ النتيجة
        </button>
      </div>
      <div className={`font-output${hasText ? '' : ' placeholder'}`} id="fontOutput" dir="auto">
        {hasText ? out : 'النتيجة ستظهر هنا…'}
      </div>
      <p className="tool-note">النتيجة نص يونيكود حقيقي يعمل في الألعاب والنبذات والمحادثات.</p>
    </div>
  );
}
