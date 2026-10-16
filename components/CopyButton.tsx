'use client';

import { useState } from 'react';
import { copyText } from '@/lib/zakhrafa';
import { showToast } from './toast';

/* Copy button with the original "تم ✓" feedback + toast. */
export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`${className ?? ''}${copied ? ' copied' : ''}`}
      onClick={async () => {
        await copyText(text);
        showToast('تم نسخ الاسم المزخرف');
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? 'تم ✓' : 'نسخ'}
    </button>
  );
}
