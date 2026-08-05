import {
  CatalogoItemCreateSchema,
  CatalogoItemUpdateSchema,
  ItemAtributoDefCreateSchema,
  ItemAtributoDefUpdateSchema,
  ItemContratoCreateSchema,
  ItemContratoUpdateSchema,
} from '@painel/schema';
import {
  atributoDefRepository,
  catalogoRepository,
  itemContratoRepository,
} from '../repositories/catalogoRepository';
import { contratoRepository } from '../repositories/contratoRepository';
import { notFound } from '../lib/errors';

export const catalogoService = {
  list: (query: Record<string, unknown>) => catalogoRepository.list(query),
  listAll: () => catalogoRepository.listAll(),
  get: (id: string) => catalogoRepository.get(id),
  create: (body: unknown) => catalogoRepository.create(CatalogoItemCreateSchema.parse(body)),
  update: (id: string, body: unknown) =>
    catalogoRepository.update(id, CatalogoItemUpdateSchema.parse(body)),
  remove: (id: string) => catalogoRepository.remove(id),
};

export const atributoDefService = {
  listByCategoria: (categoriaItemId: string, includeInativos?: boolean) =>
    atributoDefRepository.listByCategoria(categoriaItemId, includeInativos),
  create: (body: unknown) => atributoDefRepository.create(ItemAtributoDefCreateSchema.parse(body)),
  update: (id: string, body: unknown) =>
    atributoDefRepository.update(id, ItemAtributoDefUpdateSchema.parse(body)),
  remove: (id: string) => atributoDefRepository.remove(id),
};

export const itemContratoService = {
  async list(contratoId: string) {
    const contrato = await contratoRepository.findByIdBare(contratoId);
    if (!contrato) throw notFound('Contract not found');
    return itemContratoRepository.listByContrato(contratoId);
  },
  get: (contratoId: string, itemId: string) => itemContratoRepository.get(contratoId, itemId),
  async create(contratoId: string, body: unknown) {
    const contrato = await contratoRepository.findByIdBare(contratoId);
    if (!contrato) throw notFound('Contract not found');
    return itemContratoRepository.create(contratoId, ItemContratoCreateSchema.parse(body));
  },
  update: (contratoId: string, itemId: string, body: unknown) =>
    itemContratoRepository.update(contratoId, itemId, ItemContratoUpdateSchema.parse(body)),
  remove: (contratoId: string, itemId: string) =>
    itemContratoRepository.remove(contratoId, itemId),
};
