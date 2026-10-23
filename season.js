// Сезонна сцена для всіх сторінок: зима (нічне небо, місяць, сани, засніжене містечко, сніг, гірлянда)
// або осінь (захід сонця, хмари, паперові пагорби з амбаром і гарбузами, кленова крона, світлячки, листопад, прапорці).
// Сезон уже виставлено скриптом у <head> (data-season на <html>); тут лише малюємо.
(function () {
  'use strict';
  const root = document.documentElement;
  if (!root.dataset.season) { const m = new Date().getMonth(); root.dataset.season = m === 11 || m < 2 ? 'winter' : 'autumn'; }
  const season = root.dataset.season;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seed = 2026; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  let bg = document.querySelector('.bg');
  if (!bg) { bg = document.createElement('div'); bg.className = 'bg'; bg.setAttribute('aria-hidden', 'true'); document.body.prepend(bg); }
  const el = (cls, html = '') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; return d; };
  const particles = document.createElement('canvas'); particles.className = 's-particles';

  // ==================== ЗИМА ====================
  function winterScene() {
    const stars = el('x-stars');
    for (let i = 0; i < 70; i++) { const s = document.createElement('i'); s.style.left = (rnd() * 100).toFixed(2) + '%'; s.style.top = (rnd() * 100).toFixed(2) + '%'; s.style.animationDelay = (rnd() * 4).toFixed(2) + 's'; if (rnd() < 0.25) s.style.width = s.style.height = '3px'; stars.appendChild(s); }
    const sleigh = el('x-sleigh', `<svg viewBox="0 0 220 70" fill="#0a1228"><path d="M120 44c6 10 22 12 40 10l30-2c6 0 10-4 12-10l3-10-6 2-3 8c-2 4-5 6-9 6l-26 2c-10 0-20-2-26-8z"/><path d="M128 40c4-10 14-16 28-16h20c8 0 14-6 16-14l4-6 4 4-4 8c-4 12-12 18-24 18h-8l-6 8c-6 6-16 6-30-2z"/><path d="M150 26c2-8 8-12 16-12 4 0 6 2 6 6l-2 8-14 2z"/><circle cx="168" cy="12" r="5"/><path d="M162 10l2-6 6-2 4 4-2 6z"/><path d="M128 42L96 36M120 44L96 40" stroke="#0a1228" stroke-width="2" fill="none"/><g><path d="M66 32c4-6 12-8 22-6l10 2c4 0 6 4 4 8l-4 6-6-2 2-4-12-2-6 8-6-2 4-6c-4 0-8 0-10-2z"/><path d="M98 26l4-10 6 2-4 6 6-2 2 4-8 4z"/><path d="M70 40l-4 12 4 1 4-10zm12-2l2 12 4-1-2-12zm8 0l6 10 3-2-5-10z"/></g><g transform="translate(-44 6)"><path d="M66 32c4-6 12-8 22-6l10 2c4 0 6 4 4 8l-4 6-6-2 2-4-12-2-6 8-6-2 4-6c-4 0-8 0-10-2z"/><path d="M98 26l4-10 6 2-4 6 6-2 2 4-8 4z"/><path d="M70 40l-4 12 4 1 4-10zm12-2l2 12 4-1-2-12zm8 0l6 10 3-2-5-10z"/></g></svg>`);
    const W = 1600, H = 260; let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice"><defs><filter id="xglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter></defs>`;
    svg += `<path d="M0 150 C200 110 360 130 520 120 C720 106 880 140 1060 118 C1240 98 1420 128 1600 112 L1600 260 L0 260 Z" fill="#6f86bf" opacity="0.35"/>`;
    let x = -20; const houses = [];
    while (x < W) { const w = 70 + rnd() * 90, h = 50 + rnd() * 70, base = 210 + rnd() * 14; houses.push({ x, w, h, base }); x += w + 8 + rnd() * 30; }
    for (const hs of houses) {
      const top = hs.base - hs.h, roof = 26 + rnd() * 22, cx = hs.x + hs.w / 2;
      svg += `<path d="M${hs.x} ${hs.base} V${top} L${cx} ${top - roof} L${hs.x + hs.w} ${top} V${hs.base} Z" fill="#0e1a3d"/>`;
      svg += `<path d="M${hs.x - 6} ${top + 4} L${cx} ${top - roof - 3} L${hs.x + hs.w + 6} ${top + 4} L${hs.x + hs.w - 2} ${top + 8} L${cx} ${top - roof + 6} L${hs.x + 2} ${top + 8} Z" fill="#e9f2ff"/>`;
      if (rnd() < 0.55) { const chx = hs.x + hs.w * (0.62 + rnd() * 0.2); const chy = top - roof * 0.45; svg += `<rect x="${chx}" y="${chy - 22}" width="12" height="26" fill="#0e1a3d"/><rect x="${chx - 2}" y="${chy - 25}" width="16" height="5" fill="#e9f2ff"/>`; for (let k = 0; k < 3; k++) svg += `<circle cx="${chx + 6 + k * 7}" cy="${chy - 34 - k * 12}" r="${5 + k * 3}" fill="#c9d6f2" opacity="${0.22 - k * 0.05}"/>`; }
      const cols = Math.max(1, Math.floor(hs.w / 34)), rows = Math.max(1, Math.floor(hs.h / 34));
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (rnd() < 0.35) continue; const wx = hs.x + 12 + c * ((hs.w - 24) / cols), wy = top + 12 + r * 30; svg += `<g class="win" style="animation-delay:${(rnd() * 6).toFixed(1)}s"><rect x="${wx - 3}" y="${wy - 3}" width="20" height="22" fill="#ffb347" opacity="0.55" filter="url(#xglow)"/><rect x="${wx}" y="${wy}" width="14" height="16" rx="2" fill="#ffd27a"/><rect x="${wx + 6}" y="${wy}" width="2" height="16" fill="#8a5a20"/></g>`; }
    }
    svg += `<path d="M0 222 C220 210 420 228 640 218 C880 208 1100 230 1320 218 C1460 212 1540 220 1600 216 L1600 260 L0 260 Z" fill="#f2f7ff"/><path d="M0 236 C300 226 600 244 900 232 C1200 222 1400 240 1600 230 L1600 260 L0 260 Z" fill="#d6e2f6"/></svg>`;
    bg.append(stars, el('x-moon'), sleigh, el('s-ground x-town', svg), particles);
    return { kind: 'snow' };
  }

  // ==================== ОСІНЬ ====================
  const MAPLE = 'M0 -10 L2 -5 L6 -7 L5 -2 L10 -2 L6 2 L8 6 L3 5 L1 10 L0 6 L-1 10 L-3 5 L-8 6 L-6 2 L-10 -2 L-5 -2 L-6 -7 L-2 -5 Z';
  const LEAF_COLORS = ['#d84a1e', '#f2a23a', '#b8361a', '#e8782a', '#ffc24a', '#c9501f'];
  function autumnScene() {
    // хмари в небі
    const clouds = el('a-clouds', `<svg viewBox="0 0 1600 300" preserveAspectRatio="none">${[[180, 200, 1.2], [640, 170, 0.9], [1120, 210, 1.3], [1480, 160, 0.8]].map(([cx, cy, s]) => `<g transform="translate(${cx} ${cy}) scale(${s} ${s * 0.7})" fill="#ffd9ae"><ellipse cx="0" cy="24" rx="170" ry="30"/><circle cx="-70" cy="6" r="40"/><circle cx="0" cy="-10" r="56"/><circle cx="78" cy="8" r="42"/><ellipse cx="0" cy="24" rx="150" ry="18" fill="#fff0d8"/></g>`).join('')}</svg>`);
    // паперові шари: далекі пагорби з амбаром, середні з гарбузами, передній план
    const W = 1600, H = 280; const shadow = `<filter id="ap" x="-5%" y="-30%" width="110%" height="160%"><feDropShadow dx="0" dy="-4" stdDeviation="5" flood-color="#3a140c" flood-opacity="0.35"/></filter>`;
    let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice"><defs>${shadow}</defs>`;
    svg += `<path filter="url(#ap)" d="M0 120 C180 80 340 100 520 92 C720 82 860 118 1040 96 C1220 74 1420 104 1600 88 L1600 280 L0 280 Z" fill="#e39a5a"/>`;
    // амбар на далекому пагорбі
    const bx = 1080, by = 74;
    svg += `<g transform="translate(${bx} ${by})"><path d="M0 40 V8 L30 -14 L60 8 V40 Z" fill="#b8402a"/><path d="M-6 10 L30 -18 L66 10 L60 12 L30 -10 L0 12 Z" fill="#3d8f8a"/><rect x="22" y="18" width="16" height="22" fill="#f6e6d0"/><path d="M22 18 L38 40 M38 18 L22 40" stroke="#b8402a" stroke-width="2"/><rect x="25" y="2" width="10" height="8" fill="#f6e6d0"/><path d="M30 -18 V-30 M24 -30 h14" stroke="#7a3a1a" stroke-width="2"/><path d="M26 -36 q4 -6 8 0 l4 -2 -2 4 q-4 4 -10 2z" fill="#7a3a1a"/></g>`;
    svg += `<path d="M700 112 C780 108 860 112 940 104" stroke="#f2c27a" stroke-width="3" fill="none"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${700 + i * 30}" y="${100 - i * 0.6}" width="4" height="16" fill="#f2c27a"/>`).join('');
    svg += `<path filter="url(#ap)" d="M0 170 C220 140 420 160 640 150 C860 140 1060 168 1280 152 C1420 142 1520 150 1600 146 L1600 280 L0 280 Z" fill="#c4643a"/>`;
    for (let i = 0; i < 22; i++) { const px = rnd() * W, py = 160 + rnd() * 40, r = 6 + rnd() * 6; svg += `<g transform="translate(${px.toFixed(0)} ${py.toFixed(0)})"><ellipse rx="${r * 1.25}" ry="${r}" fill="#f0882a"/><path d="M${-r * 0.4} ${-r * 0.9} q${r * 0.4} ${r * 0.6} ${r * 0.8} 0" stroke="#c4561a" fill="none" stroke-width="1.5"/><rect x="-1.5" y="${-r - 5}" width="3" height="6" fill="#4a6a2a"/></g>`; }
    svg += `<path filter="url(#ap)" d="M0 218 C260 196 520 222 800 208 C1080 194 1340 222 1600 204 L1600 280 L0 280 Z" fill="#7a3420"/>`;
    for (let i = 0; i < 40; i++) { const gx = rnd() * W, gy = 214 + rnd() * 30; svg += `<path d="M${gx.toFixed(0)} ${gy.toFixed(0)} l3 -12 l3 12 l3 -9 l2 9" fill="#5a2616"/>`; }
    // великі гарбузи на передньому плані
    for (const [px, s] of [[120, 1.4], [1460, 1.2], [1530, 0.8]]) svg += `<g transform="translate(${px} 236) scale(${s})"><ellipse cx="-14" rx="16" ry="20" fill="#e8742a"/><ellipse cx="14" rx="16" ry="20" fill="#e8742a"/><ellipse rx="18" ry="22" fill="#f58a34"/><path d="M-2 -22 q0 -8 6 -12" stroke="#4a6a2a" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
    svg += `</svg>`;
    // кленова крона в лівому верхньому куті, як рамка
    let can = `<svg viewBox="0 0 520 360" preserveAspectRatio="xMinYMin meet"><path d="M-10 -10 C60 60 70 140 40 360 L80 360 C110 160 100 70 30 -10 Z" fill="#5a2a1a"/>`;
    for (let i = 0; i < 70; i++) { const cx = rnd() * 500, cy = rnd() * (240 - cx * 0.35) - 10; if (cy < -20) continue; const s = 1.6 + rnd() * 2.6; can += `<path d="${MAPLE}" transform="translate(${cx.toFixed(0)} ${cy.toFixed(0)}) rotate(${(rnd() * 360).toFixed(0)}) scale(${s.toFixed(2)})" fill="${LEAF_COLORS[Math.floor(rnd() * LEAF_COLORS.length)]}"/>`; }
    can += `</svg>`;
    const canopy = el('a-canopy', can);
    const sun = el('a-sun');
    const flies = el('s-layer'); for (let i = 0; i < 18; i++) { const f = document.createElement('i'); f.className = 'a-fly'; f.style.left = (rnd() * 100).toFixed(1) + '%'; f.style.top = (55 + rnd() * 40).toFixed(1) + '%'; f.style.animationDelay = (rnd() * 6).toFixed(1) + 's'; flies.appendChild(f); }
    bg.append(clouds, sun, el('s-ground a-ground', svg), canopy, flies, particles);
    return { kind: 'leaves' };
  }

  const scene = season === 'winter' ? winterScene() : autumnScene();
  const onScroll = () => root.toggleAttribute('data-scrolled', scrollY > 160);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // ==================== частинки: сніг або листя ====================
  const ctx = particles.getContext('2d'); let ps = [], vw = 0, vh = 0, dpr = 1;
  const leafPath = new Path2D(MAPLE);
  const resize = () => {
    dpr = Math.min(1.5, window.devicePixelRatio || 1); vw = innerWidth; vh = innerHeight; particles.width = vw * dpr; particles.height = vh * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (scene.kind === 'snow') { const n = Math.round(Math.min(160, vw * vh / 9000)); ps = Array.from({ length: n }, () => ({ x: Math.random() * vw, y: Math.random() * vh, r: 0.8 + Math.random() * 2.6, v: 18 + Math.random() * 42, p: Math.random() * 6.28, a: 0.45 + Math.random() * 0.5 })); }
    else { const n = Math.round(Math.min(45, vw * vh / 30000)); ps = Array.from({ length: n }, () => ({ x: Math.random() * vw, y: Math.random() * vh, s: 0.7 + Math.random() * 1.1, v: 28 + Math.random() * 40, p: Math.random() * 6.28, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 2.4, c: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)], a: 0.75 + Math.random() * 0.25 })); }
  };
  resize(); addEventListener('resize', resize);
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, vw, vh);
    for (const f of ps) {
      if (scene.kind === 'snow') {
        if (!reduced) { f.y += f.v * dt; f.p += dt * 0.8; f.x += Math.sin(f.p) * 12 * dt; if (f.y > vh + 4) { f.y = -4; f.x = Math.random() * vw; } }
        ctx.globalAlpha = f.a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
      } else {
        if (!reduced) { f.y += f.v * dt; f.p += dt * 1.1; f.x += (Math.sin(f.p) * 40 + 14) * dt; f.rot += f.vr * dt; if (f.y > vh + 20 || f.x > vw + 20) { f.y = -20; f.x = Math.random() * vw * 0.9 - 40; } }
        ctx.setTransform(dpr * f.s, 0, 0, dpr * f.s, f.x * dpr, f.y * dpr); ctx.rotate(f.rot); ctx.scale(1, 0.6 + 0.4 * Math.abs(Math.sin(f.p)));
        ctx.globalAlpha = f.a; ctx.fillStyle = f.c; ctx.fill(leafPath);
      }
    }
    ctx.globalAlpha = 1;
    if (!reduced && !document.hidden) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduced) { last = performance.now(); requestAnimationFrame(tick); } });

  // ==================== під шапкою: гірлянда або прапорці ====================
  const nav = document.querySelector('nav.top');
  if (nav) {
    const g = document.createElement('div'); g.className = 's-garland'; g.setAttribute('aria-hidden', 'true'); nav.appendChild(g);
    const draw = () => {
      const w = nav.clientWidth, step = 44, sag = 9; let path = 'M0 2', items = '';
      if (season === 'winter') {
        const C = ['#ff4b3e', '#ffd04a', '#3fd17a', '#4ea6ff'];
        for (let i = 0; i * step < w + step; i++) { const x0 = i * step; path += ` Q${x0 + step / 2} ${2 + sag * 2} ${x0 + step} 2`; const bx = x0 + step / 2, by = 2 + sag, c = C[i % C.length];
          items += `<g class="x-bulb" style="animation-delay:${((i * 0.37) % 2.4).toFixed(2)}s"><circle cx="${bx}" cy="${by + 8}" r="9" fill="${c}" opacity="0.35" filter="url(#sgl)"/><rect x="${bx - 2.5}" y="${by}" width="5" height="4" rx="1" fill="#3a3f4a"/><ellipse cx="${bx}" cy="${by + 8}" rx="4" ry="5.5" fill="${c}"/><ellipse cx="${bx - 1.3}" cy="${by + 6}" rx="1.2" ry="1.8" fill="#fff" opacity="0.7"/></g>`; }
      } else {
        const C = ['#e0552e', '#ffc24a', '#8a4a2a', '#f08a34', '#c9501f'];
        for (let i = 0; i * step < w + step; i++) { const x0 = i * step; path += ` Q${x0 + step / 2} ${2 + sag * 2} ${x0 + step} 2`; const bx = x0 + step / 2, by = 2 + sag - 1, c = C[i % C.length];
          items += `<g class="a-flag" style="animation-delay:${((i * 0.41) % 4).toFixed(2)}s;transform-box:fill-box"><path d="M${bx - 9} ${by} L${bx + 9} ${by} L${bx} ${by + 16} Z" fill="${c}"/><path d="M${bx - 9} ${by} L${bx + 9} ${by}" stroke="rgba(255,255,255,0.35)" stroke-width="1"/></g>`; }
      }
      g.innerHTML = `<svg viewBox="0 0 ${w} 24" preserveAspectRatio="none"><defs><filter id="sgl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs><path d="${path}" fill="none" stroke="${season === 'winter' ? '#1d2433' : '#5a2a1a'}" stroke-width="1.5"/>${items}</svg>`;
    };
    draw(); let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 150); });
  }
})();
