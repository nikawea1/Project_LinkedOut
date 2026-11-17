const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./*.html', './js/**/*.js', './src/**/*.{vue,js,ts,jsx,tsx}', './components/**/*.vue'],
  safelist: [{ pattern: /^(btn|badge|alert)-/ }],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#818CF8',
          500: '#4338CA',
          600: '#3730A3',
          700: '#312E81',
          800: '#1E1B4B',
          900: '#0B0F19',
          950: '#070A12',
        },
        gold: {
          DEFAULT: '#D99B0D',
          hover: '#C58B0A',
          dark: '#A67305',
          pale: '#FEF3C7',
          subtle: 'rgba(217, 155, 13, 0.08)',
        },
        ink: {
          DEFAULT: '#0F172A',
          soft: '#475569',
          muted: '#64748B',
        },
        success: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#0EA5E9',
          dark: '#0284C7',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['"Golos Text"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: { 'fade-up': 'fade-up .5s cubic-bezier(0.16, 1, 0.3, 1) both' },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    plugin(({ addUtilities, matchUtilities, theme }) => {
      addUtilities({
        '.scrollbar-thin': { 'scrollbar-width': 'thin', 'scrollbar-color': '#CBD5E1 transparent' },
        '.glass': {
          'background-color': 'rgba(15, 23, 42, 0.65)',
          'backdrop-filter': 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.glass-light': {
          'background-color': 'rgba(255, 255, 255, 0.85)',
          'backdrop-filter': 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        },
      });
      matchUtilities(
        { 'animation-delay': (v) => ({ 'animation-delay': v }) },
        { values: theme('transitionDelay') }
      );
    }),
  ],
};
