(() => {
  const $ = (s) => document.querySelector(s);
  const body = document.body;
  const user = Store.user();

  
  if (body.dataset.guard && !user) {
    const page = location.pathname.split('/').pop() || 'index.html';
    location.replace('register.html?next=' + encodeURIComponent(page));
    return;
  }

  const svg = (d, c = 'h-5 w-5') =>
    `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.4 6.4 0 0 0 10.5 10.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  };

  const themeBtn = `
    <button type="button" data-theme-toggle class="icon-btn" aria-label="Переключить тему">
      ${svg(I.moon, 'h-4 w-4 sm:h-5 sm:w-5 dark:hidden')}
      ${svg(I.sun, 'hidden h-4 w-4 sm:h-5 sm:w-5 dark:block')}
    </button>`;

  const cartLink = `
    <a href="checkout.html" class="icon-btn relative" aria-label="Корзина">
      ${svg(I.cart, 'h-4 w-4 sm:h-5 sm:w-5')}
      <span data-cart-count class="badge badge-gold absolute -right-1.5 -top-1.5 px-1.5 py-0 text-[10px] hidden font-mono">0</span>
    </a>`;

  
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');
  body.append(t);
  let timer;
  window.toast = (m) => {
    t.textContent = m;
    t.dataset.show = 'true';
    clearTimeout(timer);
    timer = setTimeout(() => { t.dataset.show = 'false'; }, 2800);
  };

  
  if ($('#main')) {
    body.insertAdjacentHTML('afterbegin',
      '<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-gold focus:px-4 focus:py-2 focus:font-bold focus:text-brand-900 shadow-xl">К содержимому</a>');
  }

  
  const NAV = [
    ['home', 'index.html', 'Главная'],
    ['about', 'index.html#features', 'О платформе'],
    ['plans', 'index.html#pricing', 'Тарифы'],
    ['shop', 'shop.html', 'Магазин'],
    ['contacts', '#contacts', 'Контакты'],
  ];

  const header = $('#site-header');
  if (header) {
    const a = header.dataset.active;
    const auth = user
      ? `<a href="feed.html" class="flex items-center gap-2 rounded-xl bg-brand-100 dark:bg-slate-800 px-3 py-1.5 text-xs sm:text-sm font-bold text-ink dark:text-white hover:bg-brand-200 dark:hover:bg-slate-700 transition-colors" title="${esc(user.name)}">
          <div class="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-brand-300 dark:border-slate-600">
            <img src="${esc(user.avatar || 'img/avatars/user-me.jpg')}" alt="${esc(user.name)}" class="h-full w-full object-cover">
          </div>
          <span class="max-w-[5rem] sm:max-w-[7rem] truncate">${esc(user.name)}</span>
        </a>`
      : `<a href="register.html" class="btn btn-primary btn-sm">Войти</a>`;

    header.innerHTML = `
      <div class="wrap flex h-16 items-center justify-between gap-2 sm:gap-4">
        <a href="index.html" class="logo flex items-center gap-2" aria-label="ЛЕНТЯIN — на главную">
          <img src="img/sloth.svg" alt="Логотип ленивец" class="h-7 w-7 object-contain">
          <span>ЛЕНТЯ<span class="text-brand-500 dark:text-gold">IN</span></span>
        </a>
        <input id="nav-toggle" type="checkbox" class="peer sr-only" aria-label="Открыть меню">
        <nav aria-label="Основная навигация" class="nav-menu">
          ${NAV.map(([k, h, l]) => `<a href="${h}" class="nav-link" ${a === k ? 'aria-current="page"' : ''}>${l}</a>`).join('')}
        </nav>
        <div class="flex items-center gap-1.5 sm:gap-2">
          ${cartLink}
          ${themeBtn}
          ${auth}
          <label for="nav-toggle" class="icon-btn cursor-pointer lg:hidden" aria-label="Меню">${svg(I.menu, 'h-4 w-4 sm:h-5 sm:w-5')}</label>
        </div>
      </div>`;

    header.querySelectorAll('.nav-menu a').forEach((link) => {
      link.addEventListener('click', () => {
        const toggle = $('#nav-toggle');
        if (toggle) toggle.checked = false;
      });
    });
  }

  
  const footer = $('#site-footer');
  if (footer) {
    const col = (title, links) => `<nav aria-label="${title}"><h2 class="mb-3 font-display text-sm font-bold">${title}</h2>
      <ul class="muted space-y-2 text-sm">${links.map(([h, l]) => `<li><a href="${h}" class="transition-colors hover:text-brand-500 dark:hover:text-gold">${l}</a></li>`).join('')}</ul></nav>`;
    footer.innerHTML = `
      <div class="wrap grid gap-8 py-10 sm:py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-3">
          <a href="index.html" class="logo flex items-center gap-2">
            <img src="img/sloth.svg" alt="Ленивец" class="h-6 w-6 object-contain">
            <span>ЛЕНТЯ<span class="text-brand-500 dark:text-gold">IN</span></span>
          </a>
          <p class="muted text-sm leading-relaxed">Профессиональная социальная сеть и магазин для истинных мастеров прокрастинации. Все права отложены на неопределённый срок.</p>
        </div>
        ${col('Кабинет', [['feed.html', 'Лента отговорок'], ['messenger.html', 'Мессенджер'], ['board.html', 'Доска «Отложено»'], ['dashboard.html', 'Мой лень-рейтинг']])}
        ${col('Магазин', [['shop.html', 'Каталог товаров'], ['checkout.html', 'Оформление заказа'], ['index.html#pricing', 'Тарифные планы']])}
        <div id="contacts" class="space-y-2 text-sm">
          <h2 class="mb-3 font-display text-sm font-bold">Контакты</h2>
          <p class="muted">hello@lentyain.by</p>
          <p class="muted">Минск, ул. Диванная, 5</p>
          <p class="muted">Ответим, когда хорошо выспимся.</p>
          <a href="design-system.html" class="inline-block font-semibold text-brand-500 hover:underline dark:text-gold pt-1">Дизайн-система проекта →</a>
        </div>
      </div>
      <p class="muted border-t border-brand-100 py-4 text-center text-xs dark:border-slate-800">© ЛЕНТЯIN, 2026. Учебный проект по практике (День 9–10).</p>`;
  }

  
  const APP_NAV = [
    ['feed', 'feed.html', 'newspaper', 'Лента'],
    ['dashboard', 'dashboard.html', 'chart', 'Мой рейтинг'],
    ['messenger', 'messenger.html', 'messenger', 'Мессенджер'],
    ['board', 'board.html', 'board', 'Доска «Отложено»'],
    ['shop', 'shop.html', 'shop', 'Магазин'],
    ['home', 'index.html', 'home', 'На сайт'],
  ];

  const side = $('#app-sidebar');
  if (side && user) {
    const a = side.dataset.active;
    const planName = PLANS[user.plan]?.name || 'Basic';
    side.innerHTML = `
      <div class="flex items-center justify-between mb-6 px-1">
        <a href="index.html" class="logo flex items-center gap-2">
          <img src="img/sloth.svg" alt="Ленивец" class="h-7 w-7 object-contain">
          <span>ЛЕНТЯ<span class="text-brand-500 dark:text-gold">IN</span></span>
        </a>
        <label for="sb-toggle" class="icon-btn h-8 w-8 cursor-pointer lg:hidden" aria-label="Закрыть меню">${Icons.close('h-4 w-4')}</label>
      </div>
      <nav aria-label="Кабинет" class="space-y-1">
        ${APP_NAV.map(([k, h, iconName, l]) => `
          <a href="${h}" class="side-link" ${a === k ? 'aria-current="page"' : ''}>
            <span aria-hidden="true" class="shrink-0">${Icons[iconName] ? Icons[iconName]('h-4 w-4') : ''}</span>
            <span>${l}</span>
            ${k === 'messenger' ? '<span data-unread class="badge badge-gold ml-auto hidden font-mono text-[10px]">0</span>' : ''}
          </a>`).join('')}
      </nav>
      <div class="mt-auto space-y-3 rounded-2xl bg-brand-50 p-3.5 dark:bg-slate-800/80 border border-brand-100 dark:border-slate-700">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full overflow-hidden shadow-sm shrink-0 border border-brand-200 dark:border-slate-600">
            <img src="${esc(user.avatar || 'img/avatars/user-me.jpg')}" alt="${esc(user.name)}" class="h-full w-full object-cover">
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold">${esc(user.name)}</p>
            <p data-rank class="muted truncate text-xs flex items-center gap-1"></p>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs pt-1 border-t border-brand-100/60 dark:border-slate-700">
          <span class="muted">Тариф:</span>
          <span class="font-bold text-brand-600 dark:text-gold">${planName}</span>
        </div>
        <button type="button" data-logout class="btn btn-outline btn-sm w-full flex items-center justify-center gap-1.5">
          ${Icons.logout('h-3.5 w-3.5')}
          <span>Выйти</span>
        </button>
      </div>`;

    side.querySelectorAll('.side-link').forEach((link) => {
      link.addEventListener('click', () => {
        const toggle = $('#sb-toggle');
        if (toggle) toggle.checked = false;
      });
    });
  }

  const top = $('#app-topbar');
  if (top && user) {
    top.innerHTML = `
      <label for="sb-toggle" class="icon-btn cursor-pointer lg:hidden" aria-label="Открыть меню кабинета">${svg(I.menu, 'h-4 w-4 sm:h-5 sm:w-5')}</label>
      <h1 class="hidden truncate font-display text-sm sm:text-base font-bold md:block">${esc(top.dataset.title)}</h1>
      <form action="shop.html" role="search" class="relative ml-auto w-28 xs:w-36 sm:w-full sm:max-w-xs">
        <label for="global-search" class="sr-only">Поиск по магазину</label>
        <span class="muted pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">${svg(I.search, 'h-3.5 w-3.5 sm:h-4 sm:w-4')}</span>
        <input id="global-search" name="q" type="search" placeholder="Поиск товаров…" class="input py-1.5 pl-8 pr-2 text-xs sm:text-sm sm:py-2 sm:pl-9">
      </form>
      <a href="dashboard.html" data-points class="badge badge-gold shrink-0 text-xs sm:text-sm py-1 px-2.5 shadow-sm flex items-center gap-1" aria-label="Лень-баллы">${Icons.zap('h-3.5 w-3.5')}<span>0</span></a>
      ${cartLink}
      ${themeBtn}`;
  }

  
  const paint = () => {
    const n = Store.cart().reduce((s, x) => s + x.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = n;
      el.classList.toggle('hidden', !n);
    });
    const pts = Store.points();
    document.querySelectorAll('[data-points]').forEach((el) => {
      el.innerHTML = `${Icons.zap('h-3.5 w-3.5 shrink-0')}<span>${pts}</span>`;
    });
    document.querySelectorAll('[data-rank]').forEach((el) => {
      const r = rankOf(pts);
      const iconSvg = Icons[r.icon] ? Icons[r.icon]('h-3.5 w-3.5 shrink-0 inline mr-1 text-brand-500 dark:text-gold') : '';
      el.innerHTML = `${iconSvg}<span>${r.name}</span>`;
    });
    const u = Store.get('dialogs', DIALOGS).reduce((s, d) => s + d.u, 0);
    document.querySelectorAll('[data-unread]').forEach((el) => {
      el.textContent = u;
      el.classList.toggle('hidden', !u);
    });
  };

  paint();
  document.addEventListener('store:change', paint);
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-logout]')) Store.logout();
  });
})();
