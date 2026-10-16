/* Ready-made name card gallery — original canvas templates.
   Ported from assets/js/cards.js (drawing logic identical, typed).
   Client-side only: used by the CardsTool component. */

import { convertFont, tatweelTransform } from './zakhrafa';

export const CW = 900;
export const CH = 560;

export interface CardTemplate {
  id: string;
  title: string;
  featured?: boolean;
  fontId?: string;
  tatweel?: boolean;
  baseSize?: number;
  family?: string;
  weight?: number;
  draw: (ctx: CanvasRenderingContext2D, tpl: CardTemplate, raw: string) => void;
}

function rng(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  baseSize: number,
  family: string,
  weight: number | string
): number {
  let size = baseSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && size > 22) {
    size -= 4;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

interface PreparedText {
  name: string;
  size: number;
}

function styledName(tpl: CardTemplate, raw: string): string {
  let name = (raw || '').trim() || 'اسمك هنا';
  if (tpl.fontId) name = convertFont(tpl.fontId, name);
  if (tpl.tatweel && /[؀-ۿ]/.test(name)) name = tatweelTransform(name);
  return name;
}

function prepText(ctx: CanvasRenderingContext2D, tpl: CardTemplate, raw: string): PreparedText {
  const name = styledName(tpl, raw);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const size = fitFont(
    ctx,
    name,
    CW - 170,
    tpl.baseSize || 88,
    tpl.family || "'Tajawal','Segoe UI',sans-serif",
    tpl.weight || 800
  );
  return { name, size };
}

function paintText(
  ctx: CanvasRenderingContext2D,
  p: PreparedText,
  fill: string,
  glowColor?: string,
  glowBlur?: number
): void {
  if (glowColor) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowBlur || 30;
  }
  ctx.fillStyle = fill;
  ctx.fillText(p.name, CW / 2, CH / 2);
  ctx.restore();
}

function stars(ctx: CanvasRenderingContext2D, n: number, seed: number, maxR?: number): void {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r() * CW;
    const y = r() * CH;
    const rad = 0.6 + r() * (maxR || 1.8);
    ctx.globalAlpha = 0.25 + r() * 0.75;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 7);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ---------------- templates ---------------- */
export const TEMPLATES: CardTemplate[] = [
  {
    id: 'neon',
    title: 'توهج النيون',
    featured: true,
    fontId: 'bold',
    baseSize: 92,
    draw(ctx, tpl, raw) {
      const g = ctx.createLinearGradient(0, 0, 0, CH);
      g.addColorStop(0, '#070718');
      g.addColorStop(1, '#0d0d2b');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CW, CH);
      ctx.strokeStyle = 'rgba(34,211,238,.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= CW; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CH);
        ctx.stroke();
      }
      for (let y = 0; y <= CH; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CW, y);
        ctx.stroke();
      }
      const halo = ctx.createRadialGradient(CW / 2, CH / 2, 40, CW / 2, CH / 2, 320);
      halo.addColorStop(0, 'rgba(34,211,238,.20)');
      halo.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, CW, CH);
      const p = prepText(ctx, tpl, raw);
      paintText(ctx, p, '#eafcff', '#22d3ee', 42);
      ctx.save();
      ctx.strokeStyle = '#f0f';
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(CW / 2 - 130, CH / 2 + p.size * 0.85);
      ctx.lineTo(CW / 2 + 130, CH / 2 + p.size * 0.85);
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    id: 'gold',
    title: 'الفخامة الذهبية',
    featured: true,
    fontId: 'bold',
    tatweel: true,
    baseSize: 88,
    draw(ctx, tpl, raw) {
      const g = ctx.createRadialGradient(CW / 2, CH / 2, 60, CW / 2, CH / 2, 520);
      g.addColorStop(0, '#141007');
      g.addColorStop(1, '#070502');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CW, CH);
      ctx.strokeStyle = 'rgba(245,197,66,.55)';
      ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, CW - 56, CH - 56);
      ctx.strokeStyle = 'rgba(245,197,66,.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, CW - 80, CH - 80);
      ctx.strokeStyle = '#f5c542';
      ctx.lineWidth = 4;
      (
        [
          [28, 28, 1, 1],
          [CW - 28, 28, -1, 1],
          [28, CH - 28, 1, -1],
          [CW - 28, CH - 28, -1, -1],
        ] as [number, number, number, number][]
      ).forEach((c) => {
        ctx.beginPath();
        ctx.moveTo(c[0] + 44 * c[2], c[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.lineTo(c[0], c[1] + 44 * c[3]);
        ctx.stroke();
      });
      const p = prepText(ctx, tpl, raw);
      const gold = ctx.createLinearGradient(0, CH / 2 - 60, 0, CH / 2 + 60);
      gold.addColorStop(0, '#fff3c4');
      gold.addColorStop(0.5, '#f5c542');
      gold.addColorStop(1, '#b8860b');
      ctx.shadowColor = 'rgba(245,197,66,.45)';
      ctx.shadowBlur = 26;
      ctx.fillStyle = gold;
      ctx.fillText(p.name, CW / 2, CH / 2);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = '#f5c542';
      ctx.textAlign = 'center';
      ctx.font = '28px serif';
      ctx.fillText('❖', CW / 2, CH / 2 + p.size * 0.95);
      ctx.restore();
    },
  },
  {
    id: 'blossom',
    title: 'ربيع وردي',
    featured: true,
    fontId: 'script',
    baseSize: 96,
    weight: 700,
    draw(ctx, tpl, raw) {
      const g = ctx.createLinearGradient(0, 0, CW, CH);
      g.addColorStop(0, '#ffe9f0');
      g.addColorStop(1, '#fff6ec');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CW, CH);
      const r = rng(7);
      for (let i = 0; i < 26; i++) {
        ctx.globalAlpha = 0.1 + r() * 0.12;
        ctx.fillStyle = r() > 0.5 ? '#f7b8cd' : '#ffffff';
        ctx.beginPath();
        ctx.arc(r() * CW, r() * CH, 14 + r() * 46, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(176,58,91,.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(CW / 2, 66, 120, 26, 0, 0, 7);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(CW / 2, CH - 66, 120, 26, 0, 0, 7);
      ctx.stroke();
      const p = prepText(ctx, tpl, raw);
      ctx.shadowColor = 'rgba(176,58,91,.35)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#a83255';
      ctx.fillText(p.name, CW / 2, CH / 2);
      ctx.restore();
    },
  },
  {
    id: 'flame',
    title: 'لهيب',
    featured: true,
    fontId: 'bold',
    baseSize: 94,
    draw(ctx, tpl, raw) {
      ctx.fillStyle = '#0d0505';
      ctx.fillRect(0, 0, CW, CH);
      const fire = ctx.createRadialGradient(CW / 2, CH + 60, 40, CW / 2, CH + 60, 480);
      fire.addColorStop(0, 'rgba(255,120,30,.55)');
      fire.addColorStop(0.5, 'rgba(180,40,10,.25)');
      fire.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fire;
      ctx.fillRect(0, 0, CW, CH);
      const r = rng(21);
      for (let i = 0; i < 60; i++) {
        ctx.globalAlpha = 0.3 + r() * 0.7;
        ctx.fillStyle = r() > 0.4 ? '#ffb03a' : '#ff5a1f';
        ctx.shadowColor = '#ff7a1f';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(r() * CW, r() * CH, 1 + r() * 3, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      const p = prepText(ctx, tpl, raw);
      const tg = ctx.createLinearGradient(0, CH / 2 - 60, 0, CH / 2 + 60);
      tg.addColorStop(0, '#ffe27a');
      tg.addColorStop(0.55, '#ff9a2f');
      tg.addColorStop(1, '#ff4d1c');
      ctx.shadowColor = '#ff5a1f';
      ctx.shadowBlur = 34;
      ctx.fillStyle = tg;
      ctx.fillText(p.name, CW / 2, CH / 2);
      ctx.restore();
    },
  },
  {
    id: 'galaxy',
    title: 'المجرة',
    fontId: 'bold',
    baseSize: 90,
    draw(ctx, tpl, raw) {
      const g = ctx.createLinearGradient(0, 0, CW, CH);
      g.addColorStop(0, '#04041a');
      g.addColorStop(1, '#150a33');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CW, CH);
      const neb: [string, number, number, number, number][] = [
        ['#7b2ff7', 0.22, 200, 140, 260],
        ['#2f80ff', 0.18, 680, 380, 300],
        ['#ff2fb3', 0.12, 480, 120, 200],
      ];
      neb.forEach((n) => {
        const rg = ctx.createRadialGradient(n[2], n[3], 10, n[2], n[3], n[4]);
        rg.addColorStop(0, n[0]);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = n[1] * 3;
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, CW, CH);
        ctx.globalAlpha = 1;
      });
      stars(ctx, 150, 99, 2);
      const p = prepText(ctx, tpl, raw);
      paintText(ctx, p, '#f4f0ff', '#a78bfa', 34);
    },
  },
  {
    id: 'minimal',
    title: 'أناقة هادئة',
    baseSize: 84,
    weight: 700,
    draw(ctx, tpl, raw) {
      ctx.fillStyle = '#f7f3ea';
      ctx.fillRect(0, 0, CW, CH);
      ctx.strokeStyle = '#1d1d1f';
      ctx.lineWidth = 2;
      ctx.strokeRect(34, 34, CW - 68, CH - 68);
      ctx.lineWidth = 1;
      ctx.strokeRect(46, 46, CW - 92, CH - 92);
      const p = prepText(ctx, tpl, raw);
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '2px';
      } catch {
        /* unsupported */
      }
      ctx.fillStyle = '#1d1d1f';
      ctx.fillText(p.name, CW / 2, CH / 2 - 14);
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = '#1d1d1f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(CW / 2 - 90, CH / 2 + 66);
      ctx.lineTo(CW / 2 + 90, CH / 2 + 66);
      ctx.stroke();
      ctx.fillStyle = '#1d1d1f';
      ctx.save();
      ctx.translate(CW / 2, CH / 2 + 66);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-7, -7, 14, 14);
      ctx.restore();
      ctx.restore();
    },
  },
  {
    id: 'oriental',
    title: 'زخرفة شرقية',
    fontId: 'bold',
    tatweel: true,
    baseSize: 86,
    draw(ctx, tpl, raw) {
      const g = ctx.createLinearGradient(0, 0, 0, CH);
      g.addColorStop(0, '#0a3a34');
      g.addColorStop(1, '#052019');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CW, CH);
      ctx.strokeStyle = 'rgba(245,197,66,.10)';
      ctx.lineWidth = 1.5;
      for (let x = 40; x < CW; x += 80) {
        for (let y = 40; y < CH; y += 80) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-16, -16, 32, 32);
          ctx.restore();
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 7);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = 'rgba(245,197,66,.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const ax = 120;
      const aw = CW - 240;
      const at = 90;
      const ab = CH - 90;
      ctx.moveTo(ax, ab);
      ctx.lineTo(ax, at + 90);
      ctx.quadraticCurveTo(ax, at, ax + 90, at);
      ctx.lineTo(ax + aw - 90, at);
      ctx.quadraticCurveTo(ax + aw, at, ax + aw, at + 90);
      ctx.lineTo(ax + aw, ab);
      ctx.stroke();
      const p = prepText(ctx, tpl, raw);
      const gold = ctx.createLinearGradient(0, CH / 2 - 60, 0, CH / 2 + 60);
      gold.addColorStop(0, '#fff3c4');
      gold.addColorStop(1, '#d9a62e');
      ctx.shadowColor = 'rgba(245,197,66,.4)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = gold;
      ctx.fillText(p.name, CW / 2, CH / 2 + 10);
      ctx.restore();
    },
  },
  {
    id: 'cyber',
    title: 'سايبر',
    fontId: 'mono',
    baseSize: 82,
    draw(ctx, tpl, raw) {
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, CW, CH);
      const r = rng(42);
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        ctx.strokeStyle = i % 3 ? 'rgba(34,211,238,.14)' : 'rgba(167,139,250,.14)';
        ctx.beginPath();
        const px = r() * CW;
        const py = r() * CH;
        ctx.moveTo(px, py);
        ctx.lineTo(px + (r() * 160 - 80), py);
        ctx.lineTo(px + (r() * 160 - 80), py + (r() * 120 - 60));
        ctx.stroke();
        ctx.fillStyle = 'rgba(34,211,238,.5)';
        ctx.fillRect(px - 2, py - 2, 4, 4);
      }
      ctx.fillStyle = 'rgba(255,255,255,.025)';
      for (let y = 0; y < CH; y += 5) ctx.fillRect(0, y, CW, 1);
      const p = prepText(ctx, tpl, raw);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,0,255,.75)';
      ctx.fillText(p.name, CW / 2 - 5, CH / 2);
      ctx.fillStyle = 'rgba(34,211,238,.75)';
      ctx.fillText(p.name, CW / 2 + 5, CH / 2);
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 22;
      ctx.fillStyle = '#f2fbff';
      ctx.fillText(p.name, CW / 2, CH / 2);
      ctx.restore();
    },
  },
];

export function featuredTemplates(): CardTemplate[] {
  return TEMPLATES.filter((t) => t.featured);
}
