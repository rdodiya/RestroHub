import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'site-url-default',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) =>
          html.replaceAll(
            '%VITE_SITE_URL%',
            (
              process.env.VITE_SITE_URL ||
              loadEnv(mode, process.cwd(), '').VITE_SITE_URL ||
              'http://localhost:3000'
            ).replace(/\/+$/, '')
          ),
      },
    },
  ],
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@data': path.resolve(__dirname, './src/data'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
}));
