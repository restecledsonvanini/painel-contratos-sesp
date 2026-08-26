import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'prisma/config';

const pkgRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(pkgRoot, '../..');
const envFile = path.join(repoRoot, '.env');
if (existsSync(envFile) && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envFile);
}

export default defineConfig({
  schema: path.join(pkgRoot, 'prisma', 'schema.prisma'),
  migrations: {
    path: path.join(pkgRoot, 'prisma', 'migrations'),
    seed: 'npx tsx ./seed_supabase.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://painel:pass@localhost:5434/painel_db',
  },
});
