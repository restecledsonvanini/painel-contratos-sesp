import path from 'node:path';
import { config as loadEnv } from 'dotenv';

// Load monorepo root .env then apps/api/.env (latter wins)
// src/ e dist/ ficam a 3 níveis da raiz (apps/api/*)
loadEnv({ path: path.resolve(__dirname, '../../../.env') });
loadEnv({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL é obrigatório em produção');
  }
  process.env.DATABASE_URL = 'postgresql://painel:pass@localhost:5434/painel_db';
}

import { app } from './index';

const port = process.env.PORT || 8888;
const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  console.log(`DATABASE_URL host configured`);
});

// Sem isto uma requisição pendurada segura o socket indefinidamente.
server.requestTimeout = Number(process.env.REQUEST_TIMEOUT_MS || 60_000);
server.headersTimeout = server.requestTimeout + 5_000;
