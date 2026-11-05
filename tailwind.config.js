const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: ['./*.html', './js/**/*.js', './src/**/*.css', './components/**/*.vue', './src/components/**/*.vue'],
  safelist: [{ pattern: /^(btn|badge|alert)-/ }],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F0F8', 100: '#E5DEF0', 200: '#CFC3E4',
          300: '#B4A2D4', 400: '#866DCB',
          500: '#5C43C4', 600: '#4A34A8', 700: '#3A278A', 800: '#2A1C68', 900: '#1E182A',
        },
        gold: { DEFAULT: '#FFCA43', dark: '#D49B1C', pale: '#FFF3D6' },
        ink: { DEFAULT: '#201B2C', soft: '#5E5873' },
        success: '#2E8B57',
        warning: '#D97724',
        danger: '#C2415A',
        info: '#25858B',
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        sans: ['"Golos Text"', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: { 'fade-up': 'fade-up .7s ease-out both' },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    plugin(({ addUtilities, matchUtilities, theme }) => {
      addUtilities({
        '.scrollbar-thin': { 'scrollbar-width': 'thin', 'scrollbar-color': '#CFC3E4 transparent' },
        '.glass': {
          'background-color': 'rgb(255 255 255 / 0.08)',
          'backdrop-filter': 'blur(12px)',
          border: '1px solid rgb(255 255 255 / 0.18)',
        },
      });
      matchUtilities(
        { 'animation-delay': (v) => ({ 'animation-delay': v }) },
        { values: theme('transitionDelay') }
      );
    }),
  ],
};
