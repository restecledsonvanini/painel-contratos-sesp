import { getPrisma } from '../lib/prisma';

export const searchRepository = {
  contratos(q: string, orgaoId?: string | null) {
    return getPrisma().contrato.findMany({
      where: {
        ...(orgaoId ? { unidadeGestoraId: orgaoId } : {}),
        OR: [
          { numeroGms: { contains: q, mode: 'insensitive' } },
          { objeto: { contains: q, mode: 'insensitive' } },
          { eProtocolo: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 8,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, numeroGms: true, anoGms: true, objeto: true, situacao: true },
    });
  },

  fornecedores(q: string) {
    const digits = q.replace(/\D/g, '') || q;
    return getPrisma().fornecedor.findMany({
      where: {
        OR: [
          { razaoSocial: { contains: q, mode: 'insensitive' } },
          { nomeFantasia: { contains: q, mode: 'insensitive' } },
          { documento: { contains: digits } },
        ],
      },
      take: 8,
      orderBy: { razaoSocial: 'asc' },
      select: { id: true, razaoSocial: true, documento: true },
    });
  },

  servidores(q: string, orgaoId?: string | null) {
    const digits = q.replace(/\D/g, '') || q;
    return getPrisma().servidor.findMany({
      where: {
        ativo: true,
        ...(orgaoId ? { orgaoId } : {}),
        OR: [
          { nome: { contains: q, mode: 'insensitive' } },
          { cpf: { contains: digits } },
        ],
      },
      take: 8,
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true, cargo: true },
    });
  },
};
