import { randomUUID } from 'node:crypto';
import {
  DotacaoImportLinhaSchema,
  FornecedorImportLinhaSchema,
  ImportacaoCreateInput,
  ServidorImportLinhaSchema,
  UnidadeImportLinhaSchema,
} from '@painel/schema';
import { getPrisma } from '../lib/prisma';
import { badRequest, notFound } from '../lib/errors';

type PrismaClientLike = ReturnType<typeof getPrisma>;
type TxClient = Parameters<Parameters<PrismaClientLike['$transaction']>[0]>[0];

async function resolveDominioValorId(
  db: PrismaClientLike | TxClient,
  slug: string,
  codigo: string,
) {
  const dominio = await db.dominio.findUnique({ where: { slug } });
  if (!dominio) return null;
  const valor = await db.dominioValor.findFirst({
    where: {
      dominioId: dominio.id,
      OR: [{ codigo: { equals: codigo, mode: 'insensitive' } }, { id: codigo }],
    },
  });
  return valor?.id ?? null;
}

function parseCsv(csv: string): Record<string, string>[] {
  const lines = csv
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] ?? '').trim();
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function lineError(err: unknown): object[] {
  if (err && typeof err === 'object' && 'code' in err && (err as { code?: string }).code === 'P2002') {
    return [{ message: 'Registro duplicado', path: [] }];
  }
  const message =
    err instanceof Error ? err.message : typeof err === 'string' ? err : 'Falha ao aplicar linha';
  return [{ message, path: [] }];
}

async function validateLinha(
  db: PrismaClientLike,
  tipoEntidade: string,
  payload: Record<string, unknown>,
) {
  if (tipoEntidade === 'fornecedor') {
    const parsed = FornecedorImportLinhaSchema.safeParse({
      ...payload,
      documento: String(payload.documento ?? payload.cnpj ?? '').replace(/\D/g, ''),
      razaoSocial: payload.razaoSocial ?? payload.nome,
    });
    if (!parsed.success) {
      return { ok: false as const, erros: parsed.error.errors, normalizado: null };
    }
    const expected = parsed.data.tipoPessoa === 'FISICA' ? 11 : 14;
    if (parsed.data.documento.length !== expected) {
      return {
        ok: false as const,
        erros: [
          {
            message:
              expected === 14
                ? 'CNPJ deve ter 14 dígitos'
                : 'CPF deve ter 11 dígitos',
            path: ['documento'],
          },
        ],
        normalizado: null,
      };
    }
    return { ok: true as const, erros: null, normalizado: parsed.data };
  }

  if (tipoEntidade === 'servidor') {
    const parsed = ServidorImportLinhaSchema.safeParse({
      ...payload,
      cpf: String(payload.cpf ?? '').replace(/\D/g, ''),
    });
    if (!parsed.success) {
      return { ok: false as const, erros: parsed.error.errors, normalizado: null };
    }
    if (parsed.data.cpf.replace(/\D/g, '').length !== 11) {
      return {
        ok: false as const,
        erros: [{ message: 'CPF deve ter 11 dígitos', path: ['cpf'] }],
        normalizado: null,
      };
    }
    return { ok: true as const, erros: null, normalizado: parsed.data };
  }

  if (tipoEntidade === 'dotacao') {
    const parsed = DotacaoImportLinhaSchema.safeParse({
      ...payload,
      naturezaDespesaCodigo:
        payload.naturezaDespesaCodigo ?? payload.naturezaDespesa ?? payload.natureza,
      fonteRecursoCodigo:
        payload.fonteRecursoCodigo ?? payload.fonteRecurso ?? payload.fonte,
    });
    if (!parsed.success) {
      return { ok: false as const, erros: parsed.error.errors, normalizado: null };
    }
    const naturezaDespesaId = await resolveDominioValorId(
      db,
      'natureza-despesa',
      parsed.data.naturezaDespesaCodigo,
    );
    if (!naturezaDespesaId) {
      return {
        ok: false as const,
        erros: [{ message: 'Natureza de despesa não encontrada', path: ['naturezaDespesaCodigo'] }],
        normalizado: null,
      };
    }
    const fonteRecursoId = await resolveDominioValorId(
      db,
      'fonte-recurso',
      parsed.data.fonteRecursoCodigo,
    );
    if (!fonteRecursoId) {
      return {
        ok: false as const,
        erros: [{ message: 'Fonte de recurso não encontrada', path: ['fonteRecursoCodigo'] }],
        normalizado: null,
      };
    }
    return {
      ok: true as const,
      erros: null,
      normalizado: {
        exercicio: parsed.data.exercicio,
        codigo: parsed.data.codigo,
        unidadeOrcamentaria: parsed.data.unidadeOrcamentaria ?? null,
        funcionalProgramatica: parsed.data.funcionalProgramatica ?? null,
        descricao: parsed.data.descricao ?? null,
        naturezaDespesaId,
        fonteRecursoId,
      },
    };
  }

  if (tipoEntidade === 'unidade') {
    const parsed = UnidadeImportLinhaSchema.safeParse({
      ...payload,
      orgaoSigla: payload.orgaoSigla ?? payload.orgao,
      parentSigla: payload.parentSigla ?? payload.parent ?? undefined,
    });
    if (!parsed.success) {
      return { ok: false as const, erros: parsed.error.errors, normalizado: null };
    }
    const orgao = await db.orgao.findFirst({
      where: { sigla: { equals: parsed.data.orgaoSigla, mode: 'insensitive' } },
    });
    if (!orgao) {
      return {
        ok: false as const,
        erros: [{ message: 'Órgão não encontrado', path: ['orgaoSigla'] }],
        normalizado: null,
      };
    }
    let parentId: string | null = null;
    if (parsed.data.parentSigla) {
      const parent = await db.unidadeOrganizacional.findFirst({
        where: {
          orgaoId: orgao.id,
          sigla: { equals: parsed.data.parentSigla, mode: 'insensitive' },
        },
      });
      if (!parent) {
        return {
          ok: false as const,
          erros: [{ message: 'Unidade pai não encontrada', path: ['parentSigla'] }],
          normalizado: null,
        };
      }
      parentId = parent.id;
    }
    return {
      ok: true as const,
      erros: null,
      normalizado: {
        orgaoId: orgao.id,
        parentId,
        sigla: parsed.data.sigla,
        nome: parsed.data.nome,
        nivel: parsed.data.nivel ?? null,
        ativo: parsed.data.ativo ?? true,
      },
    };
  }

  return {
    ok: false as const,
    erros: [{ message: `tipoEntidade não suportado: ${tipoEntidade}` }],
    normalizado: null,
  };
}

async function applyLinha(
  tx: TxClient,
  tipoEntidade: string,
  payload: Record<string, unknown>,
): Promise<string> {
  if (tipoEntidade === 'fornecedor') {
    const created = await tx.fornecedor.create({
      data: {
        documento: String(payload.documento),
        razaoSocial: String(payload.razaoSocial),
        tipoPessoa: (payload.tipoPessoa as 'JURIDICA' | 'FISICA') ?? 'JURIDICA',
        nomeFantasia: (payload.nomeFantasia as string | undefined) || null,
        situacao: (payload.situacao as 'ATIVO' | 'INATIVO' | 'IMPEDIDO' | 'INIDONEO') ?? 'ATIVO',
      },
    });
    return created.id;
  }

  if (tipoEntidade === 'servidor') {
    const created = await tx.servidor.create({
      data: {
        cpf: String(payload.cpf),
        nome: String(payload.nome),
        cargo: (payload.cargo as string | undefined) || null,
        email: (payload.email as string | undefined) || null,
        ativo: payload.ativo !== false,
      },
    });
    return created.id;
  }

  if (tipoEntidade === 'dotacao') {
    const exercicio = Number(payload.exercicio);
    const codigo = String(payload.codigo);
    const upserted = await tx.dotacaoOrcamentaria.upsert({
      where: { exercicio_codigo: { exercicio, codigo } },
      create: {
        exercicio,
        codigo,
        unidadeOrcamentaria: (payload.unidadeOrcamentaria as string | null) ?? null,
        funcionalProgramatica: (payload.funcionalProgramatica as string | null) ?? null,
        descricao: (payload.descricao as string | null) ?? null,
        naturezaDespesaId: String(payload.naturezaDespesaId),
        fonteRecursoId: String(payload.fonteRecursoId),
      },
      update: {
        unidadeOrcamentaria: (payload.unidadeOrcamentaria as string | null) ?? null,
        funcionalProgramatica: (payload.funcionalProgramatica as string | null) ?? null,
        descricao: (payload.descricao as string | null) ?? null,
        naturezaDespesaId: String(payload.naturezaDespesaId),
        fonteRecursoId: String(payload.fonteRecursoId),
      },
    });
    return upserted.id;
  }

  if (tipoEntidade === 'unidade') {
    const orgaoId = String(payload.orgaoId);
    const sigla = String(payload.sigla);
    const upserted = await tx.unidadeOrganizacional.upsert({
      where: { orgaoId_sigla: { orgaoId, sigla } },
      create: {
        orgaoId,
        sigla,
        nome: String(payload.nome),
        parentId: (payload.parentId as string | null) ?? null,
        nivel: (payload.nivel as
          | 'COMANDO_GERAL'
          | 'DIRETORIA'
          | 'COMANDO_REGIONAL'
          | 'BATALHAO'
          | 'COMPANHIA'
          | 'DELEGACIA'
          | 'UNIDADE_PRISIONAL'
          | 'SETOR'
          | null) ?? null,
        ativo: payload.ativo !== false,
      },
      update: {
        nome: String(payload.nome),
        parentId: (payload.parentId as string | null) ?? null,
        nivel: (payload.nivel as
          | 'COMANDO_GERAL'
          | 'DIRETORIA'
          | 'COMANDO_REGIONAL'
          | 'BATALHAO'
          | 'COMPANHIA'
          | 'DELEGACIA'
          | 'UNIDADE_PRISIONAL'
          | 'SETOR'
          | null) ?? null,
        ativo: payload.ativo !== false,
      },
    });
    return upserted.id;
  }

  throw badRequest(`tipoEntidade não suportado: ${tipoEntidade}`);
}

export const importacaoRepository = {
  async createDryRun(input: ImportacaoCreateInput, actorId: string | null) {
    const db = getPrisma();
    const dryRun = input.dryRun !== false;
    const rawRows =
      input.linhas && input.linhas.length
        ? input.linhas.map((r) => r as Record<string, unknown>)
        : parseCsv(input.csv ?? '').map((r) => r as Record<string, unknown>);

    if (!rawRows.length) throw badRequest('Nenhuma linha para importar');

    const linhasData = [];
    for (let idx = 0; idx < rawRows.length; idx += 1) {
      const payload = rawRows[idx];
      const result = await validateLinha(db, input.tipoEntidade, payload);
      linhasData.push({
        id: randomUUID(),
        numeroLinha: idx + 1,
        payloadOriginal: payload,
        payloadNormalizado: result.normalizado,
        erros: result.erros,
      });
    }

    const linhasValidas = linhasData.filter((l) => !l.erros).length;
    const linhasComErro = linhasData.length - linhasValidas;

    const lote = await db.importacaoLote.create({
      data: {
        nomeArquivo: input.nomeArquivo,
        tipoEntidade: input.tipoEntidade,
        situacao: dryRun ? 'VALIDADO' : 'RECEBIDO',
        totalLinhas: linhasData.length,
        linhasValidas,
        linhasComErro,
        executadoPorId: actorId,
        dryRun,
        resumo: {
          tipoEntidade: input.tipoEntidade,
          linhasValidas,
          linhasComErro,
          dryRun,
        },
        linhas: {
          create: linhasData.map((l) => ({
            id: l.id,
            numeroLinha: l.numeroLinha,
            payloadOriginal: l.payloadOriginal as object,
            payloadNormalizado: (l.payloadNormalizado ?? undefined) as object | undefined,
            erros: (l.erros ?? undefined) as object | undefined,
          })),
        },
      },
      include: { linhas: { orderBy: { numeroLinha: 'asc' } } },
    });

    if (!dryRun && linhasComErro === 0) {
      return this.aplicar(lote.id, actorId);
    }

    return lote;
  },

  async get(id: string) {
    const db = getPrisma();
    const lote = await db.importacaoLote.findUnique({
      where: { id },
      include: { linhas: { orderBy: { numeroLinha: 'asc' } } },
    });
    if (!lote) throw notFound('Importação não encontrada');
    return lote;
  },

  async aplicar(id: string, actorId: string | null) {
    const db = getPrisma();
    const lote = await this.get(id);
    if (lote.situacao === 'APLICADO') return lote;
    if (lote.situacao === 'REJEITADO') throw badRequest('Lote rejeitado');
    if (lote.linhasComErro > 0) {
      throw badRequest('Corrija as linhas com erro antes de aplicar', {
        linhasComErro: lote.linhasComErro,
      });
    }

    let failedLinhaId: string | null = null;
    let failedErr: unknown = null;

    try {
      return await db.$transaction(async (tx) => {
        let aplicados = 0;
        for (const linha of lote.linhas) {
          if (!linha.payloadNormalizado) continue;
          const payload = linha.payloadNormalizado as Record<string, unknown>;
          try {
            const registroId = await applyLinha(tx, lote.tipoEntidade, payload);
            await tx.importacaoLinha.update({
              where: { id: linha.id },
              data: { registroCriadoId: registroId },
            });
            aplicados += 1;
          } catch (err) {
            failedLinhaId = linha.id;
            failedErr = err;
            throw err;
          }
        }

        return tx.importacaoLote.update({
          where: { id },
          data: {
            situacao: 'APLICADO',
            dryRun: false,
            executadoPorId: actorId ?? lote.executadoPorId,
            resumo: {
              ...(typeof lote.resumo === 'object' && lote.resumo ? lote.resumo : {}),
              aplicados,
            },
          },
          include: { linhas: { orderBy: { numeroLinha: 'asc' } } },
        });
      });
    } catch (err) {
      if (failedLinhaId) {
        await db.importacaoLinha.update({
          where: { id: failedLinhaId },
          data: { erros: lineError(failedErr ?? err) as object },
        });
        await db.importacaoLote.update({
          where: { id },
          data: {
            linhasComErro: { increment: 1 },
            linhasValidas: { decrement: 1 },
          },
        });
      }
      throw badRequest('Falha ao aplicar importação; nenhuma linha foi gravada', {
        linhaId: failedLinhaId,
        detalhe: lineError(failedErr ?? err),
      });
    }
  },
};
