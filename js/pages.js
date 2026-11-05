(() => {
  if (document.body.dataset.guard && !Store.user()) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const getMe = () => Store.user() || { name: 'Диванный Эксперт', email: 'slacker@lentyain.by', plan: 'basic', avatar: 'img/avatars/user-me.jpg' };
  let me = getMe();
  const DAY = 864e5;
  const fmtDate = (t) => new Date(t).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  const fmt = (n) => String(Math.round(n * 100) / 100).replace('.', ',');
  const pages = {};

  
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-follow]');
    if (f) {
      const name = f.dataset.follow;
      let list = Store.get('following', []);
      const on = !list.includes(name);
      list = on ? [...list, name] : list.filter((x) => x !== name);
      Store.set('following', list);
      f.setAttribute('aria-pressed', on);
      f.innerHTML = on
        ? `${window.Icons ? Icons.check('h-3.5 w-3.5 inline mr-1') : ''}Подписан`
        : 'Подписаться';
      const ever = Store.get('followedEver', []);
      if (on && Store.user() && !ever.includes(name)) {
        Store.set('followedEver', [...ever, name]);
        Store.reward(3, `Подписка на ${name}`);
      }
    }

    const a = e.target.closest('[data-add]');
    if (a && !a.disabled) {
      const id = +a.dataset.add;
      Store.add(id);
      window.toast?.('Товар успешно добавлен в корзину');
      const origText = a.textContent;
      a.disabled = true;
      a.textContent = 'Добавлено';
      setTimeout(() => {
        a.disabled = false;
        a.textContent = origText;
      }, 1000);
    }
  });

  
  pages.home = () => {
    const featuredEl = $('#featured');
    if (featuredEl) {
      featuredEl.innerHTML = PRODUCTS.slice(0, 8).map(productCard).join('');
    }

    const profilesEl = $('#profiles');
    if (profilesEl) {
      const fl = Store.get('following', []);
      profilesEl.innerHTML = PEOPLE.slice(0, 3).map((p) => profileCard(p, fl.includes(p.n))).join('');
    }

    const slothPhrases = [
      '«Работа не волк — в лес не убежит. А вот сериал сам себя не посмотрит»',
      '«Дедлайн — это не бетонная стена, это просто скромная рекомендация»',
      '«Я обязательно подумаю об этом завтра. Или в следующем квартале»',
      '«Энергия должна сохраняться на диване. Фундаментальный закон физики!»',
      '«Сменил статус на "занят" во всех чатах — спас целый рабочий день»',
      '«Включи микрофон, пошипи три секунды и скажи, что перетёрся кабель»',
      '«Самое продуктивное действие рабочего дня — вовремя прилечь»',
    ];
    let phraseIdx = 0;
    const slothBox = $('#sloth-mascot');
    const phraseEl = $('#sloth-phrase');
    if (slothBox && phraseEl) {
      const nextPhrase = () => {
        phraseIdx = (phraseIdx + 1) % slothPhrases.length;
        phraseEl.style.opacity = '0';
        setTimeout(() => {
          phraseEl.textContent = slothPhrases[phraseIdx];
          phraseEl.style.opacity = '1';
        }, 200);
      };
      slothBox.addEventListener('click', nextPhrase);
      setInterval(nextPhrase, 8000);
    }
  };

  
  pages.register = () => {
    const q = new URLSearchParams(location.search);
    const planKey = PLANS[q.get('plan')] ? q.get('plan') : 'basic';
    const next = /^[\w-]+\.html$/.test(q.get('next') || '') ? q.get('next') : 'feed.html';
    const defaultTab = q.get('tab') === 'login' ? 'login' : 'register';

    if (Store.user() && !q.get('force')) {
      location.replace(next);
      return;
    }

    const tabLogin = $('#tab-login');
    const tabReg = $('#tab-register');
    const loginForm = $('#login-form');
    const regForm = $('#reg-form');
    const authAlert = $('#auth-alert');

    const setTab = (t) => {
      const isLogin = t === 'login';
      tabLogin.setAttribute('aria-selected', isLogin);
      tabReg.setAttribute('aria-selected', !isLogin);

      if (isLogin) {
        tabLogin.className = 'flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all bg-white text-brand-900 shadow-sm dark:bg-slate-700 dark:text-white';
        tabReg.className = 'flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all text-ink-soft dark:text-slate-400 hover:text-ink dark:hover:text-white';
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
      } else {
        tabReg.className = 'flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all bg-white text-brand-900 shadow-sm dark:bg-slate-700 dark:text-white';
        tabLogin.className = 'flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all text-ink-soft dark:text-slate-400 hover:text-ink dark:hover:text-white';
        regForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
      }
    };

    tabLogin.addEventListener('click', () => setTab('login'));
    tabReg.addEventListener('click', () => setTab('register'));
    setTab(defaultTab);

    $$('[data-demo]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.demo;
        const logged = Store.loginAsDemo(key);
        authAlert.textContent = `Добро пожаловать, ${logged.name}! Переходим в кабинет…`;
        authAlert.classList.remove('hidden');
        setTimeout(() => { location.href = next; }, 600);
      });
    });

    $$('[data-toggle-pw]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const inp = $('#' + btn.dataset.togglePw);
        if (!inp) return;
        const isPw = inp.type === 'password';
        inp.type = isPw ? 'text' : 'password';
        btn.textContent = isPw ? 'Скрыть' : 'Показать';
      });
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#login-email').value.trim();
      const pw = $('#login-password').value;
      if (!email || !pw) {
        window.toast?.('Заполните email и пароль');
        return;
      }
      const btn = $('#login-submit');
      btn.dataset.loading = 'true';
      btn.disabled = true;

      setTimeout(() => {
        const namePart = email.split('@')[0] || 'Лентяй';
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        Store.login({
          name: formattedName,
          email,
          plan: 'pro',
          avatar: 'img/avatars/user-me.jpg'
        });
        btn.dataset.loading = 'false';
        authAlert.textContent = `Рады видеть вас снова, ${formattedName}! Переходим в кабинет…`;
        authAlert.classList.remove('hidden');
        setTimeout(() => { location.href = next; }, 800);
      }, 900);
    });

    const planBadge = $('#plan-badge');
    if (planBadge && PLANS[planKey]) {
      planBadge.textContent = 'Тариф: ' + PLANS[planKey].name;
    }

    const pw = $('#password');
    const pw2 = $('#password2');
    const regSubmit = $('#reg-submit');
    const agree = $('#reg-agree');
    const bars = $$('#strength span');
    const strengthLabel = $('#strength-label');
    const matchError = $('#pw-match-error');

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    const names = ['Слабый пароль', 'Средний пароль', 'Хороший пароль', 'Надёжный пароль!'];

    const getScore = (v) => {
      return [
        v.length >= 8,
        /[A-Z]/.test(v) && /[a-z]/.test(v),
        /\d/.test(v),
        /[^\w\s]/.test(v) || v.length >= 12
      ].filter(Boolean).length;
    };

    const updateStrength = () => {
      const val = pw.value;
      const s = getScore(val);
      bars.forEach((b, i) => {
        b.className = 'h-1.5 flex-1 rounded-full transition-colors duration-300 ' +
          (i < s ? colors[s - 1] : 'bg-slate-200 dark:bg-slate-700');
      });
      strengthLabel.textContent = val ? names[Math.max(s - 1, 0)] : 'Введите надёжный пароль';
    };

    const validateReg = () => {
      const match = pw2.value ? pw2.value === pw.value : true;
      matchError.classList.toggle('hidden', match);
      pw2.setAttribute('aria-invalid', !match);
      const ok = regForm.checkValidity() && match && agree.checked;
      if (regSubmit.dataset.loading !== 'true') {
        regSubmit.disabled = !ok;
      }
    };

    regForm.addEventListener('input', () => {
      updateStrength();
      validateReg();
    });
    regForm.addEventListener('change', validateReg);

    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!regForm.checkValidity() || pw2.value !== pw.value || !agree.checked) {
        validateReg();
        return;
      }
      regSubmit.dataset.loading = 'true';
      regSubmit.disabled = true;

      setTimeout(() => {
        const email = $('#email').value.trim();
        const namePart = email.split('@')[0] || 'Лентяй';
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        Store.login({
          name: formattedName,
          email,
          plan: planKey,
          avatar: 'img/avatars/user-me.jpg'
        });
        regSubmit.dataset.loading = 'false';
        authAlert.textContent = 'Ленивый профиль успешно создан! Начислено +10 баллов. Переходим…';
        authAlert.classList.remove('hidden');
        setTimeout(() => { location.href = next; }, 900);
      }, 1100);
    });

    updateStrength();
    validateReg();
  };

  
  pages.feed = () => {
    me = getMe();
    const pts = Store.points();
    const lv = rankOf(pts);
    const planName = PLANS[me.plan]?.name || 'Basic';

    const meCard = $('#me-card');
    if (meCard) {
      const rankIcon = window.Icons && Icons[lv.icon] ? Icons[lv.icon]('h-4 w-4 shrink-0 inline mr-1') : '';
      const zapIcon = window.Icons ? Icons.zap('h-3.5 w-3.5 text-gold shrink-0 inline mr-1') : '';
      meCard.innerHTML = `
        <div class="h-20 w-20 rounded-full shadow-md overflow-hidden border-2 border-brand-200 dark:border-slate-700 mx-auto shrink-0">
          <img src="${esc(me.avatar || 'img/avatars/user-me.jpg')}" alt="${esc(me.name)}" class="h-full w-full object-cover">
        </div>
        <div class="text-center space-y-0.5">
          <h2 class="h3">${esc(me.name)}</h2>
          <p class="text-xs sm:text-sm font-semibold text-brand-500 dark:text-gold flex items-center justify-center">${rankIcon}<span>${lv.name}</span></p>
        </div>
        <p class="muted text-center text-xs flex items-center justify-center">${zapIcon}<span>${pts} лень-баллов · тариф ${planName}</span></p>
        <a href="dashboard.html" class="btn btn-outline btn-sm w-full">Мой рейтинг и аналитика →</a>`;
    }

    const peopleEl = $('#people');
    if (peopleEl) {
      const fl = Store.get('following', []);
      peopleEl.innerHTML = PEOPLE.slice(0, 2).map((p) => profileCard(p, fl.includes(p.n))).join('');
    }

    let filter = 'all';
    const posts = () => Store.get('posts', POSTS);

    const commentHtml = (c) => `
      <li class="rounded-xl bg-brand-50 px-3.5 py-2 text-xs sm:text-sm dark:bg-slate-800/80 border border-brand-100/50 dark:border-slate-700/60">
        <span class="font-bold text-brand-900 dark:text-white">${esc(c.n)}:</span>
        <span class="text-ink dark:text-slate-200">${esc(c.t)}</span>
      </li>`;

    const postHtml = (p, liked) => {
      const authorImg = p.img || 'img/avatars/user-alexey.jpg';
      const heartIcon = window.Icons
        ? Icons.heart('h-4 w-4', liked)
        : '<svg class="h-4 w-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      const commentIcon = window.Icons ? Icons.messageCircle('h-3.5 w-3.5') : '';
      return `
        <article class="card space-y-3 sm:space-y-4 shadow-sm" data-id="${p.id}">
          <header class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full overflow-hidden shadow-sm shrink-0 border border-brand-200 dark:border-slate-700">
              <img src="${authorImg}" alt="${esc(p.a)}" class="h-full w-full object-cover">
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs sm:text-sm font-bold">${esc(p.a)}</p>
              <p class="muted truncate text-[11px]">${esc(p.role)} · <span class="text-brand-500 dark:text-gold font-semibold">${TYPES[p.type] || 'Запись'}</span></p>
            </div>
          </header>
          
          <p class="text-xs sm:text-sm leading-relaxed">${esc(p.t)}</p>
          
          <div class="flex items-center gap-2 pt-1 border-t border-brand-100/60 dark:border-slate-800">
            <button type="button" data-like aria-pressed="${liked}" class="btn btn-ghost btn-sm aria-pressed:bg-gold aria-pressed:text-brand-900 transition-colors flex items-center gap-1.5">
              ${heartIcon} <span data-lcount class="font-mono">${p.likes}</span>
            </button>
          </div>

          <details class="group border-t border-brand-100 pt-2.5 dark:border-slate-700/80">
            <summary class="btn btn-ghost btn-sm inline-flex items-center gap-1.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-xs">
              ${commentIcon} <span>Комментарии (<span data-ccount class="font-mono">${p.comments.length}</span>)</span>
            </summary>
            <ul data-comments class="mt-3 space-y-2">${p.comments.map(commentHtml).join('')}</ul>
            <form data-comment-form class="mt-3 flex gap-2">
              <label class="sr-only" for="c-${p.id}">Комментарий</label>
              <input id="c-${p.id}" class="input py-1.5 px-3 text-xs sm:text-sm" placeholder="Напишите комментарий…" required autocomplete="off">
              <button class="btn btn-secondary btn-sm shrink-0">Ответить</button>
            </form>
          </details>
        </article>`;
    };

    const renderFeed = () => {
      const liked = Store.get('liked', []);
      const list = posts().filter((p) => filter === 'all' || p.type === filter);
      $('#posts').innerHTML = list.map((p) => postHtml(p, liked.includes(p.id))).join('');
      $('#posts-empty').classList.toggle('hidden', list.length > 0);
    };

    const ta = $('#post-text');
    const pub = $('#post-btn');
    ta.addEventListener('input', () => {
      pub.disabled = ta.value.trim().length < 5;
      $('#post-count').textContent = ta.value.length + '/280';
    });

    $('#composer').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = ta.value.trim();
      if (text.length < 5) return;
      const currentRank = rankOf(Store.points()).name;
      const post = {
        id: Date.now(),
        a: me.name,
        role: currentRank,
        img: me.avatar || 'img/avatars/user-me.jpg',
        type: $('#post-type').value,
        likes: 0,
        t: text,
        comments: []
      };
      Store.set('posts', [post, ...posts()]);
      ta.value = '';
      pub.disabled = true;
      $('#post-count').textContent = '0/280';
      Store.reward(10, 'Публикация в ленте');
      renderFeed();
    });

    $('#feed-filter').addEventListener('change', (e) => {
      filter = e.target.value;
      renderFeed();
    });

    $('#posts').addEventListener('click', (e) => {
      const b = e.target.closest('[data-like]');
      if (!b) return;
      const id = +b.closest('article').dataset.id;
      let liked = Store.get('liked', []);
      const on = !liked.includes(id);
      liked = on ? [...liked, id] : liked.filter((x) => x !== id);
      const all = posts().map((p) => (p.id === id ? { ...p, likes: p.likes + (on ? 1 : -1) } : p));
      Store.set('liked', liked);
      Store.set('posts', all);
      b.setAttribute('aria-pressed', on);
      b.querySelector('[data-lcount]').textContent = all.find((p) => p.id === id).likes;
    });

    $('#posts').addEventListener('submit', (e) => {
      const form = e.target.closest('[data-comment-form]');
      if (!form) return;
      e.preventDefault();
      const input = $('input', form);
      const text = input.value.trim();
      if (!text) return;
      const art = form.closest('article');
      const id = +art.dataset.id;
      const c = { n: me.name, t: text };
      Store.set('posts', posts().map((p) => (p.id === id ? { ...p, comments: [...p.comments, c] } : p)));
      $('[data-comments]', art).insertAdjacentHTML('beforeend', commentHtml(c));
      const cnt = $('[data-ccount]', art);
      cnt.textContent = +cnt.textContent + 1;
      input.value = '';
      Store.reward(3, 'Комментарий');
    });

    renderFeed();
  };

  
  pages.dashboard = () => {
    me = getMe();
    const now = Date.now(), log = Store.get('log', []);
    const inWin = (arr, from, to) => arr.filter((x) => x.t > now - to * DAY && x.t <= now - from * DAY);
    const trend = (a, b) => {
      if (!a && !b) return ['badge-brand', '● без изменений'];
      if (!b) return ['badge-success', '▲ новое'];
      const p = Math.round(((a - b) / b) * 100);
      return p >= 0 ? ['badge-success', `▲ +${p}%`] : ['badge-danger', `▼ −${Math.abs(p)}%`];
    };
    const orders = Store.orders();
    const myPosts = Store.get('posts', POSTS).filter((p) => p.a === me.name);

    const S = [
      ['Баллы за 7 дней', inWin(log, 0, 7).reduce((s, x) => s + x.pts, 0), inWin(log, 7, 14).reduce((s, x) => s + x.pts, 0), ''],
      ['Событий за 7 дней', inWin(log, 0, 7).length, inWin(log, 7, 14).length, ''],
      ['Публикаций за 7 дней', inWin(myPosts.map((p) => ({ t: p.id })), 0, 7).length, inWin(myPosts.map((p) => ({ t: p.id })), 7, 14).length, ''],
      ['Потрачено за 7 дней', inWin(orders, 0, 7).filter((o) => o.st !== 'fail').reduce((s, o) => s + o.sum, 0), inWin(orders, 7, 14).filter((o) => o.st !== 'fail').reduce((s, o) => s + o.sum, 0), ' BYN'],
    ];

    $('#stats').innerHTML = S.map(([name, a, b, unit]) => {
      const [cls, txt] = trend(a, b);
      return `
        <article class="card col-span-6 xl:col-span-3 min-w-0 space-y-1.5 p-4 sm:p-5 shadow-sm">
          <p class="muted truncate text-xs sm:text-sm font-medium">${name}</p>
          <p class="font-display text-xl sm:text-2xl font-bold tabular-nums">${a}${unit}</p>
          <span class="badge ${cls} text-[10px] sm:text-xs">${txt}</span>
        </article>`;
    }).join('');

    const days = Array.from({ length: 12 }, (_, i) => inWin(log, 11 - i, 12 - i).reduce((s, x) => s + x.pts, 0));
    const max = Math.max(...days, 1);
    $('#chart').innerHTML = Array.from({ length: 6 }, (_, r) => days.map((d, colIdx) => {
      const active = Math.ceil((d / max) * 6) >= 6 - r && d > 0;
      const dateLabel = new Date(now - (11 - colIdx) * DAY).toLocaleDateString('ru-RU');
      return `<span title="${dateLabel}: ${d} баллов" class="h-6 sm:h-8 rounded-sm transition-all duration-200 cursor-pointer hover:bg-gold ${active ? 'bg-brand-500 shadow-sm' : 'bg-brand-100 dark:bg-slate-700/60'}"></span>`;
    }).join('')).join('');

    $('#chart-days').innerHTML = days.map((_, i) => `<span>${new Date(now - (11 - i) * DAY).getDate()}</span>`).join('');
    $('#chart').setAttribute('aria-label', 'Баллы по дням за 12 дней: ' + days.join(', '));

    const pts = Store.points();
    const lv = rankOf(pts);
    const prog = lv.next ? Math.round(((pts - lv.min) / (lv.next.min - lv.min)) * 100) : 100;

    $('#rank').innerHTML = `
      <div class="flex items-center gap-3">
        <div class="h-12 w-12 rounded-2xl bg-brand-100 dark:bg-slate-700 flex items-center justify-center text-brand-600 dark:text-gold shrink-0 shadow-inner">
          ${window.Icons && Icons[lv.icon] ? Icons[lv.icon]('h-6 w-6') : ''}
        </div>
        <div>
          <h2 class="h3">${lv.name}</h2>
          <p class="muted text-xs sm:text-sm">${pts} лень-баллов${lv.next ? ` · до ${lv.next.name}: ${lv.next.min - pts}` : ' · максимальный ранг'}</p>
        </div>
      </div>
      <div role="progressbar" aria-label="Прогресс ранга" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${prog}" class="h-2.5 overflow-hidden rounded-full bg-brand-100 dark:bg-slate-700">
        <div class="h-full rounded-full bg-gold transition-all duration-500 shadow-sm" style="width:${prog}%"></div>
      </div>
      <h3 class="pt-2 font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-900 dark:text-slate-100">Последние события</h3>
      <ul class="space-y-2 text-xs sm:text-sm">${log.slice(0, 5).map((x) => `
        <li class="flex justify-between items-center gap-2 p-2 rounded-xl bg-brand-50 dark:bg-slate-800/60">
          <span class="truncate">${esc(x.why)}</span>
          <b class="shrink-0 text-success font-bold font-mono">+${x.pts}</b>
        </li>`).join('')}
      </ul>`;

    const status = (o) => (o.st === 'wait' && now - o.t > 20000 ? 'paid' : o.st);
    const badge = { paid: ['badge-success', 'Оплачено'], wait: ['badge-warning', 'Ожидает'], fail: ['badge-danger', 'Отказ'] };
    const per = $('#period'), st = $('#tx-status'), q = $('#tx-search');

    const drawTable = () => {
      const days_ = per.value === 'all' ? 9999 : +per.value;
      const t = q.value.trim().toLowerCase();
      const r = orders.filter((o) => now - o.t <= days_ * DAY && (st.value === 'all' || status(o) === st.value) && (o.id + o.items).toLowerCase().includes(t));

      $('#tx-body').innerHTML = r.map((o) => `
        <tr class="group border-t border-brand-100 transition-colors duration-200 hover:bg-brand-50 dark:border-slate-800 dark:hover:bg-slate-800/80">
          <td class="px-4 py-3 font-mono text-xs font-bold text-brand-600 dark:text-gold">${esc(o.id)}</td>
          <td class="px-4 py-3 text-xs text-ink-soft dark:text-slate-400 font-mono">${fmtDate(o.t)}</td>
          <td class="max-w-[14rem] sm:max-w-[18rem] truncate px-4 py-3 font-medium text-xs sm:text-sm transition-colors group-hover:text-brand-500 dark:group-hover:text-gold">${esc(o.items)}</td>
          <td class="px-4 py-3 text-right font-bold tabular-nums text-xs sm:text-sm">${fmt(o.sum)} BYN</td>
          <td class="px-4 py-3"><span class="badge ${badge[status(o)][0]} text-[10px]">${badge[status(o)][1]}</span></td>
        </tr>`).join('');

      $('#tx-empty').classList.toggle('hidden', r.length > 0);
      $('#tx-empty').innerHTML = orders.length
        ? '<div class="space-y-1 py-4 text-center"><p class="font-bold text-sm text-ink-soft">По запросу ничего не найдено</p><p class="text-xs muted">Попробуйте изменить параметры поиска или периода</p></div>'
        : '<div class="space-y-1 py-4 text-center"><p class="font-bold text-sm">Заказов пока нет</p><p class="text-xs"><a class="font-bold underline text-brand-500 dark:text-gold" href="shop.html">Загляните в каталог магазина</a></p></div>';
    };

    [per, st].forEach((el) => el.addEventListener('change', drawTable));
    q.addEventListener('input', drawTable);
    drawTable();
  };

  
  pages.messenger = () => {
    const D = Store.get('dialogs', DIALOGS);
    const to = new URLSearchParams(location.search).get('to');
    let cur = 0;
    if (to) {
      let k = D.findIndex((d) => d.n === to);
      if (k < 0) {
        D.push({
          n: to,
          img: 'img/avatars/user-alexey.jpg',
          u: 0,
          m: [['in', 'Привет! Я как раз собирался тебе не отвечать.']]
        });
        k = D.length - 1;
      }
      cur = k;
    }

    const replies = [
      'Ну ты даёшь! Вот это профессиональный подход.',
      'Обсудим обязательно, но завтра или в пятницу.',
      'Сплю на уютном диване, не кантовать ни в коем случае.',
      'Принято, перенесено в бэклог на следующую пятилетку.',
      'У меня как раз провод от мышки перетёрся. Очень кстати.',
      'Отвечу ровно через 5 минуточек, если не усну...'
    ];

    const box = $('#msgs');
    const list = $('#dialogs');
    const inp = $('#chat-input');
    const chatTitle = $('#chat-title');
    const chatImg = $('#chat-header-img');

    const save = () => Store.set('dialogs', D);

    const bubble = ([w, t]) => `
      <div class="flex ${w === 'out' ? 'justify-end' : 'justify-start'} animate-fade-up">
        <p class="max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm leading-relaxed ${
          w === 'out'
            ? 'rounded-br-sm bg-brand-500 text-white'
            : 'rounded-bl-sm bg-white text-ink dark:bg-slate-800 dark:text-slate-100 border border-brand-100/60 dark:border-slate-700'
        }">${esc(t)}</p>
      </div>`;

    const renderList = () => {
      list.innerHTML = D.map((d, i) => `
        <li>
          <button type="button" data-i="${i}" aria-current="${i === cur}" class="flex w-full items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 text-left transition-colors duration-200 hover:bg-brand-50 aria-[current=true]:bg-brand-100/70 dark:hover:bg-slate-800/60 dark:aria-[current=true]:bg-slate-800">
            <div class="h-10 w-10 rounded-full overflow-hidden shadow-sm shrink-0 border border-brand-200 dark:border-slate-700">
              <img src="${d.img || 'img/avatars/user-alexey.jpg'}" alt="${esc(d.n)}" class="h-full w-full object-cover">
            </div>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-xs sm:text-sm font-bold">${esc(d.n)}</span>
              <span class="muted block truncate text-[11px] sm:text-xs">${esc(d.m.at(-1)[1])}</span>
            </span>
            ${d.u ? `<span class="badge badge-gold px-1.5 py-0 text-[10px] font-mono" aria-label="Непрочитано: ${d.u}">${d.u}</span>` : ''}
          </button>
        </li>`).join('');
    };

    const renderChat = () => {
      chatTitle.textContent = D[cur].n;
      if (chatImg) chatImg.src = D[cur].img || 'img/avatars/user-alexey.jpg';
      box.innerHTML = D[cur].m.map(bubble).join('');
      box.scrollTop = box.scrollHeight;
    };

    const openChat = (i) => {
      cur = i;
      D[cur].u = 0;
      save();
      renderList();
      renderChat();
    };

    list.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (b) openChat(+b.dataset.i);
    });

    $('#chat-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = inp.value.trim();
      if (!t) return;
      D[cur].m.push(['out', t]);
      inp.value = '';
      save();
      renderChat();
      renderList();

      const at = cur;
      setTimeout(() => {
        D[at].m.push(['in', replies[Math.floor(Math.random() * replies.length)]]);
        if (at !== cur) D[at].u++;
        save();
        if (at === cur) renderChat();
        renderList();
      }, 1000);
    });

    openChat(cur);
  };

  
  pages.board = () => {
    me = getMe();
    const COLS = [['todo', 'To Do (Отложено)'], ['doing', 'In Progress (Имитируем)'], ['done', 'Done (Забыто)']];
    const PR = { high: ['badge-danger', 'Высокий'], mid: ['badge-warning', 'Средний'], low: ['badge-success', 'Низкий'] };
    const T = Store.get('tasks', TASKS);
    const save = () => Store.set('tasks', T);

    const renderBoard = () => {
      $('#board').innerHTML = COLS.map(([k, name], n) => {
        const tasks = T.filter((x) => x.col === k);
        return `
          <section aria-labelledby="col-${k}" class="w-[85vw] max-w-[340px] min-w-[280px] shrink-0 snap-center rounded-2xl bg-brand-100/60 p-3 sm:p-4 lg:w-auto lg:max-w-none lg:min-w-0 dark:bg-slate-800/60 border border-brand-200/50 dark:border-slate-700">
            <h2 id="col-${k}" class="mb-3 flex items-center justify-between px-1 font-display text-xs sm:text-sm font-bold">
              <span>${name}</span>
              <span class="badge badge-brand font-mono" aria-label="Задач: ${tasks.length}">${tasks.length}</span>
            </h2>
            <ul class="space-y-3">
              ${tasks.length ? tasks.map((x) => `
                <li class="group rounded-xl border border-brand-100 bg-white p-3.5 sm:p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                  <div class="flex items-start gap-2">
                    <span class="cursor-grab select-none opacity-40 transition-opacity group-hover:opacity-100" aria-hidden="true">${window.Icons ? Icons.grip('h-4 w-4') : '⋮⋮'}</span>
                    <h3 class="flex-1 text-xs sm:text-sm font-bold leading-snug">${esc(x.t)}</h3>
                    <span class="badge ${PR[x.p][0]} shrink-0 text-[10px]">${PR[x.p][1]}</span>
                  </div>
                  <p class="muted mt-2 line-clamp-2 text-xs leading-relaxed">${esc(x.d)}</p>
                  <div class="mt-3 flex flex-wrap gap-1.5">
                    ${x.tags.map((t) => `<span class="badge badge-brand text-[10px]">#${esc(t)}</span>`).join('')}
                  </div>
                  <div class="mt-3 flex items-center justify-between border-t border-brand-50 pt-2.5 dark:border-slate-700/60">
                    <div class="flex items-center gap-1.5">
                      <div class="h-6 w-6 rounded-full overflow-hidden border border-brand-200 dark:border-slate-600 shrink-0">
                        <img src="${x.whoImg || 'img/avatars/user-alexey.jpg'}" alt="${esc(x.who)}" class="h-full w-full object-cover">
                      </div>
                      <span class="text-[11px] font-bold text-ink-soft dark:text-slate-300">${esc(x.who)}</span>
                    </div>
                    <span class="flex gap-1">
                      <button type="button" data-move="${x.id}:-1" class="btn btn-ghost btn-sm px-2 py-1 text-xs" aria-label="Назад" ${n === 0 ? 'disabled' : ''}>${window.Icons ? Icons.arrowLeft('h-3.5 w-3.5') : '←'}</button>
                      <button type="button" data-move="${x.id}:1" class="btn btn-ghost btn-sm px-2 py-1 text-xs" aria-label="Вперёд" ${n === COLS.length - 1 ? 'disabled' : ''}>${window.Icons ? Icons.arrowRight('h-3.5 w-3.5') : '→'}</button>
                    </span>
                  </div>
                </li>`).join('') : '<li class="muted rounded-xl border-2 border-dashed border-brand-200/80 p-6 text-center text-xs dark:border-slate-700 space-y-1"><p class="font-bold text-ink-soft">Задач пока нет</p><p class="text-[11px]">Колонка свободна от дедлайнов</p></li>'}
            </ul>
          </section>`;
      }).join('');
    };

    $('#board').addEventListener('click', (e) => {
      const b = e.target.closest('[data-move]');
      if (!b) return;
      const [id, d] = b.dataset.move.split(':').map(Number);
      const t = T.find((x) => x.id === id);
      const n = COLS.findIndex((c) => c[0] === t.col) + d;
      if (n < 0 || n >= COLS.length) return;
      t.col = COLS[n][0];
      if (t.col === 'done' && !t.paid) {
        t.paid = true;
        Store.reward(15, 'Задача успешно «выполнена» (забыта)');
      }
      save();
      renderBoard();
    });

    const dlg = $('#task-dialog');
    const form = $('#task-form');
    $('#new-task').addEventListener('click', () => dlg.showModal());
    $('#task-cancel').addEventListener('click', () => dlg.close());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const whoIni = (me.name || 'Лен').slice(0, 2).toUpperCase();
      T.unshift({
        id: Date.now(),
        col: 'todo',
        p: d.get('p'),
        tags: ['новое'],
        who: whoIni,
        whoImg: me.avatar || 'img/avatars/user-me.jpg',
        t: d.get('title').trim(),
        d: (d.get('d') || '').trim() || 'Описание отложено на неопределённый срок.'
      });
      save();
      form.reset();
      dlg.close();
      renderBoard();
      window.toast?.('Задача добавлена в To Do! Делать её вовсе необязательно.');
    });

    renderBoard();
  };

  
  pages.shop = () => {
    me = getMe();
    const grid = $('#grid'), empty = $('#empty'), pager = $('#pager'), form = $('#filters-form'), qIn = $('#q');
    const st = {
      cat: 'all',
      max: 150,
      tags: [],
      sort: 'pop',
      page: 1,
      q: (new URLSearchParams(location.search).get('q') || '').toLowerCase()
    };
    const SIZE = 6;
    qIn.value = st.q;

    if (me && PLANS[me.plan]) {
      const discountPct = Math.round((PLANS[me.plan].discount || 0) * 100);
      $('#plan-note').textContent = `Тариф ${PLANS[me.plan].name}: скидка ${discountPct}% применится в корзине автоматически.`;
    }

    let timer;

    const list = () => PRODUCTS
      .filter((p) => (st.cat === 'all' || p.cat === st.cat) && p.price <= st.max && p.name.toLowerCase().includes(st.q) && (!st.tags.length || st.tags.some((t) => p.tags.includes(t))))
      .sort({
        pop: (a, b) => b.rating - a.rating,
        asc: (a, b) => a.price - b.price,
        desc: (a, b) => b.price - a.price
      }[st.sort]);

    const skeleton = () => {
      grid.setAttribute('aria-busy', 'true');
      grid.innerHTML = Array.from({ length: 6 }, () => `
        <div class="space-y-3 card p-4">
          <div class="skeleton aspect-square rounded-xl"></div>
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-4 w-1/3"></div>
        </div>`).join('');
    };

    const renderShop = () => {
      const items = list();
      const total = Math.max(1, Math.ceil(items.length / SIZE));
      st.page = Math.min(st.page, total);
      grid.innerHTML = items.slice((st.page - 1) * SIZE, st.page * SIZE).map(productCard).join('');
      grid.setAttribute('aria-busy', 'false');
      empty.classList.toggle('hidden', items.length > 0);
      pager.classList.toggle('hidden', items.length === 0);
      $('#count').textContent = `Найдено товаров: ${items.length}`;

      pager.innerHTML = Array.from({ length: total }, (_, i) => `
        <button type="button" data-go="${i + 1}" class="btn btn-sm ${i + 1 === st.page ? 'btn-secondary' : 'btn-ghost'}" ${i + 1 === st.page ? 'aria-current="page"' : ''}>
          ${i + 1}
        </button>`).join('');
    };

    const updateShop = (reset = true) => {
      if (reset) st.page = 1;
      skeleton();
      clearTimeout(timer);
      timer = setTimeout(renderShop, 250);
    };

    const readFilters = () => {
      const d = new FormData(form);
      st.cat = d.get('cat') || 'all';
      st.max = +(d.get('price') || 150);
      st.tags = d.getAll('tag');
      $('#price-out').textContent = st.max + ' BYN';
    };

    form.addEventListener('input', () => { readFilters(); updateShop(); });
    qIn.addEventListener('input', () => { st.q = qIn.value.trim().toLowerCase(); updateShop(); });
    $('#sort').addEventListener('change', (e) => { st.sort = e.target.value; updateShop(); });

    pager.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (b) {
        st.page = +b.dataset.go;
        updateShop(false);
        scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    $('#reset').addEventListener('click', () => {
      form.reset();
      qIn.value = '';
      st.q = '';
      readFilters();
      updateShop();
    });

    readFilters();
    updateShop(false);
  };

  
  pages.checkout = () => {
    me = getMe();
    const plan = PLANS[me.plan] || PLANS.basic;
    const f = $('#wizard'), steps = $$('[data-step]', f), items = $$('#stepper li');
    const bar = $('#bar'), back = $('#back'), next = $('#next'), card = $('#card-fields');
    let i = 0;

    $('#name').value = me.name || '';
    $('#email').value = me.email || '';
    $('#plan-note').textContent = plan.discount
      ? `Тариф ${plan.name}: персональная скидка ${plan.discount * 100}% учтена в расчёте.`
      : 'Тариф Basic: скидки нет. Тариф Pro даёт −10%, Enterprise −20%.';

    const lines = () => Store.cart().map((c) => ({ ...PRODUCTS.find((p) => p.id === c.id), qty: c.qty })).filter((x) => x.id);

    const money = () => {
      const sub = lines().reduce((s, x) => s + x.price * x.qty, 0);
      const disc = Math.round(sub * plan.discount * 100) / 100;
      const ship = lines().length ? +(f.elements.delivery?.value || 5) : 0;
      return { sub, disc, ship, total: sub - disc + ship };
    };

    const paintCart = () => {
      const L = lines(), m = money();
      $('#order-list').innerHTML = L.length ? L.map((x) => `
        <li class="flex items-center justify-between gap-2 py-2.5">
          <div class="h-9 w-9 rounded-lg overflow-hidden shrink-0 border border-brand-100 dark:border-slate-700">
            <img src="${x.img}" alt="${esc(x.name)}" class="h-full w-full object-cover">
          </div>
          <span class="min-w-0 flex-1 truncate font-medium text-xs sm:text-sm">${esc(x.name)}</span>
          <span class="flex items-center gap-1">
            <button type="button" class="icon-btn h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-xs" data-q="${x.id}:-1" aria-label="Меньше: ${esc(x.name)}">−</button>
            <b class="w-5 text-center text-xs sm:text-sm font-mono">${x.qty}</b>
            <button type="button" class="icon-btn h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-xs" data-q="${x.id}:1" aria-label="Больше: ${esc(x.name)}">+</button>
          </span>
          <b class="w-14 text-right tabular-nums text-xs sm:text-sm">${x.price * x.qty} BYN</b>
        </li>`).join('') : '<li class="muted py-4 text-center text-xs sm:text-sm">Корзина пуста. <a class="font-bold underline text-brand-500 dark:text-gold" href="shop.html">Перейти в каталог</a></li>';

      $('#t-sub').textContent = fmt(m.sub) + ' BYN';
      $('#t-disc').textContent = '−' + fmt(m.disc) + ' BYN';
      $('#t-ship').textContent = fmt(m.ship) + ' BYN';
      $('#t-total').textContent = fmt(m.total) + ' BYN';

      if (next.dataset.loading !== 'true') next.disabled = !L.length;
    };

    $('#order-list').addEventListener('click', (e) => {
      const b = e.target.closest('[data-q]');
      if (!b) return;
      const [id, d] = b.dataset.q.split(':').map(Number);
      const c = Store.cart().find((x) => x.id === id);
      Store.setQty(id, (c ? c.qty : 0) + d);
      paintCart();
    });

    $$('input[name=delivery]').forEach((r) => r.addEventListener('change', paintCart));

    const getRadioLabel = (n) => f.querySelector(`[name=${n}]:checked`)?.dataset.label || '';

    const summary = () => {
      const d = new FormData(f);
      $('#summary').innerHTML = [
        ['Получатель', d.get('name')],
        ['Email', d.get('email')],
        ['Телефон', d.get('phone')],
        ['Адрес доставки', `${d.get('city') || ''}, ${d.get('address') || ''}`],
        ['Способ доставки', getRadioLabel('delivery')],
        ['Способ оплаты', getRadioLabel('pay')],
        ['Итого к списанию', fmt(money().total) + ' BYN'],
      ].map(([k, v]) => `
        <div class="flex justify-between gap-4 py-2">
          <dt class="muted">${k}:</dt>
          <dd class="truncate font-semibold text-right">${esc(v)}</dd>
        </div>`).join('');
    };

    const showStep = () => {
      steps.forEach((s, n) => { s.hidden = n !== i; });
      items.forEach((li, n) => {
        li.dataset.state = n < i ? 'done' : n === i ? 'current' : 'todo';
        n === i ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current');
      });
      bar.style.width = ((i + 1) / steps.length) * 100 + '%';
      $('#progress').setAttribute('aria-valuenow', i + 1);
      back.disabled = i === 0;

      const labels = ['Далее к адресу →', 'Далее к оплате →', 'Далее к проверке →', 'Подтвердить заказ!'];
      $('#next-label').textContent = labels[i] || 'Далее';
      if (i === steps.length - 1) summary();
    };

    const validateStep = () => {
      let ok = true;
      $$('input.input, select.input', steps[i]).filter((el) => !el.closest('#card-fields[hidden]')).forEach((el) => {
        let err = el.nextElementSibling;
        if (!err || !err.matches('[data-error]')) {
          el.insertAdjacentHTML('afterend', '<p data-error class="mt-1 text-xs text-danger font-semibold" role="alert"></p>');
          err = el.nextElementSibling;
        }
        const bad = !el.checkValidity();
        el.setAttribute('aria-invalid', bad);
        err.textContent = bad ? el.validationMessage : '';
        if (bad) ok = false;
      });

      if (i === steps.length - 1) {
        const c = $('#consent');
        $('#consent-err').classList.toggle('hidden', c.checked);
        if (!c.checked) ok = false;
      }
      return ok;
    };

    const submitOrder = () => {
      next.dataset.loading = 'true';
      next.disabled = true;
      const m = money(), L = lines(), num = Math.floor(1000 + Math.random() * 9000), d = new FormData(f);

      setTimeout(() => {
        Store.set('orders', [{
          id: '#' + num,
          t: Date.now(),
          items: L.map((x) => `${x.name} × ${x.qty}`).join(', '),
          sum: m.total,
          st: 'wait',
          who: d.get('name')
        }, ...Store.orders()]);

        Store.clear();
        Store.reward(Math.max(5, Math.round(m.total / 2)), 'Покупка в магазине');
        f.hidden = true;
        $('#progress-wrap').hidden = true;
        $('#order-ok').classList.remove('hidden');
        $('#order-num').textContent = '№ ' + num;
        window.toast?.('Заказ успешно оформлен! Номер заказа добавлен в историю.');
      }, 1100);
    };

    $$('input[name=pay]').forEach((r) => r.addEventListener('change', () => {
      const isCard = f.elements.pay.value === 'card';
      card.hidden = !isCard;
      $$('input', card).forEach((x) => { x.required = isCard; });
    }));

    next.addEventListener('click', () => {
      if (!validateStep()) return;
      i < steps.length - 1 ? (i++, showStep()) : submitOrder();
    });

    back.addEventListener('click', () => {
      if (i > 0) { i--; showStep(); }
    });

    f.addEventListener('submit', (e) => {
      e.preventDefault();
      next.click();
    });

    paintCart();
    showStep();
  };

  
  pages.ds = () => {
    const sw = [
      ['brand-500', 'bg-brand-500', '#5C43C4'],
      ['brand-900', 'bg-brand-900', '#1E182A'],
      ['gold', 'bg-gold', '#FFCA43'],
      ['success', 'bg-success', '#2E8B57'],
      ['warning', 'bg-warning', '#D97724'],
      ['danger', 'bg-danger', '#C2415A'],
      ['info', 'bg-info', '#25858B']
    ];
    $('#swatches').innerHTML = sw.map(([n, c, hex]) => `
      <div class="rounded-xl border border-brand-100 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 shadow-sm">
        <div class="h-14 rounded-lg ${c} shadow-inner"></div>
        <p class="mt-2 text-xs font-bold">${n}</p>
        <p class="text-[10px] text-ink-soft dark:text-slate-400 font-mono">${hex}</p>
      </div>`).join('');

    const V = ['primary', 'secondary', 'outline', 'ghost', 'danger'];
    const S = ['sm', 'md', 'lg'];
    $('#matrix').innerHTML = V.map((v) => `
      <div class="flex flex-wrap items-center gap-3">
        <span class="w-20 text-xs font-mono font-bold uppercase text-ink-soft">${v}</span>
        ${S.map((s) => `<button type="button" class="btn btn-${v} btn-${s}">${v} ${s}</button>`).join('')}
        <button type="button" class="btn btn-${v} btn-md" disabled>disabled</button>
      </div>`).join('');

    $('#sample-cards').innerHTML = profileCard(PEOPLE[0]) + `<div class="w-full max-w-[16rem]">${productCard(PRODUCTS[0])}</div>`;

    $$('[data-story]').forEach((el) => {
      const d = document.createElement('details');
      d.className = 'mt-3 rounded-xl bg-brand-900 text-sm text-brand-100 overflow-hidden shadow-md';
      d.innerHTML = `
        <summary class="cursor-pointer px-4 py-2.5 font-semibold text-xs tracking-wider uppercase bg-brand-900 hover:bg-brand-800 transition-colors flex items-center justify-between">
          <span>Смотреть исходный код компонента</span>
          <span class="text-gold">HTML ⌄</span>
        </summary>
        <pre class="max-h-64 overflow-auto p-4 text-xs scrollbar-thin bg-black/40 font-mono"><code></code></pre>`;
      d.querySelector('code').textContent = el.innerHTML.replace(/\n\s{2,}/g, '\n').trim();
      el.after(d);
    });

    const m = $('#demo-modal');
    $('#open-modal').addEventListener('click', () => m.showModal());
    $('#close-modal').addEventListener('click', () => m.close());
  };

  const pageName = document.body.dataset.page;
  if (pageName && pages[pageName]) {
    pages[pageName]();
  }
})();
