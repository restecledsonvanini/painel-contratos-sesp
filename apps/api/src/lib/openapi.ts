import { publicApiCatalog, API_BASE } from './apiCatalog';
import {
  LoginSchema,
  ContractCreateSchema,
  AlertaQuerySchema,
  ImportacaoCreateSchema,
  RoleSchema,
} from '@painel/schema';
import { zodToJsonSchema } from './zodToJsonSchema';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

function pathItem(
  method: HttpMethod,
  summary: string,
  opts?: { tags?: string[]; bodySchema?: unknown; querySchema?: unknown },
) {
  const tags = opts?.tags ?? ['api'];
  const operation: Record<string, unknown> = {
    summary,
    tags,
    responses: {
      '200': { description: 'OK' },
      '201': { description: 'Created' },
      '400': { description: 'Validation error' },
      '401': { description: 'Unauthorized' },
      '403': { description: 'Forbidden' },
      '404': { description: 'Not found' },
    },
  };
  if (opts?.bodySchema) {
    operation.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: opts.bodySchema,
        },
      },
    };
  }
  if (opts?.querySchema) {
    operation.parameters = [
      {
        in: 'query',
        name: 'filter',
        schema: opts.querySchema,
        style: 'form',
        explode: true,
      },
    ];
  }
  return { [method]: operation };
}

/** OpenAPI 3 derivado do catálogo + schemas Zod principais. */
export function buildOpenApiDocument() {
  const loginSchema = zodToJsonSchema(LoginSchema, 'Login');
  const contractCreate = zodToJsonSchema(ContractCreateSchema, 'ContractCreate');
  const importacao = zodToJsonSchema(ImportacaoCreateSchema, 'ImportacaoCreate');
  const alertaQuery = zodToJsonSchema(AlertaQuerySchema, 'AlertaQuery');
  const roleSchema = zodToJsonSchema(RoleSchema, 'Role');

  const paths: Record<string, unknown> = {
    [`${API_BASE}/health`]: pathItem('get', 'Health check', { tags: ['ops'] }),
    [`${API_BASE}/health/db`]: pathItem('get', 'Database health', { tags: ['ops'] }),
    [`${API_BASE}/metrics`]: pathItem('get', 'Latência por rota', { tags: ['ops'] }),
    [`${API_BASE}/docs`]: pathItem('get', 'Este documento OpenAPI', { tags: ['ops'] }),
    [`${API_BASE}/search`]: pathItem('get', 'Busca global (CommandPalette)', { tags: ['ops'] }),
    [`${API_BASE}/exports/contratos.csv`]: pathItem('get', 'Export CSV de contratos (acervo)', {
      tags: ['exports'],
    }),
    [`${API_BASE}/exports/contratos.xlsx`]: pathItem('get', 'Export XLSX de contratos (exceljs)', {
      tags: ['exports'],
    }),
    [`${API_BASE}/contracts/{id}/export.csv`]: pathItem('get', 'Ficha CSV de um contrato', {
      tags: ['exports'],
    }),
    [`${API_BASE}/contracts/{id}/export.xlsx`]: pathItem('get', 'Ficha XLSX de um contrato', {
      tags: ['exports'],
    }),
    [`${API_BASE}/contracts/{id}/export.pdf`]: pathItem('get', 'Ficha PDF de um contrato (pdfkit)', {
      tags: ['exports'],
    }),
    [`${API_BASE}/auth/login`]: pathItem('post', 'Login JWT', {
      tags: ['auth'],
      bodySchema: { $ref: '#/components/schemas/Login' },
    }),
    [`${API_BASE}/auth/me`]: pathItem('get', 'Usuário autenticado', { tags: ['auth'] }),
    [`${API_BASE}/usuarios`]: pathItem('get', 'Listar usuários', { tags: ['auth'] }),
    [`${API_BASE}/alertas`]: pathItem('get', 'Listar alertas', {
      tags: ['alertas'],
      querySchema: { $ref: '#/components/schemas/AlertaQuery' },
    }),
    [`${API_BASE}/alertas/configs`]: pathItem('get', 'Configs de alerta', { tags: ['alertas'] }),
    [`${API_BASE}/alertas/{id}/reconhecer`]: pathItem('post', 'Reconhecer alerta', {
      tags: ['alertas'],
    }),
    [`${API_BASE}/admin/gerar-alertas`]: pathItem('post', 'Job idempotente de alertas', {
      tags: ['admin'],
    }),
    [`${API_BASE}/importacoes`]: pathItem('post', 'Upload CSV + dry-run', {
      tags: ['importacao'],
      bodySchema: { $ref: '#/components/schemas/ImportacaoCreate' },
    }),
    [`${API_BASE}/importacoes/{id}`]: pathItem('get', 'Detalhe do lote', { tags: ['importacao'] }),
    [`${API_BASE}/importacoes/{id}/aplicar`]: pathItem('post', 'Aplicar lote validado', {
      tags: ['importacao'],
    }),
    [`${API_BASE}/contracts`]: {
      ...pathItem('get', 'Listar contratos (escopo por órgão)', { tags: ['contratos'] }),
      ...pathItem('post', 'Criar contrato', {
        tags: ['contratos'],
        bodySchema: { $ref: '#/components/schemas/ContractCreate' },
      }),
    },
    [`${API_BASE}/contracts/{id}`]: {
      ...pathItem('get', 'Obter contrato', { tags: ['contratos'] }),
      ...pathItem('put', 'Atualizar contrato', { tags: ['contratos'] }),
      ...pathItem('delete', 'Excluir contrato', { tags: ['contratos'] }),
    },
    [`${API_BASE}/dashboard/kpis`]: pathItem('get', 'KPIs do dashboard', { tags: ['dashboard'] }),
    [`${API_BASE}/admin/refresh-analytics`]: pathItem('post', 'Refresh MVs', { tags: ['admin'] }),
  };

  return {
    openapi: '3.0.3',
    info: {
      title: publicApiCatalog.service,
      version: publicApiCatalog.version,
      description: `${publicApiCatalog.note} Schemas Zod publicados em components.schemas.`,
    },
    servers: [{ url: 'http://localhost:8888' }],
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'JWT de POST /auth/login, ou tokens sintéticos admin|analista|gestor|visitante',
        },
      },
      schemas: {
        Login: loginSchema,
        ContractCreate: contractCreate,
        ImportacaoCreate: importacao,
        AlertaQuery: alertaQuery,
        Role: roleSchema,
      },
    },
    security: [{ bearerAuth: [] }],
  };
}
