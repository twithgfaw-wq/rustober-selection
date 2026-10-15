// Rust Arcade: SCRAP SNAKE — змійка в стилі Rust, що збирає скрап. Canvas, піксель-арт, звук WebAudio.
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  try { history.scrollRestoration = 'manual'; } catch (e) {}

  // ---- тема (видання консолі), як на інших сторінках ----
  const root = document.documentElement;
  const setEdition = (e) => { root.dataset.edition = e; store.set('rstbr-edition', e); document.querySelectorAll('.theme-grid button').forEach((b) => b.classList.toggle('on', b.dataset.theme === e)); };
  setEdition(store.get('rstbr-edition', 'grey'));
  $('themeBtn').addEventListener('click', () => { $('themePop').hidden = !$('themePop').hidden; });
  document.querySelectorAll('.theme-grid button').forEach((b) => b.addEventListener('click', () => setEdition(b.dataset.theme)));
  document.addEventListener('click', (e) => { if (!e.target.closest('#themePop, #themeBtn')) $('themePop').hidden = true; });

  // ---- звук ----
  const sound = {
    on: store.get('rstbr-sound', false), ctx: null,
    ensure() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; },
    beep(freq = 440, dur = 0.08, type = 'square', vol = 0.05, slide = 0) {
      if (!this.on) return; const c = this.ensure(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(freq, c.currentTime);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), c.currentTime + dur);
      g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + dur);
    },
    eat() { this.beep(880, 0.06); setTimeout(() => this.beep(1320, 0.08), 60); },
    gold() { this.beep(1568, 0.06); setTimeout(() => this.beep(2093, 0.08), 60); setTimeout(() => this.beep(2637, 0.12), 130); },
    turn() { this.beep(300, 0.03, 'square', 0.02); },
    over() { this.beep(400, 0.18, 'square', 0.06, -250); setTimeout(() => this.beep(200, 0.35, 'square', 0.06, -120), 180); },
    start() { this.beep(220, 0.2, 'sawtooth', 0.04, 600); setTimeout(() => this.beep(880, 0.12), 200); },
    level() { this.beep(660, 0.06); setTimeout(() => this.beep(880, 0.06), 70); setTimeout(() => this.beep(1100, 0.1), 140); },
  };
  const paintSound = () => { $('soundBtn').textContent = sound.on ? '🔊' : '🔇'; $('soundBtn').classList.toggle('active', sound.on); };
  const toggleSound = () => { sound.on = !sound.on; store.set('rstbr-sound', sound.on); paintSound(); if (sound.on) { sound.ensure(); sound.eat(); } };
  paintSound(); $('soundBtn').addEventListener('click', toggleSound); $('btnSound').addEventListener('click', toggleSound);

  // ---- піксель-арт ----
  const P = {
    // скрап: купка іржавого металу з шестернею
    scrap: ['......ss......', '....ssggss....', '...sggGGggs...', '..sgGGyyGGgs..', '.sgGyyyyyyGgs.', '.sgGyyYYyyGgs.', 'sgGGyYYYYyGGgs', 'sgGGyYYYYyGGgs', '.sgGyyYYyyGgs.', '.sgGyyyyyyGgs.', '..sgGGyyGGgs..', '...sggGGggs...', '....ssggss....', '......ss......'],
    // голова: шолом хазмату з візором
    head: ['....oooooo....', '..oooooooooo..', '.oooOOOOOOooo.', '.ooOkkkkkkOoo.', 'oooOkbbbbkOooo', 'oooOkbkkbkOooo', 'oooOkbbbbkOooo', 'oooOkkkkkkOooo', '.ooOOOOOOOOoo.', '.oooooooooooo.', '..oorrrrrroo..', '..oorrrrrroo..', '...oooooooo...', '....oooooo....'],
    // сегмент: іржава металева пластина з заклепками
    body: ['.rrrrrrrrrrrr.', 'rRRRRRRRRRRRRr', 'rRdRRRRRRRRdRr', 'rRRRRRRRRRRRRr', 'rRRRRrrrrRRRRr', 'rRRRrbbbbrRRRr', 'rRRRrbbbbrRRRr', 'rRRRrbbbbrRRRr', 'rRRRrbbbbrRRRr', 'rRRRRrrrrRRRRr', 'rRRRRRRRRRRRRr', 'rRdRRRRRRRRdRr', 'rRRRRRRRRRRRRr', '.rrrrrrrrrrrr.'],
    // бочка (перешкода)
    barrel: ['..bbbbbbbbbb..', '.bBBBBBBBBBBb.', 'bBBBBBBBBBBBBb', 'bBBBBBBBBBBBBb', 'bbbbbbbbbbbbbb', 'bBBBBBBBBBBBBb', 'bBBBBBggBBBBBb', 'bBBBBggggBBBBb', 'bBBBBBggBBBBBb', 'bBBBBBBBBBBBBb', 'bbbbbbbbbbbbbb', 'bBBBBBBBBBBBBb', '.bBBBBBBBBBBb.', '..bbbbbbbbbb..'],
  };
  const COL = { s: '#5a4634', g: '#8a6a44', G: '#b08a56', y: '#d9b06a', Y: '#f2d58e', o: '#e3a72a', O: '#ffd36a', k: '#1b1b1f', b: '#2f3b4a', r: '#8a4a26', R: '#b86a38', d: '#5a2e14', B: '#5f6b3a' };
  const COLG = { ...COL, s: '#7a6a2a', g: '#b89a2a', G: '#e0c030', y: '#ffd93a', Y: '#fff2a0' };
  const sprites = {};
  function sprite(name, map, cols) {
    const key = name; if (sprites[key]) return sprites[key];
    const c = document.createElement('canvas'); c.width = 14; c.height = 14; const x = c.getContext('2d');
    map.forEach((row, yy) => [...row].forEach((ch, xx) => { if (cols[ch]) { x.fillStyle = cols[ch]; x.fillRect(xx, yy, 1, 1); } }));
    return (sprites[key] = c);
  }
  const SPR = { scrap: sprite('scrap', P.scrap, COL), gold: sprite('gold', P.scrap, COLG), head: sprite('head', P.head, COL), body: sprite('body', P.body, COL), barrel: sprite('barrel', P.barrel, COL) };

  // ---- гра ----
  const cv = $('game'), ctx = cv.getContext('2d');
  const COLS = 24, ROWS = 18, CELL = 20; cv.width = COLS * CELL; cv.height = ROWS * CELL;
  ctx.imageSmoothingEnabled = false;
  const G = { snake: [], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, queue: [], food: null, gold: null, goldTtl: 0, barrels: [], score: 0, speed: 1, tick: 0, acc: 0, alive: false, paused: false, started: false, eaten: 0, best: store.get('rstbr-snake-best', 0), flash: 0, shake: 0, particles: [] };
  const board = () => store.get('rstbr-snake-board', []);
  const stepMs = () => Math.max(60, 150 - (G.speed - 1) * 12);
  const same = (a, b) => a.x === b.x && a.y === b.y;
  const freeCell = () => { for (let i = 0; i < 500; i++) { const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; if (!G.snake.some((s) => same(s, p)) && !G.barrels.some((b) => same(b, p)) && !(G.food && same(G.food, p)) && !(G.gold && same(G.gold, p))) return p; } return null; };
  function reset() {
    G.snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }]; G.dir = { x: 1, y: 0 }; G.next = { x: 1, y: 0 }; G.queue = [];
    G.barrels = []; G.food = freeCell(); G.gold = null; G.goldTtl = 0; G.score = 0; G.speed = 1; G.eaten = 0; G.acc = 0; G.alive = true; G.paused = false; G.started = true; G.particles = []; G.flash = 0;
    hud(); $('overlay').hidden = true; $('ledAlive').classList.add('on'); sound.start();
  }
  function hud() { $('hudScore').textContent = `SCRAP ${G.score}`; $('hudBest').textContent = `BEST ${G.best}`; $('hudSpeed').textContent = `SPD ${G.speed}`; }
  function turn(d) {
    const last = G.queue.length ? G.queue[G.queue.length - 1] : G.dir;
    if ((d.x && last.x) || (d.y && last.y)) return; // не розвертаємось на 180° і не дублюємо
    if (G.queue.length < 2) { G.queue.push(d); sound.turn(); }
    if (!G.started || !G.alive) start(); else if (G.paused) G.paused = false;
  }
  const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  function step() {
    if (G.queue.length) G.dir = G.queue.shift();
    const h = G.snake[0]; const n = { x: h.x + G.dir.x, y: h.y + G.dir.y };
    if (n.x < 0 || n.y < 0 || n.x >= COLS || n.y >= ROWS || G.snake.some((s, i) => i < G.snake.length - 1 && same(s, n)) || G.barrels.some((b) => same(b, n))) return die();
    G.snake.unshift(n);
    let grew = false;
    if (G.food && same(n, G.food)) { G.score++; G.eaten++; grew = true; sound.eat(); burst(n, '#f2d58e'); G.food = freeCell(); if (G.eaten % 5 === 0) { G.speed++; sound.level(); G.flash = 6; if (G.speed >= 3 && G.barrels.length < 6) { const b = freeCell(); if (b && !near(b, n)) G.barrels.push(b); } } if (!G.gold && Math.random() < 0.18) { G.gold = freeCell(); G.goldTtl = 60; } }
    else if (G.gold && same(n, G.gold)) { G.score += 5; grew = true; sound.gold(); burst(n, '#ffd93a'); G.gold = null; }
    if (!grew) G.snake.pop();
    if (G.gold && --G.goldTtl <= 0) G.gold = null;
    if (G.score > G.best) { G.best = G.score; store.set('rstbr-snake-best', G.best); }
    hud();
  }
  const near = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) < 4;
  function burst(p, color) { for (let i = 0; i < 10; i++) G.particles.push({ x: p.x * CELL + CELL / 2, y: p.y * CELL + CELL / 2, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 18, color }); }
  function die() {
    G.alive = false; G.shake = 10; sound.over(); $('ledAlive').classList.remove('on');
    const b = board(); const qualifies = G.score > 0 && (b.length < 5 || G.score > b[b.length - 1].score);
    $('ovTitle').textContent = 'GAME OVER'; $('ovText').innerHTML = `SCRAP ${G.score} · BEST ${G.best}`; $('startBtn').textContent = 'RETRY ▶'; $('ovSub').textContent = qualifies ? 'NEW HIGH SCORE!' : 'PRESS START';
    setTimeout(() => { $('overlay').hidden = false; if (qualifies) askName(); }, 500);
  }
  function askName() { $('nameText').textContent = `SCRAP ${G.score}`; $('nameInput').value = store.get('rstbr-name', ''); $('nameModal').hidden = false; setTimeout(() => $('nameInput').focus(), 50); }
  function saveName(skip) {
    const name = skip ? '' : ($('nameInput').value.trim().toUpperCase() || 'PLAYER'); if (name) store.set('rstbr-name', name);
    const b = board(); b.push({ name: name || 'PLAYER', score: G.score, at: new Date().toISOString() }); b.sort((p, q) => q.score - p.score); store.set('rstbr-snake-board', b.slice(0, 5));
    $('nameModal').hidden = true; paintBoard();
  }
  $('nameSave').addEventListener('click', () => saveName(false)); $('nameSkip').addEventListener('click', () => saveName(true));
  $('nameInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveName(false); e.stopPropagation(); });
  function paintBoard() { const b = board(); $('boardList').innerHTML = b.length ? b.map((r, i) => `<li><span>${i + 1}.</span><span>${r.name.replace(/[<>&]/g, '')}</span><span>${r.score}</span></li>`).join('') : '<li><span>—</span><span>поки порожньо</span><span></span></li>'; }
  function start() { reset(); }
  $('startBtn').addEventListener('click', start);
  $('btnRestart').addEventListener('click', () => { if (G.started) reset(); else start(); });
  $('btnPause').addEventListener('click', () => { if (G.alive) { G.paused = !G.paused; } });
  document.addEventListener('keydown', (e) => {
    if (!$('nameModal').hidden) return;
    const k = e.key.toLowerCase();
    const map = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
    if (map[k]) { e.preventDefault(); turn(DIRS[map[k]]); }
    else if (k === ' ' || k === 'p') { e.preventDefault(); if (!G.started || !G.alive) start(); else G.paused = !G.paused; }
    else if (k === 'r') start();
  });
  $('dpad').addEventListener('pointerdown', (e) => { const b = e.target.closest('button[data-dir]'); if (b) { e.preventDefault(); turn(DIRS[b.dataset.dir]); } });
  // свайпи по екрану
  let sx = 0, sy = 0, st = 0;
  cv.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; st = Date.now(); cv.setPointerCapture(e.pointerId); }, { passive: true });
  cv.addEventListener('pointerup', (e) => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.abs(dx) < 14 && Math.abs(dy) < 14) { if (Date.now() - st < 300) { if (!G.started || !G.alive) start(); else G.paused = !G.paused; } return; } turn(Math.abs(dx) > Math.abs(dy) ? DIRS[dx > 0 ? 'right' : 'left'] : DIRS[dy > 0 ? 'down' : 'up']); });
  cv.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  // ---- рендер ----
  let last = performance.now();
  function draw(now) {
    const dt = now - last; last = now;
    if (G.alive && !G.paused) { G.acc += dt; while (G.acc >= stepMs()) { G.acc -= stepMs(); step(); if (!G.alive) break; } }
    ctx.save();
    if (G.shake > 0) { ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6); G.shake--; }
    // фон: темна сітка як на екрані консолі
    ctx.fillStyle = G.flash > 0 ? '#2a4466' : '#213553'; if (G.flash > 0) G.flash--;
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = 'rgba(159,208,255,0.08)'; ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL + 0.5, 0); ctx.lineTo(x * CELL + 0.5, cv.height); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL + 0.5); ctx.lineTo(cv.width, y * CELL + 0.5); ctx.stroke(); }
    const put = (spr, p, scale = 1) => { const s = CELL * scale, o = (CELL - s) / 2; ctx.drawImage(spr, p.x * CELL + o, p.y * CELL + o, s, s); };
    for (const b of G.barrels) put(SPR.barrel, b);
    if (G.food) { const bob = Math.sin(now / 180) * 0.08 + 1; put(SPR.scrap, G.food, bob); }
    if (G.gold) { const bob = Math.sin(now / 90) * 0.15 + 1.05; put(SPR.gold, G.gold, bob); ctx.fillStyle = '#ffd93a'; ctx.fillRect(G.gold.x * CELL + 2, G.gold.y * CELL + CELL - 3, (CELL - 4) * (G.goldTtl / 60), 2); }
    for (let i = G.snake.length - 1; i >= 1; i--) put(SPR.body, G.snake[i], 0.92);
    if (G.snake.length) {
      const h = G.snake[0]; ctx.save(); ctx.translate(h.x * CELL + CELL / 2, h.y * CELL + CELL / 2);
      const ang = G.dir.x === 1 ? 0 : G.dir.x === -1 ? Math.PI : G.dir.y === -1 ? -Math.PI / 2 : Math.PI / 2; ctx.rotate(ang + Math.PI / 2);
      ctx.drawImage(SPR.head, -CELL / 2, -CELL / 2, CELL, CELL); ctx.restore();
    }
    for (const p of G.particles) { p.x += p.vx; p.y += p.vy; p.life--; ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life / 18); ctx.fillRect(p.x, p.y, 3, 3); }
    ctx.globalAlpha = 1; G.particles = G.particles.filter((p) => p.life > 0);
    if (G.paused && G.alive) { ctx.fillStyle = 'rgba(13,26,43,0.6)'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.fillStyle = '#ffd36a'; ctx.font = '16px "Press Start 2P", monospace'; ctx.textAlign = 'center'; ctx.fillText('PAUSE', cv.width / 2, cv.height / 2); ctx.textAlign = 'left'; }
    // скан-лінії
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let y = 0; y < cv.height; y += 3) ctx.fillRect(0, y, cv.width, 1);
    ctx.restore();
    requestAnimationFrame(draw);
  }
  // демо-режим на стартовому екрані: змійка сама повзає по колу
  G.snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }]; G.food = { x: 15, y: 9 };
  hud(); paintBoard(); requestAnimationFrame(draw);
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.alive) G.paused = true; });
})();
