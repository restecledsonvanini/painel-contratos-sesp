import { useQuery } from '@tanstack/react-query';
import { http } from '../../../lib/http';
import { parseListResponse } from '../../../lib/listResponse';

export type CatalogoOption = {
  id: string;
  nome: string;
  unidadeMedidaPadraoId?: string;
  categoriaItem?: { codigo: string; label: string };
};

export function useCatalogoWizard(enabled: boolean) {
  return useQuery({
    queryKey: ['catalogo-itens', 'form'],
    queryFn: async () => {
      const raw = (
        await http.get<unknown>('/catalogo-itens', { params: { page: 1, pageSize: 100 } })
      ).data;
      return parseListResponse<CatalogoOption>(raw, 1, 100).data;
    },
    enabled,
  });
}
