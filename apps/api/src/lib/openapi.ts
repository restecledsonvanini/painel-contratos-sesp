import { publicApiCatalog, API_BASE } from './apiCatalog';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

function pathItem(method: HttpMethod, summary: string, tags: string[] = ['api']) {
  return {
    [method]: {
      summary,
      tags,
      responses: {
        '200': { description: 'OK' },
        '201': { description: 'Created' },
        '400': { description: 'Validation error' },
        '404': { description: 'Not found' },
      },
    },
  };
}

/** OpenAPI 3 mínimo derivado do catálogo público (fase 8). */
export function buildOpenApiDocument() {
  const paths: Record<string, unknown> = {
    [`${API_BASE}/health`]: pathItem('get', 'Health check', ['ops']),
    [`${API_BASE}/health/db`]: pathItem('get', 'Database health', ['ops']),
    [`${API_BASE}/metrics`]: pathItem('get', 'Latência por rota', ['ops']),
    [`${API_BASE}/docs`]: pathItem('get', 'Este documento OpenAPI', ['ops']),
    [`${API_BASE}/alertas`]: pathItem('get', 'Listar alertas', ['alertas']),
    [`${API_BASE}/alertas/configs`]: pathItem('get', 'Configs de alerta', ['alertas']),
    [`${API_BASE}/alertas/{id}/reconhecer`]: pathItem('post', 'Reconhecer alerta', ['alertas']),
    [`${API_BASE}/admin/gerar-alertas`]: pathItem('post', 'Job idempotente de alertas', ['admin']),
    [`${API_BASE}/importacoes`]: pathItem('post', 'Upload CSV + dry-run', ['importacao']),
    [`${API_BASE}/importacoes/{id}`]: pathItem('get', 'Detalhe do lote', ['importacao']),
    [`${API_BASE}/importacoes/{id}/aplicar`]: pathItem('post', 'Aplicar lote validado', ['importacao']),
    [`${API_BASE}/contracts`]: {
      ...pathItem('get', 'Listar contratos', ['contratos']),
      ...pathItem('post', 'Criar contrato', ['contratos']),
    },
    [`${API_BASE}/contracts/{id}`]: {
      ...pathItem('get', 'Obter contrato', ['contratos']),
      ...pathItem('put', 'Atualizar contrato', ['contratos']),
      ...pathItem('delete', 'Excluir contrato', ['contratos']),
    },
    [`${API_BASE}/dashboard/kpis`]: pathItem('get', 'KPIs do dashboard', ['dashboard']),
    [`${API_BASE}/admin/refresh-analytics`]: pathItem('post', 'Refresh MVs', ['admin']),
  };

  return {
    openapi: '3.0.3',
    info: {
      title: publicApiCatalog.service,
      version: publicApiCatalog.version,
      description: publicApiCatalog.note,
    },
    servers: [{ url: 'http://localhost:8888' }],
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Stub: Bearer admin | Bearer colaborador',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  };
}
