// Rust Arcade: SCRAP SNAKE — змійка в стилі Rust (хазмат-голова, іржаве тіло, скрап, бочки). Canvas 640×480, плавний рух 60 FPS.
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

  // ---- звук (WebAudio, 8-біт) ----
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
    noise(dur = 0.25, vol = 0.08) { if (!this.on) return; const c = this.ensure(); if (!c) return; const n = c.sampleRate * dur | 0; const b = c.createBuffer(1, n, c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(); s.buffer = b; const g = c.createGain(); g.gain.value = vol; s.connect(g).connect(c.destination); s.start(); },
    eat() { this.beep(880, 0.05); setTimeout(() => this.beep(1320, 0.07), 50); this.noise(0.05, 0.03); },
    gold() { this.beep(1568, 0.06); setTimeout(() => this.beep(2093, 0.08), 60); setTimeout(() => this.beep(2637, 0.12), 130); },
    turn() { this.beep(300, 0.025, 'square', 0.015); },
    over() { this.noise(0.4, 0.12); this.beep(300, 0.25, 'sawtooth', 0.06, -220); setTimeout(() => this.beep(160, 0.4, 'square', 0.05, -100), 200); },
    start() { this.beep(220, 0.2, 'sawtooth', 0.04, 600); setTimeout(() => this.beep(880, 0.12), 200); },
    level() { this.beep(660, 0.06); setTimeout(() => this.beep(880, 0.06), 70); setTimeout(() => this.beep(1100, 0.1), 140); },
  };
  const paintSound = () => { $('soundBtn').textContent = sound.on ? '🔊' : '🔇'; $('soundBtn').classList.toggle('active', sound.on); };
  const toggleSound = () => { sound.on = !sound.on; store.set('rstbr-sound', sound.on); paintSound(); if (sound.on) { sound.ensure(); sound.eat(); } };
  paintSound(); $('soundBtn').addEventListener('click', toggleSound); $('btnSound').addEventListener('click', toggleSound);

  // ---- піксель-арт (карти символів → offscreen-канваси, масштаб ×2) ----
  const BASE = {
    '.': null, o: '#17171b', k: '#15151a',
    // іржа (скрап, труби, гайки)
    a: '#2a1a10', b: '#6e3f24', c: '#9a5a33', d: '#c47c4c', e: '#3a2416',
    // бочка
    B: '#e0533f', Y: '#f2c22e',
  };
  const GOLDPAL = { ...BASE, b: '#9a6e10', c: '#d8a830', d: '#fff0a0', e: '#6a4a08' };
  const ART = {
    // іржава шестерня (референс: іконка Scrap з Rust)
    gear: [
      '......oo..oo....', '..oo.ocbbcbo.oo.', '.ocbooccbbcoobco', '.ocbbccccccbbco.', '..occcddddcccbo.', 'oocccdoooodcccoo', 'obbccdoeeeodccbo', 'obbccdoeaeodccbo',
      'obbccdoeaeodccbo', 'obbccdoeeeodccbo', 'oocccdoooodcccoo', '..occcddddcccbo.', '.ocbbccccccbbco.', '.ocbooccbbcoobco', '..oo.ocbbcbo.oo.', '......oo..oo....',
    ],
    nut: ['..oooo..', '.ocddco.', 'occeecco', 'oceaaeco', 'oceaaeco', 'occeecco', '.ocbbco.', '..oooo..'],
    barrel: [
      '................', '....oooooooo....', '...oBBBBBBBBo...', '..obbbbbbbbbBo..', '..obbbbbbbbbBo..', '..oooooooooooo..', '..obbbbbbbbbBo..', '..obbbYYYYbbBo..',
      '..obbbYooYbbBo..', '..obbbYYYYbbBo..', '..obbbbbbbbbBo..', '..oooooooooooo..', '..obbbbbbbbbBo..', '..obbbbbbbbbBo..', '...oBBBBBBBBo...', '....oooooooo....',
    ],
    // голови (дивляться вправо, шия зліва = колір тіла 'r')
    hazmat: [
      '....hhhhhhhhhh..', '..hhHHHHHHhhhhh.', '.hhHHHHHhhhhhhhh', 'rhhHHhhhhhkkkkkh', 'rhhHhhhhkkkkkkkh', 'rhhhhhhkkggkkggk', 'rhhhhhhkkgGkkgGk', 'rhhhhhhkkggkkggk',
      'rhhhhhhkkkkkkkkk', 'rhhhhhhhkkkkfFfk', 'rhhhhhhhkkkkFFFk', 'rdhhhhhhhkkkkfFf', '.ddhhhhhhhkkkkkk', '..dddhhhhhhhhdd.', '...dddddddddd...', '................',
    ],
    redhazmat: [
      '....hhhhhhhhhh..', '..hhHHHHHHhhhhh.', '.hhHHHHHhhhhhhhh', 'rhhHHhhhhkkkkkkh', 'rhhHhhhhhkvvvvkh', 'rhhhhhhhhkvVvvkh', 'rhhhhhhhhkvvVvkh', 'rhhhhhhhhkvvvVkh',
      'rhhhhhhhhkvvvvkh', 'rhhhhhhhhkkkkkkh', 'rhhhhhhhhhhhhhhh', 'rdhhhhhhhhhhhhhd', '.ddhhhhhhhhhhhdd', '..dddhhhhhhhhdd.', '...dddddddddd...', '................',
    ],
    facemask: [
      '....nnnnnnnnnn..', '..nnmmmmmmnnnnn.', '.nnmmmmmnnnnnnnn', 'rnnmmnnnnnnnnnnn', 'rnnmnnnnnnnMnnnn', 'rnnnnnnnnneekeek', 'rnnnnnnnnnekkekk', 'rnnnnnnnnneekeek',
      'rnnnnnnnnnnnnnnn', 'rnnnnnnnnnnMnnnn', 'rnnnnnnnnnnnooon', 'rknnnnnnnnnnonon', '.kknnnnnnnnnooon', '..kkknnnnnnnnkk.', '...kkkkkkkkkk...', '................',
    ],
    riot: [
      '....hhhhhhhhhh..', '..hhHHHHHHhhhhh.', '.hhHHHHHhhhhhhhh', 'rhhHHhhhhhhhhhhh', 'rhhHhhhhhhhhhhhh', 'rhhhhhhhmmmmmmmm', 'rhhhhhhhmvvvvvvv', 'rhhhhhhhmvVvvvvv',
      'rhhhhhhhmvvvvvvv', 'rhhhhhhhmmmmmmmm', 'rhhhhhhhhhhhhhhh', 'rdhhhhhhhhhhhhhd', '.ddhhhhhhhhhhhdd', '..dddhhhhhhhhdd.', '...dddddddddd...', '................',
    ],
  };
  // скіни змійки: голова + кольори тіла (як костюми в Rust)
  const SKINS = [
    { id: 'hazmat', name: 'HAZMAT', head: 'hazmat', pal: { h: '#bfb23e', H: '#e3d768', d: '#7d7328', g: '#49c0ff', G: '#eaf8ff', f: '#8c8c94', F: '#55555c', r: '#9a8a26' }, tube: '#9a8a26', plates: ['#d4bf3c', '#bda62c'], hi: '#efe070', lo: '#6f6016', mark: 'tape' },
    { id: 'redhazmat', name: 'RED HAZMAT', head: 'redhazmat', pal: { h: '#c0362c', H: '#e05a4a', d: '#7a1e16', v: '#9fb8b0', V: '#e4f2ee', r: '#a82a22' }, tube: '#a82a22', plates: ['#c23a30', '#a52a22'], hi: '#e3665a', lo: '#5e140e', mark: 'tape' },
    { id: 'facemask', name: 'METAL FACEMASK', head: 'facemask', pal: { n: '#5c5c62', m: '#9a9aa0', M: '#d4d4d8', e: '#e0b090', r: '#4a4a50' }, tube: '#4a4a50', plates: ['#6a6a72', '#565660'], hi: '#9a9aa4', lo: '#26262c', mark: 'rivet' },
    { id: 'riot', name: 'RIOT HELMET', head: 'riot', pal: { h: '#c0362c', H: '#e05a4a', d: '#7a1e16', m: '#8c8c94', v: '#2e5c7a', V: '#8fc8ee', r: '#7a5230' }, tube: '#7a5230', plates: ['#8e6238', '#7a5230'], hi: '#b08050', lo: '#4a2e18', mark: 'rope' },
  ];
  function sprite(map, pal, outline) {
    const n = map.length; const c = document.createElement('canvas'); c.width = n; c.height = n; const x = c.getContext('2d');
    const solid = (xx, yy) => yy >= 0 && yy < n && xx >= 0 && xx < n && !!pal[map[yy][xx]];
    map.forEach((row, yy) => [...row].forEach((ch, xx) => {
      const col = pal[ch];
      if (col) { x.fillStyle = col; x.fillRect(xx, yy, 1, 1); }
      else if (outline && (solid(xx - 1, yy) || solid(xx + 1, yy) || solid(xx, yy - 1) || solid(xx, yy + 1))) { x.fillStyle = pal.o; x.fillRect(xx, yy, 1, 1); }
    }));
    return c;
  }
  // купка скрапу 44×44: діагональна труба позаду, шестерня ×2, дві гайки спереду (референс: іконка Scrap)
  function scrapPile(pal) {
    const c = document.createElement('canvas'); c.width = 44; c.height = 44; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    const gear = sprite(ART.gear, pal), nut = sprite(ART.nut, pal);
    x.save(); x.translate(22, 22); x.rotate(-0.7);
    x.fillStyle = pal.o; x.fillRect(-27, -6, 54, 12); x.fillStyle = pal.b; x.fillRect(-26, -5, 52, 10); x.fillStyle = pal.c; x.fillRect(-26, -5, 52, 4); x.fillStyle = pal.d; x.fillRect(-26, -5, 52, 1);
    x.fillStyle = pal.e; x.fillRect(-26, 3, 52, 2); x.fillStyle = pal.o; x.fillRect(-20, -6, 2, 12); x.fillRect(18, -6, 2, 12); x.fillStyle = pal.a; x.fillRect(-27, -5, 2, 10); x.fillRect(25, -5, 2, 10); x.restore();
    x.drawImage(gear, 4, 2, 32, 32);
    x.drawImage(nut, 28, 28, 16, 16); x.drawImage(nut, 0, 30, 14, 14);
    return c;
  }
  const SPR = { scrap: scrapPile(BASE), gold: scrapPile(GOLDPAL), barrel: sprite(ART.barrel, { ...BASE, b: '#a8301f' }) };
  for (const s of SKINS) s.sprite = sprite(ART[s.head], { ...BASE, ...s.pal }, true);

  // ---- поле ----
  const cv = $('game'), ctx = cv.getContext('2d', { alpha: false });
  const COLS = 20, ROWS = 15, CELL = 32; cv.width = COLS * CELL; cv.height = ROWS * CELL;
  const W = cv.width, H = cv.height;
  // земля в стилі Rust: трава/бруд, камінці, дерев'яний паркан по краю — рендериться один раз
  const ground = document.createElement('canvas'); ground.width = W; ground.height = H;
  (function paintGround() {
    const g = ground.getContext('2d'); let seed = 1337; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      g.fillStyle = (x + y) % 2 ? '#2b331c' : '#2f3820'; g.fillRect(x * CELL, y * CELL, CELL, CELL);
      const r = rnd();
      if (r < 0.14) { // кущик трави
        const px = x * CELL + 6 + (rnd() * 16 | 0), py = y * CELL + 8 + (rnd() * 14 | 0); g.fillStyle = '#4b6a2b';
        g.fillRect(px, py, 2, 6); g.fillRect(px - 3, py + 2, 2, 4); g.fillRect(px + 3, py + 1, 2, 5); g.fillStyle = '#6a8a3a'; g.fillRect(px, py, 2, 2);
      } else if (r < 0.2) { // камінець
        const px = x * CELL + 8 + (rnd() * 14 | 0), py = y * CELL + 8 + (rnd() * 14 | 0); g.fillStyle = '#5a5a52'; g.fillRect(px, py, 6, 4); g.fillStyle = '#7a7a70'; g.fillRect(px + 1, py, 3, 1); g.fillStyle = '#3a3a34'; g.fillRect(px + 1, py + 3, 5, 1);
      } else if (r < 0.23) { // грязюка
        g.fillStyle = '#3a3222'; g.fillRect(x * CELL + 4 + (rnd() * 10 | 0), y * CELL + 4 + (rnd() * 10 | 0), 10, 8);
      }
    }
    // дерев'яний паркан по периметру
    const plank = (x, y, w, h) => { g.fillStyle = '#5a3f26'; g.fillRect(x, y, w, h); g.fillStyle = '#7a5635'; g.fillRect(x, y, w, Math.min(2, h)); g.fillStyle = '#2b1d12'; g.fillRect(x, y + h - 2, w, 2); };
    plank(0, 0, W, 8); plank(0, H - 8, W, 8); plank(0, 0, 8, H); plank(W - 8, 0, 8, H);
    g.fillStyle = '#2b1d12'; for (let x = 16; x < W; x += 32) { g.fillRect(x, 2, 2, 4); g.fillRect(x, H - 6, 2, 4); } for (let y = 16; y < H; y += 32) { g.fillRect(2, y, 4, 2); g.fillRect(W - 6, y, 4, 2); }
    // віньєтка
    const v = g.createRadialGradient(W / 2, H / 2, H / 3, W / 2, H / 2, H * 0.85); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.45)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  })();

  // ---- стан гри ----
  const G = { snake: [], prev: [], dir: { x: 1, y: 0 }, queue: [], food: null, gold: null, goldTtl: 0, barrels: [], score: 0, speed: 1, acc: 0, alive: false, paused: false, started: false, eaten: 0, best: store.get('rstbr-snake-best', 0), flash: 0, shake: 0, particles: [] };
  const kBest = () => G.mode === 'lcd' ? 'rstbr-3310-best' : 'rstbr-snake-best';
  const kBoard = () => G.mode === 'lcd' ? 'rstbr-3310-board' : 'rstbr-snake-board';
  const board = () => store.get(kBoard(), []);
  const stepMs = () => Math.max(70, 170 - (G.speed - 1) * 14);
  const same = (a, b) => a.x === b.x && a.y === b.y;
  const freeCell = (avoidHead) => { for (let i = 0; i < 500; i++) { const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; if (G.snake.some((s) => same(s, p)) || G.barrels.some((b) => same(b, p)) || (G.food && same(G.food, p)) || (G.gold && same(G.gold, p))) continue; if (avoidHead && G.snake.length && Math.abs(p.x - G.snake[0].x) + Math.abs(p.y - G.snake[0].y) < 4) continue; return p; } return null; };
  // скін: обраний вручну (кнопка SKIN) або випадковий щогри
  let skinPick = store.get('rstbr-snake-skin', 'random');
  const paintSkinBtn = () => { const b = $('skinBtn'); if (b) b.textContent = 'SKIN: ' + (skinPick === 'random' ? 'RANDOM' : (SKINS.find((s) => s.id === skinPick) || SKINS[0]).name); };
  const chooseSkin = () => { G.skin = skinPick === 'random' ? SKINS[Math.floor(Math.random() * SKINS.length)] : (SKINS.find((s) => s.id === skinPick) || SKINS[0]); };
  if ($('skinBtn')) $('skinBtn').addEventListener('click', () => { const order = ['random', ...SKINS.map((s) => s.id)]; skinPick = order[(order.indexOf(skinPick) + 1) % order.length]; store.set('rstbr-snake-skin', skinPick); paintSkinBtn(); chooseSkin(); });
  paintSkinBtn(); chooseSkin();
  let bodyStyle = store.get('rstbr-snake-body', 'worm');
  window.__setBody = (b) => { bodyStyle = b; store.set('rstbr-snake-body', b); };
  function reset() {
    chooseSkin();
    G.snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }]; G.prev = G.snake.map((s) => ({ ...s })); G.dir = { x: 1, y: 0 }; G.queue = [];
    G.barrels = []; G.food = freeCell(true); G.gold = null; G.goldTtl = 0; G.score = 0; G.speed = 1; G.eaten = 0; G.acc = 0; G.alive = true; G.paused = false; G.started = true; G.particles = []; G.flash = 0;
    hud(); $('overlay').hidden = true; $('ledAlive').classList.add('on'); sound.start();
  }
  function hud() { $('hudScore').textContent = `SCRAP ${G.score}`; $('hudBest').textContent = `BEST ${G.best}`; $('hudSpeed').textContent = `SPD ${G.speed}`; }
  function turn(d) {
    if (!G.started || !G.alive) { start(); if (d.x === -1) return; }
    const last = G.queue.length ? G.queue[G.queue.length - 1] : G.dir;
    if ((d.x && last.x) || (d.y && last.y)) return; // не розвертаємось на 180°
    if (G.queue.length < 2) { G.queue.push(d); sound.turn(); }
    if (G.paused) G.paused = false;
  }
  const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  function step() {
    if (G.queue.length) G.dir = G.queue.shift();
    const h = G.snake[0]; const n = { x: h.x + G.dir.x, y: h.y + G.dir.y };
    if (n.x < 0 || n.y < 0 || n.x >= COLS || n.y >= ROWS || G.snake.some((s, i) => i < G.snake.length - 1 && same(s, n)) || G.barrels.some((b) => same(b, n))) return die();
    const old = G.snake; G.snake = [n, ...old];
    let grew = false;
    if (G.food && same(n, G.food)) {
      G.score++; G.eaten++; grew = true; sound.eat(); burst(n, ['#fff2a0', '#d4d4d8', '#b5562a'], 14); G.food = freeCell(true);
      if (G.eaten % 5 === 0) { G.speed++; sound.level(); G.flash = 5; if (G.speed >= 3 && G.barrels.length < 7) { const b = freeCell(true); if (b) G.barrels.push(b); } }
      if (!G.gold && Math.random() < 0.2) { G.gold = freeCell(true); G.goldTtl = 50; }
    } else if (G.gold && same(n, G.gold)) { G.score += 5; grew = true; sound.gold(); burst(n, ['#ffd45a', '#fff0a0', '#e0b030'], 24); G.gold = null; }
    if (!grew) G.snake.pop();
    G.prev = G.snake.map((_, i) => old[Math.min(i, old.length - 1)]);
    if (G.gold && --G.goldTtl <= 0) G.gold = null;
    if (G.score > G.best) { G.best = G.score; store.set(kBest(), G.best); }
    hud();
  }
  function burst(p, colors, n) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 3; G.particles.push({ x: p.x * CELL + CELL / 2, y: p.y * CELL + CELL / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, life: 20 + Math.random() * 12, color: colors[i % colors.length], s: 2 + (Math.random() * 3 | 0) }); } }
  function die() {
    G.alive = false; G.diedAt = performance.now(); G.shake = 14; G.flash = 3; sound.over(); $('ledAlive').classList.remove('on');
    burst(G.snake[0], ['#ff8a3c', '#ffd45a', '#d94a3a', '#2a2a2e'], 40);
    const b = board(); const qualifies = G.score > 0 && (b.length < 5 || G.score > b[b.length - 1].score);
    $('ovTitle').textContent = 'GAME OVER'; $('ovText').innerHTML = `SCRAP ${G.score} · BEST ${G.best}`; $('startBtn').textContent = 'RETRY ▶'; $('ovSub').textContent = qualifies ? 'NEW HIGH SCORE!' : 'PRESS START';
    setTimeout(() => { $('overlay').hidden = false; if (qualifies) askName(); }, 600);
  }
  function askName() { $('nameText').textContent = `SCRAP ${G.score}`; $('nameInput').value = store.get('rstbr-name', ''); $('nameModal').hidden = false; setTimeout(() => $('nameInput').focus(), 50); }
  function saveName(skip) {
    const name = skip ? '' : ($('nameInput').value.trim().toUpperCase() || 'PLAYER'); if (name) store.set('rstbr-name', name);
    const b = board(); b.push({ name: name || 'PLAYER', score: G.score, at: new Date().toISOString() }); b.sort((p, q) => q.score - p.score); store.set(kBoard(), b.slice(0, 5));
    $('nameModal').hidden = true; paintBoard();
  }
  $('nameSave').addEventListener('click', () => saveName(false)); $('nameSkip').addEventListener('click', () => saveName(true));
  $('nameInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveName(false); e.stopPropagation(); });
  function paintBoard() { const b = board(); $('boardList').innerHTML = b.length ? b.map((r, i) => `<li><span>${i + 1}.</span><span>${String(r.name).replace(/[<>&]/g, '')}</span><span>${r.score}</span></li>`).join('') : '<li><span>—</span><span>поки порожньо</span><span></span></li>'; }
  function start() { reset(); }
  $('startBtn').addEventListener('click', start);
  $('btnRestart').addEventListener('click', start);
  $('btnPause').addEventListener('click', () => { if (G.alive) G.paused = !G.paused; });
  document.addEventListener('keydown', (e) => {
    if (!$('nameModal').hidden) return;
    const k = e.key.toLowerCase();
    const map = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
    if (map[k]) { e.preventDefault(); turn(DIRS[map[k]]); }
    else if (k === ' ' || k === 'p') { e.preventDefault(); if (!G.started || !G.alive) start(); else G.paused = !G.paused; }
    else if (k === 'r') start();
    else if (k === 'escape' && document.body.classList.contains('gamefull')) setFull(false);
  });
  $('dpad').addEventListener('pointerdown', (e) => { const b = e.target.closest('button[data-dir]'); if (b) { e.preventDefault(); turn(DIRS[b.dataset.dir]); } });
  $('dpad').addEventListener('contextmenu', (e) => e.preventDefault());
  // свайпи по екрану
  let sx = 0, sy = 0, st = 0;
  cv.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; st = Date.now(); try { cv.setPointerCapture(e.pointerId); } catch (x) {} }, { passive: true });
  cv.addEventListener('pointerup', (e) => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.abs(dx) < 12 && Math.abs(dy) < 12) { if (Date.now() - st < 300) { if (!G.started || !G.alive) start(); else G.paused = !G.paused; } return; } turn(Math.abs(dx) > Math.abs(dy) ? DIRS[dx > 0 ? 'right' : 'left'] : DIRS[dy > 0 ? 'down' : 'up']); });
  cv.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  cv.addEventListener('contextmenu', (e) => e.preventDefault());

  // ---- повний екран на телефоні ----
  function setFull(on) {
    document.body.classList.toggle('gamefull', on);
    const b = $('btnFull'); if (b) b.textContent = on ? '✕ EXIT' : '⛶ FULL SCREEN';
    try { if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (e) {}
    setTimeout(fitCanvas, 100);
  }
  if ($('btnFull')) $('btnFull').addEventListener('click', () => setFull(!document.body.classList.contains('gamefull')));
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('gamefull')) { document.body.classList.remove('gamefull'); if ($('btnFull')) $('btnFull').textContent = '⛶ FULL SCREEN'; fitCanvas(); } });
  // чіткі пікселі, коли канвас показано не меншим за оригінал; плавне зменшення, коли меншим
  function fitCanvas() { const w = cv.getBoundingClientRect().width; cv.style.imageRendering = w >= W ? 'pixelated' : 'auto'; }
  window.addEventListener('resize', fitCanvas); setTimeout(fitCanvas, 50);

  // ---- рендер (60 FPS, рух інтерпольований між клітинками) ----
  const lerp = (a, b, t) => a + (b - a) * t;

  // ---- дизайн 2: БРОНЯ — квадратні металеві пластини на шарнірах ----
  function drawPlates(pts, sk) {
    const n = pts.length; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const spine = () => { ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < n; i++) ctx.lineTo(pts[i].x, pts[i].y); };
    spine(); ctx.strokeStyle = '#17171b'; ctx.lineWidth = 12; ctx.stroke(); spine(); ctx.strokeStyle = sk.lo; ctx.lineWidth = 7; ctx.stroke();
    for (let i = n - 1; i >= 1; i--) {
      const p = pts[i], fr = i / (n - 1), sz = Math.round(26 - 9 * fr), h = sz / 2, x = Math.round(p.x - h), y = Math.round(p.y - h);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x + 3, y + 4, sz, sz);
      ctx.fillStyle = '#17171b'; ctx.fillRect(x - 2, y - 2, sz + 4, sz + 4);
      ctx.fillStyle = sk.plates[i % 2]; ctx.fillRect(x, y, sz, sz);
      ctx.fillStyle = sk.hi; ctx.fillRect(x, y, sz, 3); ctx.fillRect(x, y, 3, sz);
      ctx.fillStyle = sk.lo; ctx.fillRect(x, y + sz - 3, sz, 3); ctx.fillRect(x + sz - 3, y, 3, sz);
      if (sz < 16) continue;
      ctx.fillStyle = '#d4d4d8'; for (const [a, b] of [[4, 4], [sz - 7, 4], [4, sz - 7], [sz - 7, sz - 7]]) ctx.fillRect(x + a, y + b, 3, 3);
      if (sk.mark === 'tape') { ctx.fillStyle = '#8c8c94'; ctx.fillRect(x + 3, y + h - 2, sz - 6, 4); ctx.fillStyle = '#c4c4cc'; ctx.fillRect(x + 3, y + h - 2, sz - 6, 1); }
      else if (sk.mark === 'rope') { ctx.fillStyle = '#c8b070'; ctx.fillRect(x + 3, y + h - 4, sz - 6, 2); ctx.fillRect(x + 3, y + h + 2, sz - 6, 2); }
      else { ctx.fillStyle = '#6a6a70'; ctx.fillRect(x + h - 3, y + h - 3, 6, 6); ctx.fillStyle = '#d4d4d8'; ctx.fillRect(x + h - 1, y + h - 1, 2, 2); }
    }
  }
  // ---- дизайн 3: ТРУБОПРОВІД — іржаві труби з фланцями й болтами на стиках ----
  function drawPipes(pts, sk) {
    const n = pts.length, S = G.snake, R = 9;
    const dirTo = (a, b) => ({ x: Math.sign(b.x - a.x), y: Math.sign(b.y - a.y) });
    const seg = (p, d, len, w, color) => { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + d.x * len, p.y + d.y * len); ctx.stroke(); };
    ctx.lineCap = 'butt';
    const each = (fn) => { for (let i = 1; i < n; i++) { const p = pts[i]; fn(p, dirTo(S[i], S[i - 1]), i, false); if (i < n - 1) fn(p, dirTo(S[i], S[i + 1]), i, false); else fn(p, dirTo(S[i], S[i - 1]), i, true); } };
    ctx.save(); ctx.translate(3, 4); each((p, d) => seg(p, d, 17, R * 2 + 2, 'rgba(0,0,0,0.3)')); ctx.restore();
    each((p, d, i, cap) => { if (cap) { ctx.fillStyle = '#17171b'; ctx.beginPath(); ctx.arc(p.x, p.y, R + 3, 0, Math.PI * 2); ctx.fill(); } else seg(p, d, 17, R * 2 + 6, '#17171b'); });
    each((p, d, i, cap) => { if (cap) { ctx.fillStyle = sk.tube; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill(); } else seg(p, d, 17, R * 2, sk.tube); });
    ctx.globalAlpha = 0.5; each((p, d, i, cap) => { if (cap) return; const o = d.x ? { x: 0, y: -4 } : { x: -4, y: 0 }; seg({ x: p.x + o.x, y: p.y + o.y }, d, 17, 3, sk.hi); }); ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.35; each((p, d, i, cap) => { if (cap) return; const o = d.x ? { x: 0, y: 5 } : { x: 5, y: 0 }; seg({ x: p.x + o.x, y: p.y + o.y }, d, 17, 3, sk.lo); }); ctx.globalAlpha = 1;
    for (let i = 1; i < n; i++) {
      const p = pts[i], fl = i % 2 === 0 || i === n - 1, r = fl ? R + 3 : R + 1;
      ctx.fillStyle = '#17171b'; ctx.beginPath(); ctx.arc(p.x, p.y, r + 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = fl ? sk.plates[0] : sk.plates[1]; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = sk.hi; ctx.beginPath(); ctx.arc(p.x - 2, p.y - 2, r - 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = fl ? sk.plates[0] : sk.plates[1]; ctx.beginPath(); ctx.arc(p.x, p.y, r - 4, 0, Math.PI * 2); ctx.fill();
      if (fl) { ctx.fillStyle = '#d4d4d8'; for (const [a, b] of [[0, -r + 3], [r - 3, 0], [0, r - 3], [-r + 3, 0]]) ctx.fillRect(p.x + a - 1.5, p.y + b - 1.5, 3, 3); }
      else { ctx.fillStyle = sk.lo; ctx.fillRect(p.x - 1, p.y - 1, 2, 2); }
    }
  }
  let last = performance.now();
  function draw(now) {
    const dt = Math.min(100, now - last); last = now;
    if (G.alive && !G.paused) { G.acc += dt; while (G.acc >= stepMs()) { G.acc -= stepMs(); step(); if (!G.alive) { G.acc = 0; break; } } }
    const t = G.alive && !G.paused ? Math.min(1, G.acc / stepMs()) : 1;
    ctx.save(); ctx.imageSmoothingEnabled = false;
    if (G.shake > 0) { ctx.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake); G.shake--; }
    ctx.drawImage(ground, 0, 0);
    if (G.flash > 0) { ctx.fillStyle = 'rgba(255,220,120,0.25)'; ctx.fillRect(-20, -20, W + 40, H + 40); G.flash--; }
    const put = (spr, p, scale = 1, dy = 0) => { const s = CELL * scale, o = (CELL - s) / 2; ctx.drawImage(spr, Math.round(p.x * CELL + o), Math.round(p.y * CELL + o + dy), s, s); };
    const shadow = (px, py, w) => { ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fillRect(px - w / 2 + 2, py + w / 2 - 2, w, 4); };
    for (const b of G.barrels) { shadow(b.x * CELL + CELL / 2, b.y * CELL + CELL / 2, 26); put(SPR.barrel, b); }
    if (G.food) { const bob = Math.sin(now / 200) * 2; shadow(G.food.x * CELL + CELL / 2, G.food.y * CELL + CELL / 2, 22); ctx.drawImage(SPR.scrap, G.food.x * CELL - 6, Math.round(G.food.y * CELL - 6 + bob), 44, 44); }
    if (G.gold) { const bob = Math.sin(now / 100) * 3; ctx.fillStyle = `rgba(255,212,90,${0.18 + Math.sin(now / 120) * 0.08})`; ctx.beginPath(); ctx.arc(G.gold.x * CELL + CELL / 2, G.gold.y * CELL + CELL / 2, 20, 0, Math.PI * 2); ctx.fill(); ctx.drawImage(SPR.gold, G.gold.x * CELL - 6, Math.round(G.gold.y * CELL - 6 + bob), 44, 44); ctx.fillStyle = '#17171b'; ctx.fillRect(G.gold.x * CELL + 4, G.gold.y * CELL + CELL - 4, CELL - 8, 3); ctx.fillStyle = '#ffd45a'; ctx.fillRect(G.gold.x * CELL + 4, G.gold.y * CELL + CELL - 4, (CELL - 8) * (G.goldTtl / 50), 3); }
    // змійка: інтерпольовані центри сегментів
    const pts = G.snake.map((s, i) => { const p = G.prev[i] || s; return { x: lerp(p.x, s.x, t) * CELL + CELL / 2, y: lerp(p.y, s.y, t) * CELL + CELL / 2 }; });
    if (pts.length > 1) {
      const sk = G.skin, n = pts.length; let hb = pts[1];
      if (bodyStyle === 'plates') drawPlates(pts, sk); else if (bodyStyle === 'pipes') drawPipes(pts, sk); else {
      // плавна крива Catmull-Rom через центри сегментів, 3 підточки на сегмент; f = 0 біля шиї, 1 на кінчику хвоста
      const sm = [];
      for (let i = 0; i < n - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
        for (let k = 0; k < 3; k++) {
          const u = k / 3, u2 = u * u, u3 = u2 * u;
          sm.push({ x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3), y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3), f: (i + u) / (n - 1), seg: i });
        }
      }
      sm.push({ x: pts[n - 1].x, y: pts[n - 1].y, f: 1, seg: n - 1 });
      // радіус: товста шия → тонкий хвіст; легке «дихання» тіла
      const R = (f) => Math.max(2.5, 10.5 - 8 * f * f - 1.5 * f) + Math.sin(now / 260 + f * 6) * 0.4;
      ctx.lineCap = 'round';
      const pass = (width, color, dx = 0, dy = 0) => { ctx.strokeStyle = color; for (let i = 0; i < sm.length - 1; i++) { const q = sm[i], r = sm[i + 1]; ctx.lineWidth = width(q.f, i); ctx.beginPath(); ctx.moveTo(q.x + dx, q.y + dy); ctx.lineTo(r.x + dx, r.y + dy); ctx.stroke(); } };
      pass((f) => 2 * R(f) + 2, 'rgba(0,0,0,0.3)', 3, 4);          // тінь
      pass((f) => 2 * R(f) + 4, '#17171b');                        // контур
      for (let i = 0; i < sm.length - 1; i++) {                    // тіло: смуги кольорів по сегментах
        const q = sm[i], r = sm[i + 1]; ctx.strokeStyle = sk.plates[q.seg % 2]; ctx.lineWidth = 2 * R(q.f); ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(r.x, r.y); ctx.stroke();
      }
      ctx.globalAlpha = 0.45; pass((f) => Math.max(1, R(f) * 0.9), sk.hi, -1, -3); ctx.globalAlpha = 0.35; pass((f) => Math.max(1, R(f) * 0.7), sk.lo, 1, 3); ctx.globalAlpha = 1; // блік зверху, тінь знизу
      // стики сегментів і маркування костюма (перпендикулярно до тіла)
      for (let i = 1; i < n - 1; i++) {
        const p = pts[i], a = pts[i - 1], c = pts[i + 1]; let tx = c.x - a.x, ty = c.y - a.y; const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L; const nx = -ty, ny = tx;
        const f = i / (n - 1), r = R(f) - 1; if (r < 2) continue;
        const line = (ox, oy, w, color, len = r) => { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p.x + ox - nx * len, p.y + oy - ny * len); ctx.lineTo(p.x + ox + nx * len, p.y + oy + ny * len); ctx.stroke(); };
        ctx.lineCap = 'butt';
        line(-tx * r, -ty * r, 2, sk.lo, r + 1);                                       // шов між сегментами
        if (sk.mark === 'tape' && i % 2 === 0) { line(0, 0, 5, '#8c8c94'); line(0, -1, 1, '#c4c4cc'); }
        else if (sk.mark === 'rivet') { ctx.fillStyle = '#d4d4d8'; ctx.fillRect(p.x + nx * r * 0.5 - 1.5, p.y + ny * r * 0.5 - 1.5, 3, 3); ctx.fillRect(p.x - nx * r * 0.5 - 1.5, p.y - ny * r * 0.5 - 1.5, 3, 3); if (i % 3 === 0) { ctx.fillStyle = '#6a6a70'; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); } }
        else if (sk.mark === 'rope') { line(tx * 3, ty * 3, 2, '#c8b070'); line(-tx * 3, -ty * 3, 2, '#c8b070'); }
        ctx.lineCap = 'round';
      }
      hb = sm[1] || pts[1]; }
      // голова: більша за шию, плавно повертається за напрямком руху
      const hp = pts[0]; const ang = Math.atan2(hp.y - hb.y, hp.x - hb.x);
      ctx.save(); ctx.translate(Math.round(hp.x), Math.round(hp.y)); ctx.rotate(ang);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-14, 13, 30, 5);
      ctx.drawImage(sk.sprite, -17, -17, 34, 34); ctx.restore();
    }
    for (const p of G.particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--; ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 14)); ctx.fillStyle = p.color; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s); }
    ctx.globalAlpha = 1; if (G.particles.length) G.particles = G.particles.filter((p) => p.life > 0);
    if (G.paused && G.alive) { ctx.fillStyle = 'rgba(13,20,10,0.6)'; ctx.fillRect(-20, -20, W + 40, H + 40); ctx.fillStyle = '#ffd36a'; ctx.font = '20px "Press Start 2P", monospace'; ctx.textAlign = 'center'; ctx.fillText('PAUSE', W / 2, H / 2 + 8); ctx.textAlign = 'left'; }
    ctx.restore();
    requestAnimationFrame(draw);
  }

  G.mode = 'rust';
  G.snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }]; G.prev = G.snake.map((s) => ({ ...s })); G.food = { x: 13, y: 7 }; G.barrels = [{ x: 15, y: 4 }, { x: 4, y: 11 }];
  window.__G = G; // для налагодження
  hud(); paintBoard(); requestAnimationFrame(draw);
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.alive) G.paused = true; });
})();
