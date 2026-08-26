import type { Request } from 'express';
import { getOrgaoScope } from '../lib/scope';
import { searchRepository } from '../repositories/searchRepository';

export type SearchHit = { id: string; label: string; to: string };

export type GlobalSearchResult = {
  contratos: SearchHit[];
  fornecedores: SearchHit[];
  servidores: SearchHit[];
};

const EMPTY: GlobalSearchResult = { contratos: [], fornecedores: [], servidores: [] };

export async function globalSearch(q: string, req: Request): Promise<GlobalSearchResult> {
  const term = q.trim();
  if (term.length < 2) return EMPTY;

  const { orgaoId } = getOrgaoScope(req);
  const [contratos, fornecedores, servidores] = await Promise.all([
    searchRepository.contratos(term, orgaoId),
    searchRepository.fornecedores(term),
    searchRepository.servidores(term, orgaoId),
  ]);

  return {
    contratos: contratos.map((c) => ({
      id: c.id,
      label: `GMS ${c.numeroGms}/${c.anoGms} — ${c.objeto.slice(0, 60)}`,
      to: `/contracts/${c.id}`,
    })),
    fornecedores: fornecedores.map((f) => ({
      id: f.id,
      label: `${f.razaoSocial} (${f.documento})`,
      to: `/fornecedores/${f.id}/edit`,
    })),
    servidores: servidores.map((s) => ({
      id: s.id,
      label: s.cargo ? `${s.nome} — ${s.cargo}` : s.nome,
      to: `/servidores/${s.id}/edit`,
    })),
  };
}
