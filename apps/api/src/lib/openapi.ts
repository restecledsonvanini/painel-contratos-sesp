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
    [`${API_BASE}/usuarios`]: {
      ...pathItem('get', 'Listar usuários (ADMIN)', { tags: ['auth'] }),
      ...pathItem('post', 'Criar usuário (ADMIN)', { tags: ['auth'] }),
    },
    [`${API_BASE}/usuarios/{id}`]: {
      ...pathItem('get', 'Obter usuário (ADMIN)', { tags: ['auth'] }),
      ...pathItem('patch', 'Atualizar usuário (ADMIN)', { tags: ['auth'] }),
    },
    [`${API_BASE}/fornecedores`]: {
      ...pathItem('get', 'Listar fornecedores', { tags: ['partes'] }),
      ...pathItem('post', 'Criar fornecedor (ANALISTA+)', { tags: ['partes'] }),
    },
    [`${API_BASE}/fornecedores/{id}`]: {
      ...pathItem('get', 'Obter fornecedor', { tags: ['partes'] }),
      ...pathItem('put', 'Atualizar fornecedor (ANALISTA+)', { tags: ['partes'] }),
      ...pathItem('delete', 'Excluir fornecedor (ANALISTA+)', { tags: ['partes'] }),
    },
    [`${API_BASE}/servidores`]: {
      ...pathItem('get', 'Listar servidores', { tags: ['partes'] }),
      ...pathItem('post', 'Criar servidor (ANALISTA+)', { tags: ['partes'] }),
    },
    [`${API_BASE}/servidores/{id}`]: {
      ...pathItem('get', 'Obter servidor', { tags: ['partes'] }),
      ...pathItem('put', 'Atualizar servidor (ANALISTA+)', { tags: ['partes'] }),
      ...pathItem('delete', 'Excluir servidor (ANALISTA+)', { tags: ['partes'] }),
    },
    [`${API_BASE}/catalogo-itens`]: {
      ...pathItem('get', 'Listar itens do catálogo', { tags: ['catalogo'] }),
      ...pathItem('post', 'Criar item (ANALISTA+)', { tags: ['catalogo'] }),
    },
    [`${API_BASE}/catalogo-itens/{id}`]: {
      ...pathItem('get', 'Obter item do catálogo', { tags: ['catalogo'] }),
      ...pathItem('put', 'Atualizar item (ANALISTA+)', { tags: ['catalogo'] }),
      ...pathItem('delete', 'Excluir item (ANALISTA+)', { tags: ['catalogo'] }),
    },
    [`${API_BASE}/dotacoes`]: {
      ...pathItem('get', 'Listar dotações', { tags: ['orcamento'] }),
      ...pathItem('post', 'Criar dotação (ANALISTA+)', { tags: ['orcamento'] }),
    },
    [`${API_BASE}/dotacoes/{id}`]: {
      ...pathItem('get', 'Obter dotação', { tags: ['orcamento'] }),
      ...pathItem('put', 'Atualizar dotação (ANALISTA+)', { tags: ['orcamento'] }),
      ...pathItem('delete', 'Excluir dotação (ANALISTA+)', { tags: ['orcamento'] }),
    },
    [`${API_BASE}/orgaos`]: {
      ...pathItem('get', 'Listar órgãos', { tags: ['organizacao'] }),
      ...pathItem('post', 'Criar órgão (GESTOR+)', { tags: ['organizacao'] }),
    },
    [`${API_BASE}/orgaos/arvore`]: pathItem('get', 'Árvore de órgãos', { tags: ['organizacao'] }),
    [`${API_BASE}/unidades`]: {
      ...pathItem('get', 'Listar unidades organizacionais', { tags: ['organizacao'] }),
      ...pathItem('post', 'Criar unidade (GESTOR+)', { tags: ['organizacao'] }),
    },
    [`${API_BASE}/unidades/arvore`]: pathItem('get', 'Árvore órgão→unidades', {
      tags: ['organizacao'],
    }),
    [`${API_BASE}/alertas`]: pathItem('get', 'Listar alertas', {
      tags: ['alertas'],
      querySchema: { $ref: '#/components/schemas/AlertaQuery' },
    }),
    [`${API_BASE}/alertas/configs`]: pathItem('get', 'Configs de alerta', { tags: ['alertas'] }),
    [`${API_BASE}/alertas/{id}/reconhecer`]: pathItem('post', 'Reconhecer alerta', {
      tags: ['alertas'],
    }),
    [`${API_BASE}/admin/gerar-alertas`]: pathItem('post', 'Job idempotente de alertas (ADMIN)', {
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
      ...pathItem('post', 'Criar contrato (ANALISTA+)', {
        tags: ['contratos'],
        bodySchema: { $ref: '#/components/schemas/ContractCreate' },
      }),
    },
    [`${API_BASE}/contracts/{id}`]: {
      ...pathItem('get', 'Obter contrato', { tags: ['contratos'] }),
      ...pathItem('put', 'Atualizar contrato (ANALISTA+)', { tags: ['contratos'] }),
      ...pathItem('delete', 'Excluir contrato (ANALISTA+)', { tags: ['contratos'] }),
    },
    [`${API_BASE}/dashboard/kpis`]: pathItem('get', 'KPIs do dashboard', { tags: ['dashboard'] }),
    [`${API_BASE}/dashboard/vencimentos`]: pathItem('get', 'Vencimentos por janela', {
      tags: ['dashboard'],
    }),
    [`${API_BASE}/dashboard/por-orgao`]: pathItem('get', 'Contratos por órgão (escopo)', {
      tags: ['dashboard'],
    }),
    [`${API_BASE}/admin/refresh-analytics`]: pathItem('post', 'Refresh MVs (ADMIN)', {
      tags: ['admin'],
    }),
  };

  return {
    openapi: '3.0.3',
    info: {
      title: publicApiCatalog.service,
      version: publicApiCatalog.version,
      description: `${publicApiCatalog.note} Schemas Zod em components.schemas. Papéis: VISITANTE | ANALISTA | GESTOR | ADMIN.`,
    },
    servers: [{ url: 'http://localhost:8888' }],
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description:
            'JWT (POST /auth/login) ou tokens sintéticos de teste: admin | analista | gestor | visitante. Papéis canônicos: VISITANTE, ANALISTA, GESTOR, ADMIN.',
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
