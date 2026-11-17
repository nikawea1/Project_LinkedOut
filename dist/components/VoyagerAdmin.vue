<template>
  <div class="space-y-6">
    <!-- Top Voyager Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-brand-900 text-white shadow-lg">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-brand-950 font-display font-bold">
          V
        </div>
        <div>
          <h2 class="font-display text-base sm:text-lg font-bold text-white">Voyager Administration Control Panel</h2>
          <p class="text-xs text-brand-200">Центр управления доступом, ролями и файловыми дампами платформы</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge bg-white/10 text-gold text-xs font-mono">v3.4.0-voyager</span>
        <button
          type="button"
          @click="$emit('sync-google-drive')"
          class="btn btn-primary btn-sm text-xs"
        >
          Дамп на Google Drive
        </button>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="card p-4 space-y-1">
        <span class="text-xs text-ink-muted">Всего пользователей</span>
        <div class="font-display text-xl sm:text-2xl font-bold text-ink dark:text-white">{{ stats.totalUsers }}</div>
        <div class="text-[11px] text-emerald-600 font-semibold">+100% стабильности</div>
      </div>
      <div class="card p-4 space-y-1">
        <span class="text-xs text-ink-muted">Сохранено часов</span>
        <div class="font-display text-xl sm:text-2xl font-bold text-brand-500 dark:text-gold">{{ stats.savedHours }} ч</div>
        <div class="text-[11px] text-ink-muted">Вне корпоративного стресса</div>
      </div>
      <div class="card p-4 space-y-1">
        <span class="text-xs text-ink-muted">Загружено файлов</span>
        <div class="font-display text-xl sm:text-2xl font-bold text-ink dark:text-white">{{ files.length }}</div>
        <div class="text-[11px] text-brand-500">Local + Cloud Sync</div>
      </div>
      <div class="card p-4 space-y-1">
        <span class="text-xs text-ink-muted">Записей в аудите</span>
        <div class="font-display text-xl sm:text-2xl font-bold text-ink dark:text-white">{{ stats.logCount }}</div>
        <div class="text-[11px] text-emerald-600">Все действия фиксируются</div>
      </div>
    </div>

    <!-- Two-column Layout: Roles & Files -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Role Management Table -->
      <div class="card space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 class="font-display text-sm sm:text-base font-bold text-ink dark:text-white">Управление ролями пользователей</h3>
            <p class="muted text-xs">Назначение привилегий и уровней саботажа</p>
          </div>
          <span class="badge badge-brand">{{ users.length }} профилей</span>
        </div>

        <div class="overflow-x-auto">
          <table class="table-clean text-xs">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Текущая роль</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.email">
                <td class="font-semibold text-ink dark:text-white">
                  <div>{{ u.name }}</div>
                  <div class="text-[10px] text-slate-400 font-mono">{{ u.email }}</div>
                </td>
                <td>
                  <span class="badge" :class="getRoleBadgeClass(u.role)">{{ u.role }}</span>
                </td>
                <td>
                  <select
                    :value="u.role"
                    @change="$emit('update-role', { email: u.email, role: $event.target.value })"
                    class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-ink dark:text-white cursor-pointer"
                  >
                    <option value="Архимагистр лени">Архимагистр лени</option>
                    <option value="Старший саботажник">Старший саботажник</option>
                    <option value="Инженер дивана">Инженер дивана</option>
                    <option value="Стажёр">Стажёр</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- File Storage Management (Local + Google Drive) -->
      <div class="card space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 class="font-display text-sm sm:text-base font-bold text-ink dark:text-white">Хранилище файлов и дампов</h3>
            <p class="muted text-xs">Локальное хранилище браузера и облако Google Drive</p>
          </div>
          <button
            type="button"
            @click="$emit('download-dump')"
            class="text-xs text-brand-500 dark:text-gold hover:underline font-semibold"
          >
            Экспорт JSON-дампа
          </button>
        </div>

        <div v-if="files.length === 0" class="p-6 text-center text-xs text-slate-400 italic">
          Файлы пока не загружены. Перетащите Excel-файл во вкладке импорта.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="file in files"
            :key="file.id"
            class="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs"
          >
            <div class="min-w-0 pr-2">
              <div class="flex items-center gap-1.5 font-semibold text-ink dark:text-white truncate">
                <svg class="h-4 w-4 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span class="truncate">{{ file.name }}</span>
              </div>
              <div class="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{{ file.size }}</span>
                <span>•</span>
                <span>{{ file.date }}</span>
                <span>•</span>
                <span class="text-brand-500 dark:text-gold">{{ file.storage === 'gdrive' ? 'Google Drive' : 'Local Storage' }}</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                @click="$emit('download-file', file)"
                class="icon-btn h-7 w-7 text-xs"
                title="Скачать файл"
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button
                type="button"
                @click="$emit('delete-file', file.id)"
                class="icon-btn h-7 w-7 text-danger hover:bg-danger/10 text-xs"
                title="Удалить из хранилища"
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  files: {
    type: Array,
    default: () => [],
  },
  stats: {
    type: Object,
    default: () => ({
      totalUsers: 3,
      savedHours: 420,
      logCount: 12,
    }),
  },
});

const emit = defineEmits([
  'update-role',
  'delete-file',
  'download-file',
  'sync-google-drive',
  'download-dump',
]);

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'Архимагистр лени':
      return 'badge-gold';
    case 'Старший саботажник':
      return 'badge-brand';
    case 'Инженер дивана':
      return 'badge-success';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};
</script>
