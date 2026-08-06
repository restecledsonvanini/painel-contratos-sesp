import type { AlertaQuery } from '@painel/schema';
import { getPrisma } from '../lib/prisma';
import { notFound } from '../lib/errors';

export type AlertaCandidate = {
  contratoId: string;
  tipo:
    | 'VENCIMENTO'
    | 'LIMITE_ACRESCIMO'
    | 'PRORROGACAO_ESGOTADA'
    | 'PUBLICACAO_PENDENTE'
    | 'GARANTIA_VENCENDO'
    | 'REAJUSTE_DEVIDO'
    | 'FORNECEDOR_SANCIONADO';
  severidade: 'INFO' | 'ATENCAO' | 'CRITICO';
  janelaDias: number | null;
  mensagem: string;
  dataReferencia: Date;
};

/** Normaliza para meia-noite UTC (compatível com @db.Date + unique idempotente). */
function asDateOnly(value: Date | string) {
  const d = value instanceof Date ? value : new Date(value);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function todayDate() {
  return asDateOnly(new Date());
}

export const alertaRepository = {
  async listConfigs() {
    const db = getPrisma();
    return db.alertaConfig.findMany({ orderBy: { tipo: 'asc' } });
  },

  async list(query: AlertaQuery, scope?: { orgaoId?: string | null }) {
    const db = getPrisma();
    return db.alerta.findMany({
      where: {
        ...(query.tipo ? { tipo: query.tipo } : {}),
        ...(query.severidade ? { severidade: query.severidade } : {}),
        ...(query.contratoId ? { contratoId: query.contratoId } : {}),
        ...(query.reconhecido === true
          ? { reconhecidoEm: { not: null } }
          : query.reconhecido === false
            ? { reconhecidoEm: null }
            : {}),
        ...(scope?.orgaoId
          ? { contrato: { unidadeGestoraId: scope.orgaoId } }
          : {}),
      },
      include: {
        contrato: {
          select: {
            id: true,
            numeroGms: true,
            anoGms: true,
            objeto: true,
            situacao: true,
          },
        },
      },
      orderBy: [{ severidade: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async reconhecer(id: string, actorId: string | null) {
    const db = getPrisma();
    const existing = await db.alerta.findUnique({ where: { id } });
    if (!existing) throw notFound('Alerta não encontrado');
    return db.alerta.update({
      where: { id },
      data: {
        reconhecidoPorId: actorId,
        reconhecidoEm: new Date(),
      },
      include: {
        contrato: {
          select: { id: true, numeroGms: true, anoGms: true, objeto: true },
        },
      },
    });
  },

  async upsertMany(candidates: AlertaCandidate[]) {
    const db = getPrisma();
    let created = 0;
    let updated = 0;
    for (const c of candidates) {
      const dataReferencia = asDateOnly(c.dataReferencia);
      const existing = await db.alerta.findUnique({
        where: {
          contratoId_tipo_dataReferencia: {
            contratoId: c.contratoId,
            tipo: c.tipo,
            dataReferencia,
          },
        },
      });
      if (existing) {
        if (existing.resolvidoEm) continue;
        await db.alerta.update({
          where: { id: existing.id },
          data: {
            severidade: c.severidade,
            janelaDias: c.janelaDias,
            mensagem: c.mensagem,
          },
        });
        updated += 1;
      } else {
        await db.alerta.create({
          data: {
            contratoId: c.contratoId,
            tipo: c.tipo,
            severidade: c.severidade,
            janelaDias: c.janelaDias,
            mensagem: c.mensagem,
            dataReferencia,
          },
        });
        created += 1;
      }
    }
    return { created, updated, total: candidates.length };
  },

  async collectCandidates(): Promise<AlertaCandidate[]> {
    const db = getPrisma();
    const configs = await db.alertaConfig.findMany({ where: { ativo: true } });
    const byTipo = new Map(configs.map((c) => [c.tipo, c]));
    const out: AlertaCandidate[] = [];

    const vencConfig = byTipo.get('VENCIMENTO');
    const janelas = (vencConfig?.janelasDias?.length ? vencConfig.janelasDias : [30, 60, 90, 120]).sort(
      (a, b) => a - b,
    );
    const maxJanela = Math.max(...janelas);

    const vigencia = await db.$queryRawUnsafe<
      Array<{
        contratoId: string;
        numeroGms: string;
        anoGms: number;
        diasAteVencimento: number;
        dataFimVigenciaAtual: Date;
        situacaoEfetiva: string;
      }>
    >(
      `SELECT "contratoId", "numeroGms", "anoGms",
              "diasAteVencimento"::int AS "diasAteVencimento",
              "dataFimVigenciaAtual", "situacaoEfetiva"
       FROM vw_contrato_vigencia
       WHERE "situacaoDeclarada" = 'VIGENTE'
         AND "diasAteVencimento" <= $1`,
      maxJanela,
    );

    for (const row of vigencia) {
      const dias = Number(row.diasAteVencimento);
      const janela = janelas.find((j) => dias <= j) ?? maxJanela;
      const severidade =
        dias <= 30 ? 'CRITICO' : dias <= 60 ? 'ATENCAO' : 'INFO';
      out.push({
        contratoId: row.contratoId,
        tipo: 'VENCIMENTO',
        severidade,
        janelaDias: janela,
        mensagem: `Contrato GMS ${row.numeroGms}/${row.anoGms} vence em ${dias} dia(s) (janela ${janela}).`,
        dataReferencia: asDateOnly(row.dataFimVigenciaAtual),
      });
    }

    if (byTipo.has('LIMITE_ACRESCIMO')) {
      const limites = await db.$queryRawUnsafe<
        Array<{
          contratoId: string;
          percentualAcrescido: number;
          limiteAcrescimoPercent: number;
          flagRiscoAcrescimo: boolean;
        }>
      >(
        `SELECT lim."contratoId", lim."percentualAcrescido"::float AS "percentualAcrescido",
                lim."limiteAcrescimoPercent"::float AS "limiteAcrescimoPercent",
                lim."flagRiscoAcrescimo"
         FROM vw_contrato_limites_legais lim
         JOIN "Contrato" c ON c."id" = lim."contratoId"
         WHERE c."situacao" = 'VIGENTE'
           AND (
             lim."flagRiscoAcrescimo" = true
             OR lim."percentualAcrescido" >= lim."limiteAcrescimoPercent" * 0.8
           )`,
      );
      for (const row of limites) {
        out.push({
          contratoId: row.contratoId,
          tipo: 'LIMITE_ACRESCIMO',
          severidade: Number(row.percentualAcrescido) >= Number(row.limiteAcrescimoPercent)
            ? 'CRITICO'
            : 'ATENCAO',
          janelaDias: null,
          mensagem: `Acréscimo em ${Number(row.percentualAcrescido).toFixed(1)}% (limite ${row.limiteAcrescimoPercent}%).`,
          dataReferencia: todayDate(),
        });
      }
    }

    if (byTipo.has('PRORROGACAO_ESGOTADA')) {
      const prazos = await db.$queryRawUnsafe<
        Array<{ contratoId: string; prazoRestanteMeses: number | null; flagRiscoPrazo: boolean }>
      >(
        `SELECT lim."contratoId", lim."prazoRestanteMeses"::int AS "prazoRestanteMeses", lim."flagRiscoPrazo"
         FROM vw_contrato_limites_legais lim
         JOIN "Contrato" c ON c."id" = lim."contratoId"
         WHERE c."situacao" = 'VIGENTE'
           AND (lim."flagRiscoPrazo" = true OR lim."prazoRestanteMeses" = 0)`,
      );
      for (const row of prazos) {
        out.push({
          contratoId: row.contratoId,
          tipo: 'PRORROGACAO_ESGOTADA',
          severidade: row.prazoRestanteMeses === 0 ? 'CRITICO' : 'ATENCAO',
          janelaDias: null,
          mensagem:
            row.prazoRestanteMeses === 0
              ? 'Limite de prorrogação esgotado.'
              : `Prazo de prorrogação próximo do limite (${row.prazoRestanteMeses} mês(es) restante(s)).`,
          dataReferencia: todayDate(),
        });
      }
    }

    if (byTipo.has('PUBLICACAO_PENDENTE')) {
      const pubJanela = byTipo.get('PUBLICACAO_PENDENTE')?.janelasDias?.[0] ?? 10;
      const pendentes = await db.$queryRawUnsafe<
        Array<{ contratoId: string; numeroGms: string; anoGms: number; diasSemPub: number }>
      >(
        `SELECT c."id" AS "contratoId", c."numeroGms", c."anoGms",
                (CURRENT_DATE - c."dataAssinatura")::int AS "diasSemPub"
         FROM "Contrato" c
         WHERE c."situacao" IN ('VIGENTE', 'EM_ELABORACAO')
           AND c."dataAssinatura" IS NOT NULL
           AND (CURRENT_DATE - c."dataAssinatura") >= $1
           AND NOT EXISTS (
             SELECT 1 FROM "Publicacao" p WHERE p."contratoId" = c."id"
           )`,
        pubJanela,
      );
      for (const row of pendentes) {
        out.push({
          contratoId: row.contratoId,
          tipo: 'PUBLICACAO_PENDENTE',
          severidade: Number(row.diasSemPub) >= 30 ? 'CRITICO' : 'ATENCAO',
          janelaDias: pubJanela,
          mensagem: `Publicação pendente há ${row.diasSemPub} dia(s) (GMS ${row.numeroGms}/${row.anoGms}).`,
          dataReferencia: todayDate(),
        });
      }
    }

    if (byTipo.has('GARANTIA_VENCENDO')) {
      const gJanelas = byTipo.get('GARANTIA_VENCENDO')?.janelasDias?.length
        ? byTipo.get('GARANTIA_VENCENDO')!.janelasDias
        : [30, 60];
      const maxG = Math.max(...gJanelas);
      const garantias = await db.$queryRawUnsafe<
        Array<{
          contratoId: string;
          garantiaValidade: Date;
          diasRestantes: number;
          numeroGms: string;
          anoGms: number;
        }>
      >(
        `SELECT c."id" AS "contratoId", c."garantiaValidade", c."numeroGms", c."anoGms",
                (c."garantiaValidade" - CURRENT_DATE)::int AS "diasRestantes"
         FROM "Contrato" c
         WHERE c."garantiaValidade" IS NOT NULL
           AND c."situacao" = 'VIGENTE'
           AND (c."garantiaValidade" - CURRENT_DATE) <= $1
           AND (c."garantiaValidade" - CURRENT_DATE) >= 0`,
        maxG,
      );
      for (const row of garantias) {
        const dias = Number(row.diasRestantes);
        const janela = gJanelas.find((j) => dias <= j) ?? maxG;
        out.push({
          contratoId: row.contratoId,
          tipo: 'GARANTIA_VENCENDO',
          severidade: dias <= 30 ? 'CRITICO' : 'ATENCAO',
          janelaDias: janela,
          mensagem: `Garantia do contrato GMS ${row.numeroGms}/${row.anoGms} vence em ${dias} dia(s).`,
          dataReferencia: asDateOnly(row.garantiaValidade),
        });
      }
    }

    if (byTipo.has('FORNECEDOR_SANCIONADO')) {
      const sancionados = await db.$queryRawUnsafe<
        Array<{ contratoId: string; razaoSocial: string; tipo: string }>
      >(
        `SELECT DISTINCT c."id" AS "contratoId", f."razaoSocial", s."tipo"::text AS "tipo"
         FROM "Contrato" c
         JOIN "Fornecedor" f ON f."id" = c."fornecedorId"
         JOIN "FornecedorSancao" s ON s."fornecedorId" = f."id"
         WHERE c."situacao" = 'VIGENTE'
           AND (s."dataFim" IS NULL OR s."dataFim" >= CURRENT_DATE)`,
      );
      for (const row of sancionados) {
        out.push({
          contratoId: row.contratoId,
          tipo: 'FORNECEDOR_SANCIONADO',
          severidade: 'CRITICO',
          janelaDias: null,
          mensagem: `Fornecedor ${row.razaoSocial} com sanção ativa (${row.tipo}).`,
          dataReferencia: todayDate(),
        });
      }
    }

    return out;
  },
};
