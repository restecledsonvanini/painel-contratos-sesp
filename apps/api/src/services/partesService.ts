import {
  FornecedorContatoCreateSchema,
  FornecedorContatoUpdateSchema,
  FornecedorCreateSchema,
  FornecedorSancaoCreateSchema,
  FornecedorSancaoUpdateSchema,
  FornecedorUpdateSchema,
  ServidorCreateSchema,
  ServidorUpdateSchema,
} from '@painel/schema';
import type { Request } from 'express';
import { notFound } from '../lib/errors';
import { assertOrgaoInScope } from '../lib/scope';
import { fornecedorRepository } from '../repositories/fornecedorRepository';
import { servidorRepository } from '../repositories/servidorRepository';

export const fornecedorService = {
  list: (query: Record<string, unknown>) => fornecedorRepository.list(query),
  listAll: () => fornecedorRepository.listAll(),
  get: (id: string) => fornecedorRepository.get(id),
  create: (body: unknown) => fornecedorRepository.create(FornecedorCreateSchema.parse(body)),
  update: (id: string, body: unknown) =>
    fornecedorRepository.update(id, FornecedorUpdateSchema.parse(body)),
  remove: (id: string) => fornecedorRepository.remove(id),
  createContato: (fornecedorId: string, body: unknown) =>
    fornecedorRepository.createContato(fornecedorId, FornecedorContatoCreateSchema.parse(body)),
  updateContato: (fornecedorId: string, contatoId: string, body: unknown) =>
    fornecedorRepository.updateContato(
      fornecedorId,
      contatoId,
      FornecedorContatoUpdateSchema.parse(body),
    ),
  removeContato: (fornecedorId: string, contatoId: string) =>
    fornecedorRepository.removeContato(fornecedorId, contatoId),
  createSancao: (fornecedorId: string, body: unknown) =>
    fornecedorRepository.createSancao(fornecedorId, FornecedorSancaoCreateSchema.parse(body)),
  updateSancao: (fornecedorId: string, sancaoId: string, body: unknown) =>
    fornecedorRepository.updateSancao(
      fornecedorId,
      sancaoId,
      FornecedorSancaoUpdateSchema.parse(body),
    ),
  removeSancao: (fornecedorId: string, sancaoId: string) =>
    fornecedorRepository.removeSancao(fornecedorId, sancaoId),
};

export const servidorService = {
  list: (query: Record<string, unknown>, scope?: { orgaoId?: string | null }) =>
    servidorRepository.list(query, scope),
  listAll: (scope?: { orgaoId?: string | null }) => servidorRepository.listAll(scope),
  get: async (id: string, req: Request) => {
    const servidor = await servidorRepository.get(id);
    if (!servidor) throw notFound('Servidor não encontrado');
    assertOrgaoInScope(servidor.orgaoId, req);
    return servidor;
  },
  create: (body: unknown) => servidorRepository.create(ServidorCreateSchema.parse(body)),
  update: (id: string, body: unknown) =>
    servidorRepository.update(id, ServidorUpdateSchema.parse(body)),
  remove: (id: string) => servidorRepository.remove(id),
};
