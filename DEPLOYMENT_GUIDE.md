# Инструкция по публикации и запуску проекта «ЛЕНТЯIN»

Данное руководство описывает, как запустить проект локально с полноценным REST API и базой данных, а также как опубликовать сайт на бесплатных хостинг-платформах **без риска санкций и ограничений**.

---

## Вариант 1: Быстрая публикация на Cloudflare Pages (Рекомендуется)

Платформа **Cloudflare Pages** не имеет региональных ограничений/санкций, предоставляет полностью бесплатный неограниченный трафик, бесплатный SSL-сертификат и разрешает коммерческие и рекламные блоки (`AdSlot.vue`).

### Шаги для публикации:
1. **Инициализация и отправка репозитория в GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete luxury minimalist sloths social network with full db and vue hub"
   git branch -M main
   git remote add origin https://github.com/ВАШ_АККАУНТ/ВАШ_РЕПОЗИТОРИЙ.git
   git push -u origin main
   ```
2. **Подключение к Cloudflare Pages:**
   - Войдите в панель управления [Cloudflare Dashboard](https://dash.cloudflare.com/).
   - В левом меню выберите раздел **Compute (Workers) & Pages** → нажмите **Create application** → перейдите во вкладку **Pages** → **Connect to Git**.
   - Выберите созданный репозиторий GitHub.
3. **Настройки сборки (Build Settings):**
   - **Framework preset:** None / Other
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
4. **Запуск:**
   - Нажмите **Save and Deploy**. Сборка займёт менее 40 секунд.
   - По завершении вы получите постоянный публичный адрес вида `https://lentyain.pages.dev` с бесплатным HTTPS.

---

## Вариант 2: Публикация на GitHub Pages через встроенный GitHub Actions

В проекте уже настроен файл рабочего процесса `.github/workflows/deploy.yml`.

### Шаги для публикации:
1. Отправьте код в ваш репозиторий на GitHub (`git push origin main`).
2. В репозитории на GitHub перейдите во вкладку **Settings** → раздел **Pages** (в левом меню).
3. В выпадающем списке **Build and deployment** выберите **Source:** `GitHub Actions`.
4. Перейдите во вкладку **Actions** — рабочий процесс `Deploy to GitHub Pages` запустится автоматически.
5. После завершения сайт станет доступен по адресу:  
   `https://ВАШ_GITHUB_LOGIN.github.io/ИМЯ_РЕПОЗИТОРИЯ/`

---

## Вариант 3: Локальный запуск Fullstack сервера с REST API (Node.js)

Если необходимо протестировать сайт локально со встроенным backend-сервером и сохранением задач в дисковый файл `db.json`:

```bash
# Сборка стилей и подготовка dist
npm run build

# Запуск HTTP сервера (порт 3000)
node server.js
# или
npm start
```

После этого откройте в браузере:
- Главная страница: `http://localhost:3000`
- Реестр задач Vue Data Hub: `http://localhost:3000/data-hub.html`
- Лента отговорок: `http://localhost:3000/feed.html`
- REST API v1 (JSON): `http://localhost:3000/api/v1/tasks`
- Журнал аудита REST API v2: `http://localhost:3000/api/v2/audit-log`

---

## Демо-аккаунты для мгновенного входа:
- **Алексей Медведев** (`alexey@lentyain.by`, пароль: `pass123`) — Архимагистр лени, тариф Pro.
- **Ирина Ковалёва** (`irina@lentyain.by`, пароль: `pass123`) — Chief Excuse Officer, тариф Enterprise.
- **Дмитрий Волков** (`dmitry@lentyain.by`, пароль: `pass123`) — Master of Sofa, тариф Pro.
- **Быстрый демо-вход:** На странице входа/регистрации кликните по любому аккаунту для входа без ввода пароля.
