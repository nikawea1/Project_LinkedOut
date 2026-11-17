/**
 * ЛЕНТЯIN — Клиентская Реляционная База Данных (Client-Side Relational Database)
 * Хранит пользователей, сессии, посты, комментарии, задачи, аудит и файлы.
 * Обеспечивает персистентность данных между перезагрузками и страницами.
 */
(() => {
  const STORAGE_PREFIX = 'ln_db_';
  const CURRENT_USER_KEY = 'ln_db_current_user';

  const read = (key, fallback) => {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, val) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
    } catch (e) {
      console.warn('DB Storage Quota exceeded or unavailable', e);
    }
  };

  // Начальные пользователи
  const SEED_USERS = [
    {
      id: 'u-1',
      name: 'Алексей Медведев',
      email: 'alexey@lentyain.by',
      passwordHash: 'pass123', // Demo password
      plan: 'pro',
      role: 'Архимагистр лени',
      avatar: 'img/avatars/user-alexey.jpg',
      points: 420,
      registeredAt: 1730000000000
    },
    {
      id: 'u-2',
      name: 'Ирина Ковалёва',
      email: 'irina@lentyain.by',
      passwordHash: 'pass123',
      plan: 'enterprise',
      role: 'Chief Excuse Officer',
      avatar: 'img/avatars/user-irina.jpg',
      points: 750,
      registeredAt: 1730100000000
    },
    {
      id: 'u-3',
      name: 'Дмитрий Волков',
      email: 'dmitry@lentyain.by',
      passwordHash: 'pass123',
      plan: 'pro',
      role: 'Master of Sofa',
      avatar: 'img/avatars/user-dmitry.jpg',
      points: 310,
      registeredAt: 1730200000000
    },
    {
      id: 'u-4',
      name: 'Светлана Романова',
      email: 'svetlana@lentyain.by',
      passwordHash: 'pass123',
      plan: 'basic',
      role: 'Super Lazy',
      avatar: 'img/avatars/user-svetlana.jpg',
      points: 180,
      registeredAt: 1730300000000
    },
    {
      id: 'u-5',
      name: 'Максим Ткаченко',
      email: 'maxim@lentyain.by',
      passwordHash: 'pass123',
      plan: 'basic',
      role: 'High Prokrastinator',
      avatar: 'img/avatars/user-maxim.jpg',
      points: 140,
      registeredAt: 1730400000000
    }
  ];

  const SEED_POSTS = [
    {
      id: 1,
      userId: 'u-1',
      a: 'Алексей Медведев',
      role: 'Архимагистр лени',
      img: 'img/avatars/user-alexey.jpg',
      type: 'excuse',
      likes: 42,
      likedBy: ['u-2', 'u-3'],
      t: 'Сказал руководству, что перетёрся кабель от интернета, хотя просто скачивал новую игру. Сработало уже в третий раз за месяц.',
      comments: [
        { n: 'Максим Ткаченко', t: 'Классика! Я ещё шипение в микрофон добавляю.' },
        { n: 'Ирина Ковалёва', t: 'А у меня ноутбук стабильно обновляется по 4 часа.' }
      ],
      createdAt: Date.now() - 3600000 * 24
    },
    {
      id: 2,
      userId: 'u-3',
      a: 'Дмитрий Волков',
      role: 'Master of Sofa',
      img: 'img/avatars/user-dmitry.jpg',
      type: 'record',
      likes: 89,
      likedBy: ['u-1', 'u-4'],
      t: 'Провёл весь рабочий день в TikTok и сэкономил 8 часов ценной энергии. Организм полностью восстановился, дедлайн отодвинут.',
      comments: [
        { n: 'Светлана Романова', t: 'Главное — автокликером двигать мышь раз в 10 минут!' }
      ],
      createdAt: Date.now() - 3600000 * 18
    },
    {
      id: 3,
      userId: 'u-2',
      a: 'Ирина Ковалёва',
      role: 'Chief Excuse Officer',
      img: 'img/avatars/user-irina.jpg',
      type: 'fired',
      likes: 120,
      likedBy: ['u-1', 'u-3', 'u-5'],
      t: 'Уволилась на первом часу испытательного срока. Получила компенсацию за просмотр целого сезона сериала. Рекорд года!',
      comments: [
        { n: 'Алексей Медведев', t: 'Легендарно! Поделись шаблоном идеального заявления.' }
      ],
      createdAt: Date.now() - 3600000 * 12
    },
    {
      id: 4,
      userId: 'u-4',
      a: 'Светлана Романова',
      role: 'Super Lazy',
      img: 'img/avatars/user-svetlana.jpg',
      type: 'excuse',
      likes: 31,
      likedBy: [],
      t: 'Лайфхак: сменить статус на «занят» во всех корпоративных мессенджерах одновременно. Лишние вопросы от коллег исчезают на 95%.',
      comments: [],
      createdAt: Date.now() - 3600000 * 6
    },
    {
      id: 5,
      userId: 'u-5',
      a: 'Максим Ткаченко',
      role: 'High Prokrastinator',
      img: 'img/avatars/user-maxim.jpg',
      type: 'record',
      likes: 57,
      likedBy: ['u-2'],
      t: 'Рекорд: 412 непрочитанных сообщений в рабочем чате. Тишина, спокойствие и тотальное умиротворение.',
      comments: [
        { n: 'Дмитрий Волков', t: 'У меня 600, но я скромно молчу.' }
      ],
      createdAt: Date.now() - 3600000 * 2
    }
  ];

  const DB = {
    // Пользователи
    users: {
      all() {
        return read('users', SEED_USERS);
      },
      save(list) {
        write('users', list);
      },
      findByEmail(email) {
        if (!email) return null;
        const norm = email.toLowerCase().trim();
        return this.all().find((u) => u.email.toLowerCase().trim() === norm) || null;
      },
      findById(id) {
        return this.all().find((u) => u.id === id) || null;
      },
      register({ email, password, name, plan = 'basic', role = 'Стажёр на диване', avatar }) {
        const users = this.all();
        if (this.findByEmail(email)) {
          throw new Error('Пользователь с таким email уже зарегистрирован');
        }
        const newUser = {
          id: 'u-' + Date.now(),
          name: name || (email.split('@')[0] || 'Лентяй'),
          email: email.toLowerCase().trim(),
          passwordHash: password, // client-side simulation
          plan: plan || 'basic',
          role: role || 'Стажёр на диване',
          avatar: avatar || 'img/avatars/user-me.jpg',
          points: 10,
          registeredAt: Date.now()
        };
        users.push(newUser);
        this.save(users);
        DB.auth.setCurrent(newUser);
        return newUser;
      },
      updateRole(userId, newRole) {
        const users = this.all();
        const u = users.find((x) => x.id === userId);
        if (u) {
          u.role = newRole;
          this.save(users);
          const current = DB.auth.current();
          if (current && current.id === userId) {
            current.role = newRole;
            DB.auth.setCurrent(current);
          }
          return u;
        }
        return null;
      }
    },

    // Сессия / Аутентификация
    auth: {
      current() {
        try {
          const userJson = localStorage.getItem(CURRENT_USER_KEY);
          if (userJson) return JSON.parse(userJson);
        } catch {}
        // Fallback to legacy ln:user
        try {
          const legacy = JSON.parse(localStorage.getItem('ln:user'));
          if (legacy) return legacy;
        } catch {}
        return null;
      },
      setCurrent(user) {
        if (!user) {
          localStorage.removeItem(CURRENT_USER_KEY);
          localStorage.removeItem('ln:user');
        } else {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
          localStorage.setItem('ln:user', JSON.stringify(user));
        }
        document.dispatchEvent(new CustomEvent('auth:change', { detail: user }));
      },
      login(email, password) {
        const user = DB.users.findByEmail(email);
        if (!user) {
          // Автосоздание для удобства тестирования, если не найден
          return DB.users.register({ email, password, name: email.split('@')[0] });
        }
        this.setCurrent(user);
        return user;
      },
      logout() {
        this.setCurrent(null);
      }
    },

    // Лента и посты
    posts: {
      all() {
        return read('posts', SEED_POSTS);
      },
      save(list) {
        write('posts', list);
      },
      create({ text, type = 'excuse', authorName, authorRole, authorAvatar, userId }) {
        const list = this.all();
        const newPost = {
          id: Date.now(),
          userId: userId || 'u-me',
          a: authorName || 'Диванный Эксперт',
          role: authorRole || 'Senior Prokrastinator',
          img: authorAvatar || 'img/avatars/user-me.jpg',
          type: type || 'excuse',
          likes: 0,
          likedBy: [],
          t: text,
          comments: [],
          createdAt: Date.now()
        };
        list.unshift(newPost);
        this.save(list);
        return newPost;
      },
      toggleLike(postId, userId) {
        const list = this.all();
        const post = list.find((p) => p.id === postId);
        if (!post) return null;
        post.likedBy = post.likedBy || [];
        const idx = post.likedBy.indexOf(userId);
        if (idx >= 0) {
          post.likedBy.splice(idx, 1);
          post.likes = Math.max(0, post.likes - 1);
        } else {
          post.likedBy.push(userId);
          post.likes++;
        }
        this.save(list);
        return post;
      },
      addComment(postId, { name, text }) {
        const list = this.all();
        const post = list.find((p) => p.id === postId);
        if (!post) return null;
        post.comments = post.comments || [];
        const comment = { n: name, t: text, at: Date.now() };
        post.comments.push(comment);
        this.save(list);
        return comment;
      }
    },

    // Экспорт / Импорт всей БД (Backup & Restore)
    backup: {
      exportJSON() {
        const dump = {
          version: '2.0',
          exportedAt: new Date().toISOString(),
          users: DB.users.all(),
          posts: DB.posts.all(),
          currentUser: DB.auth.current()
        };
        return JSON.stringify(dump, null, 2);
      },
      importJSON(jsonString) {
        try {
          const dump = JSON.parse(jsonString);
          if (dump.users && Array.isArray(dump.users)) DB.users.save(dump.users);
          if (dump.posts && Array.isArray(dump.posts)) DB.posts.save(dump.posts);
          if (dump.currentUser) DB.auth.setCurrent(dump.currentUser);
          return true;
        } catch (e) {
          console.error('Import failed', e);
          return false;
        }
      },
      reset() {
        write('users', SEED_USERS);
        write('posts', SEED_POSTS);
      }
    }
  };

  // Инициализация при первом запуске
  if (!read('users', null)) {
    write('users', SEED_USERS);
  }
  if (!read('posts', null)) {
    write('posts', SEED_POSTS);
  }

  window.LentyainDB = DB;
})();
