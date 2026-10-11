'use strict';
/* ============================================================
   معرض التصاميم الجاهزة — قوالب Canvas أصلية
   يُكتب الاسم مرة واحدة فيُعرض لحظياً على كل التصاميم
   ============================================================ */

var CW = 900, CH = 560;

function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fitFont(ctx, text, maxWidth, baseSize, family, weight) {
  var size = baseSize;
  ctx.font = weight + ' ' + size + 'px ' + family;
  while (ctx.measureText(text).width > maxWidth && size > 22) {
    size -= 4;
    ctx.font = weight + ' ' + size + 'px ' + family;
  }
  return size;
}

function styledName(tpl, raw) {
  var name = (raw || '').trim() || 'اسمك هنا';
  if (tpl.fontId && window.Zakhrafa) name = window.Zakhrafa.font(tpl.fontId, name);
  if (tpl.tatweel && /[\u0600-\u06FF]/.test(name) && window.Zakhrafa) name = window.Zakhrafa.tatweel(name);
  return name;
}

function prepText(ctx, tpl, raw) {
  var name = styledName(tpl, raw);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var size = fitFont(ctx, name, CW - 170, tpl.baseSize || 88, tpl.family || "'Tajawal','Segoe UI',sans-serif", tpl.weight || 800);
  return { name: name, size: size };
}

function paintText(ctx, p, fill, glowColor, glowBlur) {
  if (glowColor) { ctx.shadowColor = glowColor; ctx.shadowBlur = glowBlur || 30; }
  ctx.fillStyle = fill;
  ctx.fillText(p.name, CW / 2, CH / 2);
  ctx.restore();
}

function stars(ctx, n, seed, maxR) {
  var r = rng(seed);
  for (var i = 0; i < n; i++) {
    var x = r() * CW, y = r() * CH, rad = 0.6 + r() * (maxR || 1.8);
    ctx.globalAlpha = 0.25 + r() * 0.75;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ---------------- القوالب ---------------- */
var TEMPLATES = [
  {
    id: 'neon', title: 'توهج النيون', featured: true, fontId: 'bold', baseSize: 92,
    draw: function (ctx, raw) {
      var g = ctx.createLinearGradient(0, 0, 0, CH);
      g.addColorStop(0, '#070718'); g.addColorStop(1, '#0d0d2b');
      ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
      ctx.strokeStyle = 'rgba(34,211,238,.07)'; ctx.lineWidth = 1;
      for (var x = 0; x <= CW; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
      for (var y = 0; y <= CH; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
      var halo = ctx.createRadialGradient(CW/2, CH/2, 40, CW/2, CH/2, 320);
      halo.addColorStop(0, 'rgba(34,211,238,.20)'); halo.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.fillStyle = halo; ctx.fillRect(0, 0, CW, CH);
      var p = prepText(ctx, this, raw);
      paintText(ctx, p, '#eafcff', '#22d3ee', 42);
      ctx.save();
      ctx.strokeStyle = '#f0f'; ctx.globalAlpha = .8; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(CW/2 - 130, CH/2 + p.size * 0.85); ctx.lineTo(CW/2 + 130, CH/2 + p.size * 0.85); ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'gold', title: 'الفخامة الذهبية', featured: true, fontId: 'bold', tatweel: true, baseSize: 88,
    draw: function (ctx, raw) {
      var g = ctx.createRadialGradient(CW/2, CH/2, 60, CW/2, CH/2, 520);
      g.addColorStop(0, '#141007'); g.addColorStop(1, '#070502');
      ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
      ctx.strokeStyle = 'rgba(245,197,66,.55)'; ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, CW - 56, CH - 56);
      ctx.strokeStyle = 'rgba(245,197,66,.25)'; ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, CW - 80, CH - 80);
      ctx.strokeStyle = '#f5c542'; ctx.lineWidth = 4;
      [[28,28,1,1],[CW-28,28,-1,1],[28,CH-28,1,-1],[CW-28,CH-28,-1,-1]].forEach(function (c) {
        ctx.beginPath(); ctx.moveTo(c[0] + 44*c[2], c[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(c[0], c[1] + 44*c[3]); ctx.stroke();
      });
      var p = prepText(ctx, this, raw);
      var gold = ctx.createLinearGradient(0, CH/2 - 60, 0, CH/2 + 60);
      gold.addColorStop(0, '#fff3c4'); gold.addColorStop(.5, '#f5c542'); gold.addColorStop(1, '#b8860b');
      ctx.shadowColor = 'rgba(245,197,66,.45)'; ctx.shadowBlur = 26;
      ctx.fillStyle = gold;
      ctx.fillText(p.name, CW / 2, CH / 2);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = '#f5c542'; ctx.textAlign = 'center'; ctx.font = '28px serif';
      ctx.fillText('❖', CW/2, CH/2 + p.size * 0.95);
      ctx.restore();
    }
  },
  {
    id: 'blossom', title: 'ربيع وردي', featured: true, fontId: 'script', baseSize: 96, weight: 700,
    draw: function (ctx, raw) {
      var g = ctx.createLinearGradient(0, 0, CW, CH);
      g.addColorStop(0, '#ffe9f0'); g.addColorStop(1, '#fff6ec');
      ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
      var r = rng(7);
      for (var i = 0; i < 26; i++) {
        ctx.globalAlpha = 0.10 + r() * 0.12;
        ctx.fillStyle = r() > .5 ? '#f7b8cd' : '#ffffff';
        ctx.beginPath(); ctx.arc(r()*CW, r()*CH, 14 + r()*46, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(176,58,91,.35)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(CW/2, 66, 120, 26, 0, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(CW/2, CH-66, 120, 26, 0, 0, 7); ctx.stroke();
      var p = prepText(ctx, this, raw);
      ctx.shadowColor = 'rgba(176,58,91,.35)'; ctx.shadowBlur = 18;
      ctx.fillStyle = '#a83255';
      ctx.fillText(p.name, CW / 2, CH / 2);
      ctx.restore();
    }
  },
  {
    id: 'flame', title: 'لهيب', featured: true, fontId: 'bold', baseSize: 94,
    draw: function (ctx, raw) {
      ctx.fillStyle = '#0d0505'; ctx.fillRect(0, 0, CW, CH);
      var fire = ctx.createRadialGradient(CW/2, CH + 60, 40, CW/2, CH + 60, 480);
      fire.addColorStop(0, 'rgba(255,120,30,.55)'); fire.addColorStop(.5, 'rgba(180,40,10,.25)'); fire.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fire; ctx.fillRect(0, 0, CW, CH);
      var r = rng(21);
      for (var i = 0; i < 60; i++) {
        ctx.globalAlpha = 0.3 + r() * 0.7;
        ctx.fillStyle = r() > .4 ? '#ffb03a' : '#ff5a1f';
        ctx.shadowColor = '#ff7a1f'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(r()*CW, r()*CH, 1 + r()*3, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      var p = prepText(ctx, this, raw);
      var tg = ctx.createLinearGradient(0, CH/2 - 60, 0, CH/2 + 60);
      tg.addColorStop(0, '#ffe27a'); tg.addColorStop(.55, '#ff9a2f'); tg.addColorStop(1, '#ff4d1c');
      ctx.shadowColor = '#ff5a1f'; ctx.shadowBlur = 34;
      ctx.fillStyle = tg;
      ctx.fillText(p.name, CW / 2, CH / 2);
      ctx.restore();
    }
  },
  {
    id: 'galaxy', title: 'المجرة', fontId: 'bold', baseSize: 90,
    draw: function (ctx, raw) {
      var g = ctx.createLinearGradient(0, 0, CW, CH);
      g.addColorStop(0, '#04041a'); g.addColorStop(1, '#150a33');
      ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
      var neb = [['#7b2ff7', .22, 200, 140, 260], ['#2f80ff', .18, 680, 380, 300], ['#ff2fb3', .12, 480, 120, 200]];
      neb.forEach(function (n) {
        var rg = ctx.createRadialGradient(n[2], n[3], 10, n[2], n[3], n[4]);
        rg.addColorStop(0, n[0]); rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = n[1] * 3; ctx.fillStyle = rg;
        ctx.fillRect(0, 0, CW, CH); ctx.globalAlpha = 1;
      });
      stars(ctx, 150, 99, 2);
      var p = prepText(ctx, this, raw);
      paintText(ctx, p, '#f4f0ff', '#a78bfa', 34);
    }
  },
  {
    id: 'minimal', title: 'أناقة هادئة', baseSize: 84, weight: 700,
    draw: function (ctx, raw) {
      ctx.fillStyle = '#f7f3ea'; ctx.fillRect(0, 0, CW, CH);
      ctx.strokeStyle = '#1d1d1f'; ctx.lineWidth = 2;
      ctx.strokeRect(34, 34, CW - 68, CH - 68);
      ctx.lineWidth = 1;
      ctx.strokeRect(46, 46, CW - 92, CH - 92);
      var p = prepText(ctx, this, raw);
      try { ctx.letterSpacing = '2px'; } catch (e) {}
      ctx.fillStyle = '#1d1d1f';
      ctx.fillText(p.name, CW / 2, CH / 2 - 14);
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = '#1d1d1f'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(CW/2 - 90, CH/2 + 66); ctx.lineTo(CW/2 + 90, CH/2 + 66); ctx.stroke();
      ctx.fillStyle = '#1d1d1f';
      ctx.save(); ctx.translate(CW/2, CH/2 + 66); ctx.rotate(Math.PI/4); ctx.fillRect(-7, -7, 14, 14); ctx.restore();
      ctx.restore();
    }
  },
  {
    id: 'oriental', title: 'زخرفة شرقية', fontId: 'bold', tatweel: true, baseSize: 86,
    draw: function (ctx, raw) {
      var g = ctx.createLinearGradient(0, 0, 0, CH);
      g.addColorStop(0, '#0a3a34'); g.addColorStop(1, '#052019');
      ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
      ctx.strokeStyle = 'rgba(245,197,66,.10)'; ctx.lineWidth = 1.5;
      for (var x = 40; x < CW; x += 80) {
        for (var y = 40; y < CH; y += 80) {
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI/4);
          ctx.strokeRect(-16, -16, 32, 32); ctx.restore();
          ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.stroke();
        }
      }
      ctx.strokeStyle = 'rgba(245,197,66,.6)'; ctx.lineWidth = 3;
      ctx.beginPath();
      var ax = 120, aw = CW - 240, at = 90, ab = CH - 90;
      ctx.moveTo(ax, ab); ctx.lineTo(ax, at + 90);
      ctx.quadraticCurveTo(ax, at, ax + 90, at);
      ctx.lineTo(ax + aw - 90, at);
      ctx.quadraticCurveTo(ax + aw, at, ax + aw, at + 90);
      ctx.lineTo(ax + aw, ab);
      ctx.stroke();
      var p = prepText(ctx, this, raw);
      var gold = ctx.createLinearGradient(0, CH/2 - 60, 0, CH/2 + 60);
      gold.addColorStop(0, '#fff3c4'); gold.addColorStop(1, '#d9a62e');
      ctx.shadowColor = 'rgba(245,197,66,.4)'; ctx.shadowBlur = 24;
      ctx.fillStyle = gold;
      ctx.fillText(p.name, CW / 2, CH / 2 + 10);
      ctx.restore();
    }
  },
  {
    id: 'cyber', title: 'سايبر', fontId: 'mono', baseSize: 82,
    draw: function (ctx, raw) {
      ctx.fillStyle = '#05070d'; ctx.fillRect(0, 0, CW, CH);
      var r = rng(42);
      ctx.lineWidth = 2;
      for (var i = 0; i < 12; i++) {
        ctx.strokeStyle = i % 3 ? 'rgba(34,211,238,.14)' : 'rgba(167,139,250,.14)';
        ctx.beginPath();
        var px = r()*CW, py = r()*CH;
        ctx.moveTo(px, py);
        ctx.lineTo(px + (r()*160 - 80), py);
        ctx.lineTo(px + (r()*160 - 80), py + (r()*120 - 60));
        ctx.stroke();
        ctx.fillStyle = 'rgba(34,211,238,.5)';
        ctx.fillRect(px - 2, py - 2, 4, 4);
      }
      ctx.fillStyle = 'rgba(255,255,255,.025)';
      for (var y = 0; y < CH; y += 5) ctx.fillRect(0, y, CW, 1);
      var p = prepText(ctx, this, raw);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,0,255,.75)';
      ctx.fillText(p.name, CW/2 - 5, CH/2);
      ctx.fillStyle = 'rgba(34,211,238,.75)';
      ctx.fillText(p.name, CW/2 + 5, CH/2);
      ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 22;
      ctx.fillStyle = '#f2fbff';
      ctx.fillText(p.name, CW/2, CH/2);
      ctx.restore();
    }
  }
];

function downloadCanvas(canvas, filename) {
  var a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function setupGallery(root) {
  var mode = root.getAttribute('data-templates') || 'all';
  var list = mode === 'featured' ? TEMPLATES.filter(function (t) { return t.featured; }) : TEMPLATES;
  var input = root.querySelector('.card-name-input');
  var grid = root.querySelector('.cards-grid');

  list.forEach(function (tpl) {
    var card = document.createElement('div');
    card.className = 'design-card';
    var canvas = document.createElement('canvas');
    canvas.width = CW; canvas.height = CH;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'تصميم ' + tpl.title);
    var meta = document.createElement('div');
    meta.className = 'design-meta';
    var title = document.createElement('span');
    title.className = 'design-title';
    title.textContent = tpl.title;
    var dl = document.createElement('button');
    dl.type = 'button'; dl.className = 'dl-btn';
    dl.textContent = 'تحميل PNG';
    dl.addEventListener('click', function () { downloadCanvas(canvas, 'تصميم-' + tpl.id + '.png'); });
    meta.appendChild(title); meta.appendChild(dl);
    card.appendChild(canvas); card.appendChild(meta);
    grid.appendChild(card);
    tpl._canvas = canvas;
  });

  var timer = null;
  function renderAll() {
    var v = input ? input.value : '';
    list.forEach(function (tpl) {
      if (!tpl._canvas) return;
      var ctx = tpl._canvas.getContext('2d');
      ctx.clearRect(0, 0, CW, CH);
      try { tpl.draw(ctx, v); } catch (e) { /* لا تكسر المعرض */ }
    });
  }
  if (input) input.addEventListener('input', function () {
    clearTimeout(timer); timer = setTimeout(renderAll, 130);
  });
  renderAll();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(renderAll);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.cards-tool').forEach(setupGallery);
});
