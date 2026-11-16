import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // При развёртывании на Cloudflare Pages (*.pages.dev) base остаётся '/'
  // При развёртывании на GitHub Pages (username.github.io/repo) можно указать '/repo-name/'
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: './index.html',
        feed: './feed.html',
        shop: './shop.html',
        board: './board.html',
        messenger: './messenger.html',
        dashboard: './dashboard.html',
        checkout: './checkout.html',
        register: './register.html',
        login: './login.html',
        dataHub: './data-hub.html',
        designSystem: './design-system.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
