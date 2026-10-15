// v3: видання консолі, атмосфера, reveal, міні-консоль при прокрутці, гонка лідерів, нижня панель, PWA.
(function () {
  'use strict';
  const R = window.RSTBR; if (!R) return;
  const $ = (id) => document.getElementById(id);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- видання консолі ----
  const root = document.documentElement;
  const edition = R.store.get('rstbr-edition', 'grey');
  const setEdition = (e) => { root.dataset.edition = e; R.store.set('rstbr-edition', e); document.querySelectorAll('.theme-grid button').forEach((b) => b.classList.toggle('on', b.dataset.theme === e)); };
  setEdition(edition);
  $('themeBtn').addEventListener('click', () => { $('themePop').hidden = !$('themePop').hidden; });
  document.querySelectorAll('.theme-grid button').forEach((b) => b.addEventListener('click', () => { setEdition(b.dataset.theme); R.sound.coin(); }));
  document.addEventListener('click', (e) => { if (!e.target.closest('#themePop, #themeBtn')) $('themePop').hidden = true; });

  // ---- атмосфера: кажани, нічний режим, місяць ----
  const hour = new Date().getHours(); const night = hour >= 21 || hour < 6;
  if (night) { root.dataset.night = '1'; $('moon').hidden = false; }
  if (!reduced) {
    const bats = $('bats'); const n = night ? 7 : 4;
    bats.innerHTML = Array.from({ length: n }, (_, i) => `<div class="bat" style="--d:${18 + i * 5}s;--dl:${-i * 7}s;--y:${8 + (i * 13) % 50}%"><i></i></div>`).join('');
  }

  // ---- reveal при прокрутці ----
  const revealEls = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reduced) {
    const ro = new IntersectionObserver((ents) => { for (const en of ents) if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } }, { rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach((el) => ro.observe(el));
  } else revealEls.forEach((el) => el.classList.add('in'));

  // ---- міні-консоль: показує те, що зараз у фокусі ----
  const mini = $('mini'), miniHead = $('miniHead'), miniBody = $('miniBody');
  const sections = ['find', 'watch', 'highscore', 'levels', 'charts', 'predict', 'authors', 'survivors', 'terminated', 'howto', 'log'];
  function miniFor(id) {
    const S = R.S; const alive = R.alive.filter((x) => x.status === 'ok');
    switch (id) {
      case 'highscore': case 'survivors': case 'watch': return ['HIGH SCORE', alive.slice(0, 4).map((x, i) => `${i + 1}. ${x.title.toUpperCase().slice(0, 14)} ${x.hidden}`).join('\n')];
      case 'levels': { const nl = S.currentLevel == null ? S.baseHidden : S.currentLevel + 1; const have = S.items.filter((x) => (x.hidden ?? -1) >= nl).length; return ['NEXT WAVE', `LEVEL ${R.stageNo(nl)}\n${have} / ${S.nextNeed} SKINS\n${'█'.repeat(Math.round(Math.min(1, have / S.nextNeed) * 12)).padEnd(12, '░')}`]; }
      case 'charts': case 'predict': return ['STATUS', `PLAYERS ${S.stats.ok}\nLOW SIG ${S.stats.risk}\nGAME OVER ${S.stats.eliminated}\nSNAPS ${S.snapshots.length}`];
      case 'authors': return ['TOP AUTHORS', S.authors.slice(0, 4).map((a, i) => `${i + 1}. ${a.name.toUpperCase().slice(0, 12)} ${a.ok}`).join('\n')];
      case 'log': { const e = S.events[0]; return ['LAST EVENT', e ? (e.type === 'gain' ? `+1 ${e.title.toUpperCase().slice(0, 24)}` : e.type === 'out' ? `OUT ${e.title.toUpperCase().slice(0, 22)}` : e.type === 'stage' ? `LEVEL ${R.stageNo(e.level)} UNLOCKED` : `-1 ${e.title.toUpperCase().slice(0, 24)}`) : 'QUIET']; }
      case 'terminated': return ['GAME OVER', `${S.stats.eliminated} SKINS OUT\nLEVEL ${R.stageNo(S.currentLevel)}`];
      default: return ['RUSTOBER', `LEVEL ${R.stageNo(S.currentLevel)}\n${S.stats.ok} PLAYERS LEFT`];
    }
  }
  let current = null;
  function paintMini(id) { if (id === current) return; current = id; const [h, b] = miniFor(id); miniHead.textContent = h; miniBody.textContent = b; }
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((ents) => { for (const en of ents) if (en.isIntersecting) { paintMini(en.target.id); document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id)); } }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach((id) => { const el = $(id); if (el) so.observe(el); });
  }
  window.addEventListener('scroll', () => { const past = window.scrollY > (document.querySelector('.hero')?.offsetHeight || 600); mini.hidden = false; mini.classList.toggle('on', past); }, { passive: true });
  paintMini('top');

  // ---- гонка лідерів (bar chart race по знімках) ----
  let raceTimer = null;
  function raceFrame(k) {
    const S = R.S; const snaps = S.snapshots; if (!snaps.length) return;
    const rows = S.items.map((x) => ({ x, v: x.series[k] ?? 0 })).filter((r) => r.v > 0).sort((a, b) => b.v - a.v || (b.x.series[snaps.length - 1] ?? 0) - (a.x.series[snaps.length - 1] ?? 0)).slice(0, 8);
    const maxV = Math.max(1, ...rows.map((r) => r.v));
    const box = $('chartRace');
    if (!box.dataset.ready) { box.innerHTML = `<div class="race" id="raceRows" style="height:${8 * 30}px"></div><div class="race-time"><span id="raceT"></span><span id="raceK"></span></div>`; box.dataset.ready = '1'; }
    const wrap = $('raceRows'); const existing = new Map([...wrap.children].map((el) => [el.dataset.id, el]));
    rows.forEach((r, i) => {
      let el = existing.get(r.x.id);
      if (!el) { el = document.createElement('div'); el.className = 'race-row'; el.dataset.id = r.x.id; el.dataset.open = r.x.id; el.innerHTML = `<span class="n"></span><div class="bar"><img src="${R.thumb(r.x.preview, 64)}" alt=""><span>${R.esc(r.x.title)}</span></div><span class="v"></span>`; wrap.appendChild(el); }
      el.style.transform = `translateY(${i * 30}px)`; el.querySelector('.n').textContent = String(i + 1).padStart(2, '0'); el.querySelector('.bar').style.width = (r.v / maxV * 100) + '%'; el.querySelector('.v').textContent = r.v; existing.delete(r.x.id);
    });
    for (const el of existing.values()) el.remove();
    $('raceT').textContent = R.fmtDate(snaps[k]); $('raceK').textContent = `${R.t('race.step')} ${k + 1}/${snaps.length}`;
  }
  function racePlay() {
    clearInterval(raceTimer); let k = 0; raceFrame(0);
    raceTimer = setInterval(() => { k++; if (k >= R.S.snapshots.length) { clearInterval(raceTimer); return; } raceFrame(k); }, 900);
  }
  $('racePlay').addEventListener('click', racePlay);
  raceFrame(R.S.snapshots.length - 1);
  R.onPaint = () => { $('chartRace').dataset.ready = ''; raceFrame(R.S.snapshots.length - 1); current = null; paintMini('top'); };

  // ---- PWA ----
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
