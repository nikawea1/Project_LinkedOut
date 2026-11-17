<template>
  <div class="space-y-4">
    <!-- Dropzone Area -->
    <div
      class="dropzone cursor-pointer"
      :class="{ 'dropzone-active': isDragging }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
      role="button"
      tabindex="0"
      aria-label="Загрузить Excel файл реестра прокрастинации"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        class="hidden"
        @change="onFileSelected"
      />
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-slate-800 dark:text-gold mb-3 border border-slate-200 dark:border-slate-700">
        <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>

      <p class="font-display text-sm sm:text-base font-bold text-ink dark:text-white">
        Перетащите сюда файл табеля (.xlsx, .xls)
      </p>
      <p class="muted mt-1 max-w-sm text-xs sm:text-sm">
        или нажмите для выбора файла на устройстве. Система автоматически считает задачи и сохранит часы отдыха в реестр.
      </p>

      <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span class="badge badge-brand">.xlsx</span>
        <span class="badge badge-brand">.xls</span>
        <span class="badge badge-gold">Автоматический расчёт</span>
      </div>
    </div>

    <!-- Download Sample Template Button -->
    <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60">
      <div class="text-xs sm:text-sm">
        <span class="font-semibold text-ink dark:text-white">Нет готового файла?</span>
        <span class="muted block text-[11px] sm:text-xs">Скачайте сгенерированный демо-шаблон с реальными задачами.</span>
      </div>
      <button
        type="button"
        @click.stop="$emit('download-sample')"
        class="btn btn-outline btn-sm text-xs"
      >
        Скачать образец .xlsx
      </button>
    </div>

    <!-- Error Modal (Строгая валидация формата не-Excel) -->
    <teleport to="body">
      <dialog
        v-if="showErrorModal"
        class="modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        open
      >
        <div class="card max-w-md w-full space-y-4 border border-danger/30 shadow-2xl">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 class="font-display text-base font-bold text-ink dark:text-white">Ошибка формата файла</h3>
              <p class="muted text-xs">Пожалуйста, выберите файл в формате электронной таблицы (.xlsx или .xls).</p>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
            <div class="flex justify-between">
              <span class="text-slate-500">Загруженный файл:</span>
              <span class="font-mono font-bold text-danger truncate max-w-[200px]">{{ rejectedFileName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Обнаруженный тип:</span>
              <span class="font-mono text-slate-700 dark:text-slate-300">{{ rejectedFileType || 'Неизвестный двоичный' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Допустимые форматы:</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400">.XLSX, .XLS</span>
            </div>
          </div>

          <p class="text-xs text-ink-soft dark:text-slate-400 leading-relaxed">
            Пожалуйста, сохраните файл в формате <b>электронной таблицы (.xlsx или .xls)</b> и повторите попытку.
          </p>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              @click="closeErrorModal"
            >
              Понятно, выберу Excel
            </button>
          </div>
        </div>
      </dialog>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['file-parsed', 'download-sample', 'error']);

const fileInputRef = ref(null);
const isDragging = ref(false);
const showErrorModal = ref(false);
const rejectedFileName = ref('');
const rejectedFileType = ref('');

const onDragOver = () => { isDragging.value = true; };
const onDragLeave = () => { isDragging.value = false; };

const triggerFileInput = () => {
  if (fileInputRef.value) fileInputRef.value.click();
};

const validateAndProcessFile = (file) => {
  if (!file) return;

  const validExtensions = ['.xlsx', '.xls'];
  const fileName = file.name || '';
  const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  const validMimes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/octet-stream',
  ];

  const isValidExt = validExtensions.includes(fileExt);

  if (!isValidExt) {
    rejectedFileName.value = fileName;
    rejectedFileType.value = file.type || fileExt;
    showErrorModal.value = true;
    emit('error', { file, reason: 'Invalid format' });
    return;
  }

  // File is valid Excel
  emit('file-parsed', file);
};

const onDrop = (e) => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    validateAndProcessFile(files[0]);
  }
};

const onFileSelected = (e) => {
  const files = e.target?.files;
  if (files && files.length > 0) {
    validateAndProcessFile(files[0]);
  }
  // reset input
  if (e.target) e.target.value = '';
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};
</script>
