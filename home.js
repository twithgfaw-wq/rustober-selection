// RUSTMAS тизер: відлік до Нового року, підсумок Rustober 2026, перемикач мови.
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const t = (k, v) => (window.t ? window.t(k, v) : k);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const thumb = (url, size = 360) => !url ? '' : `${url}?imw=${size}&imh=${size}&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true`;

  // ---- відлік до 1 січня (місцевий час) ----
  const target = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0).getTime();
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const ms = Math.max(0, target - Date.now()), s = Math.floor(ms / 1000);
    $('cD').textContent = pad(Math.floor(s / 86400)); $('cH').textContent = pad(Math.floor(s / 3600) % 24); $('cM').textContent = pad(Math.floor(s / 60) % 60); $('cS').textContent = pad(s % 60);
  };
  tick(); setInterval(tick, 1000);

  // ---- підсумок Rustober ----
  function paintArchive() {
    const R = window.R26; if (!R) { $('rustober').hidden = true; return; }
    $('archHint').textContent = t('x.archHint', { n: R.finalists.length, total: R.total });
    $('archStats').innerHTML = [['#', R.total, t('x.stTotal')], ['▶', R.finalists.length, t('x.stFinal')], ['↑', R.levels, t('x.stLevels')]]
      .map(([i, v, l]) => `<div class="stat"><i class="ico">${i}</i><b>${v}</b><span>${l}</span></div>`).join('');
    $('finals').innerHTML = R.finalists.map((x, i) => `<a class="x-fin" href="${esc(x.url)}" target="_blank" rel="noopener">
      <div class="img"><img loading="lazy" src="${esc(thumb(x.preview))}" alt=""><span class="rk">#${i + 1}</span><span class="hid">${x.hidden} ${t('x.hidden')}</span></div>
      <div class="body"><div class="ttl">${esc(x.title)}</div><div class="who">${x.avatar ? `<img src="${esc(x.avatar)}" alt="" loading="lazy">` : ''}<span>${esc(x.author || '—')}</span></div></div></a>`).join('');
  }
  paintArchive();

  // ---- мова ----
  const lb = $('langBtn');
  if (lb && window.setLang) lb.addEventListener('click', () => { window.setLang(window.LANG === 'ua' ? 'en' : 'ua'); paintArchive(); });
})();
