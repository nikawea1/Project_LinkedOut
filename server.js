/**
 * ЛЕНТЯIN — Полнофункциональный HTTP Backend Сервер (Node.js)
 * Реализует статическую раздачу сайта и версионированный REST API v1/v2 с сохранением в db.json
 * Запуск: node server.js (порт по умолчанию 3000)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const DIST_DIR = path.join(__dirname, 'dist');
const ROOT_DIR = __dirname;

// Инициализация базы данных на диске
const DEFAULT_DB = {
  tasks: [
    { id: 1, title: 'Уйти в глубокую медитацию на утреннем дейли', category: 'Совещание', status: 'Сделано', hours: 1.5, points: 25, assignee: 'Алексей М.', notes: 'Камера выключена под предлогом слабого Wi-Fi', date: '2026-11-10' },
    { id: 2, title: 'Выбрать идеальный плейлист для «написания кода»', category: 'Кодинг', status: 'Сделано', hours: 3.0, points: 40, assignee: 'Ирина К.', notes: 'Ни одной строчки кода написано не было, но музыка топ', date: '2026-11-11' },
    { id: 3, title: 'Тестирование ортопедического дивана на выгорание', category: 'Сон', status: 'В процессе', hours: 4.5, points: 50, assignee: 'Дмитрий В.', notes: 'Пульс 54 bpm, максимальная продуктивность покоя', date: '2026-11-12' },
    { id: 4, title: 'Делегировать согласование требований коту', category: 'Другое', status: 'Отложено', hours: 2.0, points: 20, assignee: 'Максим Т.', notes: 'Кот лёг на клавиатуру и нажал "ОК"', date: '2026-11-12' },
    { id: 5, title: 'Изучение 4-го сезона сериала вместо багфикса', category: 'Сериал', status: 'Сделано', hours: 6.0, points: 80, assignee: 'Светлана Р.', notes: 'Закрыла сезон за ночь, баг подождёт до релиза', date: '2026-11-13' },
  ],
  audit: [
    { id: 1, action: 'SYSTEM_INIT', title: 'База данных инициализирована', timestamp: new Date().toISOString(), author: 'System', before: null, after: { status: 'ONLINE' } }
  ],
  posts: [
    { id: 1, a: 'Алексей М.', role: 'Senior Prokrastinator', img: 'img/avatars/user-alexey.jpg', type: 'excuse', likes: 42, t: 'Сказал начальнику, что перетёрся кабель от интернета...', comments: [] }
  ]
};

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading db.json:', e);
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
  return DEFAULT_DB;
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving db.json:', e);
  }
}

let db = loadDB();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ico': 'image/x-icon',
};

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  // --- API ЭНДПОИНТЫ ---

  // Health
  if (pathname === '/api/health') {
    return sendJson(res, 200, { status: 'healthy', timestamp: new Date().toISOString(), version: '2.0.0' });
  }

  // REST API v1: Tasks List & Create
  if (pathname === '/api/v1/tasks') {
    if (req.method === 'GET') {
      let result = [...db.tasks];
      if (parsed.query.category) {
        result = result.filter(t => t.category === parsed.query.category);
      }
      if (parsed.query.status) {
        result = result.filter(t => t.status === parsed.query.status);
      }
      if (parsed.query.q) {
        const q = parsed.query.q.toLowerCase();
        result = result.filter(t => t.title.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q));
      }
      return sendJson(res, 200, { success: true, count: result.length, data: result });
    }

    if (req.method === 'POST') {
      const payload = await parseBody(req);
      const newTask = {
        id: Date.now(),
        title: payload.title || 'Новая задача лени',
        category: payload.category || 'Другое',
        status: payload.status || 'Отложено',
        hours: Number(payload.hours || 1),
        points: Number(payload.points || 15),
        assignee: payload.assignee || 'Алексей М.',
        notes: payload.notes || '',
        date: new Date().toISOString().slice(0, 10),
      };
      db.tasks.unshift(newTask);
      db.audit.unshift({
        id: Date.now(),
        action: 'TASK_CREATE',
        title: `Создана задача «${newTask.title}»`,
        timestamp: new Date().toISOString(),
        author: newTask.assignee,
        before: null,
        after: newTask,
      });
      saveDB(db);
      return sendJson(res, 201, { success: true, task: newTask });
    }
  }

  // REST API v1: Task Update & Delete
  if (pathname.startsWith('/api/v1/tasks/')) {
    const id = Number(pathname.split('/')[4]);
    const idx = db.tasks.findIndex(t => t.id === id);

    if (idx === -1) {
      return sendJson(res, 404, { success: false, error: 'Task not found' });
    }

    if (req.method === 'PUT') {
      const payload = await parseBody(req);
      const before = { ...db.tasks[idx] };
      db.tasks[idx] = { ...db.tasks[idx], ...payload, id };
      db.audit.unshift({
        id: Date.now(),
        action: 'TASK_UPDATE',
        title: `Обновлена задача «${db.tasks[idx].title}»`,
        timestamp: new Date().toISOString(),
        author: db.tasks[idx].assignee,
        before,
        after: db.tasks[idx],
      });
      saveDB(db);
      return sendJson(res, 200, { success: true, task: db.tasks[idx] });
    }

    if (req.method === 'DELETE') {
      const removed = db.tasks.splice(idx, 1)[0];
      db.audit.unshift({
        id: Date.now(),
        action: 'TASK_DELETE',
        title: `Удалена задача «${removed.title}»`,
        timestamp: new Date().toISOString(),
        author: 'System',
        before: removed,
        after: null,
      });
      saveDB(db);
      return sendJson(res, 200, { success: true, deleted: removed });
    }
  }

  // REST API v2: Audit Log
  if (pathname === '/api/v2/audit-log') {
    return sendJson(res, 200, { success: true, count: db.audit.length, logs: db.audit });
  }

  // --- СТАТИЧЕСКАЯ РАЗДАЧА ФАЙЛОВ ---
  let filePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  let resolvedPath = path.join(DIST_DIR, filePath);

  if (!fs.existsSync(resolvedPath)) {
    resolvedPath = path.join(ROOT_DIR, filePath);
  }

  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(resolvedPath).pipe(res);
  } else {
    // 404 fallback
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found — ЛЕНТЯIN');
  }
});

server.listen(PORT, () => {
  console.log(`[ЛЕНТЯIN] Сервер запущен: http://localhost:${PORT}`);
  console.log(`[ЛЕНТЯIN] REST API v1 доступен: http://localhost:${PORT}/api/v1/tasks`);
  console.log(`[ЛЕНТЯIN] Аудит-лог v2 доступен: http://localhost:${PORT}/api/v2/audit-log`);
});
