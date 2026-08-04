import express from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import contractsRouter from './routes/contracts';
import referencesRouter from './routes/references';
import { authenticate } from './middleware/auth';
import { errorHandler } from './lib/errors';
import { registerBigIntJson } from './lib/bigint-json';
import { requestContextMiddleware } from './lib/requestContext';
import { publicApiCatalog } from './lib/apiCatalog';

registerBigIntJson();

const app = express();
app.use(bodyParser.json());

// Chrome DevTools probe — silencia CSP/404 no Network quando a aba da API está aberta
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(204).end();
});

/** Entrada pública: catálogo da API (não é UI). */
app.get('/', (_req, res) => {
  res.type('json').json(publicApiCatalog);
});

app.use(authenticate);
app.use(requestContextMiddleware);

function mountApi(base: string) {
  app.get(base, (_req, res) => {
    res.type('json').json(publicApiCatalog);
  });
  app.use(`${base}/contracts`, contractsRouter);
  app.use(`${base}/references`, referencesRouter);
  app.get(`${base}/health`, (_req, res) => res.json({ ok: true, version: 'v1' }));
}

// Superfície pública versionada + alias Netlify durante a transição
mountApi('/api/v1');
mountApi('/.netlify/functions/api');

app.use(errorHandler);

export const handler = serverless(app);
export { app };
