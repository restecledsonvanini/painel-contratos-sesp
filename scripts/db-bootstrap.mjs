#!/usr/bin/env node
/**
 * Garante Postgres pronto + schema + seed.
 * Uso: npm run db:bootstrap
 *
 * Codespaces: postStart só fazia `db:up` — container sobe, mas volume vazio
 * (sem migrate/seed) se o postCreate falhou ou expirou. Este script fecha o buraco.
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

async function waitForDocker(attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    const r = spawnSync('docker', ['info'], {
      cwd: root,
      shell: process.platform === 'win32',
      stdio: 'ignore',
    });
    if (r.status === 0) return;
    await new Promise((res) => setTimeout(res, 1000));
  }
  throw new Error('Docker não respondeu. No Codespaces: Rebuild Container e confira Docker-in-Docker.');
}

async function waitForDb(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    const client = new pg.Client({ connectionString: url });
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      return;
    } catch {
      try {
        await client.end();
      } catch {
        /* ignore */
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error(`Postgres não respondeu em ${attempts}s (${url})`);
}

async function schemaReady(url) {
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    const r = await client.query(
      `SELECT COUNT(*)::int AS n FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'Usuario'`,
    );
    return r.rows[0]?.n === 1;
  } catch {
    return false;
  } finally {
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}

async function hasDemoUsers(url) {
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    const r = await client.query(`SELECT COUNT(*)::int AS n FROM "Usuario"`);
    return (r.rows[0]?.n ?? 0) > 0;
  } catch {
    return false;
  } finally {
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}

function ensureEnv() {
  const envPath = path.join(root, '.env');
  const examplePath = path.join(root, '.env.example');
  if (!existsSync(envPath) && existsSync(examplePath)) {
    copyFileSync(examplePath, envPath);
    console.log('✓ .env criado a partir de .env.example');
  }
}

async function main() {
  const forceSeed = process.argv.includes('--force-seed');
  const dbUrl = process.env.DATABASE_URL || defaultDbUrl;
  process.env.DATABASE_URL = dbUrl;

  console.log('→ db:bootstrap\n');
  ensureEnv();

  console.log('→ Aguardando Docker…');
  await waitForDocker();

  console.log('→ Postgres (Docker Compose)');
  dockerCompose(['up', '-d', '--build']);

  console.log(`→ Aguardando Postgres (${dbUrl})…`);
  await waitForDb(dbUrl);

  console.log('→ Prisma generate + migrate');
  run('npm', ['run', 'db:generate'], { env: { ...process.env, DATABASE_URL: dbUrl } });
  run('npm', ['run', 'db:migrate:deploy'], { env: { ...process.env, DATABASE_URL: dbUrl } });

  const ready = await schemaReady(dbUrl);
  if (!ready) {
    throw new Error('Migrate terminou, mas a tabela Usuario não existe. Veja npm run db:logs.');
  }

  const seeded = await hasDemoUsers(dbUrl);
  if (forceSeed || !seeded) {
    console.log(forceSeed ? '→ Seed (--force-seed)' : '→ Seed (base vazia)');
    run('npm', ['run', 'db:seed'], { env: { ...process.env, DATABASE_URL: dbUrl } });
  } else {
    console.log('✓ Seed já presente (pulei). Use npm run db:bootstrap -- --force-seed para reaplicar.');
  }

  console.log('\n✓ Banco pronto.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
