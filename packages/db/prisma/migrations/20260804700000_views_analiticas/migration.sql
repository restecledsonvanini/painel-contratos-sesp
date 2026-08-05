-- Fatia 7: views transacionais, MVs de dashboard, refresh e bi_readonly

DROP VIEW IF EXISTS view_consolidada CASCADE;

-- ========== Views transacionais ==========

CREATE OR REPLACE VIEW vw_contrato_vigencia AS
SELECT
  c."id" AS "contratoId",
  c."numeroGms",
  c."anoGms",
  c."situacao" AS "situacaoDeclarada",
  c."dataFimVigenciaOriginal",
  fn_data_fim_vigencia_atual(c."id") AS "dataFimVigenciaAtual",
  (fn_data_fim_vigencia_atual(c."id") - CURRENT_DATE) AS "diasAteVencimento",
  CASE
    WHEN c."situacao" <> 'VIGENTE' THEN c."situacao"::text
    WHEN (fn_data_fim_vigencia_atual(c."id") - CURRENT_DATE) < 0 THEN 'VENCIDO'
    WHEN (fn_data_fim_vigencia_atual(c."id") - CURRENT_DATE) <= 60 THEN 'A_VENCER'
    ELSE 'VIGENTE'
  END AS "situacaoEfetiva",
  (
    SELECT COUNT(*)::int FROM "AlteracaoContratual" a
    WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'
      AND a."tipo"::text LIKE 'ADITIVO_%'
  ) AS "qtdAditivos",
  (
    SELECT COUNT(*)::int FROM "AlteracaoContratual" a
    WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'
      AND a."tipo" IN ('ADITIVO_PRAZO', 'ADITIVO_PRAZO_VALOR')
  ) AS "qtdAditivosPrazo",
  (
    SELECT COUNT(*)::int FROM "AlteracaoContratual" a
    WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'
      AND a."tipo"::text LIKE 'APOSTILAMENTO_%'
  ) AS "qtdApostilamentos"
FROM "Contrato" c;

CREATE OR REPLACE VIEW vw_contrato_financeiro AS
SELECT
  c."id" AS "contratoId",
  c."valorGlobalOriginalCents",
  COALESCE((
    SELECT SUM(ROUND(i."quantidade" * i."valorUnitarioCents"))::bigint
    FROM "ItemContrato" i WHERE i."contratoId" = c."id"
  ), 0) AS "valorItensCents",
  COALESCE((
    SELECT SUM(a."valorAcrescidoCents") FROM "AlteracaoContratual" a
    WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'
  ), 0) AS "valorAcrescidoTotalCents",
  COALESCE((
    SELECT SUM(a."valorSuprimidoCents") FROM "AlteracaoContratual" a
    WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'
  ), 0) AS "valorSuprimidoTotalCents",
  COALESCE((
    SELECT SUM(
      CASE
        WHEN a."percentualReajuste" IS NULL THEN 0
        ELSE ROUND(c."valorGlobalOriginalCents" * a."percentualReajuste" / 100.0)
      END
    )::bigint
    FROM "AlteracaoContratual" a
    WHERE a."contratoId" = c."id"
      AND a."situacao" <> 'CANCELADO'
      AND a."tipo" IN ('APOSTILAMENTO_REAJUSTE', 'APOSTILAMENTO_REPACTUACAO', 'APOSTILAMENTO_REEQUILIBRIO')
  ), 0) AS "valorReajusteCents",
  (
    c."valorGlobalOriginalCents"
    + COALESCE((SELECT SUM(a."valorAcrescidoCents") FROM "AlteracaoContratual" a WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'), 0)
    - COALESCE((SELECT SUM(a."valorSuprimidoCents") FROM "AlteracaoContratual" a WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'), 0)
    + COALESCE((
      SELECT SUM(
        CASE WHEN a."percentualReajuste" IS NULL THEN 0
        ELSE ROUND(c."valorGlobalOriginalCents" * a."percentualReajuste" / 100.0) END
      )::bigint
      FROM "AlteracaoContratual" a
      WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'
        AND a."tipo" IN ('APOSTILAMENTO_REAJUSTE', 'APOSTILAMENTO_REPACTUACAO', 'APOSTILAMENTO_REEQUILIBRIO')
    ), 0)
  ) AS "valorGlobalAtualizadoCents",
  CASE
    WHEN c."valorGlobalOriginalCents" > 0 THEN
      (
        COALESCE((SELECT SUM(a."valorAcrescidoCents") FROM "AlteracaoContratual" a WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'), 0)::numeric
        / c."valorGlobalOriginalCents"::numeric
      ) * 100
    ELSE 0
  END AS "percentualAcrescido",
  COALESCE((
    SELECT SUM(e."valorCents") FROM "Empenho" e
    WHERE e."contratoId" = c."id" AND e."situacao" <> 'ANULADO'
  ), 0) AS "valorEmpenhadoCents",
  COALESCE((
    SELECT SUM(e."valorPagoCents") FROM "Empenho" e
    WHERE e."contratoId" = c."id" AND e."situacao" <> 'ANULADO'
  ), 0) AS "valorPagoCents",
  (
    c."valorGlobalOriginalCents"
    + COALESCE((SELECT SUM(a."valorAcrescidoCents") FROM "AlteracaoContratual" a WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'), 0)
    - COALESCE((SELECT SUM(a."valorSuprimidoCents") FROM "AlteracaoContratual" a WHERE a."contratoId" = c."id" AND a."situacao" <> 'CANCELADO'), 0)
    - COALESCE((SELECT SUM(e."valorCents") FROM "Empenho" e WHERE e."contratoId" = c."id" AND e."situacao" <> 'ANULADO'), 0)
  ) AS "saldoAExecutarCents"
FROM "Contrato" c;

CREATE OR REPLACE VIEW vw_contrato_limites_legais AS
SELECT
  c."id" AS "contratoId",
  c."naturezaObjeto",
  c."prorrogavel",
  c."limiteProrrogacaoMeses",
  f."percentualAcrescido",
  CASE
    WHEN c."naturezaObjeto" IN ('OBRA', 'SERVICO_ENGENHARIA') THEN 50
    ELSE 25
  END AS "limiteAcrescimoPercent",
  GREATEST(
    0,
    FLOOR(
      c."valorGlobalOriginalCents"
      * (CASE WHEN c."naturezaObjeto" IN ('OBRA', 'SERVICO_ENGENHARIA') THEN 50 ELSE 25 END)
      / 100.0
    )::bigint
    - f."valorAcrescidoTotalCents"
  ) AS "limiteAcrescimoDisponivelCents",
  GREATEST(
    0,
    (
      (EXTRACT(YEAR FROM v."dataFimVigenciaAtual") - EXTRACT(YEAR FROM c."dataFimVigenciaOriginal")) * 12
      + (EXTRACT(MONTH FROM v."dataFimVigenciaAtual") - EXTRACT(MONTH FROM c."dataFimVigenciaOriginal"))
    )::int
  ) AS "mesesProrrogadosAcumulados",
  CASE
    WHEN c."limiteProrrogacaoMeses" IS NULL THEN NULL
    ELSE GREATEST(
      0,
      c."limiteProrrogacaoMeses"
      - GREATEST(
        0,
        (
          (EXTRACT(YEAR FROM v."dataFimVigenciaAtual") - EXTRACT(YEAR FROM c."dataFimVigenciaOriginal")) * 12
          + (EXTRACT(MONTH FROM v."dataFimVigenciaAtual") - EXTRACT(MONTH FROM c."dataFimVigenciaOriginal"))
        )::int
      )
    )
  END AS "prazoRestanteMeses",
  (f."percentualAcrescido" > CASE WHEN c."naturezaObjeto" IN ('OBRA', 'SERVICO_ENGENHARIA') THEN 25 ELSE 20 END)
    AS "flagRiscoAcrescimo",
  (
    c."limiteProrrogacaoMeses" IS NOT NULL
    AND GREATEST(
      0,
      (
        (EXTRACT(YEAR FROM v."dataFimVigenciaAtual") - EXTRACT(YEAR FROM c."dataFimVigenciaOriginal")) * 12
        + (EXTRACT(MONTH FROM v."dataFimVigenciaAtual") - EXTRACT(MONTH FROM c."dataFimVigenciaOriginal"))
      )::int
    ) >= c."limiteProrrogacaoMeses" * 0.8
  ) AS "flagRiscoPrazo"
FROM "Contrato" c
JOIN vw_contrato_vigencia v ON v."contratoId" = c."id"
JOIN vw_contrato_financeiro f ON f."contratoId" = c."id";

CREATE OR REPLACE VIEW vw_contrato_publicidade AS
SELECT
  c."id" AS "contratoId",
  EXISTS (
    SELECT 1 FROM "Publicacao" p
    JOIN "DominioValor" dv ON dv."id" = p."veiculoId"
    WHERE p."contratoId" = c."id" AND dv."codigo" = 'PNCP'
  ) AS "publicadoPncp",
  (
    SELECT MIN(p."dataPublicacao") FROM "Publicacao" p WHERE p."contratoId" = c."id"
  ) AS "primeiraPublicacao",
  CASE
    WHEN c."dataAssinatura" IS NULL THEN NULL
    ELSE (
      SELECT MIN(p."dataPublicacao") - c."dataAssinatura"
      FROM "Publicacao" p WHERE p."contratoId" = c."id"
    )
  END AS "diasEntreAssinaturaEPublicacao",
  (
    SELECT COUNT(*)::int FROM "Publicacao" p WHERE p."contratoId" = c."id"
  ) AS "qtdPublicacoes",
  (
    c."situacao" IN ('ASSINADO', 'VIGENTE')
    AND NOT EXISTS (
      SELECT 1 FROM "Publicacao" p
      JOIN "DominioValor" dv ON dv."id" = p."veiculoId"
      WHERE p."contratoId" = c."id" AND dv."codigo" = 'PNCP'
    )
  ) AS "pendenciaPncp"
FROM "Contrato" c;

CREATE OR REPLACE VIEW vw_contrato_timeline AS
SELECT c."id" AS "contratoId", 'ASSINATURA'::text AS "tipo", c."dataAssinatura" AS "data",
  'Assinatura do contrato'::text AS "titulo", c."objeto" AS "detalhe",
  NULL::bigint AS "valorCents", 'Contrato'::text AS "origemTabela", c."id" AS "origemId"
FROM "Contrato" c WHERE c."dataAssinatura" IS NOT NULL
UNION ALL
SELECT c."id", 'INICIO_VIGENCIA', c."dataInicioVigencia", 'Início da vigência', NULL,
  NULL, 'Contrato', c."id"
FROM "Contrato" c
UNION ALL
SELECT c."id", 'FIM_VIGENCIA_ORIGINAL', c."dataFimVigenciaOriginal", 'Fim original da vigência', NULL,
  NULL, 'Contrato', c."id"
FROM "Contrato" c
UNION ALL
SELECT c."id", 'FIM_VIGENCIA_ATUAL', v."dataFimVigenciaAtual", 'Fim atual da vigência', NULL,
  NULL, 'Contrato', c."id"
FROM "Contrato" c
JOIN vw_contrato_vigencia v ON v."contratoId" = c."id"
WHERE v."dataFimVigenciaAtual" IS DISTINCT FROM c."dataFimVigenciaOriginal"
UNION ALL
SELECT c."id", 'ENCERRAMENTO', c."dataEncerramento", 'Encerramento', c."motivoEncerramento",
  NULL, 'Contrato', c."id"
FROM "Contrato" c WHERE c."dataEncerramento" IS NOT NULL
UNION ALL
SELECT a."contratoId", a."tipo"::text, a."dataAssinatura",
  COALESCE(a."eProtocolo", a."tipo"::text), a."objetoDescricao",
  a."valorAcrescidoCents" - a."valorSuprimidoCents", 'AlteracaoContratual', a."id"
FROM "AlteracaoContratual" a WHERE a."situacao" <> 'CANCELADO'
UNION ALL
SELECT p."contratoId", 'PUBLICACAO', p."dataPublicacao",
  COALESCE(dv."label", 'Publicação'), COALESCE(p."idPncp", p."numeroEdicao"),
  NULL, 'Publicacao', p."id"
FROM "Publicacao" p
LEFT JOIN "DominioValor" dv ON dv."id" = p."veiculoId"
WHERE p."contratoId" IS NOT NULL
UNION ALL
SELECT e."contratoId", 'EMPENHO', e."data",
  'Empenho ' || e."numero", e."situacao"::text, e."valorCents", 'Empenho', e."id"
FROM "Empenho" e WHERE e."situacao" <> 'ANULADO';

CREATE OR REPLACE VIEW vw_item_contrato_detalhado AS
SELECT
  i."id" AS "itemId",
  i."contratoId",
  i."sequencia",
  i."catalogoItemId",
  ci."nome" AS "catalogoNome",
  cat."codigo" AS "categoriaCodigo",
  cat."label" AS "categoriaLabel",
  i."quantidade",
  um."codigo" AS "unidadeMedida",
  i."valorUnitarioCents",
  ROUND(i."quantidade" * i."valorUnitarioCents")::bigint AS "valorTotalCents",
  i."periodicidade",
  i."atributos",
  i."unidadeDestinoId",
  ud."sigla" AS "unidadeDestinoSigla"
FROM "ItemContrato" i
JOIN "CatalogoItem" ci ON ci."id" = i."catalogoItemId"
JOIN "DominioValor" cat ON cat."id" = ci."categoriaItemId"
JOIN "DominioValor" um ON um."id" = i."unidadeMedidaId"
LEFT JOIN "UnidadeOrganizacional" ud ON ud."id" = i."unidadeDestinoId";

CREATE OR REPLACE VIEW vw_contrato_consolidado AS
SELECT
  c."id",
  c."numeroGms",
  c."anoGms",
  c."eProtocolo",
  c."objeto",
  c."pilar",
  c."naturezaObjeto",
  c."situacao",
  c."unidadeGestoraId",
  ug."sigla" AS "unidadeGestoraSigla",
  o."sigla" AS "orgaoSigla",
  o."nome" AS "orgaoNome",
  c."fornecedorId",
  f."razaoSocial" AS "fornecedorNome",
  mr."codigo" AS "modalidade",
  v."dataFimVigenciaAtual",
  v."diasAteVencimento",
  v."situacaoEfetiva",
  v."qtdAditivos",
  v."qtdApostilamentos",
  fin."valorGlobalOriginalCents",
  fin."valorGlobalAtualizadoCents",
  fin."percentualAcrescido",
  fin."valorEmpenhadoCents",
  fin."saldoAExecutarCents",
  lim."limiteAcrescimoDisponivelCents",
  lim."mesesProrrogadosAcumulados",
  lim."prazoRestanteMeses",
  lim."flagRiscoAcrescimo",
  lim."flagRiscoPrazo",
  pub."publicadoPncp",
  pub."pendenciaPncp"
FROM "Contrato" c
JOIN "UnidadeOrganizacional" ug ON ug."id" = c."unidadeGestoraId"
JOIN "Orgao" o ON o."id" = ug."orgaoId"
JOIN "Fornecedor" f ON f."id" = c."fornecedorId"
JOIN "DominioValor" mr ON mr."id" = c."modalidadeId"
JOIN vw_contrato_vigencia v ON v."contratoId" = c."id"
JOIN vw_contrato_financeiro fin ON fin."contratoId" = c."id"
JOIN vw_contrato_limites_legais lim ON lim."contratoId" = c."id"
JOIN vw_contrato_publicidade pub ON pub."contratoId" = c."id";

-- ========== Materialized views ==========

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_geral CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_geral AS
SELECT
  1 AS "id",
  COUNT(*)::int AS "totalContratos",
  COUNT(*) FILTER (WHERE v."situacaoEfetiva" = 'VIGENTE')::int AS "vigentes",
  COUNT(*) FILTER (WHERE v."situacaoEfetiva" = 'A_VENCER')::int AS "aVencer",
  COUNT(*) FILTER (WHERE v."situacaoEfetiva" = 'VENCIDO')::int AS "vencidos",
  COALESCE(SUM(fin."valorGlobalAtualizadoCents") FILTER (WHERE c."situacao" IN ('VIGENTE', 'ASSINADO', 'SUSPENSO')), 0) AS "valorSobGestaoCents",
  COALESCE(AVG(fin."percentualAcrescido") FILTER (WHERE c."situacao" IN ('VIGENTE', 'ASSINADO')), 0) AS "percentualAditadoMedio",
  NOW() AS "atualizadoEm"
FROM "Contrato" c
JOIN vw_contrato_vigencia v ON v."contratoId" = c."id"
JOIN vw_contrato_financeiro fin ON fin."contratoId" = c."id";
CREATE UNIQUE INDEX mv_kpi_geral_id_uidx ON mv_kpi_geral ("id");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_por_orgao CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_por_orgao AS
SELECT
  o."id" AS "orgaoId",
  o."sigla" AS "orgaoSigla",
  o."nome" AS "orgaoNome",
  COUNT(c."id")::int AS "qtdContratos",
  COALESCE(SUM(fin."valorGlobalAtualizadoCents"), 0) AS "valorCents",
  NOW() AS "atualizadoEm"
FROM "Orgao" o
JOIN "UnidadeOrganizacional" u ON u."orgaoId" = o."id"
JOIN "Contrato" c ON c."unidadeGestoraId" = u."id"
JOIN vw_contrato_financeiro fin ON fin."contratoId" = c."id"
GROUP BY o."id", o."sigla", o."nome";
CREATE UNIQUE INDEX mv_kpi_por_orgao_uidx ON mv_kpi_por_orgao ("orgaoId");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_vencimentos CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_vencimentos AS
SELECT
  CASE
    WHEN v."diasAteVencimento" < 0 THEN 'vencidos'
    WHEN v."diasAteVencimento" <= 30 THEN '0-30'
    WHEN v."diasAteVencimento" <= 60 THEN '31-60'
    WHEN v."diasAteVencimento" <= 90 THEN '61-90'
    WHEN v."diasAteVencimento" <= 120 THEN '91-120'
    WHEN v."diasAteVencimento" <= 180 THEN '121-180'
    ELSE '>180'
  END AS "janela",
  COUNT(*)::int AS "qtd",
  COALESCE(SUM(fin."valorGlobalAtualizadoCents"), 0) AS "valorCents",
  NOW() AS "atualizadoEm"
FROM vw_contrato_vigencia v
JOIN vw_contrato_financeiro fin ON fin."contratoId" = v."contratoId"
WHERE v."situacaoDeclarada" IN ('VIGENTE', 'ASSINADO')
GROUP BY 1;
CREATE UNIQUE INDEX mv_kpi_vencimentos_uidx ON mv_kpi_vencimentos ("janela");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_custos CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_custos AS
SELECT
  c."pilar"::text AS "pilar",
  nd."codigo" AS "naturezaDespesa",
  fr."codigo" AS "fonteRecurso",
  cd."exercicio",
  COALESCE(SUM(cd."valorPrevistoCents"), 0) AS "valorPrevistoCents",
  NOW() AS "atualizadoEm"
FROM "ContratoDotacao" cd
JOIN "Contrato" c ON c."id" = cd."contratoId"
JOIN "DotacaoOrcamentaria" d ON d."id" = cd."dotacaoId"
JOIN "DominioValor" nd ON nd."id" = d."naturezaDespesaId"
JOIN "DominioValor" fr ON fr."id" = d."fonteRecursoId"
GROUP BY c."pilar", nd."codigo", fr."codigo", cd."exercicio";
CREATE UNIQUE INDEX mv_kpi_custos_uidx ON mv_kpi_custos ("pilar", "naturezaDespesa", "fonteRecurso", "exercicio");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_evolucao_aditivos CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_evolucao_aditivos AS
SELECT
  date_trunc('month', a."dataAssinatura")::date AS "mes",
  COUNT(*)::int AS "qtdAditivos",
  COALESCE(SUM(a."valorAcrescidoCents"), 0) AS "valorAditadoCents",
  COALESCE(AVG(a."percentualReajuste"), 0) AS "indiceReajusteMedio",
  NOW() AS "atualizadoEm"
FROM "AlteracaoContratual" a
WHERE a."situacao" <> 'CANCELADO' AND a."tipo"::text LIKE 'ADITIVO_%'
GROUP BY 1;
CREATE UNIQUE INDEX mv_kpi_evolucao_aditivos_uidx ON mv_kpi_evolucao_aditivos ("mes");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_fornecedor_concentracao CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_fornecedor_concentracao AS
SELECT
  f."id" AS "fornecedorId",
  f."razaoSocial" AS "fornecedorNome",
  COUNT(c."id")::int AS "qtdContratos",
  COALESCE(SUM(fin."valorGlobalAtualizadoCents"), 0) AS "valorCents",
  CASE
    WHEN SUM(SUM(fin."valorGlobalAtualizadoCents")) OVER () > 0 THEN
      (SUM(fin."valorGlobalAtualizadoCents")::numeric / SUM(SUM(fin."valorGlobalAtualizadoCents")) OVER ()) * 100
    ELSE 0
  END AS "participacaoPercent",
  NOW() AS "atualizadoEm"
FROM "Fornecedor" f
JOIN "Contrato" c ON c."fornecedorId" = f."id"
JOIN vw_contrato_financeiro fin ON fin."contratoId" = c."id"
GROUP BY f."id", f."razaoSocial";
CREATE UNIQUE INDEX mv_kpi_fornecedor_concentracao_uidx ON mv_kpi_fornecedor_concentracao ("fornecedorId");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_carga_fiscal CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_carga_fiscal AS
SELECT
  s."id" AS "servidorId",
  s."nome" AS "servidorNome",
  cr."papel"::text AS "papel",
  COUNT(DISTINCT cr."contratoId")::int AS "qtdContratos",
  COALESCE(SUM(fin."valorGlobalAtualizadoCents"), 0) AS "valorCents",
  NOW() AS "atualizadoEm"
FROM "ContratoResponsavel" cr
JOIN "Servidor" s ON s."id" = cr."servidorId"
JOIN vw_contrato_financeiro fin ON fin."contratoId" = cr."contratoId"
WHERE cr."dataFim" IS NULL
GROUP BY s."id", s."nome", cr."papel";
CREATE UNIQUE INDEX mv_kpi_carga_fiscal_uidx ON mv_kpi_carga_fiscal ("servidorId", "papel");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_modalidade CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_modalidade AS
SELECT
  mr."codigo" AS "modalidade",
  mr."label" AS "modalidadeLabel",
  COUNT(c."id")::int AS "qtd",
  COALESCE(SUM(fin."valorGlobalAtualizadoCents"), 0) AS "valorCents",
  NOW() AS "atualizadoEm"
FROM "Contrato" c
JOIN "DominioValor" mr ON mr."id" = c."modalidadeId"
JOIN vw_contrato_financeiro fin ON fin."contratoId" = c."id"
GROUP BY mr."codigo", mr."label";
CREATE UNIQUE INDEX mv_kpi_modalidade_uidx ON mv_kpi_modalidade ("modalidade");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_itens_catalogo CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_itens_catalogo AS
SELECT
  ci."id" AS "catalogoItemId",
  ci."nome" AS "catalogoNome",
  cat."codigo" AS "categoria",
  COALESCE(SUM(i."quantidade"), 0) AS "quantidadeTotal",
  COALESCE(SUM(ROUND(i."quantidade" * i."valorUnitarioCents")), 0)::bigint AS "valorTotalCents",
  NOW() AS "atualizadoEm"
FROM "ItemContrato" i
JOIN "CatalogoItem" ci ON ci."id" = i."catalogoItemId"
JOIN "DominioValor" cat ON cat."id" = ci."categoriaItemId"
GROUP BY ci."id", ci."nome", cat."codigo";
CREATE UNIQUE INDEX mv_kpi_itens_catalogo_uidx ON mv_kpi_itens_catalogo ("catalogoItemId");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_frota CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_frota AS
SELECT
  COALESCE(i."atributos"->>'modalidadeUso', 'NAO_INFORMADO') AS "modalidadeUso",
  COALESCE(i."atributos"->>'caracterizacao', 'NAO_INFORMADO') AS "caracterizacao",
  COALESCE(i."atributos"->>'tipoVeiculo', 'NAO_INFORMADO') AS "tipoVeiculo",
  COALESCE(SUM(i."quantidade"), 0) AS "quantidade",
  CASE
    WHEN SUM(i."quantidade") > 0 THEN
      (SUM(i."quantidade" * i."valorUnitarioCents") / SUM(i."quantidade"))::bigint
    ELSE 0
  END AS "custoUnitarioMedioCents",
  NOW() AS "atualizadoEm"
FROM "ItemContrato" i
JOIN "CatalogoItem" ci ON ci."id" = i."catalogoItemId"
JOIN "DominioValor" cat ON cat."id" = ci."categoriaItemId"
WHERE cat."codigo" = 'VEICULO'
GROUP BY 1, 2, 3;
CREATE UNIQUE INDEX mv_kpi_frota_uidx ON mv_kpi_frota ("modalidadeUso", "caracterizacao", "tipoVeiculo");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_imoveis CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_imoveis AS
SELECT
  COALESCE(i."atributos"->>'destinacao', 'NAO_INFORMADO') AS "destinacao",
  COALESCE(SUM((i."atributos"->>'metragemM2')::numeric), 0) AS "metragemM2Total",
  COALESCE(SUM(i."quantidade" * i."valorUnitarioCents"), 0)::bigint AS "custoMensalCents",
  CASE
    WHEN SUM(COALESCE((i."atributos"->>'metragemM2')::numeric, 0)) > 0 THEN
      (SUM(i."quantidade" * i."valorUnitarioCents") / SUM((i."atributos"->>'metragemM2')::numeric))::bigint
    ELSE 0
  END AS "custoPorM2Cents",
  NOW() AS "atualizadoEm"
FROM "ItemContrato" i
JOIN "CatalogoItem" ci ON ci."id" = i."catalogoItemId"
JOIN "DominioValor" cat ON cat."id" = ci."categoriaItemId"
WHERE cat."codigo" = 'IMOVEL'
GROUP BY 1;
CREATE UNIQUE INDEX mv_kpi_imoveis_uidx ON mv_kpi_imoveis ("destinacao");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_postos_trabalho CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_postos_trabalho AS
SELECT
  COALESCE(ud."sigla", 'SEM_UNIDADE') AS "unidadeSigla",
  COALESCE(i."atributos"->>'nomePosto', ci."nome") AS "nomePosto",
  COALESCE(SUM(i."quantidade"), 0) AS "postos",
  COALESCE(SUM(i."quantidade" * i."valorUnitarioCents" * 12), 0)::bigint AS "custoAnualCents",
  NOW() AS "atualizadoEm"
FROM "ItemContrato" i
JOIN "CatalogoItem" ci ON ci."id" = i."catalogoItemId"
JOIN "DominioValor" cat ON cat."id" = ci."categoriaItemId"
LEFT JOIN "UnidadeOrganizacional" ud ON ud."id" = i."unidadeDestinoId"
WHERE cat."codigo" = 'POSTO_TRABALHO'
GROUP BY 1, 2;
CREATE UNIQUE INDEX mv_kpi_postos_trabalho_uidx ON mv_kpi_postos_trabalho ("unidadeSigla", "nomePosto");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_alimentacao CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_alimentacao AS
SELECT
  cat."codigo" AS "categoria",
  COALESCE(SUM(i."quantidade" * i."valorUnitarioCents" * 12), 0)::bigint AS "custoAnualCents",
  NOW() AS "atualizadoEm"
FROM "ItemContrato" i
JOIN "CatalogoItem" ci ON ci."id" = i."catalogoItemId"
JOIN "DominioValor" cat ON cat."id" = ci."categoriaItemId"
WHERE cat."codigo" IN ('ALIMENTO', 'REFEICAO')
GROUP BY cat."codigo";
CREATE UNIQUE INDEX mv_kpi_alimentacao_uidx ON mv_kpi_alimentacao ("categoria");

DROP MATERIALIZED VIEW IF EXISTS mv_kpi_publicidade CASCADE;
CREATE MATERIALIZED VIEW mv_kpi_publicidade AS
SELECT
  dv."codigo" AS "veiculo",
  COUNT(DISTINCT p."contratoId")::int AS "contratosPublicados",
  (
    SELECT COUNT(*)::int FROM "Contrato" c2 WHERE c2."situacao" IN ('ASSINADO', 'VIGENTE')
  ) AS "contratosElegiveis",
  CASE
    WHEN (SELECT COUNT(*) FROM "Contrato" c2 WHERE c2."situacao" IN ('ASSINADO', 'VIGENTE')) > 0 THEN
      (COUNT(DISTINCT p."contratoId")::numeric
        / (SELECT COUNT(*) FROM "Contrato" c2 WHERE c2."situacao" IN ('ASSINADO', 'VIGENTE'))::numeric) * 100
    ELSE 0
  END AS "percentualPublicado",
  NOW() AS "atualizadoEm"
FROM "DominioValor" dv
JOIN "Dominio" d ON d."id" = dv."dominioId" AND d."slug" = 'veiculo-publicacao'
LEFT JOIN "Publicacao" p ON p."veiculoId" = dv."id" AND p."contratoId" IS NOT NULL
GROUP BY dv."codigo";
CREATE UNIQUE INDEX mv_kpi_publicidade_uidx ON mv_kpi_publicidade ("veiculo");

CREATE OR REPLACE FUNCTION refresh_dashboard_views()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_geral;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_por_orgao;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_vencimentos;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_custos;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_evolucao_aditivos;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_fornecedor_concentracao;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_carga_fiscal;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_modalidade;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_itens_catalogo;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_frota;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_imoveis;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_postos_trabalho;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_alimentacao;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_kpi_publicidade;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bi_readonly') THEN
    CREATE ROLE bi_readonly NOLOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO bi_readonly;
GRANT SELECT ON
  vw_contrato_vigencia,
  vw_contrato_financeiro,
  vw_contrato_limites_legais,
  vw_contrato_publicidade,
  vw_contrato_timeline,
  vw_contrato_consolidado,
  vw_item_contrato_detalhado
TO bi_readonly;
GRANT SELECT ON
  mv_kpi_geral,
  mv_kpi_por_orgao,
  mv_kpi_vencimentos,
  mv_kpi_custos,
  mv_kpi_evolucao_aditivos,
  mv_kpi_fornecedor_concentracao,
  mv_kpi_carga_fiscal,
  mv_kpi_modalidade,
  mv_kpi_itens_catalogo,
  mv_kpi_frota,
  mv_kpi_imoveis,
  mv_kpi_postos_trabalho,
  mv_kpi_alimentacao,
  mv_kpi_publicidade
TO bi_readonly;
