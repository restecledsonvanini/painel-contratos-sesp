-- Fase 2: unidade gestora = Orgao; subunidade opcional; nivel/municipio nullable

-- UnidadeOrganizacional: campos opcionais
ALTER TABLE "UnidadeOrganizacional" ALTER COLUMN "municipioId" DROP NOT NULL;
ALTER TABLE "UnidadeOrganizacional" ALTER COLUMN "nivel" DROP NOT NULL;

-- Contrato: unidadeGestoraId (Unidade) → subunidadeId; nova unidadeGestoraId → Orgao
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "Contrato_unidadeGestoraId_fkey";

ALTER TABLE "Contrato" RENAME COLUMN "unidadeGestoraId" TO "subunidadeId";
ALTER TABLE "Contrato" ALTER COLUMN "subunidadeId" DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class WHERE relname = 'Contrato_unidadeGestoraId_idx'
  ) THEN
    ALTER INDEX "Contrato_unidadeGestoraId_idx" RENAME TO "Contrato_subunidadeId_idx";
  END IF;
END $$;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_subunidadeId_fkey"
  FOREIGN KEY ("subunidadeId") REFERENCES "UnidadeOrganizacional"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Contrato" ADD COLUMN IF NOT EXISTS "unidadeGestoraId" TEXT;

UPDATE "Contrato" AS c
SET "unidadeGestoraId" = u."orgaoId"
FROM "UnidadeOrganizacional" AS u
WHERE u."id" = c."subunidadeId"
  AND c."unidadeGestoraId" IS NULL;

-- Contratos sem subunidade (não deveria existir pré-migration): SESP como fallback
UPDATE "Contrato" AS c
SET "unidadeGestoraId" = o."id"
FROM "Orgao" AS o
WHERE c."unidadeGestoraId" IS NULL
  AND o.sigla = 'SESP';

ALTER TABLE "Contrato" ALTER COLUMN "unidadeGestoraId" SET NOT NULL;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_unidadeGestoraId_fkey"
  FOREIGN KEY ("unidadeGestoraId") REFERENCES "Orgao"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Contrato_unidadeGestoraId_idx" ON "Contrato"("unidadeGestoraId");
CREATE INDEX IF NOT EXISTS "Contrato_subunidadeId_idx" ON "Contrato"("subunidadeId");

-- Views/MVs que faziam hop Unidade → Orgao
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
  ug."sigla" AS "orgaoSigla",
  ug."nome" AS "orgaoNome",
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
JOIN "Orgao" ug ON ug."id" = c."unidadeGestoraId"
JOIN "Fornecedor" f ON f."id" = c."fornecedorId"
JOIN "DominioValor" mr ON mr."id" = c."modalidadeId"
JOIN vw_contrato_vigencia v ON v."contratoId" = c."id"
JOIN vw_contrato_financeiro fin ON fin."contratoId" = c."id"
JOIN vw_contrato_limites_legais lim ON lim."contratoId" = c."id"
JOIN vw_contrato_publicidade pub ON pub."contratoId" = c."id";

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
LEFT JOIN "Contrato" c ON c."unidadeGestoraId" = o."id"
LEFT JOIN vw_contrato_financeiro fin ON fin."contratoId" = c."id"
GROUP BY o."id", o."sigla", o."nome";
CREATE UNIQUE INDEX mv_kpi_por_orgao_uidx ON mv_kpi_por_orgao ("orgaoId");
