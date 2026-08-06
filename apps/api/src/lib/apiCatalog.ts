/** Catálogo da superfície HTTP pública. OpenAPI em /api/v1/docs. */

export const API_BASE = '/api/v1';

export const publicApiCatalog = {
  service: 'painel-contratos-api',
  version: 'v1',
  base: API_BASE,
  note:
    'API JSON pública. O frontend (UI) roda em http://localhost:5173 e consome estas rotas. OpenAPI: GET /api/v1/docs.',
  aliases: {
    netlify: '/.netlify/functions/api/* → mesmo conteúdo de /api/v1/*',
  },
  endpoints: {
    health: { method: 'GET', path: `${API_BASE}/health` },
    healthDb: { method: 'GET', path: `${API_BASE}/health/db` },
    metrics: { method: 'GET', path: `${API_BASE}/metrics` },
    docs: { method: 'GET', path: `${API_BASE}/docs` },
    search: { method: 'GET', path: `${API_BASE}/search?q=` },
    exports: {
      contratosCsv: { method: 'GET', path: `${API_BASE}/exports/contratos.csv` },
      contratosXlsx: { method: 'GET', path: `${API_BASE}/exports/contratos.xlsx` },
    },
    auth: {
      login: { method: 'POST', path: `${API_BASE}/auth/login` },
      me: { method: 'GET', path: `${API_BASE}/auth/me` },
      usuarios: { method: 'GET', path: `${API_BASE}/usuarios` },
    },
    lookups: {
      all: { method: 'GET', path: `${API_BASE}/lookups` },
      search: { method: 'GET', path: `${API_BASE}/lookups/:slug?q=&page=` },
    },
    dominios: {
      list: { method: 'GET', path: `${API_BASE}/dominios` },
      valores: { method: 'GET', path: `${API_BASE}/dominios/:slug/valores` },
      createValor: { method: 'POST', path: `${API_BASE}/dominios/:slug/valores` },
    },
    orgaos: { method: 'GET', path: `${API_BASE}/orgaos` },
    unidades: {
      list: { method: 'GET', path: `${API_BASE}/unidades` },
      arvore: { method: 'GET', path: `${API_BASE}/unidades/arvore` },
    },
    municipios: { method: 'GET', path: `${API_BASE}/municipios?q=` },
    fornecedores: {
      list: { method: 'GET', path: `${API_BASE}/fornecedores` },
      contatos: { method: 'POST', path: `${API_BASE}/fornecedores/:id/contatos` },
      sancoes: { method: 'POST', path: `${API_BASE}/fornecedores/:id/sancoes` },
    },
    servidores: { method: 'GET', path: `${API_BASE}/servidores` },
    catalogoItens: {
      list: { method: 'GET', path: `${API_BASE}/catalogo-itens` },
      atributos: { method: 'GET', path: `${API_BASE}/categorias-item/:id/atributos` },
    },
    contractItens: {
      list: { method: 'GET', path: `${API_BASE}/contracts/:id/itens` },
    },
    alteracoes: {
      list: { method: 'GET', path: `${API_BASE}/contracts/:id/alteracoes` },
      create: { method: 'POST', path: `${API_BASE}/contracts/:id/alteracoes` },
      simular: {
        method: 'POST',
        path: `${API_BASE}/contracts/:id/alteracoes/simular`,
        note: 'alias POST /alteracoes/:id/simular (id = contratoId)',
      },
    },
    orcamento: {
      dotacoes: { method: 'GET', path: `${API_BASE}/dotacoes` },
      contratoDotacoes: { method: 'GET', path: `${API_BASE}/contracts/:id/dotacoes` },
      empenhos: { method: 'GET', path: `${API_BASE}/contracts/:id/empenhos` },
      reservas: { method: 'GET', path: `${API_BASE}/reservas` },
      publicacoes: { method: 'GET', path: `${API_BASE}/contracts/:id/publicacoes` },
      documentos: { method: 'GET', path: `${API_BASE}/contracts/:id/documentos` },
    },
    analitico: {
      kpis: { method: 'GET', path: `${API_BASE}/dashboard/kpis` },
      vencimentos: { method: 'GET', path: `${API_BASE}/dashboard/vencimentos` },
      timeline: { method: 'GET', path: `${API_BASE}/contracts/:id/timeline` },
      limites: { method: 'GET', path: `${API_BASE}/contracts/:id/limites` },
      financeiro: { method: 'GET', path: `${API_BASE}/contracts/:id/financeiro` },
      auditoria: { method: 'GET', path: `${API_BASE}/contracts/:id/auditoria` },
      refresh: { method: 'POST', path: `${API_BASE}/admin/refresh-analytics` },
    },
    alertas: {
      list: { method: 'GET', path: `${API_BASE}/alertas?tipo=&severidade=&contratoId=` },
      configs: { method: 'GET', path: `${API_BASE}/alertas/configs` },
      reconhecer: { method: 'POST', path: `${API_BASE}/alertas/:id/reconhecer` },
      gerar: { method: 'POST', path: `${API_BASE}/admin/gerar-alertas` },
    },
    importacoes: {
      create: { method: 'POST', path: `${API_BASE}/importacoes` },
      get: { method: 'GET', path: `${API_BASE}/importacoes/:id` },
      aplicar: { method: 'POST', path: `${API_BASE}/importacoes/:id/aplicar` },
    },
    contracts: {
      list: { method: 'GET', path: `${API_BASE}/contracts` },
      get: { method: 'GET', path: `${API_BASE}/contracts/:id` },
      create: { method: 'POST', path: `${API_BASE}/contracts` },
      update: { method: 'PUT', path: `${API_BASE}/contracts/:id` },
      delete: { method: 'DELETE', path: `${API_BASE}/contracts/:id` },
      note: 'Contrato core (pilar, natureza, responsáveis, rateio). Aliases legados no payload.',
    },
    references: {
      unidadesFsp: { method: 'GET', path: `${API_BASE}/references/unidades-fsp` },
      empresas: {
        method: 'GET',
        path: `${API_BASE}/references/empresas`,
        note: 'alias → Fornecedor (compat)',
      },
      entidadesGestoras: {
        method: 'GET',
        path: `${API_BASE}/references/entidades-gestoras`,
        note: 'alias → Servidor (compat)',
      },
      fornecedores: { method: 'GET', path: `${API_BASE}/references/fornecedores` },
      servicos: {
        method: 'GET',
        path: `${API_BASE}/references/servicos`,
        note: 'alias → CatalogoItem (compat)',
      },
    },
  },
  tryNow: [
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/health`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/health/db`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/docs`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/alertas`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/lookups`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/contracts`,
  ],
} as const;
