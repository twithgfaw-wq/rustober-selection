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
  const LEAF_COLORS = ['#c96a2c', '#e08a3a', '#a8481f', '#eaa456', '#8a4a2a', '#d9772f'];
  function autumnScene() {
    // Паперовий осінній ліс (у дусі «Over The Garden Wall»): шари вирізаних дерев від блідих дальніх до темних
    // дерев-арок по краях, листяна крона зверху, купи листя й папороті внизу, паперова рамка по краю.
    const W = 1600, H = 1000;
    const shadow = (id, d, b, o) => `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="${d}" dy="${d + 2}" stdDeviation="${b}" flood-color="#2a1208" flood-opacity="${o}"/></filter>`;
    // дерево: стовбур + розгалуження (обведені лінії з округлими кінцями), опційно листя на кінцях гілок
    const tree = (x, base, h, w, color, leafy, lean = 0) => {
      let out = '';
      const branch = (x0, y0, len, ang, wd, depth) => {
        const x1 = x0 + Math.sin(ang) * len, y1 = y0 - Math.cos(ang) * len;
        const mx = (x0 + x1) / 2 + (rnd() - 0.5) * len * 0.25, my = (y0 + y1) / 2;
        out += `<path d="M${x0.toFixed(0)} ${y0.toFixed(0)} Q${mx.toFixed(0)} ${my.toFixed(0)} ${x1.toFixed(0)} ${y1.toFixed(0)}" stroke="${color}" stroke-width="${wd.toFixed(1)}" stroke-linecap="round" fill="none"/>`;
        if (depth >= 3 || wd < 2) { if (leafy) for (let k = 0; k < 3; k++) out += `<ellipse cx="${(x1 + (rnd() - 0.5) * 40).toFixed(0)}" cy="${(y1 + (rnd() - 0.5) * 26).toFixed(0)}" rx="${(16 + rnd() * 18).toFixed(0)}" ry="${(10 + rnd() * 10).toFixed(0)}" fill="${['#d9772f', '#e89a4a', '#b85a2a', '#f0b060'][Math.floor(rnd() * 4)]}"/>`; return; }
        const n = depth === 0 ? 3 : 2;
        for (let i = 0; i < n; i++) branch(x1, y1, len * (0.55 + rnd() * 0.2), ang + (i - (n - 1) / 2) * (0.5 + rnd() * 0.35) + (rnd() - 0.5) * 0.2, wd * 0.6, depth + 1);
      };
      // стовбур із прожилками
      const top = base - h * 0.55;
      out += `<path d="M${x - w / 2} ${base} C${x - w / 2 + lean * 0.3} ${base - h * 0.2} ${x - w * 0.3 + lean} ${top + 40} ${x + lean - w * 0.18} ${top} L${x + lean + w * 0.18} ${top} C${x + w * 0.3 + lean} ${top + 40} ${x + w / 2 + lean * 0.3} ${base - h * 0.2} ${x + w / 2} ${base} Z" fill="${color}"/>`;
      for (let g = 0; g < 3; g++) { const gx = x + (g - 1) * w * 0.18; out += `<path d="M${gx} ${base - 10} C${gx + lean * 0.2} ${base - h * 0.2} ${gx + lean * 0.6} ${top + 60} ${gx + lean * 0.9} ${top + 20}" stroke="rgba(255,220,180,0.13)" stroke-width="2" fill="none"/>`; }
      branch(x + lean, top + 4, h * 0.3, (rnd() - 0.5) * 0.3, w * 0.36, 0);
      return out;
    };
    let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${shadow('pf', 2, 4, 0.25)}${shadow('pm', 3, 6, 0.32)}${shadow('pn', 5, 9, 0.4)}
      <radialGradient id="glow" cx="50%" cy="46%" r="55%"><stop offset="0" stop-color="#ffd59a" stop-opacity="0.55"/><stop offset="0.6" stop-color="#e8a060" stop-opacity="0.15"/><stop offset="1" stop-color="#e8a060" stop-opacity="0"/></radialGradient></defs>`;
    svg += `<rect width="${W}" height="${H}" fill="url(#glow)"/>`;
    // дальні дерева
    svg += `<g filter="url(#pf)" opacity="0.85">`; for (let i = 0; i < 13; i++) svg += tree(80 + i * 120 + (rnd() - 0.5) * 60, 1000, 760 + rnd() * 200, 22 + rnd() * 10, '#c99062', false, (rnd() - 0.5) * 40); svg += `</g>`;
    // середні дерева з листям
    svg += `<g filter="url(#pm)">`; for (let i = 0; i < 8; i++) svg += tree(140 + i * 190 + (rnd() - 0.5) * 70, 1000, 820 + rnd() * 160, 36 + rnd() * 14, '#9a5a33', rnd() < 0.6, (rnd() - 0.5) * 60); svg += `</g>`;
    // листяна крона вздовж верху
    svg += `<g filter="url(#pm)">`; for (let i = 0; i < 170; i++) { const cx = rnd() * W, edge = Math.min(cx, W - cx), cy = rnd() * (120 + (edge < 400 ? 180 * (1 - edge / 400) : 0)) - 30; const sc = 2.4 + rnd() * 3.4; svg += `<path d="${MAPLE}" transform="translate(${cx.toFixed(0)} ${cy.toFixed(0)}) rotate(${(rnd() * 360).toFixed(0)}) scale(${sc.toFixed(2)})" fill="${['#c96a2c', '#e08a3a', '#b0552a', '#eaa456', '#a8481f', '#d9772f'][Math.floor(rnd() * 6)]}"/>`; } svg += `</g>`;
    // ближні дерева
    svg += `<g filter="url(#pn)">`; for (const [x, lean] of [[250, 30], [560, -20], [1060, 25], [1360, -30]]) svg += tree(x, 1000, 900, 60, '#6a3822', true, lean); svg += `</g>`;
    // дерева-арки по краях
    const arch = (side) => { const s = side === 'l' ? 1 : -1, x0 = side === 'l' ? 0 : W; return `<path d="M${x0} 1000 L${x0} 0 L${x0 + s * 520} 0 C${x0 + s * 330} 60 ${x0 + s * 220} 150 ${x0 + s * 170} 300 C${x0 + s * 130} 420 ${x0 + s * 150} 600 ${x0 + s * 120} 760 C${x0 + s * 100} 880 ${x0 + s * 60} 960 ${x0 + s * 40} 1000 Z" fill="#4a2416"/>` + `<path d="M${x0 + s * 170} 300 C${x0 + s * 300} 220 ${x0 + s * 420} 210 ${x0 + s * 560} 150" stroke="#4a2416" stroke-width="26" stroke-linecap="round" fill="none"/><path d="M${x0 + s * 140} 520 C${x0 + s * 240} 470 ${x0 + s * 300} 420 ${x0 + s * 380} 400" stroke="#4a2416" stroke-width="18" stroke-linecap="round" fill="none"/>` + Array.from({ length: 6 }, (_, k) => `<path d="M${x0 + s * (40 + k * 18)} 1000 C${x0 + s * (60 + k * 18)} 700 ${x0 + s * (90 + k * 20)} 400 ${x0 + s * (200 + k * 40)} ${60 + k * 10}" stroke="rgba(255,210,160,0.1)" stroke-width="2" fill="none"/>`).join(''); };
    svg += `<g filter="url(#pn)">${arch('l')}${arch('r')}</g>`;
    // купи листя й папороті внизу
    svg += `<g filter="url(#pm)"><path d="M0 1000 L0 900 C120 860 240 890 380 870 C520 850 640 900 800 880 C960 860 1080 905 1240 878 C1380 856 1500 890 1600 870 L1600 1000 Z" fill="#c8642a"/><path d="M0 1000 L0 950 C200 920 400 960 620 935 C840 912 1060 958 1280 930 C1420 914 1520 940 1600 925 L1600 1000 Z" fill="#a84a20"/></g>`;
    const fern = (x, s, flip) => { let f = `<g transform="translate(${x} 1000) scale(${flip ? -s : s} ${s})" fill="#3e1f14">`; f += `<path d="M0 0 C10 -80 40 -160 90 -220" stroke="#3e1f14" stroke-width="5" fill="none"/>`; for (let k = 1; k < 10; k++) { const t = k / 10, px = 90 * t * t + 10 * t, py = -220 * t; f += `<ellipse cx="${px + 14}" cy="${py}" rx="${22 - k * 1.6}" ry="5" transform="rotate(-30 ${px + 14} ${py})"/><ellipse cx="${px - 10}" cy="${py + 6}" rx="${20 - k * 1.5}" ry="5" transform="rotate(30 ${px - 10} ${py + 6})"/>`; } return f + `</g>`; };
    svg += `<g filter="url(#pn)">${fern(30, 1.3, false)}${fern(150, 0.9, false)}${fern(1570, 1.3, true)}${fern(1450, 0.9, true)}</g></svg>`;
    const forest = el('a-forest', svg);
    const frame = el('a-frame');
    const flies = el('s-layer'); for (let i = 0; i < 16; i++) { const f = document.createElement('i'); f.className = 'a-fly'; f.style.left = (10 + rnd() * 80).toFixed(1) + '%'; f.style.top = (30 + rnd() * 60).toFixed(1) + '%'; f.style.animationDelay = (rnd() * 6).toFixed(1) + 's'; flies.appendChild(f); }
    bg.append(forest, flies, particles, frame);
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
        const C = ['#c96a2c', '#e08a3a', '#a8481f', '#eaa456'];
        for (let i = 0; i * step < w + step; i++) { const x0 = i * step; path += ` Q${x0 + step / 2} ${2 + sag * 2} ${x0 + step} 2`; const bx = x0 + step / 2, by = 2 + sag, c = C[i % C.length], r = i % 2 ? 25 : -25;
          items += `<g class="a-flag" style="animation-delay:${((i * 0.41) % 4).toFixed(2)}s;transform-box:fill-box"><path d="${MAPLE}" transform="translate(${bx} ${by + 7}) rotate(${r + 180}) scale(0.9)" fill="${c}"/></g>`; }
      }
      g.innerHTML = `<svg viewBox="0 0 ${w} 24" preserveAspectRatio="none"><defs><filter id="sgl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs><path d="${path}" fill="none" stroke="${season === 'winter' ? '#1d2433' : '#5a2a1a'}" stroke-width="1.5"/>${items}</svg>`;
    };
    draw(); let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 150); });
  }
})();
