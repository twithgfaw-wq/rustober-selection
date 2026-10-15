// Логіка сторінок «Автори» (window.AUTHORS) і «Ринок» (window.MARKET). Спільна шапка/тема/модалка.
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const t = (k, v) => (window.t ? window.t(k, v) : k);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const loc = () => (window.LANG === 'en' ? 'en-GB' : 'uk-UA');
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(loc(), { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—';
  const usd = (c) => (c == null || c === 0) ? '—' : '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const usd0 = (d) => d == null ? '—' : '$' + Math.round(d).toLocaleString('en-US');
  const pct = (v) => v == null ? '—' : (v > 0 ? '+' : '') + (+v).toFixed(1) + '%';
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // однакова стартова позиція при кожному відкритті сторінки
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  if (!location.hash) window.scrollTo(0, 0);

  // ---- спільне: тема, мова, паралакс, reveal, модалка, тост ----
  const root = document.documentElement;
  const setEdition = (e) => { root.dataset.edition = e; store.set('rstbr-edition', e); document.querySelectorAll('.theme-grid button').forEach((b) => b.classList.toggle('on', b.dataset.theme === e)); };
  setEdition(store.get('rstbr-edition', 'grey'));
  $('themeBtn').addEventListener('click', () => { $('themePop').hidden = !$('themePop').hidden; });
  document.querySelectorAll('.theme-grid button').forEach((b) => b.addEventListener('click', () => setEdition(b.dataset.theme)));
  document.addEventListener('click', (e) => { if (!e.target.closest('#themePop, #themeBtn')) $('themePop').hidden = true; });
  const depthEls = [...document.querySelectorAll('[data-depth]')];
  if (!reduced) window.addEventListener('scroll', () => { const sy = window.scrollY; for (const el of depthEls) el.style.transform = `translate3d(0, ${(-sy * (+el.dataset.depth) * 0.6).toFixed(1)}px, 0)`; }, { passive: true });
  const revealEls = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reduced) { const ro = new IntersectionObserver((ents) => { for (const en of ents) if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } }, { rootMargin: '0px 0px -10% 0px' }); revealEls.forEach((el) => ro.observe(el)); } else revealEls.forEach((el) => el.classList.add('in'));
  function openModal(html) { $('modalContent').innerHTML = html; $('modal').hidden = false; document.body.classList.add('noscroll'); }
  function closeModal() { $('modal').hidden = true; document.body.classList.remove('noscroll'); }
  $('modal').addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); $('themePop').hidden = true; } });
  function toast(msg) { const tt = $('toast'); tt.textContent = msg; tt.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => (tt.hidden = true), 4000); }
  const tip = document.createElement('div'); tip.className = 'tip'; tip.hidden = true; document.body.appendChild(tip);
  document.addEventListener('mousemove', (e) => { const h = e.target.closest?.('.hit'); if (!h) { tip.hidden = true; return; } tip.textContent = h.dataset.tip; tip.hidden = false; tip.style.left = Math.min(innerWidth - 220, e.clientX + 12) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; }, { passive: true });
  // піксельний спрайт на екрані (джойстик-монета)
  const SPR = ['....YYYYYY....', '..YYYYYYYYYY..', '.YYYYYYYYYYYY.', '.YYYKKYYYYYYY.', 'YYYKKKKYYYYYYY', 'YYYKKKKYYYYYYY', 'YYYYKKYYYYYYYY', 'YYYYKKYYYYYYYY', 'YYYYKKYYYYYYYY', 'YYYYKKYYYYYYYY', '.YYYKKKKYYYYY.', '.YYYYYYYYYYYY.', '..YYYYYYYYYY..', '....YYYYYY....'];
  (function sprite() { const el = $('sprite'); if (!el) return; const s = 6; const sh = []; SPR.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === 'Y') sh.push(`${x * s}px ${y * s}px 0 0 #ffc63a`); if (ch === 'K') sh.push(`${x * s}px ${y * s}px 0 0 #6a3200`); })); el.style.setProperty('--px-shadow', sh.join(',')); el.style.width = s + 'px'; el.style.height = s + 'px'; el.style.marginRight = (SPR[0].length - 1) * s + 'px'; el.style.marginBottom = (SPR.length - 1) * s + 'px'; })();
  const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="none" style="aspect-ratio:${w}/${h}" role="img">${inner}</svg>`;
  const spark = (arr, w = 120, h = 22, color = '#2f7bff') => { if (!arr || arr.length < 2) return ''; const vals = arr.map((p) => p[1]); const mn = Math.min(...vals), mx = Math.max(...vals); const y = (v) => h - 2 - (h - 4) * (mx === mn ? 0.5 : (v - mn) / (mx - mn)); const d = vals.map((v, i) => `${i ? 'L' : 'M'}${(i * w / (vals.length - 1)).toFixed(1)} ${y(v).toFixed(1)}`).join(' '); return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="${color}" stroke-width="2"/></svg>`; };
  const chg = (v) => v == null ? '' : `<span class="chg ${v > 0.5 ? 'up' : v < -0.5 ? 'dn' : ''}">${pct(v)}</span>`;
  const paintStats = (rows) => { $('stats').innerHTML = rows.map(([c, i, v, l]) => `<div class="stat ${c}"><i class="ico">${i}</i><b>${v}</b><span>${l}</span></div>`).join(''); };
  $('langBtn').addEventListener('click', () => { window.setLang(window.LANG === 'ua' ? 'en' : 'ua'); location.reload(); });

  // ==================== АВТОРИ ====================
  if (window.AUTHORS) {
    const A = window.AUTHORS;
    const yrs = Object.keys(A.totals.yearly).sort();
    paintStats([['', '#', A.totals.items.toLocaleString(), t('a.stat.items')], ['c', '☺', A.totals.authors.toLocaleString(), t('a.stat.authors')], ['y', '▶', A.rising.length, t('a.stat.rising')], ['g', '⚡', A.streaks.length, t('a.stat.streaks')]]);
    $('updated').textContent = `SCMM ${fmtDate(A.scmmAt)} · ${A.totals.rotations} STORE ROTATIONS · ${yrs[0]}–${yrs.at(-1)}`;
    $('footSnap').textContent = `generated ${A.generated}`;
    $('arcadeList').innerHTML = A.top.slice(0, 8).map((a, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><span class="nm">${esc(a.name.toUpperCase().slice(0, 16))}</span><span class="sc">${a.accepted}</span></li>`).join('');
    $('ticker').textContent = A.streaks.slice(0, 8).map((a) => `${a.name.toUpperCase()} STREAK ${a.streak}`).join('   ///   ') || 'NO STREAKS';
    const notes = { top: t('a.note.top'), rising: t('a.note.rising'), streaks: t('a.note.streaks'), bestStreaks: t('a.note.best'), active90: t('a.note.active'), submitters: t('a.note.sub') };
    let tab = 'top', shown = 30, q = '';
    const list = () => {
      if (tab === 'submitters') return A.submitters;
      let arr = A[tab] || A.top;
      if (q) arr = A.all.filter((a) => a.name.toLowerCase().includes(q));
      return arr;
    };
    const row = (a, i) => {
      if (tab === 'submitters') return `<div class="rank-row" data-author="${esc(a.id || '')}" data-name="${esc(a.name)}"><span class="pos">${i + 1}</span>${a.avatar ? `<img class="ava" src="${esc(a.avatar)}" alt="">` : '<i class="ava"></i>'}<div class="nm"><b>${esc(a.name)}</b><span>${a.weeks}/${A.votesWeeks.length} ${t('a.weeks')} · ${a.submissions} ${t('a.subs')} · ${t('a.avgScore')} ${a.avgScore ?? '—'} · ${t('a.best')} ${a.bestScore ?? '—'}</span></div><div class="num"><b>${a.accepted}</b><span>${t('a.accepted')}</span></div></div>`;
      const streak = a.streak >= 2 ? `<span class="streak-bar" title="streak ${a.streak}">${'<i></i>'.repeat(Math.min(a.streak, 12))}</span>` : '';
      const main = tab === 'rising' ? [a.last365, t('a.last365')] : tab === 'streaks' ? [a.streak, t('a.streakNow')] : tab === 'bestStreaks' ? [a.bestStreak, t('a.streakBest')] : tab === 'active90' ? [a.last90, t('a.last90')] : [a.accepted, t('a.accepted')];
      const full = A.top.find((x) => x.id === a.id) || A.rising.find((x) => x.id === a.id) || A.streaks.find((x) => x.id === a.id) || A.active90.find((x) => x.id === a.id) || A.bestStreaks.find((x) => x.id === a.id);
      const thumbs = full?.items ? `<div class="thumbs">${full.items.slice(0, 8).map((it) => `<img src="${esc(it.icon)}" alt="" title="${esc(it.name)}" loading="lazy">`).join('')}</div>` : '';
      return `<div class="rank-row" data-author="${esc(a.id)}"><span class="pos">${i + 1}</span>${a.avatar ? `<img class="ava" src="${esc(a.avatar)}" alt="" loading="lazy">` : '<i class="ava"></i>'}<div class="nm"><b>${esc(a.name)}${streak}</b><span>${a.accepted} ${t('a.accepted')} · ${t('a.since')} ${fmtDate(a.first)} · ${t('a.last90')}: ${a.last90} · ${t('a.streakBest')}: ${a.bestStreak}${a.revenue ? ` · ${t('a.revenue')} ~${usd0(a.revenue / 100)}` : ''}</span></div><div class="num"><b>${main[0]}</b><span>${main[1]}</span></div>${thumbs}</div>`;
    };
    function render() {
      const arr = list(); $('rankList').innerHTML = arr.slice(0, shown).map(row).join('') || `<div class="empty">—</div>`;
      $('more').hidden = arr.length <= shown; $('listHint').textContent = `${arr.length}`; $('modeNote').textContent = notes[tab] || '';
    }
    $('tabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-tab]'); if (!b) return; tab = b.dataset.tab; shown = 30; document.querySelectorAll('#tabs button').forEach((x) => x.classList.toggle('on', x === b)); render(); });
    $('more').addEventListener('click', () => { shown += 30; render(); });
    $('search').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); shown = 30; if (q && tab === 'submitters') tab = 'top'; render(); });
    function openAuthor(id, name) {
      const a = A.top.find((x) => x.id === id) || A.rising.find((x) => x.id === id) || A.streaks.find((x) => x.id === id) || A.bestStreaks.find((x) => x.id === id) || A.active90.find((x) => x.id === id) || A.all.find((x) => x.id === id);
      if (!a) { toast(name ? `${name}: ${t('a.noAccepts')}` : '—'); return; }
      const yearsAll = yrs.map((y) => a.years?.[y] || 0); const maxY = Math.max(1, ...yearsAll);
      const sub = A.submitters.find((s) => s.name === a.name);
      openModal(`<div class="a-head">${a.avatar ? `<img class="ava big" src="${esc(a.avatar)}" alt="">` : ''}<div><h3>${esc(a.name)}</h3><div class="hint">${a.accepted} ${t('a.accepted')} · ${t('a.since')} ${fmtDate(a.first)} · ${t('a.lastAccept')} ${fmtDate(a.last)}${a.topType ? ` · ${esc(a.topType)}` : ''}</div></div>
        <div class="m-actions"><a class="btn3d yellow small" href="https://steamcommunity.com/profiles/${esc(a.id)}/myworkshopfiles/?appid=252490" target="_blank" rel="noopener">Steam Workshop ↗</a><a class="btn3d grey small" href="https://rust.scmm.app/items?creatorId=${esc(a.id)}" target="_blank" rel="noopener">SCMM ↗</a></div></div>
        <div class="counters" style="margin:12px 0"><div class="counter"><b>${a.last90 ?? 0}</b><span>${t('a.last90')}</span></div><div class="counter"><b>${a.last365 ?? 0}</b><span>${t('a.last365')}</span></div><div class="counter pub"><b>${a.streak ?? 0}</b><span>${t('a.streakNow')}</span></div><div class="counter hid"><b>${a.bestStreak ?? 0}</b><span>${t('a.streakBest')}</span></div>${a.revenue ? `<div class="counter"><b>${usd0(a.revenue / 100)}</b><span>${t('a.revenue')}</span></div>` : ''}</div>
        ${sub ? `<div class="hint" style="margin-bottom:10px">micro522: ${sub.weeks}/${A.votesWeeks.length} ${t('a.weeks')}, ${sub.submissions} ${t('a.subs')}, ${t('a.avgScore')} ${sub.avgScore}</div>` : ''}
        <div class="hint">${t('a.perYear')}</div><div class="yearbar" style="margin:4px 0 14px">${yearsAll.map((v, i) => `<i class="hit ${i === yearsAll.length - 1 ? 'last' : ''}" data-tip="${yrs[i]}: ${v}" style="height:${Math.max(6, v / maxY * 100)}%"></i>`).join('')}</div>
        <div class="hint">${t('a.latest')}</div><div class="mgrid" style="margin-top:8px">${(a.items || []).map(mcard).join('') || '—'}</div>`);
    }
    document.addEventListener('click', (e) => { const r = e.target.closest('.rank-row'); if (r && !e.target.closest('a')) openAuthor(r.dataset.author, r.dataset.name); const m = e.target.closest('.mcard'); if (m && !e.target.closest('a')) openItemByEl(m); });
    // графік по роках
    (function years() { const W = 600, H = 200, pl = 36, pr = 10, pt = 16, pb = 26; const vals = yrs.map((y) => A.totals.yearly[y]); const mx = Math.max(1, ...vals); const bw = (W - pl - pr) / yrs.length; let out = ''; vals.forEach((v, i) => { const bh = (H - pt - pb) * v / mx, x0 = pl + i * bw + 4; out += `<rect class="hit" data-tip="${yrs[i]}: ${v}" x="${x0}" y="${H - pb - bh}" width="${bw - 8}" height="${bh}" rx="3" fill="${i === vals.length - 1 ? '#5fd36b' : '#ffc63a'}"/><text x="${x0 + (bw - 8) / 2}" y="${H - pb - bh - 5}" font-size="10" fill="#f2f0ea" text-anchor="middle" font-weight="700">${v}</text><text x="${x0 + (bw - 8) / 2}" y="${H - pb + 14}" font-size="9" fill="#9a97a0" text-anchor="middle">${yrs[i].slice(2)}</text>`; }); $('chartYears').innerHTML = svg(W, H, out); })();
    render();
    const h = decodeURIComponent(location.hash || ''); if (h.startsWith('#author/')) openAuthor(h.slice(8));
  }

  // ==================== РИНОК ====================
  const M = window.MARKET;
  const allItems = M ? [...new Map([...M.gainers7, ...M.losers7, ...M.gainers30, ...M.losers30, ...M.mostTraded, ...M.mostSold, ...M.liquid, ...M.expensive, ...M.nearAth, ...M.farAth, ...M.rare, ...M.storeNow, ...M.storeRoiBest].map((x) => [x.id, x])).values()] : [];
  const itemsById = Object.fromEntries(allItems.map((x) => [x.id, x]));
  function mcard(x) {
    const ch = x.c7 != null ? chg(x.c7) : (x.c30 != null ? chg(x.c30) : '');
    const roi = x.roi != null ? `<span class="chg roi ${x.roi > 0 ? 'up' : 'dn'}" title="ROI">ROI ${pct(x.roi)}</span>` : '';
    const sp = M && M.charts[x.id] ? `<div class="spk">${spark(M.charts[x.id].slice(-30), 120, 22, (x.c7 ?? x.c30 ?? 0) >= 0 ? '#5fd36b' : '#ff5a3c')}</div>` : '';
    return `<div class="mcard" data-item="${x.id}"><img src="${esc(x.icon)}" alt="" loading="lazy"><div class="mn"><b title="${esc(x.name)}">${esc(x.name)}</b><small>${esc(x.type || '')}${x.creator ? ' · ' + esc(x.creator) : ''}</small><div class="mp"><b>${usd(x.low || x.last || null)}</b>${ch}</div>${sp}</div>${roi}</div>`;
  }
  function openItemByEl(el) { const x = itemsById[el.dataset.item] || (window.AUTHORS && findAuthorItem(el.dataset.item)); if (x) openItem(x); }
  function findAuthorItem(id) { for (const a of [...window.AUTHORS.top, ...window.AUTHORS.rising, ...window.AUTHORS.streaks, ...window.AUTHORS.active90, ...window.AUTHORS.bestStreaks]) { const it = (a.items || []).find((i) => String(i.id) === String(id)); if (it) return it; } return null; }
  function openItem(x) {
    const hist = M && M.charts[x.id];
    let chart = '';
    if (hist && hist.length > 1) {
      const W = 600, H = 180, p = 24; const vals = hist.map((h) => h[1]); const mn = Math.min(...vals), mx = Math.max(...vals);
      const xs = (i) => p + i * (W - 2 * p) / (hist.length - 1), ys = (v) => H - p - (H - 2 * p) * (mx === mn ? 0.5 : (v - mn) / (mx - mn));
      const path = vals.map((v, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ');
      const area = path + ` L${xs(hist.length - 1).toFixed(1)} ${H - p} L${p} ${H - p} Z`;
      const dots = hist.map((h, i) => `<circle class="hit" data-tip="${h[0]}: ${usd(h[1])} · vol ${h[2]}" cx="${xs(i)}" cy="${ys(h[1])}" r="3" fill="#ffc63a"/>`).join('');
      chart = `<div class="m-prices">${svg(W, H, `<path d="${area}" fill="rgba(255,198,58,0.15)"/><path d="${path}" fill="none" stroke="#ffc63a" stroke-width="2"/>${dots}<text x="${p}" y="14" font-size="10" fill="#9fd0ff">${hist[0][0]}</text><text x="${W - p}" y="14" font-size="10" fill="#9fd0ff" text-anchor="end">${hist.at(-1)[0]}</text><text x="${p}" y="${H - 6}" font-size="10" fill="#9fd0ff">min ${usd(mn)}</text><text x="${W - p}" y="${H - 6}" font-size="10" fill="#9fd0ff" text-anchor="end">max ${usd(mx)}</text>`)}</div>`;
    }
    const markets = (x.markets || []).slice(0, 6).map((m) => `<a href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.m)} ${usd(m.p)}</a>`).join('');
    openModal(`<div class="m-grid"><div class="m-img" style="aspect-ratio:1;background:#0f1a2b;display:grid;place-items:center"><img src="${esc(x.icon)}" alt="" style="object-fit:contain"></div>
      <div class="m-info"><h3>${esc(x.name)}</h3><div class="who big">${esc(x.type || '')}${x.creator ? ` · <a href="authors.html#author/${esc(x.creatorId || '')}">${esc(x.creator)}</a>` : ''}${x.accepted ? ` · ${t('m.accepted')} ${fmtDate(x.accepted)}` : ''}</div>
      <div class="counters"><div class="counter"><b>${usd(x.low)}</b><span>${t('m.price')}</span></div><div class="counter"><b>${usd(x.store)}</b><span>${t('m.store')}</span></div><div class="counter pub"><b>${pct(x.c7)}</b><span>7D</span></div><div class="counter pub"><b>${pct(x.c30)}</b><span>30D</span></div><div class="counter hid"><b>${pct(x.athPct)}</b><span>ATH ${usd(x.ath)}</span></div></div>
      <div class="counters"><div class="counter"><b>${x.s24 ?? '—'}</b><span>${t('m.sales24')}</span></div><div class="counter"><b>${x.s30 ?? '—'}</b><span>${t('m.sales30')}</span></div><div class="counter"><b>${x.supply?.toLocaleString() ?? '—'}</b><span>${t('m.supply')}</span></div><div class="counter"><b>${x.liq ?? '—'}</b><span>${t('m.liq')}</span></div>${x.roi != null ? `<div class="counter ${x.roi > 0 ? 'pub' : 'hid'}"><b>${pct(x.roi)}</b><span>ROI</span></div>` : ''}</div>
      ${chart}${markets ? `<div class="hint">${t('m.buyAt')}</div><div class="m-markets">${markets}</div>` : ''}
      <div class="m-actions"><a class="btn3d yellow small" href="https://steamcommunity.com/market/listings/252490/${encodeURIComponent(x.name)}" target="_blank" rel="noopener">Steam Market ↗</a><a class="btn3d blue small" href="https://rust.scmm.app/item/${esc(x.guid)}" target="_blank" rel="noopener">SCMM ↗</a>${x.wsId ? `<a class="btn3d grey small" href="https://steamcommunity.com/sharedfiles/filedetails/?id=${x.wsId}" target="_blank" rel="noopener">Workshop ↗</a>` : ''}</div></div></div>`);
  }
  if (M) {
    paintStats([['', '$', usd0(M.totals.marketCap), t('m.stat.cap')], ['c', '⇄', M.totals.sales24.toLocaleString(), t('m.stat.sales24')], ['y', '$', usd0(M.totals.value168), t('m.stat.v168')], ['g', '#', M.totals.items.toLocaleString(), t('m.stat.items')]]);
    $('updated').textContent = `SCMM ${fmtDate(M.scmmAt)} · STORE ${M.store?.id || '—'} · ${M.detailsCount} ITEMS WITH 7D/30D DATA`;
    $('footSnap').textContent = `generated ${M.generated}`;
    const g = M.gainers7[0], l = M.losers7[0];
    $('arcadeKv').innerHTML = `<div><span>MARKET CAP</span><b class="y">${usd0(M.totals.marketCap)}</b></div><div><span>24H SALES</span><b>${M.totals.sales24.toLocaleString()}</b></div><div><span>TOP GAINER 7D</span><b class="g">${g ? pct(g.c7) : '—'}</b></div><div><span>TOP LOSER 7D</span><b class="r">${l ? pct(l.c7) : '—'}</b></div>`;
    $('ticker').textContent = [...M.gainers7.slice(0, 5).map((x) => `${x.name.toUpperCase()} ${pct(x.c7)}`), ...M.losers7.slice(0, 3).map((x) => `${x.name.toUpperCase()} ${pct(x.c7)}`)].join('   ///   ') || 'COLLECTING DATA';
    // індекс ринку
    (function index() {
      const I = M.index; const box = $('chartIndex');
      if (I.length < 2) { box.innerHTML = `<div class="hint">${t('m.indexWait', { n: I.length })}</div>`; $('indexHint').textContent = `${I.length} ${t('m.days')}`; return; }
      const W = 900, H = 220, p = 30; const vals = I.map((d) => d.v); const mn = Math.min(...vals), mx = Math.max(...vals);
      const xs = (i) => p + i * (W - 2 * p) / (I.length - 1), ys = (v) => H - p - (H - 2 * p) * (mx === mn ? 0.5 : (v - mn) / (mx - mn));
      const path = vals.map((v, i) => `${i ? 'L' : 'M'}${xs(i)} ${ys(v)}`).join(' ');
      box.innerHTML = svg(W, H, `<path d="${path} L${xs(I.length - 1)} ${H - p} L${p} ${H - p} Z" fill="rgba(95,211,107,0.12)"/><path d="${path}" fill="none" stroke="#5fd36b" stroke-width="2.5"/>${I.map((d, i) => `<circle class="hit" data-tip="${d.d}: ${usd0(d.v)} (${d.n} items)" cx="${xs(i)}" cy="${ys(d.v)}" r="4" fill="#ffc63a"/>`).join('')}<text x="${p}" y="16" font-size="11" fill="#9a97a0">${I[0].d}</text><text x="${W - p}" y="16" font-size="11" fill="#9a97a0" text-anchor="end">${I.at(-1).d}</text>`);
      const first = I[0].v, last = I.at(-1).v; $('indexHint').textContent = `${I.length} ${t('m.days')} · ${pct(first ? (last - first) / first * 100 : null)}`;
    })();
    // магазин
    const sNow = M.storeNow || []; $('storeHint').textContent = `${sNow.length} ${t('m.items')} · ${M.store?.start ? fmtDate(M.store.start) : ''}`;
    $('storeGrid').innerHTML = sNow.map(mcard).join('') || `<div class="empty">—</div>`;
    // мувери
    const mnotes = { gainers7: t('m.note.7'), losers7: t('m.note.7'), gainers30: t('m.note.30'), losers30: t('m.note.30'), mostTraded: t('m.note.traded'), mostSold: t('m.note.sold'), expensive: t('m.note.exp'), nearAth: t('m.note.ath'), farAth: t('m.note.dip'), rare: t('m.note.rare'), storeRoiBest: t('m.note.roi') };
    let mtab = 'gainers7';
    const mrender = () => { const arr = M[mtab] || []; $('mGrid').innerHTML = arr.map(mcard).join('') || `<div class="empty">${t('m.empty')}</div>`; $('moversHint').textContent = `${arr.length}`; $('mModeNote').textContent = mnotes[mtab] || ''; };
    $('mtabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-tab]'); if (!b) return; mtab = b.dataset.tab; document.querySelectorAll('#mtabs button').forEach((x) => x.classList.toggle('on', x === b)); mrender(); });
    mrender();
    // ротації
    $('rotList').innerHTML = (M.rotStats || []).map((r) => `<div class="rot-row"><span class="d">${fmtDate(r.start)}</span><div class="bar">${r.avgRoi != null ? `<i class="${r.avgRoi < 0 ? 'neg' : ''}" style="width:${Math.min(100, Math.abs(r.avgRoi))}%"></i>` : ''}</div><b>${r.avgRoi != null ? pct(r.avgRoi) : '—'}</b><span class="d">${r.items} ${t('m.items')}${r.best ? ` · ${t('m.best')}: ${esc(r.best.name)} ${pct(r.maxRoi)}` : ''}</span></div>`).join('');
    // типи
    (function types() { const T = M.typeStats; const mx = Math.max(1, ...T.map((x) => x.v168)); $('chartTypes').innerHTML = `<div class="bars">${T.map((x) => `<div class="bar-row hit" data-tip="${esc(x.type)}: ${t('m.stat.v168')} ${usd0(x.v168)} · cap ${usd0(x.cap)} · ${x.n} items"><span class="lbl">${esc(x.type)}</span><span class="track"><i style="width:${x.v168 / mx * 100}%"><b style="width:100%"></b></i></span><span class="val">${usd0(x.v168)}</span></div>`).join('')}</div>`; })();
    document.addEventListener('click', (e) => { const m = e.target.closest('.mcard'); if (m && !e.target.closest('a')) openItemByEl(m); });
  }
})();
