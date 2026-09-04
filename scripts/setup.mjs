#!/usr/bin/env node
/**
 * Alias histórico de `npm run bootstrap`.
 * Preferir: npm run bootstrap
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bootstrap = path.join(root, 'scripts/bootstrap.mjs');
const extra = process.argv.slice(2);

const r = spawnSync(process.execPath, [bootstrap, ...extra], {
  stdio: 'inherit',
  cwd: root,
  shell: process.platform === 'win32',
});
process.exit(r.status ?? 1);
