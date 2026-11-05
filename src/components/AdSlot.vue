<template>
  <div
    v-if="!dismissed"
    class="ad-slot-container relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition-all duration-200 hover:border-brand-400 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-500"
    :class="presetClasses"
    :style="customStyles"
    role="complementary"
    aria-label="Рекламный блок"
  >
    
    <span
      class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 backdrop-blur-sm dark:bg-slate-700 dark:text-slate-300"
    >
      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {{ badgeText }}
    </span>

    
    <button
      v-if="closable"
      type="button"
      class="absolute right-3 top-3 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
      :title="'Скрыть рекламу'"
      @click="dismissed = true"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    
    <slot>
      <div class="flex flex-col items-center justify-center space-y-1.5 py-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200/70 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <p class="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
          {{ label }}
        </p>
        <p v-if="sublabel" class="text-[11px] text-slate-400 dark:text-slate-400 max-w-xs">
          {{ sublabel }}
        </p>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  preset: {
    type: String,
    default: 'sidebar',
    validator: (v) => ['sidebar', 'banner', 'feed', 'custom'].includes(v)
  },
  label: {
    type: String,
    default: 'Рекламное место'
  },
  sublabel: {
    type: String,
    default: 'Здесь могла быть ваша реклама товаров для отдыха'
  },
  badgeText: {
    type: String,
    default: 'Реклама'
  },
  closable: {
    type: Boolean,
    default: true
  }
});

const dismissed = ref(false);

const presetClasses = computed(() => {
  switch (props.preset) {
    case 'banner':
      return 'w-full min-h-[90px] sm:min-h-[110px] my-4';
    case 'feed':
      return 'w-full min-h-[130px] sm:min-h-[150px] my-3 shadow-sm';
    case 'sidebar':
      return 'w-full min-h-[220px] sm:min-h-[250px]';
    case 'custom':
    default:
      return '';
  }
});

const customStyles = computed(() => {
  const styles = {};
  if (props.width) styles.width = props.width;
  if (props.height) styles.height = props.height;
  return styles;
});
</script>

<style scoped>
.ad-slot-container {
  min-width: 0;
}
</style>
