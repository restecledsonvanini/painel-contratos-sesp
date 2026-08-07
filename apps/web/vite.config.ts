import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = path.resolve(rootDir, '../..');
const reactPkg = path.resolve(repoRoot, 'node_modules/react');
const reactDomPkg = path.resolve(repoRoot, 'node_modules/react-dom');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: reactPkg,
      'react-dom': reactDomPkg,
      'react/jsx-runtime': path.resolve(reactPkg, 'jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(reactPkg, 'jsx-dev-runtime.js'),
      '@painel/schema': path.resolve(repoRoot, 'packages/schema/src/index.ts'),
      '@painel/domain': path.resolve(repoRoot, 'packages/domain/src/index.ts'),
      'date-fns': path.resolve(repoRoot, 'node_modules/date-fns'),
      sonner: path.resolve(repoRoot, 'node_modules/sonner'),
      cmdk: path.resolve(repoRoot, 'node_modules/cmdk'),
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
