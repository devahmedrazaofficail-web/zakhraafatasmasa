'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CH, CW, TEMPLATES, featuredTemplates, type CardTemplate } from '@/lib/cards';

/* Canvas name-card gallery: type once, preview on every design, download PNG. */
export function CardsTool({
  mode = 'all',
  note = true,
  cta,
}: {
  mode?: string;
  /** Show the tool note (the cards page shows it; the homepage shows a CTA instead) */
  note?: boolean;
  cta?: React.ReactNode;
}) {
  const list: CardTemplate[] = mode === 'featured' ? featuredTemplates() : TEMPLATES;
  const [name, setName] = useState('');
  const [debounced, setDebounced] = useState('');
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(name), 130);
    return () => clearTimeout(t);
  }, [name]);

  const renderAll = useCallback(
    (raw: string) => {
      list.forEach((tpl, i) => {
        const canvas = canvasRefs.current[i];
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, CW, CH);
        try {
          tpl.draw(ctx, tpl, raw);
        } catch {
          /* never break the gallery */
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode]
  );

  useEffect(() => {
    renderAll(debounced);
  }, [debounced, renderAll]);

  useEffect(() => {
    renderAll('');
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => renderAll(debounced));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cards-tool" data-templates={mode}>
      <div className="tool-card">
        <div className="tool-input-row">
          <input
            type="text"
            className="card-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك لمعاينته على كل التصاميم…"
            autoComplete="off"
            aria-label="اكتب اسمك لمعاينته على التصاميم"
          />
        </div>
        <div className="cards-grid">
          {list.map((tpl, i) => (
            <div className="design-card" key={tpl.id}>
              <canvas
                ref={(el) => {
                  canvasRefs.current[i] = el;
                }}
                width={CW}
                height={CH}
                role="img"
                aria-label={`تصميم ${tpl.title}`}
              />
              <div className="design-meta">
                <span className="design-title">{tpl.title}</span>
                <button
                  type="button"
                  className="dl-btn"
                  onClick={() => {
                    const canvas = canvasRefs.current[i];
                    if (!canvas) return;
                    const a = document.createElement('a');
                    a.download = `تصميم-${tpl.id}.png`;
                    a.href = canvas.toDataURL('image/png');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  تحميل PNG
                </button>
              </div>
            </div>
          ))}
        </div>
        {note ? (
          <p className="tool-note">
            اكتب اسمك مرة واحدة فيظهر فوراً على جميع التصاميم. اضغط «تحميل PNG» لحفظ أي تصميم
            كصورة.
          </p>
        ) : null}
        {cta}
      </div>
    </div>
  );
}
