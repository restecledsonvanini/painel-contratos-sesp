/** Catálogo da superfície HTTP pública. OpenAPI completo vem na fase 8. */

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
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/lookups`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/lookups/catalogo?q=suv`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/catalogo-itens?flat=true`,
    `http://localhost:${process.env.PORT || 8888}${API_BASE}/contracts`,
  ],
} as const;
