// WORKSHOP: роботи майстерні лише від авторів з акцептами (дані site/workshop.json).
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const t = (k, v) => (window.t ? window.t(k, v) : k);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const num = (n) => (n >= 10000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k' : String(n));
  const DAY = 86400;
  let W = null, rows = [], view = [], shown = 0; const PAGE = 48;
  const st = { q: '', sort: 'new', period: 30, type: '', status: 'all', author: null };

  const ago = (sec) => { const d = Math.floor((Date.now() / 1000 - sec) / DAY); return d <= 0 ? t('w.today') : d < 30 ? t('w.daysAgo', { n: d }) : d < 365 ? t('w.monthsAgo', { n: Math.floor(d / 30) }) : t('w.yearsAgo', { n: Math.floor(d / 365) }); };
  // нижня межа Вілсона: рейтинг, що не дає 1 голосу «100%» обігнати сотні
  const wilson = (up, down) => { const n = up + down; if (!n) return 0; const z = 1.96, p = up / n; return (p + z * z / (2 * n) - z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n)) / (1 + z * z / n); };

  function readHash() { const h = decodeURIComponent(location.hash || ''); st.author = h.startsWith('#author/') ? h.slice(8) : null; }

  function apply() {
    const now = Date.now() / 1000; const q = st.q.toLowerCase();
    view = rows.filter((r) => {
      if (st.author) { if (r.owner !== st.author && !r.co.includes(st.author)) return false; }
      else if (now - r.created > st.period * DAY) return false;
      if (st.status === 'new' && r.acc) return false; if (st.status === 'acc' && !r.acc) return false;
      if (st.type && r.tag !== st.type) return false;
      if (q && !r.title.toLowerCase().includes(q) && !(W.people[r.owner]?.[0] || '').toLowerCase().includes(q)) return false;
      return true;
    });
    const key = { new: (r) => r.created, pop: (r) => r.subs, fav: (r) => r.favs, top: (r) => wilson(r.up, r.down), trend: (r) => r.subs / Math.pow(Math.max(1, (now - r.created) / DAY), 0.8) }[st.sort];
    view.sort((a, b) => key(b) - key(a) || b.created - a.created);
    shown = 0; $('grid').innerHTML = ''; more();
    const p = st.author && W.people[st.author];
    $('resTitle').textContent = p ? p[0] : t('w.sort.' + st.sort);
    $('resHint').textContent = t('w.found', { n: view.length.toLocaleString() });
    if (!view.length) $('grid').innerHTML = `<div class="empty">${t('w.empty')}</div>`;
  }
  function card(r) {
    const p = W.people[r.owner] || ['—', '', 0, null];
    const img = r.preview ? `${W.ugc}${r.preview}?imw=360&imh=360&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true` : '';
    const who = p[2] ? `<a href="authors.html#author/${esc(r.owner)}" title="${esc(t('w.profile'))}">${esc(p[0])}</a>` : `<span>${esc(p[0])}</span>`;
    return `<article class="w-card ${r.acc ? 'acc' : ''}"><a class="img" href="https://steamcommunity.com/sharedfiles/filedetails/?id=${esc(r.id)}" target="_blank" rel="noopener">${img ? `<img loading="lazy" src="${esc(img)}" alt="">` : ''}${r.acc ? `<span class="badge">${t('w.inGame')}</span>` : ''}<span class="age">${ago(r.created)}</span>${r.tag ? `<span class="tag">${esc(r.tag)}</span>` : ''}</a>
      <div class="body"><a class="ttl" href="https://steamcommunity.com/sharedfiles/filedetails/?id=${esc(r.id)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${esc(r.title)}</a>
      <div class="who">${p[1] ? `<img src="${esc(p[1])}" alt="" loading="lazy">` : ''}${who}${r.co.length ? `<em>+${r.co.length}</em>` : ''}</div>
      <div class="nums"><span title="${esc(t('w.subs'))}">⬇ ${num(r.subs)}</span><span title="${esc(t('w.favs'))}">♥ ${num(r.favs)}</span><span title="${esc(t('w.votes'))}">👍 ${num(r.up)}</span></div>
      ${p[3] != null && !r.acc ? `<div class="rate" title="${esc(t('w.rateTip'))}">${t('w.rate', { p: p[3] })}</div>` : ''}</div></article>`;
  }
  function more() { const chunk = view.slice(shown, shown + PAGE); $('grid').insertAdjacentHTML('beforeend', chunk.map(card).join('')); shown += chunk.length; $('more').hidden = shown >= view.length; }

  function paintAuthorBar() {
    const bar = $('authorBar'); const p = st.author && W.people[st.author];
    if (!p) { bar.hidden = true; return; }
    const total = rows.filter((r) => r.owner === st.author || r.co.includes(st.author)).length;
    bar.hidden = false;
    bar.innerHTML = `${p[1] ? `<img src="${esc(p[1])}" alt="">` : ''}<div><b>${esc(p[0])}</b><br><span>${t('w.authorLine', { n: total, a: p[2] })}${p[3] != null ? ' · ' + t('w.rate', { p: p[3] }) : ''}</span></div><button id="clearAuthor">${t('w.allAuthors')} ✕</button>`;
    $('clearAuthor').onclick = () => { history.replaceState(null, '', location.pathname); readHash(); paintAuthorBar(); apply(); };
  }

  function init(data) {
    W = data; const c = W.cols; const ix = Object.fromEntries(c.map((k, i) => [k, i]));
    rows = W.items.map((a) => ({ id: a[ix.id], title: a[ix.title], owner: a[ix.owner], created: a[ix.created], subs: a[ix.subs], favs: a[ix.favs], views: a[ix.views], up: a[ix.up], down: a[ix.down], tag: W.tags[a[ix.tag]] || '', preview: a[ix.preview], acc: !!a[ix.accepted], co: a[ix.coauthors] || [] }));
    const authors = Object.keys(W.people).length, acc = rows.filter((r) => r.acc).length, week = rows.filter((r) => Date.now() / 1000 - r.created < 7 * DAY).length;
    $('stats').innerHTML = [['', '#', rows.length.toLocaleString(), t('w.stItems')], ['c', '☺', authors.toLocaleString(), t('w.stAuthors')], ['y', '★', acc.toLocaleString(), t('w.stAcc')], ['g', '+', week.toLocaleString(), t('w.stWeek')]].map(([cl, i, v, l]) => `<div class="stat ${cl}"><i class="ico">${i}</i><b>${v}</b><span>${l}</span></div>`).join('');
    $('updated').textContent = `STEAM ${W.fetched ? new Date(W.fetched).toLocaleDateString() : ''} · ${t('w.window')}`;
    $('footSnap').textContent = `generated ${W.generated}`;
    const counts = {}; for (const r of rows) if (r.tag) counts[r.tag] = (counts[r.tag] || 0) + 1;
    $('type').insertAdjacentHTML('beforeend', Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<option value="${esc(k)}">${esc(k)} (${n})</option>`).join(''));
    readHash(); paintAuthorBar(); apply();
  }

  $('q').addEventListener('input', (e) => { st.q = e.target.value.trim(); apply(); });
  $('sort').addEventListener('change', (e) => { st.sort = e.target.value; apply(); });
  $('period').addEventListener('change', (e) => { st.period = +e.target.value; apply(); });
  $('type').addEventListener('change', (e) => { st.type = e.target.value; apply(); });
  $('status').addEventListener('click', (e) => { const b = e.target.closest('button[data-st]'); if (!b) return; st.status = b.dataset.st; $('status').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); apply(); });
  $('more').addEventListener('click', more);
  addEventListener('hashchange', () => { if (!W) return; readHash(); paintAuthorBar(); apply(); });
  const lb = $('langBtn'); if (lb && window.setLang) lb.addEventListener('click', () => { window.setLang(window.LANG === 'ua' ? 'en' : 'ua'); if (W) { paintAuthorBar(); apply(); } });
  const v = (document.querySelector('script[src^="workshop.js"]')?.getAttribute('src').split('?v=')[1]) || Date.now();
  fetch(`workshop.json?v=${v}`).then((r) => r.json()).then(init).catch(() => { $('grid').innerHTML = `<div class="empty">${t('w.fail')}</div>`; });
})();
