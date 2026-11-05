
const Store = {
  get(k, d) {
    try {
      const v = JSON.parse(localStorage.getItem('ln:' + k));
      return v ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem('ln:' + k, JSON.stringify(v));
    } catch {}
    document.dispatchEvent(new CustomEvent('store:change', { detail: k }));
  },

  
  user() {
    return this.get('user', null);
  },

  login({ name, email, plan, avatar }) {
    const userObj = {
      name: name || 'Лентяй',
      email: email || '',
      plan: PLANS[plan] ? plan : 'basic',
      avatar: avatar || 'img/avatars/user-me.jpg',
      registeredAt: Date.now()
    };
    this.set('user', userObj);
    if (!this.get('log', null)) this.seed();
    this.reward(10, 'Регистрация в ЛЕНТЯIN');
    return userObj;
  },

  loginAsDemo(key) {
    const demos = {
      alexey: {
        name: 'Алексей М.',
        email: 'alexey@lentyain.by',
        plan: 'pro',
        avatar: 'img/avatars/user-alexey.jpg'
      },
      irina: {
        name: 'Ирина К.',
        email: 'irina@lentyain.by',
        plan: 'enterprise',
        avatar: 'img/avatars/user-irina.jpg'
      },
      guest: {
        name: 'Диванный Эксперт',
        email: 'slacker@lentyain.by',
        plan: 'basic',
        avatar: 'img/avatars/user-me.jpg'
      }
    };
    const chosen = demos[key] || demos.guest;
    return this.login(chosen);
  },

  logout() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('ln:'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    location.href = 'index.html';
  },

  seed() {
    const DAY = 864e5, now = Date.now();
    const why = ['Сорванный дедлайн', 'Часы в TikTok', 'Лучшая отговорка', 'Тихий час', 'Отложенный отчёт'];
    const pts = [8, 14, 0, 6, 18, 10, 4, 0, 12, 9, 5, 7];
    this.set('log', pts.map((p, i) => ({ t: now - (i + 1) * DAY, pts: p, why: why[i % 5] })).filter((x) => x.pts));
    this.set('orders', [
      { id: '#0981', t: now - 3 * DAY, items: 'Беруши «Не слышу начальство»', sum: 12, st: 'paid', who: 'Алексей М.' },
      { id: '#0975', t: now - 8 * DAY, items: 'Диван-трансформер «Кабинет»', sum: 149, st: 'fail', who: 'Дмитрий В.' },
    ]);
  },

  
  reward(pts, why) {
    const l = this.get('log', []);
    l.unshift({ t: Date.now(), pts, why });
    this.set('log', l);
    window.toast?.(`+${pts} лень-баллов · ${why}`);
  },

  points() {
    return this.get('log', []).reduce((s, x) => s + x.pts, 0);
  },

  
  cart() {
    return this.get('cart', []);
  },

  add(id) {
    const c = this.cart();
    const it = c.find((x) => x.id === id);
    if (it) {
      it.qty++;
    } else {
      c.push({ id, qty: 1 });
    }
    this.set('cart', c);
  },

  setQty(id, q) {
    const c = this.cart().map((x) => (x.id === id ? { ...x, qty: q } : x)).filter((x) => x.qty > 0);
    this.set('cart', c);
  },

  clear() {
    this.set('cart', []);
  },

  orders() {
    return this.get('orders', []);
  },
};
