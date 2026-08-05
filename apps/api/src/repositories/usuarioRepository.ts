import { getPrisma } from '../lib/prisma';
import { hashPassword } from '../lib/jwt';
import type { UsuarioCreateInput, UsuarioUpdateInput } from '@painel/schema';
import { notFound } from '../lib/errors';

const publicSelect = {
  id: true,
  email: true,
  nome: true,
  role: true,
  orgaoId: true,
  servidorId: true,
  ativo: true,
  createdAt: true,
  updatedAt: true,
  orgao: { select: { id: true, sigla: true, nome: true } },
  servidor: { select: { id: true, nome: true, cpf: true } },
} as const;

export const usuarioRepository = {
  async findByEmail(email: string) {
    return getPrisma().usuario.findUnique({ where: { email: email.toLowerCase() } });
  },

  async findById(id: string) {
    return getPrisma().usuario.findUnique({
      where: { id },
      select: publicSelect,
    });
  },

  async list() {
    return getPrisma().usuario.findMany({
      orderBy: { email: 'asc' },
      select: publicSelect,
    });
  },

  async create(data: UsuarioCreateInput) {
    return getPrisma().usuario.create({
      data: {
        email: data.email.toLowerCase(),
        nome: data.nome ?? null,
        passwordHash: hashPassword(data.password),
        role: data.role,
        servidorId: data.servidorId ?? null,
        orgaoId: data.orgaoId ?? null,
        ativo: data.ativo ?? true,
        sub: data.sub ?? null,
      },
      select: publicSelect,
    });
  },

  async update(id: string, data: UsuarioUpdateInput) {
    const existing = await getPrisma().usuario.findUnique({ where: { id } });
    if (!existing) throw notFound('Usuário não encontrado');
    return getPrisma().usuario.update({
      where: { id },
      data: {
        ...(data.email !== undefined ? { email: data.email.toLowerCase() } : {}),
        ...(data.nome !== undefined ? { nome: data.nome } : {}),
        ...(data.password !== undefined ? { passwordHash: hashPassword(data.password) } : {}),
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.servidorId !== undefined ? { servidorId: data.servidorId } : {}),
        ...(data.orgaoId !== undefined ? { orgaoId: data.orgaoId } : {}),
        ...(data.ativo !== undefined ? { ativo: data.ativo } : {}),
        ...(data.sub !== undefined ? { sub: data.sub } : {}),
      },
      select: publicSelect,
    });
  },
};
