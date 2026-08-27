import { useQuery } from '@tanstack/react-query';
import { http } from '../../../lib/http';

export function useContractExtras(id: string | undefined, tab: string, ready: boolean) {
  const enabled = Boolean(id) && ready;
  const financeiro = useQuery({
    queryKey: ['contrato-financeiro', id],
    queryFn: async () => (await http.get(`/contracts/${id}/financeiro`)).data,
    enabled: enabled && (tab === 'resumo' || tab === 'financeiro' || tab === 'publicidade'),
  });
  const dotacoes = useQuery({
    queryKey: ['contrato-dotacoes', id],
    queryFn: async () => (await http.get(`/contracts/${id}/dotacoes`)).data,
    enabled: enabled && tab === 'financeiro',
  });
  const empenhos = useQuery({
    queryKey: ['contrato-empenhos', id],
    queryFn: async () => (await http.get(`/contracts/${id}/empenhos`)).data,
    enabled: enabled && tab === 'financeiro',
  });
  const publicacoes = useQuery({
    queryKey: ['contrato-publicacoes', id],
    queryFn: async () => (await http.get(`/contracts/${id}/publicacoes`)).data,
    enabled: enabled && tab === 'publicidade',
  });
  const documentos = useQuery({
    queryKey: ['contrato-documentos', id],
    queryFn: async () => (await http.get(`/contracts/${id}/documentos`)).data,
    enabled: enabled && tab === 'documentos',
  });
  const timeline = useQuery({
    queryKey: ['contrato-timeline', id],
    queryFn: async () => (await http.get(`/contracts/${id}/timeline`)).data,
    enabled: enabled && tab === 'timeline',
  });
  const limites = useQuery({
    queryKey: ['contrato-limites', id],
    queryFn: async () => (await http.get(`/contracts/${id}/limites`)).data,
    enabled: enabled && tab === 'alteracoes',
  });
  const auditoria = useQuery({
    queryKey: ['contrato-auditoria', id],
    queryFn: async () => (await http.get(`/contracts/${id}/auditoria`)).data,
    enabled: enabled && tab === 'auditoria',
  });

  return {
    financeiro: financeiro.data,
    dotacoes: dotacoes.data,
    empenhos: empenhos.data,
    publicacoes: publicacoes.data,
    documentos: documentos.data,
    timeline: timeline.data,
    limites: limites.data,
    auditoria: auditoria.data,
  };
}
