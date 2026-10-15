// Переклади інтерфейсу: UA (за замовчуванням) та EN. Підключається перед app.js.
window.I18N = {
  ua: {
    'boot.skip': 'натисни будь-де, щоб пропустити',
    'nav.countdown': 'до наступного оновлення даних', 'nav.players': 'Проходять', 'nav.charts': 'Графіки', 'nav.rules': 'Правила',
    'nav.theme': 'Колір консолі', 'nav.sound': 'Звук', 'nav.tv': 'TV-режим (повний екран)', 'nav.collection': 'Колекція Steam',
    'theme.title': 'Видання консолі',
    'hero.lead': 'Хто зі скінів конкурсу потрапляє в приховані колекції голосування і йде далі, а хто вибуває. Пройшов усі рівні — лишився на екрані й потрапив у гру. Не пройшов — консоль вимикається.',
    'hero.find': 'Знайти мій скін',
    'find.text': 'Встав посилання на свою роботу в майстерні (або її ID) і отримай картку зі статусом та місцем у рейтингу.',
    'watch.hint': 'твої обрані скіни · зміни підсвічуються', 'podium.hint': 'топ-3 за прихованими колекціями',
    'charts.hint': 'хвилі, розподіл і час активності', 'charts.race': 'Гонка лідерів · по знімках', 'charts.timeline': 'Скільки скінів на кожному рівні · по знімках',
    'charts.dist': 'Розподіл за прихованими колекціями', 'charts.heat': 'Коли приходять нові приховані · по годинах', 'charts.tags': 'Предмети у відборі · топ-10 типів',
    'predict.hint': 'постав свої прогнози: хто пройде наступний рівень', 'authors.hint': 'хто має найбільше скінів, що проходять',
    'controls.search': 'пошук: назва, автор, предмет…  ( / )', 'controls.allItems': 'Усі предмети', 'controls.allAuthors': 'Усі автори',
    'sort.rank': 'Рейтинг', 'sort.delta': 'Нові приховані (+)', 'sort.total': 'Усього колекцій', 'sort.score': 'За оцінкою (micro522)', 'votes.title': 'Оцінка спільноти (micro522):', 'sort.title': 'Назва', 'sort.author': 'Автор',
    'controls.dead': 'Вибули', 'controls.changed': 'Що змінилось',
    'players.sub': '// проходять далі', 'players.empty': 'нічого не знайдено за цим фільтром', 'dead.sub': '// вибули з голосування',
    'howto.hint': 'як працює відбір', 'log.more': 'Показати ще',
    'foot.src': 'Джерело: сторінки майстерні Steam · приховані = усі колекції − публічні', 'foot.search': 'пошук', 'foot.close': 'закрити',
    'tab.players': 'Гравці', 'tab.log': 'Події', 'tab.charts': 'Графіки', 'tab.find': 'Мій скін',
    // динамічні рядки
    'stat.total': 'у конкурсі', 'stat.ok': 'проходять', 'stat.risk': 'під загрозою', 'stat.dead': 'вибули', 'stat.gain': 'приріст',
    'c.total': 'УСЬОГО', 'c.pub': 'ПУБЛ.', 'c.hid': 'ПРИХОВ.', 'c.levels': 'РІВНІВ',
    'ev.gain': 'отримав приховану колекцію', 'ev.loss': 'втратив приховану', 'ev.stage': 'Увімкнувся', 'ev.passed': 'пройшли', 'ev.out': 'вибув на рівні', 'ev.hidden': 'прихованих',
    'ev.gainN': 'приріст', 'ev.outN': 'вибули', 'ev.changes': 'зміни', 'ev.quiet': 'поки тихо: чекаємо на хвилю', 'ev.count': 'подій', 'ev.snaps': 'знімків',
    'stage.start': 'скінів у конкурсній колекції', 'stage.passed': 'пройшли', 'stage.sofar': 'поки', 'stage.need': 'потрібно', 'stage.same': 'одночасно', 'stage.final': 'фінал: приймають у гру',
    'stage.hint': 'рівень = к-ть прихованих колекцій · нова стадія вмикається, коли ≥{n} скінів (≥{p}% попередньої стадії) досягли її одночасно',
    'm.player': '▶ PLAYER · проходить', 'm.risk': '! LOW SIGNAL · під загрозою', 'm.dead': '✕ GAME OVER · вибув',
    'm.chart': 'приховані колекції по знімках · пунктир = поточний рівень', 'm.pub': 'Публічні колекції:', 'm.pubNone': 'лише конкурсна',
    'm.steam': 'Відкрити у Steam ↗', 'm.share': 'Картинка для шерингу', 'm.copy': 'Копіювати лінк', 'm.vsAdd': 'Додати у VS', 'm.vsDel': 'Прибрати з VS',
    'm.watchAdd': '★ У watchlist', 'm.watchDel': '★ Прибрати з watchlist',
    'm.shareHint': 'Натисни правою кнопкою → «Зберегти зображення»', 'm.shareNoImg': 'Steam не дозволяє вбудувати рендер у картинку, тому вона без нього.',
    'cmp.one': 'обрано {n} · додай ще, щоб порівняти (до 3)', 'cmp.many': '{n} скіни поруч', 'cmp.max': 'Максимум 3 скіни',
    'cmp.rank': 'Місце', 'cmp.status': 'Статус', 'cmp.hidden': 'Приховані', 'cmp.total': 'Усього колекцій', 'cmp.pub': 'Публічні', 'cmp.levels': 'Рівнів пройдено', 'cmp.delta': 'Приріст за знімок',
    'toast.copied': 'Скопійовано', 'toast.notFound': 'Скін не знайдено в цій колекції', 'toast.dying': '{n} скін(ів) вибуло в останньому знімку',
    'toast.newSnap': 'Новий знімок {t}', 'toast.gains': 'Новий знімок: {n} скін(ів) отримали приховану колекцію', 'toast.watch': 'Зміни у watchlist: {names}',
    'find.byName': 'За назвою знайдено:', 'find.none': 'Такого скіна немає в конкурсній колекції. Встав лінк виду steamcommunity.com/sharedfiles/filedetails/?id=…',
    'tier.common': 'COMMON', 'tier.rare': 'RARE', 'tier.epic': 'EPIC', 'tier.legend': 'LEGENDARY',
    'author.skins': 'скінів у конкурсі', 'author.ok': 'проходять', 'author.best': 'макс', 'author.hid': 'прих.', 'author.profile': 'Профіль Steam', 'author.share': 'Картинка «мої роботи»', 'author.all': 'Усі скіни автора',
    'pred.intro': 'Обери скіни, які, на твою думку, отримають наступну приховану колекцію. Коли рівень увімкнеться, порахуємо, скільки ти вгадав. Прогнози зберігаються лише в твоєму браузері.',
    'pred.picked': 'обрано', 'pred.score': 'вгадано', 'pred.of': 'з', 'pred.reset': 'Скинути', 'pred.pick': 'Прогноз', 'pred.picked1': '✓ Прогноз', 'pred.none': 'Клацни «Прогноз» на картках нижче, щоб зробити ставку.',
    'race.step': 'знімок', 'more': 'Показати ще',
    'howto.html': `<p>Для кожного скіна зі сторінки майстерні беремо <code>усього колекцій</code> (число у «Переглянути всі колекції (N)») і <code>публічні</code>
    (колекції, які видно на сторінці перегляду). <code>Приховані = усього − публічні</code>. Конкурсна колекція публічна, тож вона не рахується як прихована.</p>
    <ul>
      <li><b>Рівень 1</b>: скін проходить, якщо прихованих ≥ {base} (напр. 3 колекції: 1 відкрита + 2 приховані, або 4: 2 + 2).</li>
      <li><b>Наступні рівні</b>: коли в одному знімку щонайменше {minWave} скінів і не менше {share}% тих, хто пройшов попередній рівень, одночасно отримують ще одну приховану колекцію, вмикається новий рівень. Хто його досяг, проходить далі; хто ні, спершу <b>LOW SIGNAL</b>, а після кількох знімків поспіль нижче рівня — <b>GAME OVER</b> назавжди.</li>
      <li><b>Рідкість</b>: COMMON (0–1 прих.), RARE (2), EPIC (3), LEGENDARY (4+). Топ-3 мають голографічну рамку.</li>
      <li><b>Рейтинг</b>: живі скіни сортуються за кількістю прихованих, потім за загальною кількістю колекцій. Клік по картці відкриває історію, <b>VS</b> додає у порівняння, <b>★</b> у watchlist.</li>
      <li><b>Оновлення</b>: сканер працює цілодобово (живі скіни перевіряються частіше), сторінка підхоплює новий знімок сама. Дані доступні як <a href="state.json" target="_blank" rel="noopener">JSON</a>.</li>
      <li>Клавіші: <span class="kbd">/</span> пошук, <span class="kbd">Esc</span> закрити, <span class="kbd">↑↑↓↓←→←→BA</span> — секрет.</li>
    </ul>`,
  },
  en: {
    'boot.skip': 'click anywhere to skip',
    'nav.countdown': 'until the next data update', 'nav.players': 'Players', 'nav.charts': 'Stats', 'nav.rules': 'Rules',
    'nav.theme': 'Console color', 'nav.sound': 'Sound', 'nav.tv': 'TV mode (fullscreen)', 'nav.collection': 'Steam collection',
    'theme.title': 'Console edition',
    'hero.lead': 'Which contest skins land in the hidden voting collections and move on, and which drop out. Pass every level and you stay on screen and make it into the game. Fail and the console powers off.',
    'hero.find': 'Find my skin',
    'find.text': 'Paste the Workshop link to your entry (or its ID) to get a card with its status and rank.',
    'watch.hint': 'your starred skins · changes are highlighted', 'podium.hint': 'top 3 by hidden collections',
    'charts.hint': 'waves, distribution and activity hours', 'charts.race': 'Leader race · by snapshot', 'charts.timeline': 'Skins per level · by snapshot',
    'charts.dist': 'Distribution by hidden collections', 'charts.heat': 'When new hidden collections arrive · by hour', 'charts.tags': 'Items in the running · top 10 types',
    'predict.hint': 'make your calls: who passes the next level', 'authors.hint': 'who has the most skins still in',
    'controls.search': 'search: title, author, item…  ( / )', 'controls.allItems': 'All items', 'controls.allAuthors': 'All authors',
    'sort.rank': 'Rank', 'sort.delta': 'New hidden (+)', 'sort.total': 'Total collections', 'sort.score': 'By score (micro522)', 'votes.title': 'Community score (micro522):', 'sort.title': 'Title', 'sort.author': 'Author',
    'controls.dead': 'Eliminated', 'controls.changed': 'What changed',
    'players.sub': '// still in', 'players.empty': 'nothing matches this filter', 'dead.sub': '// out of the vote',
    'howto.hint': 'how selection works', 'log.more': 'Show more',
    'foot.src': 'Source: Steam Workshop pages · hidden = all collections − public', 'foot.search': 'search', 'foot.close': 'close',
    'tab.players': 'Players', 'tab.log': 'Log', 'tab.charts': 'Stats', 'tab.find': 'My skin',
    'stat.total': 'in contest', 'stat.ok': 'passing', 'stat.risk': 'at risk', 'stat.dead': 'out', 'stat.gain': 'gained',
    'c.total': 'TOTAL', 'c.pub': 'PUBLIC', 'c.hid': 'HIDDEN', 'c.levels': 'LEVELS',
    'ev.gain': 'gained a hidden collection', 'ev.loss': 'lost a hidden collection', 'ev.stage': 'Unlocked', 'ev.passed': 'passed', 'ev.out': 'eliminated at level', 'ev.hidden': 'hidden',
    'ev.gainN': 'gained', 'ev.outN': 'out', 'ev.changes': 'changes', 'ev.quiet': 'quiet so far: waiting for a wave', 'ev.count': 'events', 'ev.snaps': 'snapshots',
    'stage.start': 'skins in the contest collection', 'stage.passed': 'passed', 'stage.sofar': 'so far', 'stage.need': 'need', 'stage.same': 'at once', 'stage.final': 'final: accepted into the game',
    'stage.hint': 'level = number of hidden collections · a new stage unlocks when ≥{n} skins (≥{p}% of the previous stage) reach it at once',
    'm.player': '▶ PLAYER · passing', 'm.risk': '! LOW SIGNAL · at risk', 'm.dead': '✕ GAME OVER · eliminated',
    'm.chart': 'hidden collections by snapshot · dashed = current level', 'm.pub': 'Public collections:', 'm.pubNone': 'contest only',
    'm.steam': 'Open in Steam ↗', 'm.share': 'Share image', 'm.copy': 'Copy link', 'm.vsAdd': 'Add to VS', 'm.vsDel': 'Remove from VS',
    'm.watchAdd': '★ Watch', 'm.watchDel': '★ Unwatch',
    'm.shareHint': 'Right-click → “Save image”', 'm.shareNoImg': 'Steam blocks embedding the render, so the image has none.',
    'cmp.one': '{n} picked · add more to compare (up to 3)', 'cmp.many': '{n} skins side by side', 'cmp.max': 'Up to 3 skins',
    'cmp.rank': 'Rank', 'cmp.status': 'Status', 'cmp.hidden': 'Hidden', 'cmp.total': 'Total collections', 'cmp.pub': 'Public', 'cmp.levels': 'Levels passed', 'cmp.delta': 'Change this snapshot',
    'toast.copied': 'Copied', 'toast.notFound': 'Skin not found in this collection', 'toast.dying': '{n} skin(s) dropped out in the latest snapshot',
    'toast.newSnap': 'New snapshot {t}', 'toast.gains': 'New snapshot: {n} skin(s) gained a hidden collection', 'toast.watch': 'Watchlist changes: {names}',
    'find.byName': 'Found by title:', 'find.none': 'No such skin in the contest collection. Paste a link like steamcommunity.com/sharedfiles/filedetails/?id=…',
    'tier.common': 'COMMON', 'tier.rare': 'RARE', 'tier.epic': 'EPIC', 'tier.legend': 'LEGENDARY',
    'author.skins': 'skins in contest', 'author.ok': 'passing', 'author.best': 'best', 'author.hid': 'hidden', 'author.profile': 'Steam profile', 'author.share': '“My entries” image', 'author.all': 'All skins by this author',
    'pred.intro': 'Pick the skins you think will get the next hidden collection. When the level unlocks we count how many you got right. Predictions are stored only in your browser.',
    'pred.picked': 'picked', 'pred.score': 'correct', 'pred.of': 'of', 'pred.reset': 'Reset', 'pred.pick': 'Predict', 'pred.picked1': '✓ Picked', 'pred.none': 'Click “Predict” on the cards below to place your call.',
    'race.step': 'snapshot', 'more': 'Show more',
    'howto.html': `<p>For every skin we read <code>total collections</code> from its Workshop page (the number in “See all collections (N)”) and <code>public</code> ones (those listed on the browse page). <code>Hidden = total − public</code>. The contest collection is public, so it never counts as hidden.</p>
    <ul>
      <li><b>Level 1</b>: a skin passes with ≥ {base} hidden collections (e.g. 3 collections: 1 public + 2 hidden, or 4: 2 + 2).</li>
      <li><b>Next levels</b>: when in one snapshot at least {minWave} skins and at least {share}% of the previous level's survivors gain another hidden collection at once, a new level unlocks. Those who reached it move on; the rest show <b>LOW SIGNAL</b> first and, after several snapshots below the level, <b>GAME OVER</b> for good.</li>
      <li><b>Rarity</b>: COMMON (0–1 hidden), RARE (2), EPIC (3), LEGENDARY (4+). The top 3 get a holographic frame.</li>
      <li><b>Ranking</b>: live skins are sorted by hidden collections, then by total collections. Click a card for its history, <b>VS</b> to compare, <b>★</b> to watch.</li>
      <li><b>Updates</b>: the scanner runs 24/7 (live skins are checked more often) and the page picks up new snapshots by itself. Data is available as <a href="state.json" target="_blank" rel="noopener">JSON</a>.</li>
      <li>Keys: <span class="kbd">/</span> search, <span class="kbd">Esc</span> close, <span class="kbd">↑↑↓↓←→←→BA</span> — secret.</li>
    </ul>`,
  },
};
(function () {
  let lang = 'ua';
  try { lang = localStorage.getItem('rstbr-lang') || ((navigator.language || '').toLowerCase().startsWith('uk') || (navigator.language || '').toLowerCase().startsWith('ru') ? 'ua' : 'en'); } catch (e) {}
  window.LANG = lang;
  window.t = (k, vars) => { let s = (window.I18N[window.LANG] || {})[k] ?? window.I18N.ua[k] ?? k; if (vars) for (const [a, b] of Object.entries(vars)) s = s.split('{' + a + '}').join(b); return s; };
  window.applyI18n = () => {
    document.documentElement.lang = window.LANG === 'ua' ? 'uk' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = window.t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = window.t(el.dataset.i18nTitle); });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = window.t(el.dataset.i18nPh); });
    const b = document.getElementById('langBtn'); if (b) b.textContent = window.LANG === 'ua' ? 'EN' : 'UA';
  };
  window.setLang = (l) => { window.LANG = l; try { localStorage.setItem('rstbr-lang', l); } catch (e) {} window.applyI18n(); };
  document.addEventListener('DOMContentLoaded', window.applyI18n);
})();
