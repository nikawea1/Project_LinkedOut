const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const PRODUCTS = [
  {
    id: 1,
    name: 'Плед «Я на созвоне»',
    price: 49,
    cat: 'comfort',
    tags: ['хит'],
    rating: 4.9,
    img: 'img/products/prod-1.jpg',
    desc: 'Тёплый вязаный плед крупной вязки из мериносовой шерсти для максимального комфорта на диване.'
  },
  {
    id: 2,
    name: 'Кнопка «Отвечу завтра»',
    price: 15,
    cat: 'office',
    tags: ['хит', 'скидка'],
    rating: 4.8,
    img: 'img/products/prod-2.jpg',
    desc: 'Механическая тактильная кнопка. Издаёт громкий клик и автоматически закрывает рабочий мессенджер.'
  },
  {
    id: 3,
    name: 'Лежанка для ноутбука',
    price: 89,
    cat: 'tech',
    tags: ['новинка'],
    rating: 4.6,
    img: 'img/products/prod-3.jpg',
    desc: 'Эргономичная подставка с подушкой для работы лёжа на диване. Кулер охлаждает пыл начальника.'
  },
  {
    id: 4,
    name: 'Автокликер мышки «Я работаю»',
    price: 35,
    cat: 'tech',
    tags: ['хит'],
    rating: 4.7,
    img: 'img/products/prod-4.jpg',
    desc: 'Поддерживает статус «В сети» в Slack и Teams. Пока вы спите, курсор совершает осмысленные движения.'
  },
  {
    id: 5,
    name: 'Подписка на пиццу раз в день',
    price: 120,
    cat: 'food',
    tags: ['новинка'],
    rating: 4.9,
    img: 'img/products/prod-5.jpg',
    desc: 'Горячая пепперони прямо к дивану в случайное время суток. Чтобы не думать о готовке.'
  },
  {
    id: 6,
    name: 'Наушники с шумоподавлением «Не слышу начальство»',
    price: 95,
    cat: 'tech',
    tags: ['хит', 'скидка'],
    rating: 4.8,
    img: 'img/products/prod-6.jpg',
    desc: 'Беспроводные наушники с активным шумоподавлением (ANC). Полная тишина и фильтрация фраз «срочно» и «дедлайн».'
  },
  {
    id: 7,
    name: 'Кружка «Ещё 5 минуточек»',
    price: 18,
    cat: 'comfort',
    tags: [],
    rating: 4.5,
    img: 'img/products/prod-7.jpg',
    desc: 'Большая керамическая кружка на 650 мл. Сохраняет кофе горячим до самого вечера.'
  },
  {
    id: 8,
    name: 'Фон для видеозвонка «Офис»',
    price: 9,
    cat: 'tech',
    tags: ['скидка'],
    rating: 4.3,
    img: 'img/products/prod-8.jpg',
    desc: 'Складной хромакей с ультрареалистичным принтом делового опенспейса. Стирает бардак сзади.'
  },
  {
    id: 9,
    name: 'Набор снеков «Дедлайн»',
    price: 27,
    cat: 'food',
    tags: ['хит'],
    rating: 4.6,
    img: 'img/products/prod-9.jpg',
    desc: 'Попкорн, чипсы и орешки для многочасового просмотра сериалов вместо написания квартального отчёта.'
  },
  {
    id: 10,
    name: 'Табличка «Не беспокоить»',
    price: 7,
    cat: 'office',
    tags: [],
    rating: 4.2,
    img: 'img/products/prod-10.jpg',
    desc: 'Деревянная табличка на дверь кабинета или спальни с гравировкой «Сохраняю рабочий запал».'
  },
  {
    id: 11,
    name: 'Диван-трансформер «Кабинет»',
    price: 149,
    cat: 'comfort',
    tags: ['новинка'],
    rating: 5.0,
    img: 'img/products/prod-11.jpg',
    desc: 'Премиальный ортопедический диван, превращающийся в рабочую станцию одним лёгким нажатием.'
  },
  {
    id: 12,
    name: 'Энергетик «Потом»',
    price: 6,
    cat: 'food',
    tags: ['скидка'],
    rating: 4.1,
    img: 'img/products/prod-12.jpg',
    desc: 'Освежающий газированный напиток с экстрактом ромашки и мяты для здорового крепкого дневного сна.'
  },
];

const PLANS = {
  basic: { name: 'Basic', price: 0, discount: 0, badge: 'Бесплатный' },
  pro: { name: 'Pro', price: 19, discount: 0.1, badge: 'Popular' },
  enterprise: { name: 'Enterprise', price: 99, discount: 0.2, badge: 'VIP' },
};

const RANKS = [
  { min: 0, name: 'Middle Slacker', icon: 'rank1', badgeClass: 'badge-brand' },
  { min: 100, name: 'High Prokrastinator', icon: 'rank2', badgeClass: 'badge-brand' },
  { min: 300, name: 'Super Lazy', icon: 'rank3', badgeClass: 'badge-gold' },
  { min: 600, name: 'Expert Fired', icon: 'rank4', badgeClass: 'badge-gold' },
];

const rankOf = (pts) => {
  const i = RANKS.reduce((k, r, n) => (pts >= r.min ? n : k), 0);
  return { ...RANKS[i], next: RANKS[i + 1] || null };
};

const TYPES = { excuse: 'Отговорка', record: 'Рекорд', fired: 'Увольнение' };

const PEOPLE = [
  {
    id: 'alexey',
    n: 'Алексей М.',
    role: 'Senior Prokrastinator',
    img: 'img/avatars/user-alexey.jpg',
    bio: 'Три раза за месяц «перетёрся кабель интернета». Всегда на связи, когда это выгодно и не мешает сну.'
  },
  {
    id: 'dmitry',
    n: 'Дмитрий В.',
    role: 'Master of Sofa',
    img: 'img/avatars/user-dmitry.jpg',
    bio: 'Сэкономил 8 часов рабочей энергии за один день в TikTok. Совесть кристально чиста, диван нагрет.'
  },
  {
    id: 'irina',
    n: 'Ирина К.',
    role: 'Chief Excuse Officer',
    img: 'img/avatars/user-irina.jpg',
    bio: 'Автор бестселлера «120 проверенных отговорок». Ноутбук обновляется строго в часы важных созвонов.'
  },
  {
    id: 'svetlana',
    n: 'Светлана Н.',
    role: 'Super Lazy',
    img: 'img/avatars/user-svetlana.jpg',
    bio: 'Перевела рабочие чаты в архив. Считает, что если проблема важная, то она рассосётся сама.'
  },
  {
    id: 'maxim',
    n: 'Максим Т.',
    role: 'High Prokrastinator',
    img: 'img/avatars/user-maxim.jpg',
    bio: 'Рекордсмен по числу непрочитанных писем. Считает входящие сообщения личным оскорблением.'
  }
];

const POSTS = [
  {
    id: 1,
    a: 'Алексей М.',
    role: 'Senior Prokrastinator',
    img: 'img/avatars/user-alexey.jpg',
    type: 'excuse',
    likes: 42,
    t: 'Сказал начальнику, что перетёрся кабель от интернета, хотя просто скачивал новую игру. Сработало уже в третий раз за месяц.',
    comments: [
      { n: 'Максим', t: 'Классика! Я ещё шипение в микрофон добавляю.' },
      { n: 'Ирина', t: 'А у меня ноутбук стабильно обновляется по 4 часа.' }
    ]
  },
  {
    id: 2,
    a: 'Дмитрий В.',
    role: 'Master of Sofa',
    img: 'img/avatars/user-dmitry.jpg',
    type: 'record',
    likes: 89,
    t: 'Провёл весь день в TikTok и сэкономил 8 часов ценной рабочей энергии. Организм восстановился, дедлайн отодвинут.',
    comments: [
      { n: 'Светлана', t: 'Главное — автокликером двигать мышь раз в 10 минут!' }
    ]
  },
  {
    id: 3,
    a: 'Ирина К.',
    role: 'Chief Excuse Officer',
    img: 'img/avatars/user-irina.jpg',
    type: 'fired',
    likes: 120,
    t: 'Уволилась на первом часу испытательного срока. Получила выходное пособие за просмотр первого сезона сериала. Рекорд года!',
    comments: [
      { n: 'Алексей', t: 'Легендарно! Поделись шаблоном идеального заявления.' }
    ]
  },
  {
    id: 4,
    a: 'Светлана Н.',
    role: 'Super Lazy',
    img: 'img/avatars/user-svetlana.jpg',
    type: 'excuse',
    likes: 31,
    t: 'Лайфхак: сменить статус на «занят» везде одновременно. Лишние вопросы от коллег исчезают на 95%.',
    comments: []
  },
  {
    id: 5,
    a: 'Максим Т.',
    role: 'High Prokrastinator',
    img: 'img/avatars/user-maxim.jpg',
    type: 'record',
    likes: 57,
    t: 'Рекорд: 412 непрочитанных сообщений в рабочем чате. Тишина, спокойствие и умиротворение.',
    comments: [
      { n: 'Дмитрий', t: 'У меня 600, но я скромно молчу.' }
    ]
  },
];

const DIALOGS = [
  {
    n: 'Алексей М.',
    img: 'img/avatars/user-alexey.jpg',
    u: 2,
    m: [
      ['in', 'Ты уже отправил отчёт руководству?'],
      ['out', 'Отправил. Там было ровно три слова: «В процессе согласования».'],
      ['in', 'Гениально! Обязательно возьму на вооружение.']
    ]
  },
  {
    n: 'Дмитрий В.',
    img: 'img/avatars/user-dmitry.jpg',
    u: 0,
    m: [
      ['in', 'Идёшь на внеплановый созвон?'],
      ['out', 'Камера снова сломалась. Очень вовремя.']
    ]
  },
  {
    n: 'Ирина К.',
    img: 'img/avatars/user-irina.jpg',
    u: 5,
    m: [
      ['in', 'Поделись отговоркой дня срочно!'],
      ['in', 'Меня тут на ретроспективу зовут, выручай срочно.']
    ]
  },
  {
    n: 'Светлана Н.',
    img: 'img/avatars/user-svetlana.jpg',
    u: 0,
    m: [
      ['in', 'Кто сегодня выходит на работу?'],
      ['out', 'Никто. План соблюдён идеально.']
    ]
  },
];

const TASKS = [
  {
    id: 1,
    col: 'todo',
    p: 'high',
    tags: ['почта'],
    who: 'АМ',
    whoImg: 'img/avatars/user-alexey.jpg',
    t: 'Ответить на письмо начальства',
    d: 'Составить достойный ответ в духе «вернусь к вопросу на днях» и подписать с уважением.'
  },
  {
    id: 2,
    col: 'todo',
    p: 'low',
    tags: ['дом'],
    who: 'ИК',
    whoImg: 'img/avatars/user-irina.jpg',
    t: 'Разобрать диван',
    d: 'Найти пульт от телевизора, три носка и потерянную неделю назад рабочую мотивацию.'
  },
  {
    id: 3,
    col: 'todo',
    p: 'mid',
    tags: ['созвон'],
    who: 'ДВ',
    whoImg: 'img/avatars/user-dmitry.jpg',
    t: 'Подготовить умный вид',
    d: 'Отработать фирменный кивок и фразу «давайте вынесем эту дискуссию в оффлайн».'
  },
  {
    id: 4,
    col: 'doing',
    p: 'high',
    tags: ['отчёт'],
    who: 'АМ',
    whoImg: 'img/avatars/user-alexey.jpg',
    t: 'Написать отчёт из трёх слов',
    d: 'Утверждённые слова: «анализировал», «прорабатывал», «согласовывал».'
  },
  {
    id: 5,
    col: 'doing',
    p: 'mid',
    tags: ['сон'],
    who: 'СН',
    whoImg: 'img/avatars/user-svetlana.jpg',
    t: 'Ещё 5 минуточек',
    d: 'Задача длится уже третий час подряд, статус остаётся неизменным.'
  },
  {
    id: 6,
    col: 'done',
    p: 'low',
    paid: true,
    tags: ['еда'],
    who: 'ДВ',
    whoImg: 'img/avatars/user-dmitry.jpg',
    t: 'Заказать пиццу',
    d: 'Выполнено с опережением графика, диван успешно освоен.'
  },
];

const productCard = (p) => {
  const starIcon = window.Icons
    ? Icons.star('h-3 w-3 text-gold inline mr-0.5')
    : '<svg class="h-3 w-3 text-gold inline mr-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  return `
  <article class="product-card group flex flex-col justify-between">
    <div class="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
      <img src="${p.img}" alt="${esc(p.name)}" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onerror="this.src='img/products/prod-1.jpg'">
      ${p.tags && p.tags[0] ? `<span class="badge badge-gold absolute left-2.5 top-2.5 shadow-sm">${p.tags[0]}</span>` : ''}
      <span class="absolute bottom-2.5 right-2.5 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm flex items-center gap-0.5">${starIcon}<span>${p.rating}</span></span>
    </div>
    <div class="mt-3 flex-1 flex flex-col">
      <h3 class="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-ink dark:text-slate-100 transition-colors group-hover:text-brand-500 dark:group-hover:text-gold">${esc(p.name)}</h3>
      <p class="muted mt-1 text-xs line-clamp-1">${esc(p.desc || '')}</p>
      <div class="mt-3 flex items-center justify-between pt-2 border-t border-brand-100/60 dark:border-slate-800">
        <p class="font-display text-base sm:text-lg font-bold text-brand-900 dark:text-white tabular-nums">${p.price} BYN</p>
        <button type="button" class="btn btn-secondary btn-sm" data-add="${p.id}">В корзину</button>
      </div>
    </div>
  </article>`;
};

const profileCard = (p, on = false) => {
  const followContent = on
    ? `${window.Icons ? Icons.check('h-3.5 w-3.5 inline mr-1') : ''}Подписан`
    : 'Подписаться';
  return `
  <article class="card w-full md:w-80 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
    <div class="h-20 w-20 rounded-full shadow-md overflow-hidden border-2 border-brand-200 dark:border-slate-700 shrink-0">
      <img src="${p.img || 'img/avatars/user-alexey.jpg'}" alt="${esc(p.n)}" class="h-full w-full object-cover" onerror="this.src='img/avatars/user-alexey.jpg'">
    </div>
    <div class="space-y-1">
      <h3 class="h3">${esc(p.n)}</h3>
      <p class="text-xs sm:text-sm font-semibold text-brand-500 dark:text-gold">${esc(p.role)}</p>
    </div>
    <p class="body text-xs sm:text-sm leading-relaxed">${esc(p.bio)}</p>
    <div class="flex gap-2 w-full pt-1">
      <button type="button" data-follow="${esc(p.n)}" aria-pressed="${on}" class="btn btn-secondary flex-1 aria-pressed:bg-gold aria-pressed:text-brand-900 transition-colors">
        ${followContent}
      </button>
      <a href="messenger.html?to=${encodeURIComponent(p.n)}" class="btn btn-outline flex-1">Написать</a>
    </div>
  </article>`;
};
