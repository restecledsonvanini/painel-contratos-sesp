import { useQuery } from '@tanstack/react-query';
import { http } from '../../../lib/http';

export function useContractExtras(id: string | undefined, tab: string) {
  const financeiro = useQuery({
    queryKey: ['contrato-financeiro', id],
    queryFn: async () => (await http.get(`/contracts/${id}/financeiro`)).data,
    enabled: Boolean(id),
  });
  const dotacoes = useQuery({
    queryKey: ['contrato-dotacoes', id],
    queryFn: async () => (await http.get(`/contracts/${id}/dotacoes`)).data,
    enabled: Boolean(id),
  });
  const empenhos = useQuery({
    queryKey: ['contrato-empenhos', id],
    queryFn: async () => (await http.get(`/contracts/${id}/empenhos`)).data,
    enabled: Boolean(id),
  });
  const publicacoes = useQuery({
    queryKey: ['contrato-publicacoes', id],
    queryFn: async () => (await http.get(`/contracts/${id}/publicacoes`)).data,
    enabled: Boolean(id),
  });
  const documentos = useQuery({
    queryKey: ['contrato-documentos', id],
    queryFn: async () => (await http.get(`/contracts/${id}/documentos`)).data,
    enabled: Boolean(id),
  });
  const timeline = useQuery({
    queryKey: ['contrato-timeline', id],
    queryFn: async () => (await http.get(`/contracts/${id}/timeline`)).data,
    enabled: Boolean(id),
  });
  const limites = useQuery({
    queryKey: ['contrato-limites', id],
    queryFn: async () => (await http.get(`/contracts/${id}/limites`)).data,
    enabled: Boolean(id),
  });
  const auditoria = useQuery({
    queryKey: ['contrato-auditoria', id],
    queryFn: async () => (await http.get(`/contracts/${id}/auditoria`)).data,
    enabled: Boolean(id) && tab === 'auditoria',
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
