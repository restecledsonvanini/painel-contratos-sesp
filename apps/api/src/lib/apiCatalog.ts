/** Catálogo da superfície HTTP pública (fase 0). OpenAPI completo vem na fase 8. */

export const API_BASE = '/api/v1';

export const publicApiCatalog = {
  service: 'painel-contratos-api',
  version: 'v1',
  base: API_BASE,
  note:
    'API JSON pública. O frontend (UI) roda em http://localhost:5173 e consome estas rotas. OpenAPI em /api/v1/docs chega na fase 8.',
  aliases: {
    netlify: '/.netlify/functions/api/* → mesmo conteúdo de /api/v1/*',
  },
  endpoints: {
    health: { method: 'GET', path: `${API_BASE}/health` },
    contracts: {
      list: { method: 'GET', path: `${API_BASE}/contracts` },
      get: { method: 'GET', path: `${API_BASE}/contracts/:id` },
      create: { method: 'POST', path: `${API_BASE}/contracts` },
      update: { method: 'PUT', path: `${API_BASE}/contracts/:id` },
      delete: { method: 'DELETE', path: `${API_BASE}/contracts/:id` },
    },
    references: {
      unidadesFsp: { method: 'GET', path: `${API_BASE}/references/unidades-fsp` },
      empresas: { method: 'GET', path: `${API_BASE}/references/empresas` },
      entidadesGestoras: { method: 'GET', path: `${API_BASE}/references/entidades-gestoras` },
      fornecedores: { method: 'GET', path: `${API_BASE}/references/fornecedores` },
      servicos: { method: 'GET', path: `${API_BASE}/references/servicos` },
    },
  },
  tryNow: [
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/health`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/contracts`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/references/empresas`,
  ],
} as const;
