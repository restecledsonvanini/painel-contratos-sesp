import React, { createContext, useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LookupOption } from '@painel/schema';
import { http } from '../lib/http';
import { qk } from '../lib/queryKeys';

export type { LookupOption };

export type LookupsPayload = {
  dominios: Record<string, LookupOption[]>;
  dominioMeta: Record<
    string,
    { id: string; nome: string; editavelPeloUsuario: boolean; permiteHierarquia: boolean }
  >;
  atualizadoEm: string;
};

type LookupsContextValue = {
  data?: LookupsPayload;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const LookupsContext = createContext<LookupsContextValue | null>(null);

async function fetchLookups() {
  const res = await http.get<LookupsPayload>('/lookups');
  return res.data;
}

export function LookupsProvider({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: qk.lookups,
    queryFn: fetchLookups,
    staleTime: 1000 * 60 * 30,
  });

  const value = useMemo<LookupsContextValue>(
    () => ({
      data: query.data,
      isLoading: query.isLoading,
      error: (query.error as Error) ?? null,
      refetch: () => {
        void query.refetch();
      },
    }),
    [query.data, query.isLoading, query.error, query.refetch],
  );

  return <LookupsContext.Provider value={value}>{children}</LookupsContext.Provider>;
}

function useLookupsContext() {
  const ctx = useContext(LookupsContext);
  if (!ctx) throw new Error('useLookups* hooks require LookupsProvider');
  return ctx;
}

export function useLookups() {
  return useLookupsContext();
}

export function useDominio(slug: string) {
  const { data, isLoading, error } = useLookupsContext();
  const options = data?.dominios[slug] ?? [];
  const meta = data?.dominioMeta[slug];
  return { options, meta, isLoading, error };
}

export function useDominioValor(id?: string) {
  const { data } = useLookupsContext();
  if (!id || !data) return undefined;
  for (const list of Object.values(data.dominios)) {
    const found = list.find((o) => o.id === id || o.codigo === id);
    if (found) return found;
  }
  return undefined;
}

export function useUnidadeArvore() {
  const query = useQuery({
    queryKey: ['unidades', 'arvore'],
    queryFn: async () => (await http.get<unknown[]>('/unidades/arvore')).data,
    staleTime: 1000 * 60 * 5,
  });
  return { orgaos: query.data ?? [], isLoading: query.isLoading, error: query.error as Error | null };
}

export function useLookupSearch(slug: string, q: string) {
  return useQuery({
    queryKey: qk.lookup(slug, q),
    queryFn: async () => {
      const res = await http.get<{ data: LookupOption[]; meta: unknown }>(`/lookups/${slug}`, {
        params: { q, pageSize: 25 },
      });
      return res.data;
    },
    enabled: q.trim().length >= 2,
    staleTime: 1000 * 30,
  });
}

export function useQuickCreate(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { codigo: string; label: string; parentId?: string | null }) => {
      const res = await http.post<LookupOption>(`/dominios/${slug}/valores`, payload);
      return res.data;
    },
    onSuccess: (option) => {
      qc.setQueryData<LookupsPayload>(qk.lookups, (prev) => {
        if (!prev) return prev;
        const list = prev.dominios[slug] ?? [];
        return {
          ...prev,
          dominios: {
            ...prev.dominios,
            [slug]: [...list, option],
          },
        };
      });
      void qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}
