(function () {
  const S = window.STATE;
  const $ = (id) => document.getElementById(id);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- піксельний гарбуз (box-shadow по сітці) ----------
  (function pumpkins() {
    const map = [
      '......GG......',
      '.....GG.......',
      '...OOOOOOOO...',
      '..OOOOOOOOOO..',
      '.OOOOOOOOOOOO.',
      '.OOKKOOOOKKOO.',
      'OOKKKOOOOKKKOO',
      'OOOOOOKKOOOOOO',
      'OOKOOOOOOOOKOO',
      'OOKKOOKKOOKKOO',
      '.OOKKKKKKKKOO.',
      '.OOOOKKKKOOOO.',
      '..OOOOOOOOOO..',
      '....OOOOOO....',
    ];
    const col = { G: '#5fd36b', O: '#ff8a3c', K: '#1b1b1f' };
    const build = (el, s) => {
      if (!el) return;
      const sh = [];
      map.forEach((row, y) => [...row].forEach((ch, x) => { if (col[ch]) sh.push(`${x * s}px ${y * s}px 0 0 ${col[ch]}`); }));
      el.style.setProperty('--px-shadow', sh.join(','));
      el.style.width = s + 'px'; el.style.height = s + 'px';
      el.style.marginRight = (map[0].length - 1) * s + 'px';
      el.style.marginBottom = (map.length - 1) * s + 'px';
    };
    build($('bootPumpkin'), 8);
    build($('heroPumpkin'), 7);
  })();

  // ---------- boot-екран ----------
  (function boot() {
    const el = $('boot');
    if (!el || reduced) { el && el.classList.add('off'); return; }
    let seen = false;
    try { seen = sessionStorage.getItem('rstbr-boot') === '1'; } catch (e) {}
    if (seen) { el.classList.add('off'); return; }
    const lines = [
      'INSERT CARTRIDGE... OK',
      `LOADING ${S?.stats?.total ?? '?'} SKINS`,
      `LEVEL ${S?.currentLevel == null ? '-' : S.currentLevel - (S.baseHidden ?? 2) + 1}  SNAPSHOTS ${S?.snapshots?.length ?? 0}`,
      'PRESS START',
    ];
    const box = $('bootLines');
    lines.forEach((t, i) => { const d = document.createElement('div'); d.textContent = '> ' + t; d.style.animationDelay = (i * 0.3) + 's'; box.appendChild(d); });
    setTimeout(() => { el.classList.add('off'); try { sessionStorage.setItem('rstbr-boot', '1'); } catch (e) {} }, 1800);
    el.addEventListener('click', () => el.classList.add('off'));
  })();

  if (!S || !S.items) {
    $('aliveEmpty').hidden = false;
    $('aliveEmpty').textContent = '// немає даних. Запусти refresh.cmd (node scripts/fetch.mjs), щоб зібрати знімок';
    return;
  }

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
  const thumb = (url, size = 512) => !url ? '' : url.startsWith('data:') ? url : `${url}?imw=${size}&imh=${size}&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true`;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const stageNo = (L) => (L == null ? '—' : L - S.baseHidden + 1);

  // ---------- шапка ----------
  $('collLink').href = S.collectionUrl;
  const alive = S.items.filter((x) => x.alive);
  const dead = S.items.filter((x) => !x.alive);
  const risk = S.items.filter((x) => x.status === 'risk');
  const dyingNow = dead.filter((x) => x.eliminatedNow);
  const gained = S.items.filter((x) => x.delta > 0).length;
  $('stats').innerHTML = [
    ['', '#', S.stats.total, 'у конкурсі'],
    ['c', '▶', S.stats.ok, 'проходять'],
    ['y', '!', risk.length, 'під загрозою'],
    ['m', '✕', dead.length, 'вибули'],
    ['g', '+', gained, 'приріст'],
  ].map(([c, i, v, l]) => `<div class="stat ${c}"><i class="ico">${i}</i><b data-n="${v}">0</b><span>${l}</span></div>`).join('');
  $('updated').textContent = `SNAPSHOT ${fmtDate(S.snapshots.at(-1))} · N=${S.snapshots.length} · LEVEL ${S.currentLevel == null ? '-' : '>=' + S.currentLevel} HIDDEN`;
  $('status').innerHTML = `<i class="led on"></i><span>LIVE · ${fmtDate(S.snapshots.at(-1))}</span>`;
  $('footSnap').textContent = `generated ${S.generated}`;
  $('screenSub').textContent = `LEVEL ${stageNo(S.currentLevel)} · ${S.stats.ok} PLAYERS LEFT`;
  const tops = alive.filter((x) => x.status === 'ok').slice(0, 8).map((x, i) => `${i + 1}. ${x.title.toUpperCase()} [${x.hidden}]`).join('   ///   ');
  $('ticker').textContent = tops ? `HIGH SCORE:   ${tops}` : 'NO DATA YET';

  // лічильники, що набігають
  function countUp() {
    document.querySelectorAll('.stat b[data-n]').forEach((b) => {
      const n = +b.dataset.n; if (reduced || !isFinite(n)) { b.textContent = b.dataset.n; return; }
      const t0 = performance.now(), dur = 900;
      const tick = (t) => { const p = Math.min(1, (t - t0) / dur); b.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }

  // ---------- подіум ----------
  const top3 = alive.filter((x) => x.status === 'ok').slice(0, 3);
  $('podium').innerHTML = top3.map((x, i) => `
    <a class="pod p${i + 1}" href="${x.url}" target="_blank" rel="noopener" title="${esc(x.title)}">
      <div class="pod-rank">${['1ST', '2ND', '3RD'][i]}</div>
      <img src="${thumb(x.preview, 300)}" alt="">
      <div class="pod-body">
        <div class="pod-title">${esc(x.title)}</div>
        <div class="pod-meta"><span class="who">${x.avatar ? `<img class="ava" src="${esc(x.avatar)}" alt="">` : ''}${esc(x.author || '—')}</span><span>HID <b>${x.hidden ?? '?'}</b> / ${x.total ?? '?'}</span></div>
      </div>
    </a>`).join('') || `<div class="empty">NO DATA YET</div>`;

  // легкий паралакс пристрою за курсором
  const hero = document.querySelector('.hero'), device = $('device');
  if (hero && device && !reduced) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      device.style.transform = `rotate(${(-5 + x * 4).toFixed(2)}deg) translate(${(x * 10).toFixed(1)}px, ${(y * 8).toFixed(1)}px)`;
      device.style.animation = 'none';
    });
    hero.addEventListener('mouseleave', () => { device.style.transform = ''; device.style.animation = ''; });
  }

  // ---------- стадії ----------
  const countAtLeast = (L) => S.items.filter((x) => (x.hidden ?? -1) >= L).length;
  const stageEls = [];
  stageEls.push(`<div class="stage ${S.stages.length ? 'done' : 'current'}"><span class="n">00</span><b>START</b>${S.stats.total} скінів у конкурсній колекції</div>`);
  for (const st of S.stages) {
    const cls = st.level === S.currentLevel ? 'current' : 'done';
    stageEls.push(`<div class="stage ${cls}"><span class="n">0${stageNo(st.level)}</span><b>LEVEL ${stageNo(st.level)} - ${st.level}+ HIDDEN</b>${countAtLeast(st.level)} пройшли · ${fmtDate(st.time)}${st.forced ? ' · manual' : ''}</div>`);
  }
  const nextL = S.currentLevel == null ? S.baseHidden : S.currentLevel + 1;
  stageEls.push(`<div class="stage future"><span class="n">0${stageNo(nextL)}</span><b>LEVEL ${stageNo(nextL)} - ${nextL}+ HIDDEN</b>поки ${countAtLeast(nextL)} / потрібно ≥${S.nextNeed} одночасно</div>`);
  stageEls.push(`<div class="stage future"><span class="n">FIN</span><b>IN GAME</b>фінал: приймають у гру</div>`);
  $('stages').innerHTML = stageEls.join('');
  $('stageHint').textContent = `рівень = к-ть прихованих колекцій · нова стадія вмикається, коли ≥${S.nextNeed} скінів (≥${Math.round(S.minWaveShare*100)}% попередньої стадії) досягли її одночасно`;

  // ---------- фільтри ----------
  const tags = [...new Set(S.items.flatMap((x) => x.tags))].sort();
  $('tag').innerHTML += tags.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  const authors = [...new Set(S.items.map((x) => x.author).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  $('author').innerHTML += authors.map((a) => `<option value="${esc(a)}">${esc(a)}</option>`).join('');

  const state = { q: '', tag: '', author: '', sort: 'rank', showDead: false, onlyNew: false };
  try { Object.assign(state, JSON.parse(localStorage.getItem('rustober-ui') || '{}')); } catch (e) {}
  $('search').value = state.q; $('tag').value = state.tag; $('author').value = state.author; $('sort').value = state.sort;
  $('showDead').checked = state.showDead; $('onlyNew').checked = state.onlyNew;

  function matches(x) {
    if (state.tag && !x.tags.includes(state.tag)) return false;
    if (state.author && x.author !== state.author) return false;
    if (state.onlyNew && !(x.delta > 0)) return false;
    if (state.q) {
      const q = state.q.toLowerCase();
      if (!`${x.title} ${x.author || ''} ${x.tags.join(' ')} ${x.id}`.toLowerCase().includes(q)) return false;
    }
    return true;
  }
  function sorter(a, b) {
    switch (state.sort) {
      case 'delta': return (b.delta - a.delta) || ((b.hidden ?? -1) - (a.hidden ?? -1));
      case 'total': return ((b.total ?? 0) - (a.total ?? 0)) || ((b.hidden ?? -1) - (a.hidden ?? -1));
      case 'title': return a.title.localeCompare(b.title);
      case 'author': return (a.author || '').localeCompare(b.author || '') || a.title.localeCompare(b.title);
      default: return 0;
    }
  }

  const tier = (x) => Math.min(4, Math.max(1, x.stagesPassed + (S.currentLevel != null && x.hidden > S.currentLevel ? 1 : 0)));
  const maxSeries = Math.max(1, ...S.items.flatMap((x) => x.series.map((v) => v ?? 0)));
  const totalStages = S.stages.length + 1;

  function card(x, i, opts = {}) {
    const dead = !x.alive, risk = x.status === 'risk';
    const cls = ['card', dead ? 'dead' : 't' + tier(x), risk ? 'risk' : '', opts.dying ? 'dying' : '', x.manual ? 'manual' : ''].filter(Boolean).join(' ');
    let pips = '';
    for (let k = 0; k < totalStages; k++) pips += `<i class="pip ${k < x.stagesPassed ? 'on' : ''}"></i>`;
    const spark = x.series.length > 1 ? `<div class="spark" title="приховані по знімках: ${x.series.map((v) => v ?? '?').join(' → ')}">${x.series.map((v, k) => `<i class="${k === x.series.length - 1 ? 'last' : ''}" style="height:${Math.max(10, Math.round(((v ?? 0) / maxSeries) * 100))}%"></i>`).join('')}</div>` : '';
    const delta = x.delta ? `<div class="delta ${x.delta < 0 ? 'neg' : ''}">${x.delta > 0 ? '+' : ''}${x.delta}</div>` : '';
    const stamp = dead ? `<div class="stamp">GAME OVER · LVL ${stageNo(x.eliminatedLevel ?? S.currentLevel)}</div>` : risk ? `<div class="stamp warn">LOW SIGNAL · LVL ${stageNo(x.riskLevel)}</div>` : '';
    const pubList = x.pubTitles?.length ? `публічні: ${x.pubTitles.join('; ')}` : 'публічних колекцій нема';
    return `<a class="${cls}" style="--i:${Math.min(i, 40)}" href="${x.url}" target="_blank" rel="noopener" data-id="${x.id}" title="${esc(x.title)} — ${esc(pubList)}">
      <div class="img"><img loading="lazy" src="${thumb(x.preview)}" alt="">
        <div class="rank">#${i + 1}</div>${delta}${stamp}
        <div class="pips">${pips}</div>
      </div>
      <div class="body">
        <div class="ttl">${esc(x.title)}</div>
        <div class="author"><span class="who">${x.avatar ? `<img class="ava" src="${esc(x.avatar)}" alt="" loading="lazy">` : '<i class="ava"></i>'}${esc(x.author || '—')}</span><span class="tagchip">${esc(x.tags[0] || '')}</span></div>
        <div class="counters">
          <div class="counter"><b>${x.total ?? '?'}</b><span>УСЬОГО</span></div>
          <div class="counter pub"><b>${x.pub ?? '?'}</b><span>ПУБЛ.</span></div>
          <div class="counter hid"><b>${x.hidden ?? '?'}</b><span>ПРИХОВ.</span></div>
        </div>
        ${spark}
      </div>
    </a>`;
  }

  let firstRender = true;
  function render() {
    const a = alive.filter(matches).sort(sorter);
    const d = dead.filter(matches).sort(sorter);
    const dyingIds = new Set(firstRender ? dyingNow.map((x) => x.id) : []);
    const aliveHtml = a.map((x, i) => card(x, i));
    if (firstRender && dyingIds.size) {
      const dy = dead.filter((x) => dyingIds.has(x.id) && matches(x));
      aliveHtml.push(...dy.map((x, i) => card({ ...x, alive: true, status: 'ok' }, a.length + i, { dying: true })));
    }
    $('aliveGrid').innerHTML = aliveHtml.join('');
    $('aliveEmpty').hidden = a.length > 0;
    $('aliveCount').textContent = `${a.length} / ${alive.length}`;
    $('terminated').hidden = !state.showDead;
    $('deadGrid').innerHTML = state.showDead ? d.map((x, i) => card(x, i)).join('') : '';
    $('deadCount').textContent = `${d.length} / ${dead.length}`;
    if (firstRender && dyingIds.size) {
      setTimeout(() => { document.querySelectorAll('.card.dying').forEach((el) => el.remove()); toast(`${dyingIds.size} скін(ів) вибуло в останньому знімку`); }, 3200);
    }
    firstRender = false;
  }

  // 3D-нахил картки за курсором (делегування, одна картка за раз)
  if (!reduced) {
    document.addEventListener('mousemove', (e) => {
      const c = e.target.closest?.('.card');
      if (!c || c.classList.contains('dying')) return;
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty('--ry', ((px - 0.5) * 12).toFixed(2) + 'deg');
      c.style.setProperty('--rx', ((0.5 - py) * 12).toFixed(2) + 'deg');
      c.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      c.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    }, { passive: true });
    document.addEventListener('mouseout', (e) => {
      const c = e.target.closest?.('.card');
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); }
    });
  }

  function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; setTimeout(() => (t.hidden = true), 4500); }
  function save() { try { localStorage.setItem('rustober-ui', JSON.stringify(state)); } catch (e) {} }
  $('search').addEventListener('input', (e) => { state.q = e.target.value.trim(); save(); render(); });
  $('tag').addEventListener('change', (e) => { state.tag = e.target.value; save(); render(); });
  $('author').addEventListener('change', (e) => { state.author = e.target.value; save(); render(); });
  $('sort').addEventListener('change', (e) => { state.sort = e.target.value; save(); render(); });
  $('showDead').addEventListener('change', (e) => { state.showDead = e.target.checked; save(); render(); });
  $('onlyNew').addEventListener('change', (e) => { state.onlyNew = e.target.checked; save(); render(); });

  $('howtoBody').innerHTML = `
    <p>Для кожного скіна зі сторінки майстерні беремо <code>усього колекцій</code> (число у «Переглянути всі колекції (N)») і <code>публічні</code>
    (колекції, які видно на сторінці перегляду). <code>Приховані = усього − публічні</code>. Конкурсна колекція публічна, тож вона не рахується як прихована.</p>
    <ul>
      <li><b>Стадія 1</b>: скін проходить, якщо прихованих ≥ ${S.baseHidden} (напр. 3 колекції: 1 відкрита + 2 приховані, або 4: 2 + 2).</li>
      <li><b>Наступні стадії</b>: коли в одному знімку щонайменше ${S.minWave} скінів і не менше ${Math.round(S.minWaveShare*100)}% тих, хто пройшов попередню стадію, одночасно отримують ще одну приховану колекцію, вмикається новий рівень.
      Хто його досяг, проходить далі й піднімається вище; хто ні, спершу позначається <b>AT RISK</b>, а якщо й у наступному знімку
      (${S.graceSnapshots} знімок запасу) не дотягнув, вибуває остаточно і зникає з сайту (видно через перемикач «Вибулі»).</li>
      <li><b>Рейтинг</b>: живі скіни сортуються за кількістю прихованих колекцій, потім за загальною кількістю. Смужки під лічильниками показують історію по знімках, бейдж «+1» — приріст за останній знімок.</li>
      <li><b>Оновлення</b>: <code>refresh.cmd</code> у папці проєкту (або <code>node scripts/fetch.mjs</code>). Ручні правки у <code>config.json</code>: <code>overrides.keep</code> / <code>overrides.drop</code> (ID скінів), <code>forceLevel</code>.</li>
    </ul>`;

  render();
  countUp();

  // Авто-оновлення: сканер 24/7 переписує state.js; коли з'являється новий знімок — перезавантажуємо сторінку
  // (працює через http, напр. node scripts/serve.mjs; при відкритті з диска просто ігнорується)
  if (location.protocol.startsWith('http')) {
    setInterval(async () => {
      try {
        const t = await (await fetch('state.js', { cache: 'no-store' })).text();
        const m = t.match(/"generated":"([^"]+)"/);
        if (m && m[1] !== S.generated) location.reload();
      } catch (e) {}
    }, 5 * 60 * 1000);
  }
  if (dyingNow.length) toast(`УВАГА: ${dyingNow.length} скін(ів) втрачають сигнал…`);
})();
