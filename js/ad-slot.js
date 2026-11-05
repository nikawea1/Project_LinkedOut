
(() => {
  const PRESET_CLASSES = {
    banner: 'w-full min-h-[90px] sm:min-h-[110px] my-4',
    feed: 'w-full min-h-[130px] sm:min-h-[150px] my-3 shadow-sm',
    sidebar: 'w-full min-h-[220px] sm:min-h-[250px]',
    custom: ''
  };

  const getAdSlotHtml = ({
    preset = 'sidebar',
    width = '',
    height = '',
    label = 'Рекламное место',
    sublabel = 'Здесь могла быть ваша реклама товаров для отдыха',
    badgeText = 'Реклама',
    closable = true
  } = {}) => {
    const presetCls = PRESET_CLASSES[preset] || PRESET_CLASSES.sidebar;
    const styleAttr = (width || height) ? `style="${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}"` : '';

    return `
      <div class="ad-slot-container relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition-all duration-200 hover:border-brand-400 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-500 ${presetCls}" ${styleAttr} role="complementary" aria-label="Рекламный блок">
        <!-- Бейдж «Реклама» -->
        <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 backdrop-blur-sm dark:bg-slate-700 dark:text-slate-300">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          ${badgeText}
        </span>

        ${closable ? `
          <!-- Кнопка скрытия рекламы -->
          <button type="button" data-ad-close class="absolute right-3 top-3 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200" title="Скрыть рекламу (лень смотреть)">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ` : ''}

        <div class="flex flex-col items-center justify-center space-y-1.5 py-2">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200/70 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <p class="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
            ${label}
          </p>
          ${sublabel ? `
            <p class="text-[11px] text-slate-400 dark:text-slate-400 max-w-xs">
              ${sublabel}
            </p>
          ` : ''}
        </div>
      </div>
    `;
  };

  if (typeof customElements !== 'undefined' && !customElements.get('ad-slot')) {
    class AdSlotElement extends HTMLElement {
      connectedCallback() {
        const preset = this.getAttribute('preset') || 'sidebar';
        const width = this.getAttribute('width') || '';
        const height = this.getAttribute('height') || '';
        const label = this.getAttribute('label') || 'Рекламное место';
        const sublabel = this.getAttribute('sublabel') || 'Здесь могла быть ваша реклама товаров для отдыха';
        const badgeText = this.getAttribute('badge') || 'Реклама';
        const closable = this.getAttribute('closable') !== 'false';

        this.innerHTML = getAdSlotHtml({ preset, width, height, label, sublabel, badgeText, closable });

        const closeBtn = this.querySelector('[data-ad-close]');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            this.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            this.style.opacity = '0';
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.remove(); }, 200);
          });
        }
      }
    }
    customElements.define('ad-slot', AdSlotElement);
  }

  const initAdSlots = () => {
    document.querySelectorAll('[data-ad-slot]').forEach((el) => {
      if (el.dataset.initialized) return;
      el.dataset.initialized = 'true';
      const preset = el.dataset.adSlot || 'sidebar';
      const label = el.dataset.label || 'Рекламное место';
      const sublabel = el.dataset.sublabel || 'Здесь могла быть ваша реклама товаров для отдыха';
      const width = el.dataset.width || '';
      const height = el.dataset.height || '';
      el.innerHTML = getAdSlotHtml({ preset, label, sublabel, width, height });

      const closeBtn = el.querySelector('[data-ad-close]');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          el.style.opacity = '0';
          el.style.transform = 'scale(0.95)';
          setTimeout(() => { el.remove(); }, 200);
        });
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdSlots);
  } else {
    initAdSlots();
  }

  window.renderAdSlot = getAdSlotHtml;
})();
