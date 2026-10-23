// Перехідник для старих сторінок у кеші браузера: колись тема була в xmas.css/xmas.js, тепер — season.css/season.js.
(function () {
  var d = document.documentElement;
  if (!d.dataset.season) { var m = new Date().getMonth(); d.dataset.season = m === 11 || m < 2 ? 'winter' : 'autumn'; }
  d.removeAttribute('data-xmas');
  if (!document.querySelector('link[href^="season.css"]')) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'season.css?v=' + Date.now(); document.head.appendChild(l); }
  if (!document.querySelector('script[src^="season.js"]')) { var s = document.createElement('script'); s.src = 'season.js?v=' + Date.now(); document.body.appendChild(s); }
})();
