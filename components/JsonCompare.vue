<template>
  <div class="space-y-3 font-mono text-xs">
    <div class="flex items-center justify-between text-xs">
      <span class="font-semibold font-sans text-ink dark:text-white">Сравнение параметров записи</span>
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1 text-[11px] text-danger font-sans">
          <span class="h-2 w-2 rounded-full bg-danger"></span> До изменения
        </span>
        <span class="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-sans">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span> После изменения
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- Before Box -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-3 overflow-x-auto">
        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-2 font-sans">
          Предыдущая версия
        </div>
        <div v-if="!before" class="text-slate-400 italic font-sans text-xs">
          (Новая запись, предыдущие данные отсутствуют)
        </div>
        <div v-else class="space-y-1">
          <div
            v-for="(val, key) in before"
            :key="'before-' + key"
            class="flex items-start gap-2 py-0.5"
            :class="{ 'bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded px-1': isFieldChanged(key) }"
          >
            <span class="text-slate-500 select-none">"{{ key }}":</span>
            <span class="font-bold">{{ formatValue(val) }}</span>
          </div>
        </div>
      </div>

      <!-- After Box -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-3 overflow-x-auto">
        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-2 font-sans">
          Текущая версия
        </div>
        <div v-if="!after" class="text-slate-400 italic font-sans text-xs">
          (Запись удалена из реестра)
        </div>
        <div v-else class="space-y-1">
          <div
            v-for="(val, key) in after"
            :key="'after-' + key"
            class="flex items-start gap-2 py-0.5"
            :class="{ 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded px-1': isFieldChanged(key) }"
          >
            <span class="text-slate-500 select-none">"{{ key }}":</span>
            <span class="font-bold">{{ formatValue(val) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  before: {
    type: Object,
    default: null,
  },
  after: {
    type: Object,
    default: null,
  },
});

const isFieldChanged = (key) => {
  if (!props.before || !props.after) return false;
  return JSON.stringify(props.before[key]) !== JSON.stringify(props.after[key]);
};

const formatValue = (v) => {
  if (v === null) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  return String(v);
};
</script>
