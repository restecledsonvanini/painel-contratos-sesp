export type ContratoFiltros = {
  page?: number;
  pageSize?: number;
  sort?: string;
  q?: string;
  orgaoId?: string;
  unidadeId?: string;
  fornecedorId?: string;
  situacao?: string;
  [key: string]: string | number | undefined;
};

export const qk = {
  lookups: ['lookups'] as const,
  lookup: (slug: string, q?: string) => ['lookups', slug, q ?? ''] as const,
  contratos: (filtros?: ContratoFiltros) => ['contratos', filtros ?? {}] as const,
  contrato: (id: string) => ['contratos', id] as const,
  contratoTimeline: (id: string) => ['contratos', id, 'timeline'] as const,
  contratoLimites: (id: string) => ['contratos', id, 'limites'] as const,
  dashboard: (painel: string, params?: object) => ['dashboard', painel, params ?? {}] as const,
  empresas: ['empresas'] as const,
  empresa: (id: string) => ['empresas', id] as const,
  fornecedores: ['fornecedores'] as const,
  fornecedor: (id: string) => ['fornecedores', id] as const,
  servidores: ['servidores'] as const,
  servidor: (id: string) => ['servidores', id] as const,
  servicos: ['servicos'] as const,
  servico: (id: string) => ['servicos', id] as const,
  entidadesGestoras: ['entidadesGestoras'] as const,
  entidadeGestora: (id: string) => ['entidadesGestoras', id] as const,
  unidadesFsp: ['unidadesFsp'] as const,
  unidadeFsp: (id: string) => ['unidadesFsp', id] as const,
};
