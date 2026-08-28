import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = path.resolve(rootDir, '../..');
const reactPkg = path.resolve(repoRoot, 'node_modules/react');
const reactDomPkg = path.resolve(repoRoot, 'node_modules/react-dom');

/**
 * Codespaces serve o dev server atrás de um proxy HTTPS em *.app.github.dev.
 * Sem liberar o host, o Vite responde "Blocked request" (proteção contra DNS
 * rebinding); sem clientPort 443, o socket de HMR tenta a porta 5173 e falha.
 * Em Windows/local nada disso se aplica e os defaults do Vite valem.
 */
const isCodespaces = process.env.CODESPACES === 'true';
const forwardingDomain =
  process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';
const devApiPort = Number(process.env.PW_API_PORT || process.env.API_PORT || 8888);
const devApiOrigin = `http://localhost:${devApiPort}`;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: reactPkg,
      'react-dom': reactDomPkg,
      'react/jsx-runtime': path.resolve(reactPkg, 'jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(reactPkg, 'jsx-dev-runtime.js'),
      '@painel/ui': path.resolve(repoRoot, 'packages/ui/src/index.ts'),
      '@painel/schema': path.resolve(repoRoot, 'packages/schema/src/index.ts'),
      '@painel/domain': path.resolve(repoRoot, 'packages/domain/src/index.ts'),
      'date-fns': path.resolve(repoRoot, 'node_modules/date-fns'),
      sonner: path.resolve(repoRoot, 'node_modules/sonner'),
      cmdk: path.resolve(repoRoot, 'node_modules/cmdk'),
    },
  },
  server: {
    port: 5173,
    host: isCodespaces,
    watch: {
      ignored: ['**/playwright-report/**', '**/test-results/**', '**/playwright/.cache/**'],
    },
    allowedHosts: isCodespaces ? [`.${forwardingDomain}`] : undefined,
    hmr: isCodespaces ? { clientPort: 443, protocol: 'wss' } : undefined,
    fs: { allow: [repoRoot] },
    proxy: {
      '/api/v1': {
        target: devApiOrigin,
        changeOrigin: true,
        secure: false,
      },
      '/.netlify/functions/api': {
        target: devApiOrigin,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
