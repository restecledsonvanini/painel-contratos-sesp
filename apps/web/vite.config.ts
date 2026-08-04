import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      react: path.resolve(rootDir, 'node_modules/react'),
      'react-dom': path.resolve(rootDir, 'node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(rootDir, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(rootDir, 'node_modules/react/jsx-dev-runtime.js'),
      '@painel/schema': path.resolve(rootDir, '../../packages/schema/src/index.ts'),
      '@painel/domain': path.resolve(rootDir, '../../packages/domain/src/index.ts'),
      'date-fns': path.resolve(rootDir, '../../node_modules/date-fns'),
      sonner: path.resolve(rootDir, '../../node_modules/sonner'),
      cmdk: path.resolve(rootDir, '../../node_modules/cmdk'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
      },
      '/.netlify/functions/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
