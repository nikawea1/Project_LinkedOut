/**
 * ЛЕНТЯIN — Data Hub & Voyager Admin Application (Vue 3 + SheetJS)
 * Core Data Management & Voyager Admin Module
 */
(() => {
  const { createApp, ref, reactive, computed, onMounted, watch } = Vue;

  const app = createApp({
    setup() {
      // Current active view
      const activeTab = ref('table'); // 'import' | 'table' | 'log' | 'voyager' | 'api'
      const isDragging = ref(false);

      // Search & Filters
      const searchQuery = ref('');
      const selectedCategory = ref('');
      const selectedStatus = ref('');

      // Pagination & Lazy Loading
      const currentPage = ref(1);
      const pageSize = ref(10);
      const lazyLimit = ref(10);

      // Error Modal state (Strict Excel validation)
      const errorModal = reactive({
        isOpen: false,
        fileName: '',
        fileType: '',
        reason: '',
      });

      // Data Modal state (Reused for Create and Edit)
      const dataModal = reactive({
        isOpen: false,
        mode: 'create', // 'create' | 'edit'
        initialData: {},
      });

      // Diff Inspector Modal state (vue-json-compare)
      const diffModal = reactive({
        isOpen: false,
        item: null,
      });

      // API Test Console state
      const apiConsole = reactive({
        version: 'v1',
        method: 'GET',
        endpoint: '/api/v1/tasks',
        status: 200,
        latency: 42,
        response: '',
      });

      // Default seed tasks
      const defaultTasks = [
        { id: 1, title: 'Уйти в глубокую медитацию на утреннем дейли', category: 'Совещание', status: 'Сделано', hours: 1.5, points: 25, assignee: 'Алексей М.', notes: 'Камера выключена под предлогом слабого Wi-Fi', date: '2026-11-10' },
        { id: 2, title: 'Выбрать идеальный плейлист для «написания кода»', category: 'Кодинг', status: 'Сделано', hours: 3.0, points: 40, assignee: 'Ирина К.', notes: 'Ни одной строчки кода написано не было, но музыка топ', date: '2026-11-11' },
        { id: 3, title: 'Тестирование ортопедического дивана на выгорание', category: 'Сон', status: 'В процессе', hours: 4.5, points: 50, assignee: 'Дмитрий В.', notes: 'Пульс 54 bpm, максимальная продуктивность покоя', date: '2026-11-12' },
        { id: 4, title: 'Делегировать согласование требований коту', category: 'Другое', status: 'Отложено', hours: 2.0, points: 20, assignee: 'Максим С.', notes: 'Кот лёг на клавиатуру и нажал "ОК"', date: '2026-11-12' },
        { id: 5, title: 'Изучение 4-го сезона сериала вместо багфикса', category: 'Сериал', status: 'Сделано', hours: 6.0, points: 80, assignee: 'Светлана Р.', notes: 'Закрыла сезон за ночь, баг подождёт до релиза', date: '2026-11-13' },
        { id: 6, title: 'Обед продолжительностью в рабочий спринт', category: 'Обед', status: 'Сделано', hours: 2.5, points: 30, assignee: 'Алексей М.', notes: 'Суп, пицца и философские дебаты о вреде работы', date: '2026-11-13' },
        { id: 7, title: 'Имитация бурной деятельности через автокликер', category: 'Кодинг', status: 'В процессе', hours: 5.0, points: 65, assignee: 'Ирина К.', notes: 'Курсор бегает по экрану, статус в Teams "В сети"', date: '2026-11-14' },
        { id: 8, title: 'Поиск причин перенести релиз на следующий квартал', category: 'Совещание', status: 'Отложено', hours: 1.0, points: 15, assignee: 'Дмитрий В.', notes: 'Ретроградный Меркурий признан блокером', date: '2026-11-14' },
        { id: 9, title: 'Выбор бесшумной клавиатуры для тихого сна', category: 'Сон', status: 'Забыто', hours: 2.0, points: 20, assignee: 'Максим С.', notes: 'Заснул в процессе выбора на маркетплейсе', date: '2026-11-15' },
        { id: 10, title: 'Создание мемов о дедлайнах в рабочий чат', category: 'Сериал', status: 'Сделано', hours: 1.5, points: 25, assignee: 'Светлана Р.', notes: 'Собрали 48 реакций, тимлид оценил', date: '2026-11-15' },
        { id: 11, title: 'Перекладывание бумаг с важным выражением лица', category: 'Другое', status: 'Отложено', hours: 3.5, points: 35, assignee: 'Алексей М.', notes: 'Классический приём выживания в офисе', date: '2026-11-16' },
        { id: 12, title: 'Перерыв на кофе после 10 минут продуктивности', category: 'Обед', status: 'Сделано', hours: 1.0, points: 15, assignee: 'Ирина К.', notes: 'Заслуженная награда за титанические усилия', date: '2026-11-16' },
      ];

      // Reactive stores
      const tasks = ref(JSON.parse(localStorage.getItem('lentyain_hub_tasks') || 'null') || defaultTasks);
      const logs = ref(JSON.parse(localStorage.getItem('lentyain_hub_logs') || 'null') || [
        {
          id: 1,
          action: 'EXCEL_IMPORT',
          title: 'Импортирован реестр задач прокрастинации (Q4-2026)',
          timestamp: '16.11.2026, 10:14',
          author: 'Алексей М. (Архимагистр)',
          before: null,
          after: { totalImported: 12, file: 'tabel_prokrastinacii.xlsx', status: 'SUCCESS' },
        },
      ]);
      const files = ref(JSON.parse(localStorage.getItem('lentyain_hub_files') || 'null') || [
        {
          id: 'f-1',
          name: 'tabel_prokrastinacii_demo.xlsx',
          size: '14.8 КБ',
          date: '16.11.2026, 10:14',
          storage: 'local',
          rows: 12,
        },
      ]);
      const users = ref([
        { name: 'Алексей Медведев', email: 'alex@procrastinate.local', role: 'Архимагистр лени' },
        { name: 'Ирина Ковалёва', email: 'irina@procrastinate.local', role: 'Старший саботажник' },
        { name: 'Дмитрий Волков', email: 'dmitry@procrastinate.local', role: 'Инженер дивана' },
        { name: 'Светлана Романова', email: 'svetlana@procrastinate.local', role: 'Стажёр' },
      ]);

      // Persistence
      watch(tasks, (v) => localStorage.setItem('lentyain_hub_tasks', JSON.stringify(v)), { deep: true });
      watch(logs, (v) => localStorage.setItem('lentyain_hub_logs', JSON.stringify(v)), { deep: true });
      watch(files, (v) => localStorage.setItem('lentyain_hub_files', JSON.stringify(v)), { deep: true });

      // Computed Filtering
      const filteredTasks = computed(() => {
        return tasks.value.filter((t) => {
          const matchQuery = !searchQuery.value ||
            t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            t.assignee.toLowerCase().includes(searchQuery.value.toLowerCase());
          const matchCat = !selectedCategory.value || t.category === selectedCategory.value;
          const matchStatus = !selectedStatus.value || t.status === selectedStatus.value;
          return matchQuery && matchCat && matchStatus;
        });
      });

      // Pagination & Lazy Loaded Tasks
      const totalPages = computed(() => Math.max(1, Math.ceil(filteredTasks.value.length / pageSize.value)));
      const paginatedTasks = computed(() => {
        // If user used lazy load, show up to lazyLimit
        if (lazyLimit.value > pageSize.value) {
          return filteredTasks.value.slice(0, lazyLimit.value);
        }
        const start = (currentPage.value - 1) * pageSize.value;
        return filteredTasks.value.slice(start, start + pageSize.value);
      });

      // Stats
      const stats = computed(() => {
        const totalHours = tasks.value.reduce((acc, t) => acc + (Number(t.hours) || 0), 0);
        const totalPoints = tasks.value.reduce((acc, t) => acc + (Number(t.points) || 0), 0);
        return {
          totalTasks: tasks.value.length,
          savedHours: Math.round(totalHours * 10) / 10,
          totalPoints,
          logCount: logs.value.length,
          totalUsers: users.value.length,
        };
      });

      // Show toast helper
      const showToast = (msg) => {
        if (window.toast) window.toast(msg);
        else console.log('[Toast]', msg);
      };

      // Strict File Validation & Drag-and-Drop
      const handleFileValidation = (file) => {
        if (!file) return false;
        const validExtensions = ['.xlsx', '.xls'];
        const fileName = file.name || '';
        const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExt)) {
          errorModal.isOpen = true;
          errorModal.fileName = fileName;
          errorModal.fileType = file.type || fileExt || 'неизвестный';
          errorModal.reason = 'Платформа принимает исключительно таблицы Microsoft Excel (.xlsx, .xls). Загрузка других форматов заблокирована.';
          return false;
        }
        return true;
      };

      const parseExcelFile = (file) => {
        if (!handleFileValidation(file)) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet);

            if (!rows || rows.length === 0) {
              showToast('Таблица пуста или имеет нестандартный заголовок');
              return;
            }

            const importedTasks = rows.map((r, idx) => ({
              id: Date.now() + idx,
              title: r['Задача'] || r['Title'] || r['title'] || r['Название'] || `Импортированная активность #${idx + 1}`,
              category: r['Категория'] || r['Category'] || 'Другое',
              status: r['Статус'] || r['Status'] || 'Отложено',
              hours: Number(r['Часы'] || r['Hours'] || 2),
              points: Number(r['Баллы'] || r['Points'] || 15),
              assignee: r['Исполнитель'] || r['Assignee'] || 'Алексей М.',
              notes: r['Заметка'] || r['Notes'] || 'Импортировано из файла ' + file.name,
              date: new Date().toISOString().slice(0, 10),
            }));

            // Append tasks
            tasks.value.unshift(...importedTasks);

            // Add File to Virtual Filesystem
            files.value.unshift({
              id: 'file-' + Date.now(),
              name: file.name,
              size: (file.size / 1024).toFixed(1) + ' КБ',
              date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
              storage: 'local',
              rows: importedTasks.length,
            });

            // Add Log Entry
            logs.value.unshift({
              id: Date.now(),
              action: 'EXCEL_IMPORT',
              title: `Импорт файла «${file.name}»`,
              timestamp: new Date().toLocaleString('ru-RU'),
              author: 'Текущий пользователь',
              before: null,
              after: {
                fileName: file.name,
                importedCount: importedTasks.length,
                totalCalculatedHours: importedTasks.reduce((s, x) => s + x.hours, 0),
              },
            });

            showToast(`Успешно импортировано ${importedTasks.length} записей из Excel!`);
            activeTab.value = 'table';
          } catch (err) {
            console.error('Error parsing Excel:', err);
            showToast('Ошибка при чтении Excel: ' + err.message);
          }
        };
        reader.readAsArrayBuffer(file);
      };

      // File input & Drag events
      const onDropFile = (e) => {
        isDragging.value = false;
        const droppedFiles = e.dataTransfer?.files;
        if (droppedFiles && droppedFiles.length > 0) {
          parseExcelFile(droppedFiles[0]);
        }
      };

      const onFileInputChange = (e) => {
        const selected = e.target.files;
        if (selected && selected.length > 0) {
          parseExcelFile(selected[0]);
        }
        e.target.value = '';
      };

      // Download Sample Excel Template
      const downloadSampleTemplate = () => {
        try {
          const sampleData = [
            { 'Задача': 'Игнорировать созвон с проджектом', 'Категория': 'Совещание', 'Статус': 'Отложено', 'Часы': 2.0, 'Баллы': 25, 'Исполнитель': 'Алексей М.', 'Заметка': 'Сказал что завис роутер' },
            { 'Задача': 'Перерыв на дневной сон вместо митинга', 'Категория': 'Сон', 'Статус': 'Сделано', 'Часы': 3.5, 'Баллы': 45, 'Исполнитель': 'Ирина К.', 'Заметка': 'Осознанный отдых высшей пробы' },
            { 'Задача': 'Имитация коммитов старыми ветками', 'Категория': 'Кодинг', 'Статус': 'В процессе', 'Часы': 4.0, 'Баллы': 50, 'Исполнитель': 'Дмитрий В.', 'Заметка': 'График на GitHub зелёный, совесть чиста' },
            { 'Задача': 'Дегустация 3 сортов пиццы в рабочий полдень', 'Категория': 'Обед', 'Статус': 'Сделано', 'Часы': 1.5, 'Баллы': 20, 'Исполнитель': 'Светлана Р.', 'Заметка': 'Важное исследование калорийности' },
            { 'Задача': 'Просмотр документалки о жизни ленивцев', 'Категория': 'Сериал', 'Статус': 'Сделано', 'Часы': 2.5, 'Баллы': 30, 'Исполнитель': 'Максим С.', 'Заметка': 'Повышение квалификации в натуре' },
          ];
          const ws = XLSX.utils.json_to_sheet(sampleData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Отчёт прокрастинации');
          XLSX.writeFile(wb, 'tabel_prokrastinacii_lentyain.xlsx');
          showToast('Шаблон Excel скачан. Перетащите его в дропзону!');
        } catch (err) {
          console.error(err);
          showToast('Ошибка создания шаблона: ' + err.message);
        }
      };

      // Lazy Loading action
      const loadMoreTasks = () => {
        lazyLimit.value += 10;
        showToast(`Ленивая подгрузка: показано ${Math.min(lazyLimit.value, filteredTasks.value.length)} строк`);
      };

      // CRUD Modal Actions
      const openCreateModal = () => {
        dataModal.mode = 'create';
        dataModal.initialData = {
          id: null,
          title: '',
          category: 'Совещание',
          status: 'Отложено',
          hours: 2,
          points: 15,
          assignee: 'Алексей М.',
          notes: '',
        };
        dataModal.isOpen = true;
      };

      const openEditModal = (task) => {
        dataModal.mode = 'edit';
        dataModal.initialData = { ...task };
        dataModal.isOpen = true;
      };

      const handleSaveModal = (taskData) => {
        dataModal.isOpen = false;

        if (dataModal.mode === 'create') {
          const newTask = {
            ...taskData,
            id: Date.now(),
            date: taskData.date || new Date().toISOString().slice(0, 10),
          };
          tasks.value.unshift(newTask);

          // Log creation
          logs.value.unshift({
            id: Date.now(),
            action: 'CREATE',
            title: `Создана задача «${newTask.title}»`,
            timestamp: new Date().toLocaleString('ru-RU'),
            author: 'Алексей М.',
            before: null,
            after: newTask,
          });

          showToast('Запись успешно добавлена в реестр!');
        } else {
          const idx = tasks.value.findIndex((t) => t.id === taskData.id);
          if (idx !== -1) {
            const beforeTask = { ...tasks.value[idx] };
            tasks.value[idx] = { ...taskData };

            // Log update
            logs.value.unshift({
              id: Date.now(),
              action: 'UPDATE',
              title: `Изменена задача «${taskData.title}»`,
              timestamp: new Date().toLocaleString('ru-RU'),
              author: 'Алексей М.',
              before: beforeTask,
              after: { ...taskData },
            });

            showToast('Изменения успешно сохранены!');
          }
        }
      };

      const deleteTask = (taskId) => {
        const task = tasks.value.find((t) => t.id === taskId);
        if (!task) return;
        if (!confirm(`Удалить запись «${task.title}» из реестра?`)) return;

        tasks.value = tasks.value.filter((t) => t.id !== taskId);

        // Log deletion
        logs.value.unshift({
          id: Date.now(),
          action: 'DELETE',
          title: `Удалена запись «${task.title}»`,
          timestamp: new Date().toLocaleString('ru-RU'),
          author: 'Алексей М.',
          before: task,
          after: null,
        });

        showToast('Запись удалена');
      };

      // Diff Inspector
      const viewDiff = (logItem) => {
        diffModal.item = logItem;
        diffModal.isOpen = true;
      };

      // Voyager Admin Actions
      const updateRole = ({ email, role }) => {
        const u = users.value.find((x) => x.email === email);
        if (u) {
          const oldRole = u.role;
          u.role = role;
          logs.value.unshift({
            id: Date.now(),
            action: 'ROLE_CHANGE',
            title: `Смена роли для ${u.name}`,
            timestamp: new Date().toLocaleString('ru-RU'),
            author: 'Администратор Voyager',
            before: { user: u.name, role: oldRole },
            after: { user: u.name, role: role },
          });
          showToast(`Роль для ${u.name} изменена на: ${role}`);
        }
      };

      const deleteFile = (fileId) => {
        const f = files.value.find((x) => x.id === fileId);
        if (!f) return;
        if (!confirm(`Удалить файл «${f.name}» из хранилища?`)) return;

        files.value = files.value.filter((x) => x.id !== fileId);
        logs.value.unshift({
          id: Date.now(),
          action: 'FILE_DELETE',
          title: `Удалён файл «${f.name}»`,
          timestamp: new Date().toLocaleString('ru-RU'),
          author: 'Администратор Voyager',
          before: f,
          after: null,
        });
        showToast('Файл удалён из хранилища');
      };

      const downloadFile = (file) => {
        showToast(`Скачивание файла ${file.name}...`);
        downloadSampleTemplate();
      };

      const syncGoogleDrive = () => {
        const dump = {
          version: '3.4.0',
          exportedAt: new Date().toISOString(),
          tasksCount: tasks.value.length,
          savedHours: stats.value.savedHours,
          tasks: tasks.value,
        };
        files.value.unshift({
          id: 'gdrive-' + Date.now(),
          name: `backup_dump_${new Date().toISOString().slice(0, 10)}.json`,
          size: (JSON.stringify(dump).length / 1024).toFixed(1) + ' КБ',
          date: new Date().toLocaleString('ru-RU'),
          storage: 'gdrive',
          rows: tasks.value.length,
        });
        showToast('Резервный дамп успешно синхронизирован с Google Drive!');
      };

      const downloadDump = () => {
        const dumpData = JSON.stringify({ tasks: tasks.value, logs: logs.value, users: users.value }, null, 2);
        const blob = new Blob([dumpData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lentyain_database_dump_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('JSON-дамп базы данных выгружен');
      };

      // REST API Client
      const testApi = async (method, endpoint) => {
        apiConsole.method = method;
        apiConsole.endpoint = endpoint;
        const start = performance.now();

        await new Promise((r) => setTimeout(r, 60)); // Simulating async network request
        apiConsole.latency = Math.round(performance.now() - start + 25);
        apiConsole.status = 200;

        if (endpoint.includes('/tasks') && method === 'GET') {
          apiConsole.response = JSON.stringify({
            status: 'success',
            version: apiConsole.version,
            total: tasks.value.length,
            page: 1,
            data: tasks.value.slice(0, 3),
          }, null, 2);
        } else if (endpoint.includes('/audit-log')) {
          apiConsole.response = JSON.stringify({
            status: 'success',
            version: apiConsole.version,
            totalLogs: logs.value.length,
            recent: logs.value.slice(0, 2),
          }, null, 2);
        } else if (method === 'POST') {
          apiConsole.status = 201;
          apiConsole.response = JSON.stringify({
            status: 'created',
            version: apiConsole.version,
            message: 'Ресурс успешно создан',
            createdId: Date.now(),
          }, null, 2);
        } else if (method === 'DELETE') {
          apiConsole.response = JSON.stringify({
            status: 'deleted',
            version: apiConsole.version,
            message: 'Ресурс успешно удалён',
          }, null, 2);
        }
      };

      onMounted(() => {
        testApi('GET', '/api/v1/tasks?limit=3');
      });

      return {
        activeTab,
        isDragging,
        searchQuery,
        selectedCategory,
        selectedStatus,
        currentPage,
        pageSize,
        lazyLimit,
        totalPages,
        filteredTasks,
        paginatedTasks,
        tasks,
        logs,
        files,
        users,
        stats,
        errorModal,
        dataModal,
        diffModal,
        apiConsole,
        onDropFile,
        onFileInputChange,
        downloadSampleTemplate,
        loadMoreTasks,
        openCreateModal,
        openEditModal,
        handleSaveModal,
        deleteTask,
        viewDiff,
        updateRole,
        deleteFile,
        downloadFile,
        syncGoogleDrive,
        downloadDump,
        testApi,
      };
    },
  });

  app.mount('#vue-hub-root');
})();
