#!/usr/bin/env node
/**
 * Setup inicial cross-platform (Windows + Linux/Codespaces).
 * Uso: npm run setup
 */
import { copyFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const composeFile = path.join(root, 'apps/docker/docker-compose.postgres.yml');
const defaultDbUrl = 'postgresql://painel:pass@localhost:5434/painel_db';

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

function dockerCompose(args) {
  run('docker', ['compose', '-f', composeFile, ...args]);
}

async function waitForDb(url, attempts = 45) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const client = new pg.Client({ connectionString: url });
      await client.connect();
      await client.end();
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error(`Postgres não respondeu em ${attempts}s (${url})`);
}

async function main() {
  const envPath = path.join(root, '.env');
  const examplePath = path.join(root, '.env.example');

  console.log('→ painel-contratos-sesp setup\n');

  if (!existsSync(envPath) && existsSync(examplePath)) {
    copyFileSync(examplePath, envPath);
    console.log('✓ .env criado a partir de .env.example');
  } else if (existsSync(envPath)) {
    console.log('✓ .env já existe');
  } else {
    console.warn('⚠ .env.example não encontrado; usando defaults');
  }

  // npm ci garante a mesma árvore em Windows e Codespaces; sem lockfile não há
  // o que reproduzir e caímos no install normal.
  const hasLockfile = existsSync(path.join(root, 'package-lock.json'));
  console.log(hasLockfile ? '\n→ npm ci' : '\n→ npm install');
  run('npm', [hasLockfile ? 'ci' : 'install']);

  console.log('\n→ Postgres (Docker Compose)');
  dockerCompose(['up', '-d', '--build']);

  const dbUrl = process.env.DATABASE_URL || defaultDbUrl;
  process.env.DATABASE_URL = dbUrl;
  console.log(`\n→ Aguardando Postgres (${dbUrl})…`);
  await waitForDb(dbUrl);

  console.log('\n→ Prisma generate + migrate + seed');
  run('npm', ['run', 'db:generate'], { env: { ...process.env, DATABASE_URL: dbUrl } });
  run('npm', ['run', 'db:migrate:deploy'], { env: { ...process.env, DATABASE_URL: dbUrl } });
  run('npm', ['run', 'db:seed'], { env: { ...process.env, DATABASE_URL: dbUrl } });

  console.log('\n✓ Setup concluído.');
  console.log('\nPróximo passo:\n  npm run dev\n');
  console.log('URLs: web http://localhost:5173 · API http://localhost:8888');
  console.log('Login demo: admin@sesp.pr.gov.br / admin123 (AUTH off por padrão)\n');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
