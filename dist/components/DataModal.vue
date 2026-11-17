<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="mode === 'create' ? 'modal-create-title' : 'modal-edit-title'"
    >
      <div class="card w-full max-w-lg space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-up">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3
              :id="mode === 'create' ? 'modal-create-title' : 'modal-edit-title'"
              class="font-display text-base sm:text-lg font-bold text-ink dark:text-white"
            >
              {{ mode === 'create' ? 'Новая запись в реестр' : 'Редактирование записи' }}
            </h3>
            <p class="muted text-xs">
              {{ mode === 'create' ? 'Внесите отложенную задачу для учёта сохранённых нервов' : 'Обновите параметры отложенной активности' }}
            </p>
          </div>
          <button
            type="button"
            class="icon-btn h-8 w-8"
            @click="handleClose"
            aria-label="Закрыть модальное окно"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="handleSubmit" class="space-y-3.5 text-xs sm:text-sm">
          <div class="field">
            <label class="label" for="task-title">Название задачи / активности *</label>
            <input
              id="task-title"
              v-model="form.title"
              type="text"
              required
              class="input text-xs sm:text-sm"
              placeholder="Например: Проигнорировать созвон в 9:00"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="field">
              <label class="label" for="task-category">Категория</label>
              <select
                id="task-category"
                v-model="form.category"
                class="input text-xs sm:text-sm cursor-pointer"
              >
                <option value="Совещание">Совещание</option>
                <option value="Кодинг">Кодинг</option>
                <option value="Сон">Сон на диване</option>
                <option value="Сериал">Сериал</option>
                <option value="Обед">Обед / Перекус</option>
                <option value="Другое">Другое</option>
              </select>
            </div>

            <div class="field">
              <label class="label" for="task-status">Статус</label>
              <select
                id="task-status"
                v-model="form.status"
                class="input text-xs sm:text-sm cursor-pointer"
              >
                <option value="Отложено">Отложено</option>
                <option value="В процессе">В процессе лени</option>
                <option value="Забыто">Благополучно забыто</option>
                <option value="Сделано">Сделано в спешке</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="field">
              <label class="label" for="task-hours">Часов лени</label>
              <input
                id="task-hours"
                v-model.number="form.hours"
                type="number"
                min="0.5"
                step="0.5"
                max="100"
                required
                class="input text-xs sm:text-sm font-mono"
              />
            </div>

            <div class="field">
              <label class="label" for="task-points">Баллы лени</label>
              <input
                id="task-points"
                v-model.number="form.points"
                type="number"
                min="0"
                step="5"
                required
                class="input text-xs sm:text-sm font-mono"
              />
            </div>

            <div class="field">
              <label class="label" for="task-assignee">Ответственный</label>
              <input
                id="task-assignee"
                v-model="form.assignee"
                type="text"
                class="input text-xs sm:text-sm"
                placeholder="Имя"
              />
            </div>
          </div>

          <div class="field">
            <label class="label" for="task-notes">Заметка / Отговорка для руководства</label>
            <textarea
              id="task-notes"
              v-model="form.notes"
              rows="2"
              class="input text-xs sm:text-sm"
              placeholder="«Проблема на стороне провайдера, пакеты не идут...»"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              class="btn btn-outline btn-sm"
              @click="handleClose"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-sm"
            >
              {{ mode === 'create' ? 'Добавить в реестр' : 'Сохранить изменения' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'create', // 'create' or 'edit'
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'save']);

const form = reactive({
  id: null,
  title: '',
  category: 'Совещание',
  status: 'Отложено',
  hours: 2,
  points: 15,
  assignee: 'Алексей М.',
  notes: '',
  date: '',
});

watch(
  () => props.initialData,
  (val) => {
    if (val && Object.keys(val).length > 0) {
      form.id = val.id || null;
      form.title = val.title || '';
      form.category = val.category || 'Совещание';
      form.status = val.status || 'Отложено';
      form.hours = val.hours ?? 2;
      form.points = val.points ?? 15;
      form.assignee = val.assignee || 'Алексей М.';
      form.notes = val.notes || '';
      form.date = val.date || new Date().toISOString().slice(0, 10);
    } else {
      form.id = null;
      form.title = '';
      form.category = 'Совещание';
      form.status = 'Отложено';
      form.hours = 2;
      form.points = 15;
      form.assignee = 'Алексей М.';
      form.notes = '';
      form.date = new Date().toISOString().slice(0, 10);
    }
  },
  { immediate: true }
);

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  emit('save', { ...form });
};
</script>
