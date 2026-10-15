(function () {
  'use strict';
  let S = window.STATE;
  const $ = (id) => document.getElementById(id);
  const t = (k, v) => (window.t ? window.t(k, v) : k);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const loc = () => (window.LANG === 'en' ? 'en-GB' : 'uk-UA');
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString(loc(), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
  const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' }) : '—';
  const thumb = (url, size = 512) => !url ? '' : url.startsWith('data:') ? url : `${url}?imw=${size}&imh=${size}&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true`;
  const stageNo = (L) => (L == null ? '—' : L - S.baseHidden + 1);
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const LQIP = window.LQIP || {};

  // ============ піксельний гарбуз (box-shadow по сітці) ============
  const PUMPKIN = ['......GG......', '.....GG.......', '...OOOOOOOO...', '..OOOOOOOOOO..', '.OOOOOOOOOOOO.', '.OOKKOOOOKKOO.', 'OOKKKOOOOKKKOO', 'OOOOOOKKOOOOOO', 'OOKOOOOOOOOKOO', 'OOKKOOKKOOKKOO', '.OOKKKKKKKKOO.', '.OOOOKKKKOOOO.', '..OOOOOOOOOO..', '....OOOOOO....'];
  const PCOL = { G: '#5fd36b', O: '#ff8a3c', K: '#1b1b1f' };
  function pumpkin(el, s) {
    if (!el) return;
    const sh = [];
    PUMPKIN.forEach((row, y) => [...row].forEach((ch, x) => { if (PCOL[ch]) sh.push(`${x * s}px ${y * s}px 0 0 ${PCOL[ch]}`); }));
    el.style.setProperty('--px-shadow', sh.join(','));
    el.style.width = s + 'px'; el.style.height = s + 'px';
    el.style.marginRight = (PUMPKIN[0].length - 1) * s + 'px';
    el.style.marginBottom = (PUMPKIN.length - 1) * s + 'px';
  }
  pumpkin($('bootPumpkin'), 8);
  pumpkin($('heroPumpkin'), 7);

  // ============ звук (синтез WebAudio, без файлів) ============
  const sound = {
    on: store.get('rstbr-sound', false), ctx: null,
    ensure() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; },
    beep(freq = 440, dur = 0.08, type = 'square', vol = 0.05, slide = 0) {
      if (!this.on) return; const c = this.ensure(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, c.currentTime);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), c.currentTime + dur);
      g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + dur);
    },
    click() { this.beep(1200, 0.04, 'square', 0.03); },
    toggle() { this.beep(660, 0.06); setTimeout(() => this.beep(990, 0.06), 60); },
    power() { this.beep(220, 0.25, 'sawtooth', 0.04, 600); setTimeout(() => this.beep(880, 0.12, 'square', 0.04), 220); },
    gain() { this.beep(880, 0.07); setTimeout(() => this.beep(1320, 0.1), 80); },
    over() { this.beep(400, 0.18, 'square', 0.05, -250); setTimeout(() => this.beep(200, 0.3, 'square', 0.05, -120), 180); },
    coin() { this.beep(1568, 0.06); setTimeout(() => this.beep(2093, 0.14), 70); },
  };
  const soundBtn = $('soundBtn');
  const paintSound = () => { soundBtn.textContent = sound.on ? '🔊' : '🔇'; soundBtn.classList.toggle('active', sound.on); };
  paintSound();
  soundBtn.addEventListener('click', () => { sound.on = !sound.on; store.set('rstbr-sound', sound.on); paintSound(); if (sound.on) { sound.ensure(); sound.coin(); } });
  document.addEventListener('click', (e) => { if (e.target.closest('.btn3d, .rb, .bigbtn, .pill.toggle, .iconbtn, .stage, .star, .pred, .tabbar a')) sound.click(); }, true);

  // ============ інтро: консоль вмикається ============
  (function boot() {
    const el = $('boot');
    if (!el) return;
    const seen = (() => { try { return sessionStorage.getItem('rstbr-boot') === '1'; } catch (e) { return false; } })();
    if (reduced || seen || !S) { el.remove(); document.body.classList.add('ready'); return; }
    const lines = ['INSERT CARTRIDGE... OK', `LOADING ${S.stats.total} SKINS`, `LEVEL ${stageNo(S.currentLevel)}  SNAPSHOTS ${S.snapshots.length}`, 'PRESS START'];
    const box = $('bootLines');
    lines.forEach((tx, i) => { const d = document.createElement('div'); d.textContent = '> ' + tx; d.style.setProperty('animation-delay', (0.85 + i * 0.22) + 's', 'important'); box.appendChild(d); });
    let done = false;
    const pct = $('bootPct'); const t0 = performance.now();
    const tickPct = () => { const p = Math.min(100, Math.round(Math.max(0, (performance.now() - t0 - 900) / 1300) * 100)); if (pct) pct.textContent = p + '%'; if (p < 100 && !done) requestAnimationFrame(tickPct); };
    requestAnimationFrame(tickPct);
    el.classList.add('power');
    const finish = () => { if (done) return; done = true; el.classList.add('off'); document.body.classList.add('ready'); try { sessionStorage.setItem('rstbr-boot', '1'); } catch (e) {} setTimeout(() => el.remove(), 700); };
    setTimeout(finish, 2600);
    el.addEventListener('click', finish);
  })();

  if (!S || !S.items) { $('aliveEmpty').hidden = false; $('aliveEmpty').textContent = 'no data: run refresh.cmd'; return; }

  // ============ паралакс (миша + скрол) ============
  const depthEls = [...document.querySelectorAll('[data-depth]')];
  let mx = 0, my = 0;
  function paintParallax() {
    const sy = window.scrollY;
    for (const el of depthEls) { const d = +el.dataset.depth; el.style.transform = `translate3d(${(mx * d * 60).toFixed(1)}px, ${(my * d * 40 - sy * d * 0.6).toFixed(1)}px, 0)`; }
  }
  if (!reduced) {
    window.addEventListener('mousemove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; requestAnimationFrame(paintParallax); }, { passive: true });
    window.addEventListener('scroll', () => requestAnimationFrame(paintParallax), { passive: true });
  }

  // ============ консоль: кадри екрана, кнопки, нахил ============
  const device = $('device');
  let frame = 0, frameTimer = null;
  function showFrame(n) {
    frame = n;
    document.querySelectorAll('.screen .frame').forEach((f, i) => f.classList.toggle('on', i === n));
    document.querySelectorAll('.rb[data-frame]').forEach((b) => b.classList.toggle('lit', +b.dataset.frame === n));
  }
  document.querySelectorAll('.rb[data-frame]').forEach((b) => b.addEventListener('click', () => { showFrame(+b.dataset.frame); clearInterval(frameTimer); frameTimer = setInterval(() => showFrame((frame + 1) % 4), 9000); }));
  frameTimer = setInterval(() => showFrame((frame + 1) % 4), 9000);
  const hero = document.querySelector('.hero');
  if (hero && device && !reduced) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      device.style.transform = `rotate(${(-5 + x * 5).toFixed(2)}deg) translate(${(x * 12).toFixed(1)}px, ${(y * 10).toFixed(1)}px)`; device.style.animation = 'none';
    });
    hero.addEventListener('mouseleave', () => { device.style.transform = ''; device.style.animation = ''; });
    window.addEventListener('scroll', () => { const p = Math.min(1, window.scrollY / 600); device.style.setProperty('--scroll-rot', (p * 8).toFixed(2) + 'deg'); }, { passive: true });
  }

  // ============ дані ============
  let alive, dead, risk, dyingNow, gained, byId;
  function derive() {
    alive = S.items.filter((x) => x.alive);
    dead = S.items.filter((x) => !x.alive);
    risk = S.items.filter((x) => x.status === 'risk');
    dyingNow = dead.filter((x) => x.eliminatedNow && Date.now() - Date.parse(x.eliminatedTime) < 6 * 3600 * 1000).slice(0, 12);
    gained = S.items.filter((x) => x.delta > 0).length;
    byId = Object.fromEntries(S.items.map((x) => [x.id, x]));
  }
  derive();
  const nextLevel = () => (S.currentLevel == null ? S.baseHidden : S.currentLevel + 1);
  // рідкість за кількістю прихованих
  const tierOf = (x) => { const h = x.hidden ?? 0; return h >= 4 ? 'legend' : h === 3 ? 'epic' : h === 2 ? 'rare' : 'common'; };

  // ============ watchlist і прогнози (локально) ============
  const watch = new Set(store.get('rstbr-watch', []));
  const saveWatch = () => store.set('rstbr-watch', [...watch]);
  const pred = Object.assign({ level: null, picks: [] }, store.get('rstbr-pred', {}));
  const savePred = () => store.set('rstbr-pred', pred);
  if (pred.level == null) pred.level = nextLevel();

  // ============ шапка, екран, тікер, відлік ============
  function paintHeader() {
    $('collLink').href = S.collectionUrl;
    $('stats').innerHTML = [
      ['', '#', S.stats.total, t('stat.total')], ['c', '▶', S.stats.ok, t('stat.ok')], ['y', '!', risk.length, t('stat.risk')], ['m', '✕', dead.length, t('stat.dead')], ['g', '+', gained, t('stat.gain')],
    ].map(([c, i, v, l]) => `<div class="stat ${c}"><i class="ico">${i}</i><b class="odo" data-n="${v}">0</b><span>${l}</span></div>`).join('');
    $('updated').textContent = `SNAPSHOT ${fmtDate(S.snapshots.at(-1))} · N=${S.snapshots.length} · LEVEL ${S.currentLevel == null ? '-' : '>=' + S.currentLevel} HIDDEN`;
    $('status').innerHTML = `<i class="led on"></i><span>LIVE · ${fmtTime(S.snapshots.at(-1))}</span>`;
    $('footSnap').textContent = `generated ${S.generated}`;
    $('screenSub').textContent = `LEVEL ${stageNo(S.currentLevel)} · ${S.stats.ok} PLAYERS LEFT`;
    const top = alive.filter((x) => x.status === 'ok').slice(0, 10);
    $('arcadeList').innerHTML = top.map((x, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><span class="nm">${esc(x.title.toUpperCase().slice(0, 18))}</span><span class="sc">${x.hidden}</span></li>`).join('');
    $('arcadeStats').innerHTML = [['PLAYERS', S.stats.ok], ['LOW SIGNAL', risk.length], ['GAME OVER', dead.length], ['SNAPSHOTS', S.snapshots.length]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
    const nextL = nextLevel(); const have = S.items.filter((x) => (x.hidden ?? -1) >= nextL).length;
    $('arcadeNext').innerHTML = `<div>LEVEL ${stageNo(nextL)} · ${nextL}+ HIDDEN</div><div class="bar"><i style="width:${Math.min(100, Math.round(have / S.nextNeed * 100))}%"></i></div><div>${have} / ${S.nextNeed} SKINS</div>`;
    const ev = S.events.slice(0, 12).map((e) => e.type === 'gain' ? `+${e.to - e.from} ${e.title.toUpperCase()} [${e.to}]` : e.type === 'loss' ? `-${e.from - e.to} ${e.title.toUpperCase()}` : e.type === 'stage' ? `LEVEL ${stageNo(e.level)} UNLOCKED (${e.passed} PASSED)` : `GAME OVER: ${e.title.toUpperCase()}`);
    $('ticker').textContent = (ev.length ? ev : [`HIGH SCORE: ${top.map((x, i) => `${i + 1}. ${x.title.toUpperCase()} [${x.hidden}]`).join('  ///  ')}`]).join('   ///   ');
    countUp();
  }
  function countUp() {
    document.querySelectorAll('.odo[data-n]').forEach((b) => {
      const n = +b.dataset.n; if (reduced || !isFinite(n)) { b.textContent = b.dataset.n; return; }
      const t0 = performance.now(), dur = 1100;
      const tick = (tt) => { const p = Math.min(1, (tt - t0) / dur); b.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }
  function paintCountdown() {
    const gen = Date.parse(S.generated);
    const period = ((S.scanDurationSec || 3600) + (S.loopIntervalMin || 5) * 60) * 1000;
    let eta = gen + period; while (eta < Date.now()) eta += period;
    const left = Math.max(0, eta - Date.now());
    const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
    $('countdownText').textContent = `~${h ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    $('ledScan').classList.toggle('on', Date.now() - gen < 120000);
  }
  setInterval(paintCountdown, 1000);

  // ============ подіум, рівні ============
  function paintPodium() {
    const top3 = alive.filter((x) => x.status === 'ok').slice(0, 3);
    $('podium').innerHTML = top3.map((x, i) => `
      <div class="pod p${i + 1} holo" data-open="${x.id}" role="button" tabindex="0" title="${esc(x.title)}">
        <div class="pod-rank">${['1ST', '2ND', '3RD'][i]}</div>
        <img src="${thumb(x.preview, 300)}" alt="" loading="lazy">
        <div class="pod-body">
          <div class="pod-title">${esc(x.title)}</div>
          <div class="pod-meta"><span class="who">${x.avatar ? `<img class="ava" src="${esc(x.avatar)}" alt="">` : ''}${esc(x.author || '—')}</span><span>HID <b>${x.hidden ?? '?'}</b> / ${x.total ?? '?'}</span></div>
        </div>
      </div>`).join('') || `<div class="empty">NO DATA YET</div>`;
  }
  function paintStages() {
    const countAtLeast = (L) => S.items.filter((x) => (x.hidden ?? -1) >= L).length;
    const els = [`<div class="stage ${S.stages.length ? 'done' : 'current'}"><span class="n">00</span><b>START</b>${S.stats.total} ${t('stage.start')}</div>`];
    for (const st of S.stages) els.push(`<div class="stage ${st.level === S.currentLevel ? 'current' : 'done'}"><span class="n">0${stageNo(st.level)}</span><b>LEVEL ${stageNo(st.level)} - ${st.level}+ HIDDEN</b>${countAtLeast(st.level)} ${t('stage.passed')} · ${fmtDate(st.time)}${st.forced ? ' · manual' : ''}</div>`);
    const nextL = nextLevel();
    els.push(`<div class="stage future"><span class="n">0${stageNo(nextL)}</span><b>LEVEL ${stageNo(nextL)} - ${nextL}+ HIDDEN</b>${t('stage.sofar')} ${countAtLeast(nextL)} / ${t('stage.need')} ≥${S.nextNeed} ${t('stage.same')}</div>`);
    els.push(`<div class="stage future"><span class="n">FIN</span><b>IN GAME</b>${t('stage.final')}</div>`);
    $('stages').innerHTML = els.join('');
    $('stageHint').textContent = t('stage.hint', { n: S.nextNeed, p: Math.round(S.minWaveShare * 100) });
  }

  // ============ стрічка подій ============
  let logShown = 40;
  function evLine(e) {
    const tm = `<time>${fmtDate(e.time)}</time>`;
    if (e.type === 'gain') return `<div class="ev gain" data-open="${e.id}">${tm}<i>+${e.to - e.from}</i><span><b>${esc(e.title)}</b> ${t('ev.gain')}: ${e.from} → ${e.to}</span></div>`;
    if (e.type === 'loss') return `<div class="ev loss" data-open="${e.id}">${tm}<i>−${e.from - e.to}</i><span><b>${esc(e.title)}</b> ${t('ev.loss')}: ${e.from} → ${e.to}</span></div>`;
    if (e.type === 'stage') return `<div class="ev stage">${tm}<i>LVL</i><span>${t('ev.stage')} <b>LEVEL ${stageNo(e.level)}</b> (${e.level}+ ${t('ev.hidden')}): ${t('ev.passed')} ${e.passed}</span></div>`;
    return `<div class="ev out" data-open="${e.id}">${tm}<i>✕</i><span><b>${esc(e.title)}</b> ${t('ev.out')} ${stageNo(e.level)}</span></div>`;
  }
  function paintLog() {
    const groups = new Map();
    for (const e of S.events) { if (!groups.has(e.time)) groups.set(e.time, []); groups.get(e.time).push(e); }
    let n = 0; const html = [];
    for (const [time, evs] of groups) {
      const gains = evs.filter((e) => e.type === 'gain').length, outs = evs.filter((e) => e.type === 'out').length;
      html.push(`<div class="ev-group"><div class="ev-head"><b>${fmtDate(time)}</b><span>${gains ? `+${gains} ${t('ev.gainN')}` : ''}${gains && outs ? ' · ' : ''}${outs ? `${outs} ${t('ev.outN')}` : ''}${!gains && !outs ? t('ev.changes') : ''}</span></div>`);
      for (const e of evs) { if (n++ >= logShown) break; html.push(evLine(e)); }
      html.push('</div>');
      if (n >= logShown) break;
    }
    $('logList').innerHTML = html.join('') || `<div class="empty">${t('ev.quiet')}</div>`;
    $('logMore').hidden = S.events.length <= logShown;
    $('logHint').textContent = `${S.events.length} ${t('ev.count')} · ${S.snapshots.length} ${t('ev.snaps')}`;
  }
  $('logMore').addEventListener('click', () => { logShown += 60; paintLog(); });

  // ============ графіки ============
  const C = { ink: '#f2f0ea', muted: '#9a97a0', grid: 'rgba(255,255,255,0.08)', seq: ['#3a3a44', '#5b7fb3', '#ffc63a', '#ff8a3c', '#ff5a3c'] };
  const lvlColor = (h) => C.seq[Math.min(h, C.seq.length - 1)];
  const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="none" style="aspect-ratio:${w}/${h}" role="img">${inner}</svg>`;
  const hid = (txt) => esc(txt).replace(/"/g, '&quot;');
  function chartTimeline() {
    const T = S.timeline; if (!T.length) return;
    const W = 600, H = 220, pl = 36, pr = 10, pt = 14, pb = 34;
    const maxN = Math.max(1, ...T.map((x) => x.dist.reduce((a, b) => a + b, 0))); const levels = T[0].dist.length;
    const bw = Math.max(6, Math.min(40, (W - pl - pr) / T.length - 6));
    const x = (i) => pl + (i + 0.5) * ((W - pl - pr) / T.length), y = (v) => pt + (H - pt - pb) * (1 - v / maxN);
    let out = '';
    for (let g = 0; g <= 4; g++) { const v = Math.round(maxN * g / 4); out += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="${C.grid}"/><text x="${pl - 6}" y="${y(v) + 4}" font-size="10" fill="${C.muted}" text-anchor="end">${v}</text>`; }
    T.forEach((tt, i) => {
      let acc = 0;
      for (let h = 0; h < levels; h++) { const v = tt.dist[h]; if (!v) continue; const y1 = y(acc + v), y2 = y(acc); out += `<rect class="hit" data-tip="${hid(fmtDate(tt.time))}: ${v} × ${h} ${t('ev.hidden')}" x="${x(i) - bw / 2}" y="${y1}" width="${bw}" height="${Math.max(0, y2 - y1 - 1.5)}" rx="2" fill="${lvlColor(h)}"/>`; acc += v; }
      out += `<text x="${x(i)}" y="${H - pb + 16}" font-size="9" fill="${C.muted}" text-anchor="middle">${fmtTime(tt.time)}</text><text x="${x(i)}" y="${H - pb + 28}" font-size="9" fill="${C.muted}" text-anchor="middle">${tt.gains ? '+' + tt.gains : ''}</text>`;
    });
    const legend = Array.from({ length: levels }, (_, h) => `<span><i style="background:${lvlColor(h)}"></i>${h}${h === levels - 1 && levels > 1 ? '+' : ''}</span>`).join('');
    $('chartTimeline').innerHTML = svg(W, H, out) + `<div class="legend">${legend}</div>`;
  }
  function chartDist() {
    const dist = S.timeline.at(-1)?.dist || []; if (!dist.length) return;
    const W = 600, H = 200, pl = 30, pr = 10, pt = 22, pb = 26; const maxN = Math.max(1, ...dist); const bw = (W - pl - pr) / dist.length;
    let out = '';
    dist.forEach((v, h) => { const bh = (H - pt - pb) * v / maxN, x0 = pl + h * bw + 6; out += `<rect class="hit" data-tip="${v} × ${h} ${t('ev.hidden')}" x="${x0}" y="${H - pb - bh}" width="${bw - 12}" height="${bh}" rx="3" fill="${lvlColor(h)}"/><text x="${x0 + (bw - 12) / 2}" y="${H - pb - bh - 6}" font-size="11" fill="${C.ink}" text-anchor="middle" font-weight="700">${v}</text><text x="${x0 + (bw - 12) / 2}" y="${H - pb + 16}" font-size="10" fill="${C.muted}" text-anchor="middle">${h}</text>`; });
    if (S.currentLevel != null) { const xl = pl + S.currentLevel * bw; out += `<line x1="${xl}" x2="${xl}" y1="${pt - 6}" y2="${H - pb}" stroke="#5fd36b" stroke-dasharray="4 3"/><text x="${xl + 4}" y="${pt}" font-size="9" fill="#5fd36b">${t('stat.ok')} →</text>`; }
    $('chartDist').innerHTML = svg(W, H, out);
  }
  function chartHeat() {
    const heat = S.hourHeat; const maxN = Math.max(1, ...heat);
    $('chartHeat').innerHTML = `<div class="heat">${heat.map((v, h) => `<div class="cell hit" data-tip="${String(h).padStart(2, '0')}:00 — ${v}" style="background:${v ? `rgba(255,138,60,${0.15 + 0.85 * v / maxN})` : 'rgba(255,255,255,0.05)'}"><span>${h}</span></div>`).join('')}</div>`;
  }
  function chartTags() {
    const m = {}; for (const x of S.items) { const k = x.tags[0] || '—'; (m[k] = m[k] || { n: 0, ok: 0 }); m[k].n++; if (x.status === 'ok') m[k].ok++; }
    const rows = Object.entries(m).sort((a, b) => b[1].n - a[1].n).slice(0, 10); const maxN = Math.max(1, ...rows.map((r) => r[1].n));
    $('chartTags').innerHTML = `<div class="bars">${rows.map(([k, v]) => `<div class="bar-row hit" data-tip="${hid(k)}: ${v.ok}/${v.n}"><span class="lbl">${esc(k)}</span><span class="track"><i style="width:${v.n / maxN * 100}%"><b style="width:${v.n ? v.ok / v.n * 100 : 0}%"></b></i></span><span class="val">${v.ok}/${v.n}</span></div>`).join('')}</div><div class="legend"><span><i style="background:#ffc63a"></i>${t('stat.ok')}</span><span><i style="background:#3a3a44"></i>${t('stat.total')}</span></div>`;
  }
  const tip = document.createElement('div'); tip.className = 'tip'; tip.hidden = true; document.body.appendChild(tip);
  document.addEventListener('mousemove', (e) => { const h = e.target.closest?.('.hit'); if (!h) { tip.hidden = true; return; } tip.textContent = h.dataset.tip; tip.hidden = false; tip.style.left = Math.min(innerWidth - 220, e.clientX + 12) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; }, { passive: true });

  // ============ автори ============
  function paintAuthors() {
    const top = S.authors.filter((a) => a.name !== '—').slice(0, 12);
    $('authorsList').innerHTML = top.map((a, i) => `<div class="author-card" data-author="${esc(a.name)}" role="button" tabindex="0">
      <span class="rank-n">${i + 1}</span>${a.avatar ? `<img class="ava big" src="${esc(a.avatar)}" alt="">` : '<i class="ava big"></i>'}
      <div class="author-info"><b>${esc(a.name)}</b><span>${a.ok} ${t('author.ok')} · ${a.count} ${t('author.skins')} · ${t('author.best')} ${a.bestHidden} ${t('author.hid')}</span></div>
      ${a.url ? `<a class="iconbtn" href="${esc(a.url)}" target="_blank" rel="noopener" title="${t('author.profile')}">↗</a>` : ''}
    </div>`).join('');
  }
  function openAuthor(name) {
    const a = S.authors.find((q) => q.name === name); if (!a) return;
    const skins = a.ids.map((id) => byId[id]).filter(Boolean);
    $('modalContent').innerHTML = `<div class="a-head">${a.avatar ? `<img class="ava big" src="${esc(a.avatar)}" alt="">` : ''}<div><h3>${esc(a.name)}</h3><div class="hint">${a.ok} ${t('author.ok')} · ${a.count} ${t('author.skins')} · ${t('author.best')} ${a.bestHidden} ${t('author.hid')}</div></div>
      <div class="m-actions">${a.url ? `<a class="btn3d yellow small" href="${esc(a.url)}" target="_blank" rel="noopener">${t('author.profile')} ↗</a>` : ''}<button class="btn3d blue small" id="aShare">${t('author.share')}</button><button class="btn3d grey small" id="aCopy" data-link="${esc((S.siteUrl || location.href.split('#')[0]) + '#author/' + encodeURIComponent(a.name))}">${t('m.copy')}</button></div></div>
      <div class="hint" style="margin:10px 0 6px">${t('author.all')}</div>
      <div class="grid small" id="aGrid">${skins.map((x, i) => card(x, S.items.indexOf(x))).join('')}</div>
      <canvas id="shareCanvas" width="1200" height="630" hidden></canvas><div id="shareOut"></div>`;
    $('modal').hidden = false; document.body.classList.add('noscroll');
    history.replaceState(null, '', '#author/' + encodeURIComponent(name));
    $('aCopy').addEventListener('click', (e) => copyText(e.currentTarget.dataset.link));
    $('aShare').addEventListener('click', () => shareAuthor(a, skins));
    sound.coin();
  }

  // ============ фільтри та картки ============
  const ui = Object.assign({ q: '', tag: '', author: '', sort: 'rank', showDead: false, onlyNew: false }, store.get('rustober-ui', {}));
  function paintFilters() {
    const tags = [...new Set(S.items.flatMap((x) => x.tags))].sort();
    $('tag').innerHTML = `<option value="">${t('controls.allItems')}</option>` + tags.map((k) => `<option value="${esc(k)}">${esc(k)}</option>`).join('');
    const authors = [...new Set(S.items.map((x) => x.author).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    $('author').innerHTML = `<option value="">${t('controls.allAuthors')}</option>` + authors.map((a) => `<option value="${esc(a)}">${esc(a)}</option>`).join('');
    $('search').value = ui.q; $('tag').value = ui.tag; $('author').value = ui.author; $('sort').value = ui.sort;
    $('showDead').checked = ui.showDead; $('onlyNew').checked = ui.onlyNew;
  }
  const matches = (x) => (!ui.tag || x.tags.includes(ui.tag)) && (!ui.author || x.author === ui.author) && (!ui.onlyNew || x.delta !== 0 || x.eliminatedNow)
    && (!ui.q || `${x.title} ${x.author || ''} ${x.tags.join(' ')} ${x.id}`.toLowerCase().includes(ui.q.toLowerCase()));
  const sc = (x) => x.votes?.score ?? -1;
  const sorter = (a, b) => ({ delta: (b.delta - a.delta) || ((b.hidden ?? -1) - (a.hidden ?? -1)), total: ((b.total ?? 0) - (a.total ?? 0)) || ((b.hidden ?? -1) - (a.hidden ?? -1)), score: (sc(b) - sc(a)) || ((b.hidden ?? -1) - (a.hidden ?? -1)), title: a.title.localeCompare(b.title), author: (a.author || '').localeCompare(b.author || '') || a.title.localeCompare(b.title) }[ui.sort] ?? 0);
  const tier = (x) => Math.min(4, Math.max(1, x.stagesPassed + (S.currentLevel != null && x.hidden > S.currentLevel ? 1 : 0)));
  const compareSel = new Set();

  function card(x, i, opts = {}) {
    const deadC = !x.alive, riskC = x.status === 'risk'; const rank = i + 1; const tr = tierOf(x);
    const cls = ['card', deadC ? 'dead' : 't' + tier(x), 'tier-' + tr, rank <= 3 && x.status === 'ok' ? 'holo' : '', rank === 1 && x.status === 'ok' ? 'gold' : '', riskC ? 'risk' : '', opts.dying ? 'dying' : '', x.manual ? 'manual' : '', compareSel.has(x.id) ? 'selected' : '', watch.has(x.id) ? 'watched' : ''].filter(Boolean).join(' ');
    const totalStages = S.stages.length + 1;
    let pips = ''; for (let k = 0; k < totalStages; k++) pips += `<i class="pip ${k < x.stagesPassed ? 'on' : ''}"></i>`;
    const maxSeries = Math.max(1, ...x.series.map((v) => v ?? 0), S.currentLevel ?? 1);
    const spark = x.series.length > 1 ? `<div class="spark">${x.series.map((v, k) => `<i class="${k === x.series.length - 1 ? 'last' : ''}" style="height:${Math.max(12, Math.round(((v ?? 0) / maxSeries) * 100))}%"></i>`).join('')}</div>` : '';
    const delta = x.delta ? `<div class="delta ${x.delta < 0 ? 'neg' : ''}">${x.delta > 0 ? '+' : ''}${x.delta}</div>` : '';
    const stamp = deadC ? `<div class="stamp">GAME OVER · LVL ${stageNo(x.eliminatedLevel ?? S.currentLevel)}</div>` : riskC ? `<div class="stamp warn">LOW SIGNAL · LVL ${stageNo(x.riskLevel)}</div>` : '';
    const lq = LQIP[x.id] ? `style="background-image:url(${LQIP[x.id]})"` : '';
    const canPred = x.status === 'ok' && (x.hidden ?? 0) < nextLevel() && pred.level === nextLevel();
    const picked = pred.picks.includes(x.id);
    return `<div class="${cls}" style="--i:${Math.min(i, 40)}" data-id="${x.id}" data-open="${x.id}" role="button" tabindex="0" title="${esc(x.title)}">
      <div class="img lq" ${lq}><img loading="lazy" src="${thumb(x.preview)}" alt="" onload="this.classList.add('ld')">
        <div class="rank">#${rank}</div>${delta}${stamp}
        <div class="tier ${tr}">${t('tier.' + tr)}</div>
        ${x.votes && x.votes.score != null ? `<div class="score" title="${t('votes.title')}">${x.votes.score}</div>` : ''}
        <button class="star ${watch.has(x.id) ? 'on' : ''}" data-star="${x.id}" title="watchlist">★</button>
        <div class="pips">${pips}</div>
        <button class="vs ${compareSel.has(x.id) ? 'on' : ''}" data-vs="${x.id}" title="VS">VS</button>
      </div>
      <div class="body">
        <div class="ttl">${esc(x.title)}</div>
        <div class="author"><span class="who" data-author="${esc(x.author || '')}">${x.avatar ? `<img class="ava" src="${esc(x.avatar)}" alt="" loading="lazy">` : '<i class="ava"></i>'}${esc(x.author || '—')}</span><span class="tagchip">${esc(x.tags[0] || '')}</span></div>
        <div class="counters">
          <div class="counter"><b>${x.total ?? '?'}</b><span>${t('c.total')}</span></div>
          <div class="counter pub"><b>${x.pub ?? '?'}</b><span>${t('c.pub')}</span></div>
          <div class="counter hid"><b>${x.hidden ?? '?'}</b><span>${t('c.hid')}</span></div>
        </div>
        ${x.votes ? `<div class="votes"><span title="Score">★ ${x.votes.score ?? '—'}</span><span>👍 ${x.votes.up ?? 0}</span><span>👎 ${x.votes.down ?? 0}</span><span>♥ ${x.votes.favs ?? 0}</span></div>` : ''}
        ${spark}
        ${canPred || picked ? `<button class="pred ${picked ? 'on' : ''}" data-pred="${x.id}">${picked ? t('pred.picked1') : t('pred.pick')}</button>` : ''}
      </div>
    </div>`;
  }

  // прогресивний рендер: перші 48 карток одразу, решта по мірі прокрутки
  const PAGE = 48;
  const pager = {};
  function paintGrid(gridId, sentinelId, list, offsetRank = 0) {
    const grid = $(gridId), sent = $(sentinelId);
    pager[gridId] = { list, shown: 0, offsetRank };
    grid.innerHTML = '';
    appendPage(gridId, sentinelId);
  }
  function appendPage(gridId, sentinelId) {
    const p = pager[gridId]; if (!p) return; const grid = $(gridId), sent = $(sentinelId);
    const chunk = p.list.slice(p.shown, p.shown + PAGE);
    grid.insertAdjacentHTML('beforeend', chunk.map((x, k) => card(x, p.shown + k)).join(''));
    p.shown += chunk.length;
    sent.hidden = p.shown >= p.list.length;
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => { for (const en of ents) if (en.isIntersecting) appendPage(en.target.dataset.grid, en.target.id); }, { rootMargin: '600px' }) : null;
  for (const [sid, gid] of [['aliveMore', 'aliveGrid'], ['deadMore', 'deadGrid']]) { $(sid).dataset.grid = gid; io && io.observe($(sid)); }

  let firstRender = true;
  function render(opts = {}) {
    const a = alive.filter(matches).sort(sorter);
    const d = dead.filter(matches).sort(sorter);
    const dyingIds = new Set((firstRender || opts.animateDying) ? dyingNow.map((x) => x.id) : []);
    paintGrid('aliveGrid', 'aliveMore', a);
    if (dyingIds.size) $('aliveGrid').insertAdjacentHTML('beforeend', dead.filter((x) => dyingIds.has(x.id) && matches(x)).map((x, i) => card({ ...x, alive: true, status: 'ok' }, a.length + i, { dying: true })).join(''));
    $('aliveEmpty').hidden = a.length > 0;
    $('aliveCount').textContent = `${a.length} / ${alive.length}`;
    $('terminated').hidden = !ui.showDead;
    if (ui.showDead) paintGrid('deadGrid', 'deadMore', d); else { $('deadGrid').innerHTML = ''; $('deadMore').hidden = true; }
    $('deadCount').textContent = `${d.length} / ${dead.length}`;
    paintWatch(); paintPredict();
    if (dyingIds.size) { sound.over(); setTimeout(() => { document.querySelectorAll('.card.dying').forEach((el) => el.remove()); toast(t('toast.dying', { n: dyingIds.size })); }, 3200); }
    firstRender = false;
  }
  function paintWatch() {
    const list = [...watch].map((id) => byId[id]).filter(Boolean);
    $('watch').hidden = list.length === 0;
    $('watchGrid').innerHTML = list.map((x) => card(x, S.items.indexOf(x))).join('');
  }
  function paintPredict() {
    const nl = nextLevel();
    const box = $('predictBox');
    const resolved = pred.level != null && S.currentLevel != null && S.currentLevel >= pred.level;
    const picks = pred.picks.map((id) => byId[id]).filter(Boolean);
    let score = '';
    if (resolved && picks.length) { const hit = picks.filter((x) => (x.hidden ?? 0) >= pred.level).length; score = `<div class="pred-score">${t('pred.score')}: <b>${hit}</b> ${t('pred.of')} ${picks.length} · LEVEL ${stageNo(pred.level)}</div>`; }
    box.innerHTML = `<p>${t('pred.intro')}</p>
      <div class="pred-row"><span class="pill small"><span class="ico">✓</span>${t('pred.picked')}: <b>${picks.length}</b> · LEVEL ${stageNo(pred.level)}</span>${score}<button class="btn3d grey small" id="predReset">${t('pred.reset')}</button></div>
      <div class="pred-list">${picks.length ? picks.map((x) => `<button class="pill small" data-open="${x.id}"><img class="ava" src="${thumb(x.preview, 64)}" alt="">${esc(x.title)} <i class="${(x.hidden ?? 0) >= pred.level ? 'ok' : ''}">${x.hidden}/${pred.level}</i></button>`).join('') : `<span class="hint">${t('pred.none')}</span>`}</div>`;
    $('predReset').addEventListener('click', () => { pred.picks = []; pred.level = nl; savePred(); render(); });
  }
  const saveUi = () => store.set('rustober-ui', ui);
  $('search').addEventListener('input', (e) => { ui.q = e.target.value.trim(); saveUi(); render(); });
  $('tag').addEventListener('change', (e) => { ui.tag = e.target.value; saveUi(); render(); });
  $('author').addEventListener('change', (e) => { ui.author = e.target.value; saveUi(); render(); });
  $('sort').addEventListener('change', (e) => { ui.sort = e.target.value; saveUi(); render(); });
  $('showDead').addEventListener('change', (e) => { ui.showDead = e.target.checked; saveUi(); render(); sound.toggle(); });
  $('onlyNew').addEventListener('change', (e) => { ui.onlyNew = e.target.checked; saveUi(); render(); sound.toggle(); });

  if (!reduced) {
    document.addEventListener('mousemove', (e) => { const c = e.target.closest?.('.card'); if (!c || c.classList.contains('dying')) return; const r = c.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; c.style.setProperty('--ry', ((px - 0.5) * 8).toFixed(2) + 'deg'); c.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg'); c.style.setProperty('--mx', (px * 100).toFixed(0) + '%'); c.style.setProperty('--my', (py * 100).toFixed(0) + '%'); }, { passive: true });
    document.addEventListener('mouseout', (e) => { const c = e.target.closest?.('.card'); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); } });
  }

  // ============ модальне вікно скіна ============
  function seriesChart(x) {
    const W = 320, H = 90, p = 10; const vals = x.series.map((v) => v ?? 0); const maxV = Math.max(1, ...vals, S.currentLevel ?? 1);
    const xs = (i) => p + (vals.length === 1 ? (W - 2 * p) / 2 : i * (W - 2 * p) / (vals.length - 1)); const ys = (v) => H - p - (H - 2 * p) * v / maxV;
    const path = vals.map((v, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ');
    const lvl = S.currentLevel != null ? `<line x1="${p}" x2="${W - p}" y1="${ys(S.currentLevel)}" y2="${ys(S.currentLevel)}" stroke="#5fd36b" stroke-dasharray="4 3"/>` : '';
    const dots = vals.map((v, i) => `<circle class="hit" data-tip="${hid(fmtDate(S.snapshots[i]))}: ${v}" cx="${xs(i)}" cy="${ys(v)}" r="4" fill="${i === vals.length - 1 ? '#ff5a3c' : '#ffc63a'}"/>`).join('');
    return svg(W, H, `${lvl}<path d="${path}" fill="none" stroke="#ffc63a" stroke-width="2"/>${dots}`);
  }
  function openSkin(id, push = true) {
    const x = byId[id]; if (!x) { toast(t('toast.notFound')); return; }
    const rank = S.items.indexOf(x) + 1; const evs = S.events.filter((e) => e.id === id).slice(0, 8);
    const link = (S.siteUrl || location.href.split('#')[0]) + '#skin/' + id; const tr = tierOf(x);
    $('modalContent').innerHTML = `
      <div class="m-grid">
        <div class="m-img tier-${tr} ${rank <= 3 && x.status === 'ok' ? 'holo' : ''}"><img src="${thumb(x.preview, 512)}" alt="" id="mImg"><div class="rank">#${rank}</div><div class="tier ${tr}">${t('tier.' + tr)}</div>${x.status === 'dead' ? '<div class="stamp">GAME OVER</div>' : x.status === 'risk' ? '<div class="stamp warn">LOW SIGNAL</div>' : ''}</div>
        <div class="m-info">
          <div class="m-status ${x.status}">${x.status === 'ok' ? t('m.player') : x.status === 'risk' ? t('m.risk') : t('m.dead')}</div>
          <h3>${esc(x.title)}</h3>
          <div class="who big">${x.avatar ? `<img class="ava" src="${esc(x.avatar)}" alt="">` : ''}<a href="#author/${encodeURIComponent(x.author || '')}" data-author="${esc(x.author || '')}">${esc(x.author || '—')}</a> · ${esc(x.tags.join(', '))}</div>
          <div class="counters">
            <div class="counter"><b>${x.total ?? '?'}</b><span>${t('c.total')}</span></div>
            <div class="counter pub"><b>${x.pub ?? '?'}</b><span>${t('c.pub')}</span></div>
            <div class="counter hid"><b>${x.hidden ?? '?'}</b><span>${t('c.hid')}</span></div>
            <div class="counter"><b>${x.stagesPassed}</b><span>${t('c.levels')}</span></div>
          </div>
          ${x.votes ? `<div class="m-votes"><b>${t('votes.title')}</b> <span>★ ${x.votes.score ?? '—'}</span><span>👍 ${x.votes.up ?? 0}</span><span>👎 ${x.votes.down ?? 0}</span><span>♥ ${x.votes.favs ?? 0}</span><span>👁 ${x.votes.views ?? 0}</span> <a href="${esc(S.votesSource || '#')}" target="_blank" rel="noopener">micro522 ↗</a></div>` : ''}
          <div class="m-chart">${seriesChart(x)}<div class="hint">${t('m.chart')}</div></div>
          <div class="m-pub"><b>${t('m.pub')}</b> ${x.pubTitles?.length ? x.pubTitles.map(esc).join('; ') : t('m.pubNone')}</div>
          ${evs.length ? `<div class="m-ev">${evs.map(evLine).join('')}</div>` : ''}
          <div class="m-actions">
            <a class="btn3d yellow small" href="${esc(x.url)}" target="_blank" rel="noopener">${t('m.steam')}</a>
            <button class="btn3d blue small" id="mShare">${t('m.share')}</button>
            <button class="btn3d grey small" id="mCopy" data-link="${esc(link)}">${t('m.copy')}</button>
            <button class="btn3d grey small" id="mVs" data-vs="${x.id}">${compareSel.has(x.id) ? t('m.vsDel') : t('m.vsAdd')}</button>
            <button class="btn3d grey small" id="mWatch" data-star="${x.id}">${watch.has(x.id) ? t('m.watchDel') : t('m.watchAdd')}</button>
          </div>
          <canvas id="shareCanvas" width="1200" height="630" hidden></canvas>
          <div id="shareOut"></div>
        </div>
      </div>`;
    $('modal').hidden = false; document.body.classList.add('noscroll');
    if (push) history.replaceState(null, '', '#skin/' + id);
    sound.coin();
    $('mShare').addEventListener('click', () => shareImage(x));
    $('mCopy').addEventListener('click', (e) => copyText(e.currentTarget.dataset.link));
  }
  function closeModal() { $('modal').hidden = true; document.body.classList.remove('noscroll'); if (/^#(skin|author)\//.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); }
  $('modal').addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  function copyText(tx) { const done = () => toast(t('toast.copied')); if (navigator.clipboard?.writeText) navigator.clipboard.writeText(tx).then(done).catch(() => prompt('Link:', tx)); else prompt('Link:', tx); }

  // ---- картинки для шерингу (canvas) ----
  function shareBase(ctx) {
    ctx.fillStyle = '#0b0b0d'; ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; for (let i = 0; i < 1200; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 630); ctx.stroke(); } for (let i = 0; i < 630; i += 60) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1200, i); ctx.stroke(); }
  }
  const rr = (ctx, px, py, w, h, r, fill) => { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(px, py, w, h, r); ctx.fill(); };
  function shareOutput(cv, ok) {
    const out = $('shareOut');
    try { const url = cv.toDataURL('image/png'); out.innerHTML = `<img class="share-img" src="${url}" alt=""><div class="hint">${ok ? t('m.shareHint') : t('m.shareNoImg')}</div>`; sound.coin(); return true; } catch (e) { return false; }
  }
  function shareImage(x) {
    const cv = $('shareCanvas'), ctx = cv.getContext('2d');
    const shareImg = new Image(); shareImg.crossOrigin = 'anonymous';
    const draw = (withImg) => {
      shareBase(ctx);
      rr(ctx, 60, 60, 480, 510, 36, '#e8e5de'); rr(ctx, 90, 90, 420, 420, 20, '#213553');
      let drew = false;
      if (withImg) { try { if (shareImg.complete && shareImg.naturalWidth) { ctx.drawImage(shareImg, 100, 100, 400, 400); drew = true; } } catch (e) {} }
      if (!drew) { ctx.fillStyle = '#ffc63a'; ctx.font = '22px "Press Start 2P", monospace'; ctx.textAlign = 'center'; ctx.fillText('RUSTOBER', 300, 290); ctx.fillText('SELECTION', 300, 330); ctx.textAlign = 'left'; }
      ['#2f7bff', '#ffc63a', '#ff5a3c'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(130 + i * 50, 540, 16, 0, 7); ctx.fill(); });
      ctx.fillStyle = '#ffc63a'; ctx.beginPath(); ctx.arc(470, 540, 26, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffc63a'; ctx.font = '26px "Press Start 2P", monospace'; ctx.fillText('RUSTOBER', 600, 110); ctx.fillStyle = '#fff'; ctx.fillText('SELECTION', 600, 150);
      ctx.fillStyle = '#f2f0ea'; ctx.font = '800 34px Rubik, sans-serif';
      const words = x.title.split(' '); let line = '', y0 = 230; for (const w of words) { const tx = line ? line + ' ' + w : w; if (ctx.measureText(tx).width > 540) { ctx.fillText(line, 600, y0); y0 += 42; line = w; } else line = tx; } ctx.fillText(line, 600, y0);
      ctx.fillStyle = '#9a97a0'; ctx.font = '600 24px Rubik, sans-serif'; ctx.fillText(`by ${x.author || '—'}`, 600, y0 + 44);
      const st = x.status === 'ok' ? ['PLAYER', '#5fd36b'] : x.status === 'risk' ? ['LOW SIGNAL', '#ffc63a'] : ['GAME OVER', '#ff5a3c'];
      ctx.fillStyle = st[1]; ctx.font = '22px "Press Start 2P", monospace'; ctx.fillText(`${st[0]} · ${t('tier.' + tierOf(x))}`, 600, y0 + 110);
      ctx.fillStyle = '#f2f0ea'; ctx.font = '700 26px Rubik, sans-serif'; ctx.fillText(`#${S.items.indexOf(x) + 1} · ${x.hidden ?? '?'} hidden · ${x.total ?? '?'} collections`, 600, y0 + 160);
      ctx.fillStyle = '#9a97a0'; ctx.font = '500 20px Rubik, sans-serif'; ctx.fillText((S.siteUrl || '').replace(/^https?:\/\//, '') || 'rustober selection', 600, 580);
    };
    const go = () => { draw(true); if (!shareOutput(cv, true)) { draw(false); shareOutput(cv, false); } };
    shareImg.onload = go; shareImg.onerror = () => { draw(false); shareOutput(cv, false); };
    shareImg.src = thumb(x.preview, 512);
  }
  function shareAuthor(a, skins) {
    const cv = $('shareCanvas'), ctx = cv.getContext('2d');
    shareBase(ctx);
    ctx.fillStyle = '#ffc63a'; ctx.font = '26px "Press Start 2P", monospace'; ctx.fillText('RUSTOBER', 70, 90); ctx.fillStyle = '#fff'; ctx.fillText('SELECTION', 70, 130);
    ctx.fillStyle = '#f2f0ea'; ctx.font = '800 44px Rubik, sans-serif'; ctx.fillText(a.name, 70, 210);
    ctx.fillStyle = '#9a97a0'; ctx.font = '600 24px Rubik, sans-serif'; ctx.fillText(`${a.ok} ${t('author.ok')} · ${a.count} ${t('author.skins')} · LEVEL ${stageNo(S.currentLevel)}`, 70, 250);
    const list = skins.slice(0, 8); const cols = 4, size = 220, gx = 70, gy = 300;
    const imgs = list.map((x) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.src = thumb(x.preview, 256); return { x, img }; });
    let loaded = 0; const finish = () => {
      imgs.forEach(({ x, img }, i) => { const px = gx + (i % cols) * (size + 40), py = gy + Math.floor(i / cols) * (size + 40); rr(ctx, px, py, size, size, 16, '#213553'); try { if (img.naturalWidth) ctx.drawImage(img, px + 8, py + 8, size - 16, size - 16); } catch (e) {} const st = x.status === 'ok' ? '#5fd36b' : x.status === 'risk' ? '#ffc63a' : '#ff5a3c'; ctx.fillStyle = st; ctx.font = '12px "Press Start 2P", monospace'; ctx.fillText(`#${S.items.indexOf(x) + 1} · ${x.hidden}H`, px + 10, py + size - 12); });
      ctx.fillStyle = '#9a97a0'; ctx.font = '500 20px Rubik, sans-serif'; ctx.fillText((S.siteUrl || '').replace(/^https?:\/\//, ''), 70, 600);
      shareOutput(cv, true) || shareOutput(cv, false);
    };
    if (!imgs.length) finish();
    imgs.forEach(({ img }) => { img.onload = img.onerror = () => { if (++loaded === imgs.length) finish(); }; });
  }

  // ============ порівняння ============
  function paintCompare() {
    const box = $('compare'); const sel = [...compareSel].map((id) => byId[id]).filter(Boolean);
    box.hidden = sel.length === 0;
    $('compareHint').textContent = sel.length < 2 ? t('cmp.one', { n: sel.length }) : t('cmp.many', { n: sel.length });
    const rows = [[t('cmp.rank'), (x) => '#' + (S.items.indexOf(x) + 1)], [t('cmp.status'), (x) => x.status === 'ok' ? 'PLAYER' : x.status === 'risk' ? 'LOW SIGNAL' : 'GAME OVER'], [t('cmp.hidden'), (x) => x.hidden ?? '?'], [t('cmp.total'), (x) => x.total ?? '?'], [t('cmp.pub'), (x) => x.pub ?? '?'], [t('cmp.levels'), (x) => x.stagesPassed], [t('cmp.delta'), (x) => (x.delta > 0 ? '+' : '') + x.delta]];
    $('compareBody').innerHTML = `<table><thead><tr><th></th>${sel.map((x) => `<th><img src="${thumb(x.preview, 128)}" alt=""><div>${esc(x.title)}</div><button class="iconbtn" data-vs="${x.id}">✕</button></th>`).join('')}</tr></thead><tbody>${rows.map(([l, f]) => `<tr><td>${l}</td>${sel.map((x) => `<td>${f(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function toggleCompare(id) {
    if (compareSel.has(id)) compareSel.delete(id); else { if (compareSel.size >= 3) { toast(t('cmp.max')); return; } compareSel.add(id); }
    sound.toggle(); paintCompare();
    document.querySelectorAll(`[data-vs="${id}"]`).forEach((b) => b.classList.toggle('on', compareSel.has(id)));
    document.querySelectorAll(`.card[data-id="${id}"]`).forEach((c) => c.classList.toggle('selected', compareSel.has(id)));
    const mv = $('mVs'); if (mv && mv.dataset.vs === id) mv.textContent = compareSel.has(id) ? t('m.vsDel') : t('m.vsAdd');
  }
  $('compareClear').addEventListener('click', () => { compareSel.clear(); paintCompare(); render(); });
  function toggleWatch(id) {
    if (watch.has(id)) watch.delete(id); else watch.add(id);
    saveWatch(); sound.toggle();
    document.querySelectorAll(`[data-star="${id}"]`).forEach((b) => { b.classList.toggle('on', watch.has(id)); if (b.id === 'mWatch') b.textContent = watch.has(id) ? t('m.watchDel') : t('m.watchAdd'); });
    document.querySelectorAll(`.card[data-id="${id}"]`).forEach((c) => c.classList.toggle('watched', watch.has(id)));
    paintWatch();
  }
  function togglePred(id) {
    const nl = nextLevel(); if (pred.level !== nl) { pred.level = nl; pred.picks = []; }
    const i = pred.picks.indexOf(id); if (i >= 0) pred.picks.splice(i, 1); else pred.picks.push(id);
    savePred(); sound.toggle();
    document.querySelectorAll(`[data-pred="${id}"]`).forEach((b) => { const on = pred.picks.includes(id); b.classList.toggle('on', on); b.textContent = on ? t('pred.picked1') : t('pred.pick'); });
    paintPredict();
  }

  // делегування кліків
  document.addEventListener('click', (e) => {
    const vs = e.target.closest('[data-vs]'); if (vs) { e.preventDefault(); e.stopPropagation(); toggleCompare(vs.dataset.vs); return; }
    const st = e.target.closest('[data-star]'); if (st) { e.preventDefault(); e.stopPropagation(); toggleWatch(st.dataset.star); return; }
    const pr = e.target.closest('[data-pred]'); if (pr) { e.preventDefault(); e.stopPropagation(); togglePred(pr.dataset.pred); return; }
    const au = e.target.closest('[data-author]'); if (au && au.dataset.author && !e.target.closest('a.iconbtn')) { e.preventDefault(); e.stopPropagation(); openAuthor(au.dataset.author); return; }
    const op = e.target.closest('[data-open]'); if (op && !e.target.closest('a, button')) openSkin(op.dataset.open);
  });
  document.addEventListener('keydown', (e) => { const op = e.target.closest?.('[data-open]'); if (op && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openSkin(op.dataset.open); } });

  // ============ знайти мій скін ============
  $('findForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('findInput').value.trim(); const m = v.match(/(\d{6,})/); const id = m ? m[1] : null; const box = $('findResult'); box.hidden = false;
    if (!id || !byId[id]) {
      const q = v.toLowerCase(); const hits = q.length > 2 ? S.items.filter((x) => x.title.toLowerCase().includes(q) || (x.author || '').toLowerCase().includes(q)).slice(0, 6) : [];
      box.innerHTML = hits.length ? `<div class="hint">${t('find.byName')}</div><div class="find-hits">${hits.map((x) => `<button class="pill" data-open="${x.id}"><img class="ava" src="${thumb(x.preview, 64)}" alt="">${esc(x.title)}</button>`).join('')}</div>` : `<div class="empty">${t('find.none')}</div>`;
      return;
    }
    box.innerHTML = ''; openSkin(id); sound.coin();
  });

  // ============ живе оновлення без перезавантаження (FLIP) ============
  function paintAll() { paintHeader(); paintPodium(); paintStages(); paintLog(); chartTimeline(); chartDist(); chartHeat(); chartTags(); paintAuthors(); paintFilters(); paintCompare(); paintCountdown(); paintHowto(); render(); window.RSTBR?.onPaint?.(); }
  function applyNewState(N) {
    const old = byId;
    const before = {}; document.querySelectorAll('#aliveGrid .card').forEach((c) => { before[c.dataset.id] = c.getBoundingClientRect(); });
    S = N; window.STATE = N; derive();
    paintHeader(); paintPodium(); paintStages(); paintLog(); chartTimeline(); chartDist(); chartHeat(); chartTags(); paintAuthors(); paintFilters(); paintHowto();
    render({ animateDying: true });
    let gains = 0; const watched = [];
    document.querySelectorAll('#aliveGrid .card').forEach((c) => {
      const id = c.dataset.id, b = before[id]; const a = c.getBoundingClientRect();
      if (b) { const dx = b.left - a.left, dy = b.top - a.top; if (dx || dy) { c.style.transition = 'none'; c.style.transform = `translate(${dx}px, ${dy}px)`; requestAnimationFrame(() => { c.style.transition = 'transform 0.8s cubic-bezier(.2,.8,.2,1)'; c.style.transform = ''; }); } }
      const o = old[id], n = byId[id]; if (o && n && (n.hidden ?? 0) > (o.hidden ?? 0)) { c.classList.add('flash'); gains++; setTimeout(() => c.classList.remove('flash'), 2500); }
    });
    for (const id of watch) { const o = old[id], n = byId[id]; if (o && n && (o.hidden !== n.hidden || o.status !== n.status)) watched.push(n.title); }
    if (watched.length) toast(t('toast.watch', { names: watched.join(', ') }));
    else if (gains) { sound.gain(); toast(t('toast.gains', { n: gains })); } else toast(t('toast.newSnap', { t: fmtTime(S.snapshots.at(-1)) }));
    window.RSTBR?.onPaint?.();
  }
  if (location.protocol.startsWith('http')) {
    setInterval(async () => {
      try {
        const tx = await (await fetch('state.js', { cache: 'no-store' })).text();
        const m = tx.match(/"generated":"([^"]+)"/); if (!m || m[1] === S.generated) return;
        const N = JSON.parse(tx.slice(tx.indexOf('=') + 1).trim().replace(/;\s*$/, '')); if (N && N.items) applyNewState(N);
      } catch (e) {}
    }, 2 * 60 * 1000);
  }

  // ============ TV-режим ============
  let tvTimer = null, tvPage = 0;
  function tvPaint() {
    const list = alive.filter((x) => x.status === 'ok'); const per = 6; const pages = Math.max(1, Math.ceil(list.length / per));
    tvPage = tvPage % pages; const chunk = list.slice(tvPage * per, tvPage * per + per);
    $('tvTitle').textContent = `TOP PLAYERS · ${tvPage * per + 1}–${tvPage * per + chunk.length} / ${list.length} · LEVEL ${stageNo(S.currentLevel)}`;
    $('tvBody').innerHTML = chunk.map((x, i) => card(x, tvPage * per + i)).join(''); tvPage++;
  }
  function tvOpen() { $('tv').hidden = false; document.body.classList.add('noscroll'); tvPage = 0; tvPaint(); tvTimer = setInterval(tvPaint, 8000); document.documentElement.requestFullscreen?.().catch(() => {}); history.replaceState(null, '', '#tv'); }
  function tvClose() { $('tv').hidden = true; document.body.classList.remove('noscroll'); clearInterval(tvTimer); if (document.fullscreenElement) document.exitFullscreen?.(); if (location.hash === '#tv') history.replaceState(null, '', location.pathname); }
  $('tvBtn').addEventListener('click', tvOpen);

  // ============ клавіатура ============
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (!$('game').hidden) gameClose(); else if (!$('tv').hidden) tvClose(); else if (!$('modal').hidden) closeModal(); else if (!$('themePop').hidden) $('themePop').hidden = true; }
    if (e.key === '/' && !e.target.matches('input, textarea, select')) { e.preventDefault(); $('search').focus(); $('search').select(); }
  });

  // ============ Konami: впіймай гарбуз ============
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kIdx = 0, gameRaf = null, gameState = null;
  document.addEventListener('keydown', (e) => { kIdx = e.key === KONAMI[kIdx] ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0); if (kIdx === KONAMI.length) { kIdx = 0; gameOpen(); } });
  function gameOpen() {
    $('game').hidden = false; document.body.classList.add('noscroll'); sound.power();
    const cv = $('gameCanvas'), ctx = cv.getContext('2d');
    gameState = { x: 240, score: 0, items: [], t: 0, lives: 3 };
    const keys = {}; const kd = (e) => { keys[e.key] = true; }, ku = (e) => { keys[e.key] = false; };
    document.addEventListener('keydown', kd); document.addEventListener('keyup', ku);
    cv.onmousemove = (e) => { const r = cv.getBoundingClientRect(); gameState.x = (e.clientX - r.left) / r.width * 480; };
    cv.ontouchmove = (e) => { const r = cv.getBoundingClientRect(); gameState.x = (e.touches[0].clientX - r.left) / r.width * 480; };
    const drawPumpkin = (px, py, s) => PUMPKIN.forEach((row, y) => [...row].forEach((ch, x) => { if (PCOL[ch]) { ctx.fillStyle = PCOL[ch]; ctx.fillRect(px + x * s, py + y * s, s, s); } }));
    const loop = () => {
      const g = gameState; g.t++;
      if (keys.ArrowLeft) g.x -= 7; if (keys.ArrowRight) g.x += 7; g.x = Math.max(30, Math.min(450, g.x));
      if (g.t % Math.max(18, 45 - Math.floor(g.score / 5)) === 0) g.items.push({ x: 20 + Math.random() * 400, y: -40, v: 2 + Math.random() * 2 + g.score / 20, bad: Math.random() < 0.25 });
      ctx.fillStyle = '#0b0b0d'; ctx.fillRect(0, 0, 480, 640); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; for (let i = 0; i < 480; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 640); ctx.stroke(); }
      for (const it of g.items) { it.y += it.v; if (it.bad) { ctx.fillStyle = '#ff5a3c'; ctx.fillRect(it.x - 10, it.y - 10, 20, 20); ctx.fillStyle = '#0b0b0d'; ctx.fillRect(it.x - 5, it.y - 5, 10, 10); } else drawPumpkin(it.x - 21, it.y - 21, 3); if (it.y > 560 && it.y < 600 && Math.abs(it.x - g.x) < 45) { it.y = 9999; if (it.bad) { g.lives--; sound.over(); } else { g.score++; sound.coin(); } } }
      g.items = g.items.filter((it) => it.y < 700);
      ctx.fillStyle = '#e8e5de'; ctx.beginPath(); ctx.roundRect(g.x - 45, 580, 90, 28, 10); ctx.fill(); ctx.fillStyle = '#213553'; ctx.fillRect(g.x - 35, 586, 70, 10);
      ctx.fillStyle = '#ffc63a'; ctx.font = '14px "Press Start 2P", monospace'; ctx.fillText(`SCORE ${g.score}`, 16, 30); ctx.fillText('♥'.repeat(Math.max(0, g.lives)), 380, 30);
      $('gameScore').textContent = g.score;
      if (g.lives <= 0) { ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, 480, 640); ctx.fillStyle = '#ff5a3c'; ctx.font = '26px "Press Start 2P", monospace'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', 240, 300); ctx.fillStyle = '#fff'; ctx.font = '12px "Press Start 2P", monospace'; ctx.fillText(`SCORE ${g.score} · ESC`, 240, 340); ctx.textAlign = 'left'; document.removeEventListener('keydown', kd); document.removeEventListener('keyup', ku); return; }
      gameRaf = requestAnimationFrame(loop);
    };
    gameRaf = requestAnimationFrame(loop); $('gameClose').onclick = gameClose;
    gameState._cleanup = () => { document.removeEventListener('keydown', kd); document.removeEventListener('keyup', ku); };
  }
  function gameClose() { cancelAnimationFrame(gameRaf); gameState?._cleanup?.(); $('game').hidden = true; document.body.classList.remove('noscroll'); }

  function paintHowto() { $('howtoBody').innerHTML = t('howto.html', { base: S.baseHidden, minWave: S.minWave, share: Math.round(S.minWaveShare * 100) }); }
  function toast(msg) { const tt = $('toast'); tt.textContent = msg; tt.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => (tt.hidden = true), 4500); }

  // ============ мова ============
  $('langBtn').addEventListener('click', () => { window.setLang(window.LANG === 'ua' ? 'en' : 'ua'); paintAll(); });

  // ============ публічний інтерфейс для v3.js ============
  window.RSTBR = { get S() { return S; }, get alive() { return alive; }, byId: () => byId, card, openSkin, openAuthor, render, paintAll, thumb, esc, t, stageNo, fmtTime, fmtDate, sound, tierOf, toast, store, onPaint: null };

  // ============ старт ============
  paintAll();
  if (dyingNow.length) toast(t('toast.dying', { n: dyingNow.length }));
  const h = decodeURIComponent(location.hash || '');
  if (h.startsWith('#skin/')) openSkin(h.slice(6), false);
  else if (h.startsWith('#author/')) openAuthor(h.slice(8));
  else if (h === '#tv') tvOpen();
})();
