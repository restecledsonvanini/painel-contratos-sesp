import express from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import contractsRouter from './routes/contracts';
import referencesRouter from './routes/references';
import lookupsRouter from './routes/lookups';
import organizacaoRouter from './routes/organizacao';
import partesRouter from './routes/partes';
import catalogoRouter from './routes/catalogo';
import { contratoItensRouter } from './routes/catalogo';
import { contratoAlteracoesRouter, alteracoesAliasRouter } from './routes/alteracoes';
import orcamentoRouter, { contratoOrcamentoRouter } from './routes/orcamento';
import dashboardRouter, { contratoAnaliticoRouter } from './routes/dashboard';
import exportsRouter from './routes/exports';
import operacaoRouter from './routes/operacao';
import authRouter from './routes/auth';
import { authenticate } from './middleware/auth';
import { errorHandler } from './lib/errors';
import { registerBigIntJson } from './lib/bigint-json';
import { requestContextMiddleware } from './lib/requestContext';
import { observabilityMiddleware } from './lib/observability';
import { publicApiCatalog } from './lib/apiCatalog';
import { buildOpenApiDocument } from './lib/openapi';
import { getMetricsSnapshot } from './lib/metrics';
import { getPrisma } from './lib/prisma';
import { assertProductionConfig } from './lib/env';
import { applyHardening } from './middleware/security';
import { requireMinRole } from './middleware/rbac';
import { API_BASES } from './lib/apiBases';

assertProductionConfig();
registerBigIntJson();

const app = express();
applyHardening(app);
app.use(bodyParser.json({ limit: '5mb' }));

app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(204).end();
});

app.get('/', (_req, res) => {
  res.type('json').json(publicApiCatalog);
});

// Contexto e observabilidade antes da autenticação: do contrário as respostas
// 401 ficam fora das métricas e do log de acesso, escondendo justamente o
// tráfego de quem está tentando entrar.
app.use(requestContextMiddleware);
app.use(observabilityMiddleware);
app.use(authenticate);

function mountApi(base: string) {
  app.get(base, (_req, res) => {
    res.type('json').json(publicApiCatalog);
  });
  app.use(base, authRouter);
  app.use(base, exportsRouter);
  app.use(`${base}/contracts`, contractsRouter);
  app.use(`${base}/contracts/:id/itens`, contratoItensRouter);
  app.use(`${base}/contracts/:id/alteracoes`, contratoAlteracoesRouter);
  app.use(`${base}/contracts/:id`, contratoOrcamentoRouter);
  app.use(`${base}/contracts/:id`, contratoAnaliticoRouter);
  app.use(`${base}/alteracoes`, alteracoesAliasRouter);
  app.use(base, orcamentoRouter);
  app.use(base, dashboardRouter);
  app.use(base, operacaoRouter);
  app.use(`${base}/references`, referencesRouter);
  app.use(base, lookupsRouter);
  app.use(base, organizacaoRouter);
  app.use(base, partesRouter);
  app.use(base, catalogoRouter);
  app.get(`${base}/health`, (_req, res) => res.json({ ok: true, version: 'v1' }));
  app.get(`${base}/health/db`, async (_req, res) => {
    try {
      const db = getPrisma();
      const started = Date.now();
      await db.$queryRaw`SELECT 1`;
      return res.json({ ok: true, latencyMs: Date.now() - started });
    } catch (err) {
      // Sem detalhe do Prisma: a mensagem crua expõe host, base e credencial.
      console.error(
        JSON.stringify({
          code: 'HEALTH_DB_FAILED',
          message: err instanceof Error ? err.message : String(err),
        }),
      );
      return res.status(503).json({ ok: false, error: 'db unavailable' });
    }
  });
  // Latência por rota e superfície OpenAPI completa não são dados públicos.
  app.get(`${base}/metrics`, requireMinRole('ADMIN'), (_req, res) =>
    res.json(getMetricsSnapshot()),
  );
  app.get(`${base}/docs`, requireMinRole('ADMIN'), (_req, res) =>
    res.type('json').json(buildOpenApiDocument()),
  );
}

for (const base of API_BASES) mountApi(base);

app.use(errorHandler);

export const handler = serverless(app);
export { app };
