import {
  OrgaoCreateSchema,
  OrgaoUpdateSchema,
  UnidadeOrganizacionalCreateSchema,
  UnidadeOrganizacionalUpdateSchema,
} from '@painel/schema';
import {
  municipioRepository,
  orgaoRepository,
  unidadeRepository,
} from '../repositories/orgaoRepository';

export const orgaoService = {
  list: () => orgaoRepository.list(),
  get: (id: string) => orgaoRepository.get(id),
  create: (body: unknown) => orgaoRepository.create(OrgaoCreateSchema.parse(body)),
  update: (id: string, body: unknown) =>
    orgaoRepository.update(id, OrgaoUpdateSchema.parse(body)),
  remove: (id: string) => orgaoRepository.remove(id),
};

export const unidadeService = {
  list: () => unidadeRepository.list(),
  arvore: () => unidadeRepository.arvore(),
  get: (id: string) => unidadeRepository.get(id),
  create: (body: unknown) =>
    unidadeRepository.create(UnidadeOrganizacionalCreateSchema.parse(body)),
  update: (id: string, body: unknown) =>
    unidadeRepository.update(id, UnidadeOrganizacionalUpdateSchema.parse(body)),
  remove: (id: string) => unidadeRepository.remove(id),
};

export const municipioService = {
  search: (query: Record<string, unknown>) => municipioRepository.search(query),
};
