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
    "a.lead": "Хто з авторів має найбільше прийнятих у гру скінів, хто зараз на підйомі, хто тримає стрік тижнів поспіль і хто викладає роботи щотижня.",
    "a.tab.top": "Найбільше акцептів",
    "a.tab.rising": "Перспективні",
    "a.tab.streaks": "Стрік зараз",
    "a.tab.best": "Рекордні стріки",
    "a.tab.active": "Останні 90 днів",
    "a.tab.sub": "Викладають щотижня",
    "a.yearly": "скільки скінів приймали у гру щороку",
    "a.stat.items": "прийнятих скінів",
    "a.stat.authors": "авторів",
    "a.stat.rising": "на підйомі",
    "a.stat.streaks": "зі стріком",
    "a.note.top": "Усі прийняті в гру скіни за даними SCMM, згруповані за автором.",
    "a.note.rising": "Перший акцепт не раніше 2 років тому, щонайменше 3 роботи; порядок за темпом: 3 × останні 90 днів + останній рік.",
    "a.note.streaks": "Скільки ротацій магазину поспіль (щотижня) автор має хоча б один прийнятий скін, рахуючи до останньої ротації.",
    "a.note.best": "Найдовша серія тижневих ротацій поспіль із прийнятим скіном за всю історію.",
    "a.note.active": "Кількість прийнятих скінів за останні 90 днів.",
    "a.note.sub": "За даними micro522: у скількох з останніх тижнів автор подавав роботи, скільки подав, середня та найкраща оцінка.",
    "a.weeks": "тижнів",
    "a.subs": "робіт",
    "a.avgScore": "сер. оцінка",
    "a.best": "найкраща",
    "a.accepted": "акцептів",
    "a.last365": "за рік",
    "a.streakNow": "стрік",
    "a.streakBest": "рекорд",
    "a.last90": "за 90 днів",
    "a.since": "з",
    "a.revenue": "дохід магазину",
    "a.lastAccept": "останній",
    "a.perYear": "прийнято по роках",
    "a.latest": "останні прийняті",
    "a.noAccepts": "ще немає прийнятих скінів",
    "m.lead": "Куди рухаються ціни на скіни Rust: хто росте і падає, що найбільше купують, скільки можна заробити на магазині, і як виглядає ринок загалом.",
    "m.storeNote": "ROI = скільки % можна заробити, купивши в магазині й продавши на ринку за поточною ціною (мінус 13% комісії Steam). Для нових предметів ринок відкривається через тиждень.",
    "m.tab.g7": "Ростуть · 7 днів",
    "m.tab.l7": "Падають · 7 днів",
    "m.tab.g30": "Ростуть · 30 днів",
    "m.tab.l30": "Падають · 30 днів",
    "m.tab.traded": "Найбільший обіг",
    "m.tab.sold": "Найбільше продажів",
    "m.tab.exp": "Найдорожчі",
    "m.tab.ath": "Біля максимуму",
    "m.tab.dip": "Просіли від максимуму",
    "m.tab.rare": "Рідкісні",
    "m.tab.roi": "Магазин → ринок: топ ROI",
    "m.rotHint": "як окупалися ротації магазину: медіанний ROI предметів тижня",
    "m.typesHint": "обіг за тиждень і капіталізація по типах предметів",
    "m.stat.cap": "капіталізація",
    "m.stat.sales24": "продажів за 24 год",
    "m.stat.v168": "обіг за тиждень",
    "m.stat.items": "предметів на ринку",
    "m.indexWait": "Індекс будується з денних знімків: поки {n}. Через кілька днів тут буде графік.",
    "m.days": "днів",
    "m.items": "предметів",
    "m.best": "найкращий",
    "m.empty": "поки немає даних",
    "m.note.7": "Зміна найнижчої ціни продажу за 7 днів (дані SCMM), лише предмети з продажами за добу й ціною від $0.50.",
    "m.note.30": "Зміна ціни за 30 днів (дані SCMM).",
    "m.note.traded": "Сума продажів у доларах за останній тиждень.",
    "m.note.sold": "Кількість продажів за 24 години.",
    "m.note.exp": "Найвища поточна ціна продажу.",
    "m.note.ath": "Найближче до історичного максимуму (ATH) серед предметів з продажами.",
    "m.note.dip": "Найбільше просіли від ATH (потенційні «на дні»), лише ATH від $3.",
    "m.note.rare": "Найменший відомий обсяг (supply) серед предметів від $2.",
    "m.note.roi": "Предмети, які зараз найвигідніше було купити в магазині й продати на ринку.",
    "m.accepted": "прийнято",
    "m.price": "ринок",
    "m.store": "магазин",
    "m.sales24": "прод./24г",
    "m.sales30": "прод./30д",
    "m.supply": "обсяг",
    "m.liq": "ліквідність",
    "m.buyAt": "Купити дешевше на інших майданчиках:",
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
    "a.lead": "Which authors have the most skins accepted into the game, who is on the rise, who holds a weekly streak, and who submits every week.",
    "a.tab.top": "Most accepted",
    "a.tab.rising": "Rising",
    "a.tab.streaks": "Current streak",
    "a.tab.best": "Record streaks",
    "a.tab.active": "Last 90 days",
    "a.tab.sub": "Weekly submitters",
    "a.yearly": "skins accepted per year",
    "a.stat.items": "accepted skins",
    "a.stat.authors": "authors",
    "a.stat.rising": "rising",
    "a.stat.streaks": "on a streak",
    "a.note.top": "All skins accepted into the game per SCMM, grouped by author.",
    "a.note.rising": "First accept within the last 2 years and at least 3 items; ordered by pace: 3 × last 90 days + last year.",
    "a.note.streaks": "How many weekly store rotations in a row the author has at least one accepted skin, counting back from the latest.",
    "a.note.best": "Longest run of consecutive weekly rotations with an accepted skin, all time.",
    "a.note.active": "Accepted skins in the last 90 days.",
    "a.note.sub": "Per micro522: in how many of the recent weeks the author submitted, how many entries, average and best score.",
    "a.weeks": "weeks",
    "a.subs": "entries",
    "a.avgScore": "avg score",
    "a.best": "best",
    "a.accepted": "accepted",
    "a.last365": "last year",
    "a.streakNow": "streak",
    "a.streakBest": "record",
    "a.last90": "last 90d",
    "a.since": "since",
    "a.revenue": "store revenue",
    "a.lastAccept": "latest",
    "a.perYear": "accepted per year",
    "a.latest": "latest accepted",
    "a.noAccepts": "no accepted skins yet",
    "m.lead": "Where Rust skin prices are heading: what rises and falls, what sells most, how much the store can earn you, and the market as a whole.",
    "m.storeNote": "ROI = % you could earn buying in the store and selling on the market at the current price (minus the 13% Steam fee). New items become marketable after a week.",
    "m.tab.g7": "Gainers · 7d",
    "m.tab.l7": "Losers · 7d",
    "m.tab.g30": "Gainers · 30d",
    "m.tab.l30": "Losers · 30d",
    "m.tab.traded": "Most traded",
    "m.tab.sold": "Most sold",
    "m.tab.exp": "Most expensive",
    "m.tab.ath": "Near ATH",
    "m.tab.dip": "Dipped from ATH",
    "m.tab.rare": "Rare",
    "m.tab.roi": "Store → market: top ROI",
    "m.rotHint": "how store rotations paid off: median ROI of the week's items",
    "m.typesHint": "weekly volume and market cap by item type",
    "m.stat.cap": "market cap",
    "m.stat.sales24": "sales in 24h",
    "m.stat.v168": "7-day volume",
    "m.stat.items": "items on market",
    "m.indexWait": "The index is built from daily snapshots: {n} so far. A chart appears after a few days.",
    "m.days": "days",
    "m.items": "items",
    "m.best": "best",
    "m.empty": "no data yet",
    "m.note.7": "Change of the lowest sell price over 7 days (SCMM), items with daily sales and price ≥ $0.50 only.",
    "m.note.30": "30-day price change (SCMM).",
    "m.note.traded": "Dollar volume over the last week.",
    "m.note.sold": "Number of sales in 24 hours.",
    "m.note.exp": "Highest current sell price.",
    "m.note.ath": "Closest to all-time high among items with sales.",
    "m.note.dip": "Furthest below ATH (potential bottoms), ATH ≥ $3 only.",
    "m.note.rare": "Lowest known supply among items ≥ $2.",
    "m.note.roi": "Items that would have been most profitable to buy in the store and sell on the market.",
    "m.accepted": "accepted",
    "m.price": "market",
    "m.store": "store",
    "m.sales24": "sales/24h",
    "m.sales30": "sales/30d",
    "m.supply": "supply",
    "m.liq": "liquidity",
    "m.buyAt": "Cheaper on other marketplaces:",
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
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = window.t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = window.t(el.dataset.i18nPh); });
    const b = document.getElementById('langBtn'); if (b) b.textContent = window.LANG === 'ua' ? 'EN' : 'UA';
  };
  window.setLang = (l) => { window.LANG = l; try { localStorage.setItem('rstbr-lang', l); } catch (e) {} window.applyI18n(); };
  document.addEventListener('DOMContentLoaded', window.applyI18n);
})();

// ---- сторінка GAMES ----
Object.assign(window.I18N.ua, {
  'g.cart.snake': 'змійка збирає скрап', 'g.cart.soon': 'наступна гра',
  'g.ov.text': 'Збирай скрап, не вріжся в стіни, бочки і в себе.<br>Стрілки / WASD · свайп · D-pad',
  'g.btn.pause': 'Пауза', 'g.btn.restart': 'Заново',
  'g.board.hint': 'локально, у твоєму браузері', 'g.board.empty': 'поки порожньо',
  'g.howto.1': '<b>Стрілки</b> / <b>WASD</b>, на телефоні свайп по екрану або D-pad.',
  'g.howto.2': 'Кожен скрап = +1, кожні 5 — швидкість росте.',
  'g.howto.3': 'Золотий скрап зникає швидко і дає +5.',
  'g.howto.4': 'Червоні бочки, стіни і власний хвіст — кінець гри.',
  'g.howto.5': '<b>Space</b> або синя кнопка — пауза, червона — заново.',
  'g.name.ph': "ТВОЄ ІМ'Я", 'g.name.skip': 'Пропустити',
  'g.foot': 'Rust Arcade · рахунки зберігаються локально',
  'g.lang': 'Мова: UA / EN',
});
Object.assign(window.I18N.en, {
  'g.cart.snake': 'a snake that eats scrap', 'g.cart.soon': 'next game',
  'g.ov.text': "Collect scrap, don't hit the walls, barrels or yourself.<br>Arrows / WASD · swipe · D-pad",
  'g.btn.pause': 'Pause', 'g.btn.restart': 'Restart',
  'g.board.hint': 'stored locally in your browser', 'g.board.empty': 'no scores yet',
  'g.howto.1': '<b>Arrows</b> / <b>WASD</b>, on a phone swipe the screen or use the D-pad.',
  'g.howto.2': 'Each scrap = +1, every 5 the speed goes up.',
  'g.howto.3': 'Golden scrap vanishes fast and gives +5.',
  'g.howto.4': 'Red barrels, walls and your own tail end the run.',
  'g.howto.5': '<b>Space</b> or the blue button pauses, the red one restarts.',
  'g.name.ph': 'YOUR NAME', 'g.name.skip': 'Skip',
  'g.foot': 'Rust Arcade · scores are stored locally',
  'g.lang': 'Language: UA / EN',
});

// ---- «наздогнав» ----
Object.assign(window.I18N.ua, {
  'c.caught': 'НАЗДОГНАВ', 'c.caughtTip': 'Вибув раніше, але зараз має стільки ж прихованих колекцій, скільки потрібно на поточному рівні',
  'ev.catchup': 'наздогнав живих після вибуття: {h} прихованих', 'm.caught': 'Наздогнав: {h} прихованих, як у живих. За правилами лишається вибулим',
});
Object.assign(window.I18N.en, {
  'c.caught': 'CAUGHT UP', 'c.caughtTip': 'Eliminated earlier, but now has as many hidden collections as the current level requires',
  'ev.catchup': 'caught up after elimination: {h} hidden', 'm.caught': 'Caught up: {h} hidden, same as survivors. By the rules it stays eliminated',
});

// ---- «за крок» і лічильник ----
Object.assign(window.I18N.ua, {
  'c.near': 'ЗА КРОК', 'c.nearTip': 'Бракує однієї прихованої колекції до поточного рівня',
  'cs.caught': 'Наздогнали живих', 'cs.near': 'За крок, {h} прихованих', 'cs.note': 'Бейдж «НАЗДОГНАВ» з\'явиться на картці, щойно вибулий скін набере стільки ж прихованих, як живі. Такі скіни перевіряються щогодини.',
});
Object.assign(window.I18N.en, {
  'c.near': 'ONE SHORT', 'c.nearTip': 'One hidden collection short of the current level',
  'cs.caught': 'Caught up', 'cs.near': 'One short, {h} hidden', 'cs.note': 'A CAUGHT UP badge appears on the card as soon as an eliminated skin matches the survivors. These skins are rechecked every hour.',
});

// ---- категорія «ЗА КРОК» ----
Object.assign(window.I18N.ua, {
  'chase.sub': '// за крок: майже вибули або доганяють', 'stat.chase': 'за крок',
  'c.near': 'ЗА КРОК', 'c.gaining': '↗ ДОГАНЯЄ', 'c.caught': '↑ НАЗДОГНАВ',
  'c.nearTip': 'Бракує однієї прихованої колекції до поточного рівня', 'c.gainingTip': 'Після вибуття отримав нові приховані колекції', 'c.caughtTip': 'Має стільки ж прихованих колекцій, скільки живі',
  'cs.note': 'Скіни з {h} прихованими: живим потрібно {l}. Не рахуються як GAME OVER і перевіряються щогодини.',
  'm.chase.near': 'Майже вибув: {h} прихованих, до рівня бракує однієї', 'm.chase.gaining': 'Доганяє: після вибуття додались приховані, зараз {h}', 'm.chase.caught': 'Наздогнав: {h} прихованих, як у живих',
});
Object.assign(window.I18N.en, {
  'chase.sub': '// one step: nearly out or catching up', 'stat.chase': 'one step',
  'c.near': 'ONE STEP', 'c.gaining': '↗ CATCHING UP', 'c.caught': '↑ CAUGHT UP',
  'c.nearTip': 'One hidden collection short of the current level', 'c.gainingTip': 'Gained hidden collections after being eliminated', 'c.caughtTip': 'Has as many hidden collections as the survivors',
  'cs.note': 'Skins with {h} hidden: survivors need {l}. Not counted as GAME OVER and rechecked every hour.',
  'm.chase.near': 'Nearly out: {h} hidden, one short of the level', 'm.chase.gaining': 'Catching up: gained hidden collections after elimination, now {h}', 'm.chase.caught': 'Caught up: {h} hidden, same as survivors',
});

// ---- RUSTMAS тизер ----
Object.assign(window.I18N.ua, {
  'x.soon': 'СКОРО', 'x.t1': 'Новорічний', 'x.t2': 'відбір',
  'x.lead': "Колекції новорічного конкурсу ще немає. Щойно вона з'явиться, тут запуститься відбір: хто зі скінів потрапляє в приховані колекції голосування і йде далі, а хто вибуває.",
  'x.d': 'днів', 'x.h': 'годин', 'x.m': 'хвилин', 'x.s': 'секунд', 'x.toNY': 'до Нового року',
  'x.how': 'Як це працює', 'x.last': 'Підсумок Halloween', 'x.howTitle': 'Як це працюватиме',
  'x.s1t': 'Колекція', 'x.s1': "Щойно з'явиться новорічна колекція конкурсу, сканер почне перевіряти кожен скін цілодобово.",
  'x.s2t': 'Хвилі', 'x.s2': 'Скіни, що потрапляють у приховані колекції голосування, проходять далі. Кожна нова хвиля відкриває новий рівень.',
  'x.s3t': 'Фінал', 'x.s3': 'Хто дійде до останнього рівня, має найбільші шанси потрапити в гру. На Halloween саме так і сталося.',
  'x.archTitle': 'Підсумок Rustober', 'x.archHint': 'Halloween 2026 · {n} фіналістів із {total}',
  'x.stTotal': 'у конкурсі', 'x.stFinal': 'у фіналі', 'x.stLevels': 'рівнів', 'x.hidden': 'прих.',
  'x.foot': 'Rustmas Selection · дані зі Steam Workshop',
});
Object.assign(window.I18N.en, {
  'x.soon': 'SOON', 'x.t1': 'Christmas', 'x.t2': 'selection',
  'x.lead': 'The Christmas contest collection is not out yet. As soon as it appears, the selection starts here: which skins land in hidden voting collections and move on, and which drop out.',
  'x.d': 'days', 'x.h': 'hours', 'x.m': 'minutes', 'x.s': 'seconds', 'x.toNY': 'until New Year',
  'x.how': 'How it works', 'x.last': 'Halloween results', 'x.howTitle': 'How it will work',
  'x.s1t': 'Collection', 'x.s1': 'Once the Christmas contest collection appears, the scanner starts checking every skin around the clock.',
  'x.s2t': 'Waves', 'x.s2': 'Skins that land in hidden voting collections move on. Every new wave unlocks a new level.',
  'x.s3t': 'Final', 'x.s3': 'Whoever reaches the last level has the best shot at getting into the game. That is exactly how Halloween went.',
  'x.archTitle': 'Rustober results', 'x.archHint': 'Halloween 2026 · {n} finalists out of {total}',
  'x.stTotal': 'in the contest', 'x.stFinal': 'in the final', 'x.stLevels': 'levels', 'x.hidden': 'hidden',
  'x.foot': 'Rustmas Selection · data from the Steam Workshop',
});

// ---- автори v2: дохід, співпраця ----
Object.assign(window.I18N.ua, {
  'a.tab.income': 'Дохід', 'a.tab.collab': 'Співпраця', 'a.tab.rate': 'Частка акцептів',
  'a.note.income': 'Чистий дохід автора ≈ виручка магазину / 4. Спільні роботи діляться порівну між співавторами.',
  'a.note.collab': 'Хто найчастіше робить скіни разом з іншими авторами.',
  'a.note.rate': 'Яка частина робіт автора в майстерні потрапила в гру (від 10 робіт).',
  'a.income': 'чистий дохід', 'a.incomeTip': 'Оцінка: виручка магазину (ціна × кількість проданих) / 4, для спільних робіт поділено між співавторами. Без урахування комісій ринку.',
  'a.collabN': 'у співпраці', 'a.soloN': 'соло', 'a.rateN': 'прийнято', 'a.partners': 'Працював(ла) разом з', 'a.withN': '+{n} співавт.',
  'a.wsLink': 'Роботи в майстерні', 'a.stat.collab': 'спільних робіт', 'a.stat.income': 'чистий дохід авторів',
  'a.coverage': 'співавтори перевірено для {p}% робіт',
});
Object.assign(window.I18N.en, {
  'a.tab.income': 'Income', 'a.tab.collab': 'Collabs', 'a.tab.rate': 'Accept rate',
  'a.note.income': "Author's net income ≈ store revenue / 4. Collaborations are split evenly between co-authors.",
  'a.note.collab': 'Who makes skins together with other authors most often.',
  'a.note.rate': "Share of the author's workshop items that made it into the game (10+ items).",
  'a.income': 'net income', 'a.incomeTip': 'Estimate: store revenue (price × units sold) / 4, split between co-authors for collaborations. Market fees not included.',
  'a.collabN': 'collabs', 'a.soloN': 'solo', 'a.rateN': 'accepted', 'a.partners': 'Worked together with', 'a.withN': '+{n} co-authors',
  'a.wsLink': 'Workshop items', 'a.stat.collab': 'collaborations', 'a.stat.income': 'authors net income',
  'a.coverage': 'co-authors checked for {p}% of items',
});

Object.assign(window.I18N.ua, { 'm.src.all': 'Усі скіни', 'm.src.ws': 'Скіни майстерні', 'm.src.fp': 'Скіни Facepunch' });
Object.assign(window.I18N.en, { 'm.src.all': 'All skins', 'm.src.ws': 'Workshop skins', 'm.src.fp': 'Facepunch skins' });

// ---- WORKSHOP ----
Object.assign(window.I18N.ua, {
  'w.only': 'ЛИШЕ АВТОРИ З АКЦЕПТАМИ', 'w.lead': 'Як майстерня в Steam, але тут лише роботи авторів, чиї скіни вже прийняли в гру. Нові ідеї від тих, хто вміє проходити відбір.',
  'w.search': 'Пошук: назва або автор', 'w.sort.new': 'Найновіші', 'w.sort.trend': 'У тренді', 'w.sort.pop': 'Найпопулярніші', 'w.sort.top': 'Найкращі за оцінками', 'w.sort.fav': 'Найбільше в обраному',
  'w.p.7': 'За тиждень', 'w.p.30': 'За місяць', 'w.p.90': 'За 3 місяці', 'w.p.365': 'За рік', 'w.allTypes': 'Усі типи',
  'w.st.all': 'Усі', 'w.st.new': 'Ще не в грі', 'w.st.acc': 'Вже в грі', 'w.loading': 'Завантажую майстерню…', 'w.more': 'Показати ще',
  'w.foot': 'Дані: Steam Web API · оновлюється раз на добу', 'w.found': '{n} робіт', 'w.empty': 'Нічого не знайдено за цими фільтрами', 'w.fail': 'Не вдалося завантажити дані майстерні',
  'w.today': 'сьогодні', 'w.daysAgo': '{n} дн. тому', 'w.monthsAgo': '{n} міс. тому', 'w.yearsAgo': '{n} р. тому',
  'w.inGame': 'В ГРІ', 'w.subs': 'підписки', 'w.favs': 'в обраному', 'w.votes': 'оцінки «подобається»', 'w.profile': 'Профіль автора',
  'w.rate': 'автор: {p}% робіт у грі', 'w.rateTip': 'Яка частина робіт цього автора вже потрапила в гру — грубий шанс на акцепт',
  'w.authorLine': '{n} робіт за рік · {a} у грі', 'w.allAuthors': 'Усі автори',
  'w.stItems': 'робіт за рік', 'w.stAuthors': 'авторів', 'w.stAcc': 'вже в грі', 'w.stWeek': 'за тиждень', 'w.window': 'роботи за останні 12 місяців + усі прийняті',
});
Object.assign(window.I18N.en, {
  'w.only': 'ACCEPTED AUTHORS ONLY', 'w.lead': 'Like the Steam Workshop, but only items by authors whose skins are already in the game. New ideas from people who know how to get accepted.',
  'w.search': 'Search: title or author', 'w.sort.new': 'Most recent', 'w.sort.trend': 'Trending', 'w.sort.pop': 'Most popular', 'w.sort.top': 'Top rated', 'w.sort.fav': 'Most favorited',
  'w.p.7': 'Past week', 'w.p.30': 'Past month', 'w.p.90': 'Past 3 months', 'w.p.365': 'Past year', 'w.allTypes': 'All types',
  'w.st.all': 'All', 'w.st.new': 'Not in game yet', 'w.st.acc': 'In game', 'w.loading': 'Loading the workshop…', 'w.more': 'Show more',
  'w.foot': 'Data: Steam Web API · refreshed daily', 'w.found': '{n} items', 'w.empty': 'Nothing matches these filters', 'w.fail': 'Could not load workshop data',
  'w.today': 'today', 'w.daysAgo': '{n}d ago', 'w.monthsAgo': '{n}mo ago', 'w.yearsAgo': '{n}y ago',
  'w.inGame': 'IN GAME', 'w.subs': 'subscriptions', 'w.favs': 'favorites', 'w.votes': 'upvotes', 'w.profile': 'Author profile',
  'w.rate': 'author: {p}% accepted', 'w.rateTip': "Share of this author's items already in the game — a rough acceptance chance",
  'w.authorLine': '{n} items this year · {a} in game', 'w.allAuthors': 'All authors',
  'w.stItems': 'items this year', 'w.stAuthors': 'authors', 'w.stAcc': 'in game', 'w.stWeek': 'this week', 'w.window': 'items from the last 12 months + all accepted',
});
