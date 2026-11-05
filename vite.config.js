import { defineConfig } from 'vite';

export default defineConfig({
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
        designSystem: './design-system.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
