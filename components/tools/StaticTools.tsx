'use client';

import { INVISIBLE, SYMBOL_GROUPS, copyText } from '@/lib/zakhrafa';
import type { SymbolGroup } from '@/lib/types';
import { showToast } from '../toast';
import { CopyButton } from '../CopyButton';

/* Static symbol library with click-to-copy. */
export function SymbolsTool({ groups, bare }: { groups?: SymbolGroup[]; bare?: boolean }) {
  const list = groups ?? SYMBOL_GROUPS;
  const inner = (
    <>
      {list.map((g) => (
        <div className="symbol-group" key={g.title}>
          <h3>{g.title}</h3>
          <div className="symbol-grid">
            {g.symbols.map((s) => (
              <button
                key={s}
                type="button"
                className="symbol-btn"
                title={`انسخ ${s}`}
                onClick={async () => {
                  await copyText(s);
                  showToast('تم نسخ الاسم المزخرف');
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
      {bare ? null : (
        <p className="tool-note">اضغط على أي رمز لنسخه فوراً ثم الصقه حول اسمك.</p>
      )}
    </>
  );
  if (bare) return inner;
  return <div className="tool-card">{inner}</div>;
}

/* Invisible characters with click-to-copy. */
export function InvisibleTool({ bare }: { bare?: boolean }) {
  const buttons = INVISIBLE.map((it) => (
    <button
      key={it.label}
      type="button"
      className="invisible-btn"
      onClick={async () => {
        await copyText(it.char);
        showToast('تم نسخ الاسم المزخرف');
      }}
    >
      <span className="inv-label">{it.label}</span>
      <span className="inv-hint">اضغط للنسخ</span>
    </button>
  ));
  if (bare) return <>{buttons}</>;
  return (
    <div className="tool-card">
      <div className="invisible-wrap">{buttons}</div>
      <p className="tool-note">
        انسخ الحرف والصقه في خانة الاسم للحصول على اسم فارغ. تحقق من شروط لعبتك أولاً.
      </p>
    </div>
  );
}

/* Ready-made name collections with per-name copy buttons. */
export function NamesTool({ names }: { names: string[] }) {
  return (
    <div className="tool-card">
      <div className="names-list">
        {names.map((n) => (
          <div className="name-row" key={n}>
            <span className="nm" dir="auto">
              {n}
            </span>
            <CopyButton text={n} />
          </div>
        ))}
      </div>
      <p className="tool-note">اضغط «نسخ» بجانب أي اسم لاستخدامه مباشرة.</p>
    </div>
  );
}
