#!/usr/bin/env node
/**
 * Bootstrap completo do monorepo (Windows + Codespaces).
 *
 * Orquestra:
 *   1. .env a partir de .env.example
 *   2. npm ci / npm install
 *   3. scripts/db-bootstrap.mjs  (Docker → migrate → seed)
 *
 * Uso:
 *   npm run bootstrap
 *   npm run bootstrap -- --force-seed
 *
 * Depois, no dia a dia:
 *   npm run dev
 *
 * Este projeto usa npm workspaces (não pnpm).
 */
import { copyFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dbBootstrap = path.join(root, 'scripts/db-bootstrap.mjs');

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    stdio: 'inherit',
    cwd: root,
    shell: process.platform === 'win32',
    ...opts,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

function ensureEnv() {
  const envPath = path.join(root, '.env');
  const examplePath = path.join(root, '.env.example');
  if (!existsSync(envPath) && existsSync(examplePath)) {
    copyFileSync(examplePath, envPath);
    console.log('✓ .env criado a partir de .env.example');
    return;
  }
  if (existsSync(envPath)) {
    console.log('✓ .env já existe');
    return;
  }
  console.warn('⚠ .env.example não encontrado; usando defaults');
}

function installDeps() {
  const hasLockfile = existsSync(path.join(root, 'package-lock.json'));
  console.log(hasLockfile ? '\n→ npm ci' : '\n→ npm install');
  run('npm', [hasLockfile ? 'ci' : 'install']);
}

function printHelp() {
  console.log(`Uso:
  npm run bootstrap              # .env + install + banco (seed forçado)
  npm run bootstrap -- --force-seed

Depois:
  npm run dev

Só o banco (sem reinstall):
  npm run db:bootstrap

Codespaces: docs/CODESPACES.md
`);
}

function main() {
  const extra = process.argv.slice(2);
  if (extra.includes('--help') || extra.includes('-h')) {
    printHelp();
    return;
  }

  // Bootstrap completo sempre força seed na 1ª inicialização / reexecução.
  // Para só migrar sem reseedar: npm run db:bootstrap
  const dbArgs = ['--force-seed'];

  console.log('→ painel-contratos-sesp bootstrap\n');
  console.log('  (1) .env  (2) dependências  (3) Postgres + migrate + seed\n');

  ensureEnv();
  installDeps();

  console.log('\n→ Banco (db-bootstrap)');
  run('node', [dbBootstrap, ...dbArgs]);

  console.log('\n✓ Bootstrap concluído.');
  console.log('\nPróximo passo (só isso no dia a dia):\n  npm run dev\n');
  console.log('URLs: web http://localhost:5173 · API http://localhost:8888');
  console.log('Login demo: admin@sesp.pr.gov.br / admin123 (AUTH off por padrão)\n');
  console.log('Codespaces: veja docs/CODESPACES.md\n');
}

main();
