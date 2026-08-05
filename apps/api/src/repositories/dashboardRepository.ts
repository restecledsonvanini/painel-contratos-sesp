import { getPrisma } from '../lib/prisma';

function serializeRow(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (typeof v === 'bigint') {
      out[k] = Number(v);
    } else if (v instanceof Date) {
      out[k] = v.toISOString().slice(0, 10);
    } else if (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v)) {
      // pg devolve bigint/numeric como string
      out[k] = Number(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function serializeRows(rows: unknown[]) {
  return (rows as Record<string, unknown>[]).map(serializeRow);
}

export const dashboardRepository = {
  async kpis() {
    const db = getPrisma();
    const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM mv_kpi_geral LIMIT 1`,
    );
    if (!rows[0]) return null;
    const row = serializeRow(rows[0]);
    for (const key of Object.keys(row)) {
      if (typeof row[key] === 'string' && /^-?\d+(\.\d+)?$/.test(row[key] as string)) {
        row[key] = Number(row[key]);
      }
    }
    return row;
  },

  async vencimentos() {
    const db = getPrisma();
    return serializeRows(
      await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_vencimentos ORDER BY
        CASE "janela"
          WHEN 'vencidos' THEN 0
          WHEN '0-30' THEN 1
          WHEN '31-60' THEN 2
          WHEN '61-90' THEN 3
          WHEN '91-120' THEN 4
          WHEN '121-180' THEN 5
          ELSE 6
        END`),
    );
  },

  async porOrgao() {
    const db = getPrisma();
    return serializeRows(
      await db.$queryRawUnsafe(
        `SELECT * FROM mv_kpi_por_orgao ORDER BY "valorCents" DESC`,
      ),
    );
  },

  async custos(agrupar?: string) {
    const db = getPrisma();
    if (agrupar === 'fonteRecurso') {
      return serializeRows(
        await db.$queryRawUnsafe(
          `SELECT "fonteRecurso", SUM("valorPrevistoCents")::bigint AS "valorPrevistoCents", MAX("atualizadoEm") AS "atualizadoEm"
           FROM mv_kpi_custos GROUP BY "fonteRecurso" ORDER BY SUM("valorPrevistoCents") DESC`,
        ),
      );
    }
    if (agrupar === 'naturezaDespesa') {
      return serializeRows(
        await db.$queryRawUnsafe(
          `SELECT "naturezaDespesa", SUM("valorPrevistoCents")::bigint AS "valorPrevistoCents", MAX("atualizadoEm") AS "atualizadoEm"
           FROM mv_kpi_custos GROUP BY "naturezaDespesa" ORDER BY SUM("valorPrevistoCents") DESC`,
        ),
      );
    }
    if (agrupar === 'pilar') {
      return serializeRows(
        await db.$queryRawUnsafe(
          `SELECT "pilar", SUM("valorPrevistoCents")::bigint AS "valorPrevistoCents", MAX("atualizadoEm") AS "atualizadoEm"
           FROM mv_kpi_custos GROUP BY "pilar" ORDER BY SUM("valorPrevistoCents") DESC`,
        ),
      );
    }
    return serializeRows(
      await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_custos ORDER BY "exercicio" DESC, "valorPrevistoCents" DESC`),
    );
  },

  async aditivos() {
    const db = getPrisma();
    return serializeRows(
      await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_evolucao_aditivos ORDER BY "mes"`),
    );
  },

  async fornecedores(limite = 10) {
    const db = getPrisma();
    return serializeRows(
      await db.$queryRawUnsafe(
        `SELECT * FROM mv_kpi_fornecedor_concentracao ORDER BY "valorCents" DESC LIMIT $1`,
        limite,
      ),
    );
  },

  async fiscalizacao() {
    const db = getPrisma();
    return serializeRows(
      await db.$queryRawUnsafe(
        `SELECT * FROM mv_kpi_carga_fiscal ORDER BY "qtdContratos" DESC, "valorCents" DESC`,
      ),
    );
  },

  async publicidade() {
    const db = getPrisma();
    return serializeRows(
      await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_publicidade ORDER BY "veiculo"`),
    );
  },

  async modalidade() {
    const db = getPrisma();
    return serializeRows(
      await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_modalidade ORDER BY "valorCents" DESC`),
    );
  },

  async frota() {
    const db = getPrisma();
    return serializeRows(await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_frota`));
  },

  async imoveis() {
    const db = getPrisma();
    return serializeRows(await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_imoveis`));
  },

  async postos() {
    const db = getPrisma();
    return serializeRows(await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_postos_trabalho`));
  },

  async alimentacao() {
    const db = getPrisma();
    return serializeRows(await db.$queryRawUnsafe(`SELECT * FROM mv_kpi_alimentacao`));
  },

  async itens(categoria?: string) {
    const db = getPrisma();
    if (categoria) {
      return serializeRows(
        await db.$queryRawUnsafe(
          `SELECT * FROM mv_kpi_itens_catalogo WHERE "categoria" = $1 ORDER BY "quantidadeTotal" DESC`,
          categoria,
        ),
      );
    }
    return serializeRows(
      await db.$queryRawUnsafe(
        `SELECT * FROM mv_kpi_itens_catalogo ORDER BY "quantidadeTotal" DESC`,
      ),
    );
  },

  async refresh() {
    const db = getPrisma();
    await db.$executeRawUnsafe(`SELECT refresh_dashboard_views()`);
    const kpis = await this.kpis();
    return { ok: true, atualizadoEm: kpis?.atualizadoEm ?? null };
  },

  async timeline(contratoId: string) {
    const db = getPrisma();
    return serializeRows(
      await db.$queryRawUnsafe(
        `SELECT * FROM vw_contrato_timeline WHERE "contratoId" = $1 ORDER BY "data" NULLS LAST, "tipo"`,
        contratoId,
      ),
    );
  },

  async limites(contratoId: string) {
    const db = getPrisma();
    const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM vw_contrato_limites_legais WHERE "contratoId" = $1`,
      contratoId,
    );
    return rows[0] ? serializeRow(rows[0]) : null;
  },

  async financeiro(contratoId: string) {
    const db = getPrisma();
    const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT f.*, v."dataFimVigenciaAtual", v."diasAteVencimento", v."situacaoEfetiva",
              p."publicadoPncp", p."pendenciaPncp"
       FROM vw_contrato_financeiro f
       JOIN vw_contrato_vigencia v ON v."contratoId" = f."contratoId"
       JOIN vw_contrato_publicidade p ON p."contratoId" = f."contratoId"
       WHERE f."contratoId" = $1`,
      contratoId,
    );
    return rows[0] ? serializeRow(rows[0]) : null;
  },

  async vigencia(contratoId: string) {
    const db = getPrisma();
    const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM vw_contrato_vigencia WHERE "contratoId" = $1`,
      contratoId,
    );
    return rows[0] ? serializeRow(rows[0]) : null;
  },
};
