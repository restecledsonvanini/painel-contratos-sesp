import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/http';
import { qk } from '../lib/queryKeys';

function asArray<T>(data: T | T[] | null | undefined): T[] {
  if (data == null) return [];
  return Array.isArray(data) ? data : [data];
}

export type DashboardKpis = {
  totalContratos?: number;
  vigentes?: number;
  aVencer?: number;
  vencidos?: number;
  valorSobGestaoCents?: number;
  percentualAditadoMedio?: number;
  atualizadoEm?: string;
};

export type VencimentoJanela = {
  janela: string;
  qtd: number;
  valorCents: number;
  atualizadoEm?: string;
};

export function useDashboardKpis() {
  return useQuery({
    queryKey: qk.dashboard('kpis'),
    queryFn: async () => (await http.get<DashboardKpis>('/dashboard/kpis')).data,
    staleTime: 60_000,
  });
}

export function useDashboardVencimentos() {
  return useQuery({
    queryKey: qk.dashboard('vencimentos'),
    queryFn: async () => asArray((await http.get<VencimentoJanela[]>('/dashboard/vencimentos')).data),
    staleTime: 60_000,
  });
}

export function useDashboardPorOrgao() {
  return useQuery({
    queryKey: qk.dashboard('por-orgao'),
    queryFn: async () => asArray((await http.get('/dashboard/por-orgao')).data),
    staleTime: 60_000,
  });
}

export function useDashboardCustos(agrupar?: string) {
  return useQuery({
    queryKey: qk.dashboard('custos', { agrupar }),
    queryFn: async () => {
      const qs = agrupar ? `?agrupar=${encodeURIComponent(agrupar)}` : '';
      return asArray((await http.get(`/dashboard/custos${qs}`)).data);
    },
    staleTime: 60_000,
  });
}

export function useDashboardAditivos() {
  return useQuery({
    queryKey: qk.dashboard('aditivos'),
    queryFn: async () => asArray((await http.get('/dashboard/aditivos')).data),
    staleTime: 60_000,
  });
}

export function useDashboardFornecedores() {
  return useQuery({
    queryKey: qk.dashboard('fornecedores'),
    queryFn: async () => asArray((await http.get('/dashboard/fornecedores?limite=10')).data),
    staleTime: 60_000,
  });
}

export function useDashboardFiscalizacao() {
  return useQuery({
    queryKey: qk.dashboard('fiscalizacao'),
    queryFn: async () => asArray((await http.get('/dashboard/fiscalizacao')).data),
    staleTime: 60_000,
  });
}

export function useDashboardPublicidade() {
  return useQuery({
    queryKey: qk.dashboard('publicidade'),
    queryFn: async () => asArray((await http.get('/dashboard/publicidade')).data),
    staleTime: 60_000,
  });
}

export function useDashboardModalidade() {
  return useQuery({
    queryKey: qk.dashboard('modalidade'),
    queryFn: async () => asArray((await http.get('/dashboard/modalidade')).data),
    staleTime: 60_000,
  });
}

export function useDashboardFrota() {
  return useQuery({
    queryKey: qk.dashboard('frota'),
    queryFn: async () => asArray((await http.get('/dashboard/frota')).data),
    staleTime: 60_000,
  });
}

export function useDashboardImoveis() {
  return useQuery({
    queryKey: qk.dashboard('imoveis'),
    queryFn: async () => asArray((await http.get('/dashboard/imoveis')).data),
    staleTime: 60_000,
  });
}

export function useDashboardPostos() {
  return useQuery({
    queryKey: qk.dashboard('postos'),
    queryFn: async () => asArray((await http.get('/dashboard/postos')).data),
    staleTime: 60_000,
  });
}

export function useDashboardAlimentacao() {
  return useQuery({
    queryKey: qk.dashboard('alimentacao'),
    queryFn: async () => asArray((await http.get('/dashboard/alimentacao')).data),
    staleTime: 60_000,
  });
}

export function useDashboardItens() {
  return useQuery({
    queryKey: qk.dashboard('itens'),
    queryFn: async () => asArray((await http.get('/dashboard/itens')).data),
    staleTime: 60_000,
  });
}

export function useDashboardAlertas() {
  return useQuery({
    queryKey: ['alertas', 'dashboard'],
    queryFn: async () => asArray((await http.get('/alertas')).data),
    staleTime: 30_000,
  });
}
