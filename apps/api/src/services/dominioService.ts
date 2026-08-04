import { DominioValorCreateSchema, DominioValorUpdateSchema } from '@painel/schema';
import { dominioRepository } from '../repositories/dominioRepository';
import { lookupRepository } from '../repositories/lookupRepository';
import { notFound } from '../lib/errors';

export const lookupService = {
  getPayload: () => lookupRepository.buildPayload(),
  async search(slug: string, query: Record<string, unknown>) {
    const result = await lookupRepository.searchSlug(slug, query);
    if (!result) throw notFound(`Lookup '${slug}' não encontrado`);
    return result;
  },
};

export const dominioService = {
  list: () => dominioRepository.list(),
  getBySlug: (slug: string) => dominioRepository.getBySlug(slug),
  listValores: (slug: string, includeInativos?: boolean) =>
    dominioRepository.listValores(slug, includeInativos),
  createValor: (slug: string, body: unknown) => {
    const parsed = DominioValorCreateSchema.parse(body);
    return dominioRepository.createValor(slug, parsed);
  },
  updateValor: (slug: string, id: string, body: unknown) => {
    const parsed = DominioValorUpdateSchema.parse(body);
    return dominioRepository.updateValor(slug, id, parsed);
  },
  deactivateValor: (slug: string, id: string) => dominioRepository.deactivateValor(slug, id),
};
