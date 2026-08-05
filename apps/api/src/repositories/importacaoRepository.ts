import { randomUUID } from 'node:crypto';
import {
  FornecedorImportLinhaSchema,
  ImportacaoCreateInput,
  ServidorImportLinhaSchema,
} from '@painel/schema';
import { getPrisma } from '../lib/prisma';
import { badRequest, notFound } from '../lib/errors';
import { fornecedorService, servidorService } from '../services/partesService';

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

function validateLinha(tipoEntidade: string, payload: Record<string, unknown>) {
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
  return {
    ok: false as const,
    erros: [{ message: `tipoEntidade não suportado: ${tipoEntidade}` }],
    normalizado: null,
  };
}

export const importacaoRepository = {
  async createDryRun(input: ImportacaoCreateInput, actorId: string | null) {
    const db = getPrisma();
    const rawRows =
      input.linhas && input.linhas.length
        ? input.linhas.map((r) => r as Record<string, unknown>)
        : parseCsv(input.csv ?? '').map((r) => r as Record<string, unknown>);

    if (!rawRows.length) throw badRequest('Nenhuma linha para importar');

    const linhasData = rawRows.map((payload, idx) => {
      const result = validateLinha(input.tipoEntidade, payload);
      return {
        id: randomUUID(),
        numeroLinha: idx + 1,
        payloadOriginal: payload,
        payloadNormalizado: result.normalizado,
        erros: result.erros,
      };
    });

    const linhasValidas = linhasData.filter((l) => !l.erros).length;
    const linhasComErro = linhasData.length - linhasValidas;

    const lote = await db.importacaoLote.create({
      data: {
        nomeArquivo: input.nomeArquivo,
        tipoEntidade: input.tipoEntidade,
        situacao: 'VALIDADO',
        totalLinhas: linhasData.length,
        linhasValidas,
        linhasComErro,
        executadoPorId: actorId,
        dryRun: true,
        resumo: {
          tipoEntidade: input.tipoEntidade,
          linhasValidas,
          linhasComErro,
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

    let aplicados = 0;
    for (const linha of lote.linhas) {
      if (!linha.payloadNormalizado) continue;
      const payload = linha.payloadNormalizado as Record<string, unknown>;
      let registroId: string | null = null;
      if (lote.tipoEntidade === 'fornecedor') {
        const created = await fornecedorService.create(payload);
        registroId = created.id;
      } else if (lote.tipoEntidade === 'servidor') {
        const created = await servidorService.create(payload);
        registroId = created.id;
      }
      await db.importacaoLinha.update({
        where: { id: linha.id },
        data: { registroCriadoId: registroId },
      });
      aplicados += 1;
    }

    return db.importacaoLote.update({
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
  },
};
