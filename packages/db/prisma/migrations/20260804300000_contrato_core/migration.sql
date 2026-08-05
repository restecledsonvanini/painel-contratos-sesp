-- Fatia 3: Contrato reestruturado + ProcessoContratacao + Responsavel + Rateio

DROP VIEW IF EXISTS "view_consolidada" CASCADE;

CREATE TYPE "PilarOrcamentario" AS ENUM ('CUSTEIO', 'INVESTIMENTO', 'SERVICOS');
CREATE TYPE "NaturezaObjeto" AS ENUM (
  'SERVICO_CONTINUADO', 'SERVICO_NAO_CONTINUADO', 'OBRA', 'SERVICO_ENGENHARIA',
  'COMPRA', 'LOCACAO_BEM_MOVEL', 'LOCACAO_IMOVEL', 'SOLUCAO_TIC'
);
CREATE TYPE "SituacaoContrato" AS ENUM (
  'EM_ELABORACAO', 'ASSINADO', 'VIGENTE', 'SUSPENSO', 'RESCINDIDO', 'ENCERRADO', 'ANULADO'
);
CREATE TYPE "UnidadeTempo" AS ENUM ('DIAS', 'MESES', 'ANOS');
CREATE TYPE "TipoGarantia" AS ENUM ('NENHUMA', 'CAUCAO', 'SEGURO_GARANTIA', 'FIANCA_BANCARIA');
CREATE TYPE "PapelResponsavel" AS ENUM (
  'GESTOR', 'GESTOR_SUBSTITUTO', 'FISCAL_TECNICO', 'FISCAL_ADMINISTRATIVO',
  'FISCAL_SETORIAL', 'FISCAL_SUBSTITUTO', 'PREPOSTO_CONTRATADA'
);
CREATE TYPE "SituacaoProcesso" AS ENUM (
  'PLANEJAMENTO', 'EM_ANALISE_JURIDICA', 'EM_LICITACAO', 'HOMOLOGADO',
  'CONTRATADO', 'FRACASSADO', 'DESERTO', 'CANCELADO'
);

-- ProcessoContratacao
CREATE TABLE "ProcessoContratacao" (
  "id" TEXT NOT NULL,
  "eProtocolo" TEXT NOT NULL,
  "ano" INTEGER NOT NULL,
  "objetoResumo" TEXT NOT NULL,
  "unidadeDemandanteId" TEXT NOT NULL,
  "modalidadePretendidaId" TEXT,
  "valorEstimadoCents" BIGINT,
  "etpConcluido" BOOLEAN NOT NULL DEFAULT false,
  "dataEtp" DATE,
  "termoReferenciaConcluido" BOOLEAN NOT NULL DEFAULT false,
  "dataTermoReferencia" DATE,
  "situacao" "SituacaoProcesso" NOT NULL DEFAULT 'PLANEJAMENTO',
  "observacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProcessoContratacao_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProcessoContratacao_eProtocolo_key" ON "ProcessoContratacao"("eProtocolo");
CREATE INDEX "ProcessoContratacao_ano_idx" ON "ProcessoContratacao"("ano");
CREATE INDEX "ProcessoContratacao_situacao_idx" ON "ProcessoContratacao"("situacao");

ALTER TABLE "ProcessoContratacao"
  ADD CONSTRAINT "ProcessoContratacao_unidadeDemandanteId_fkey"
  FOREIGN KEY ("unidadeDemandanteId") REFERENCES "UnidadeOrganizacional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProcessoContratacao"
  ADD CONSTRAINT "ProcessoContratacao_modalidadePretendidaId_fkey"
  FOREIGN KEY ("modalidadePretendidaId") REFERENCES "DominioValor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Snapshot legado do Contrato
CREATE TABLE "_Contrato_legado" AS SELECT * FROM "Contrato";

-- Drop constraints/indexes antigos de Contrato
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "chk_gestor_fiscal";
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "Contrato_unidadeFspId_fkey";
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "Contrato_gestorId_fkey";
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "Contrato_fiscalId_fkey";
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "Contrato_fornecedorId_fkey";
DROP INDEX IF EXISTS "Contrato_numGms_anoGms_key";
DROP INDEX IF EXISTS "Contrato_dataFimOrig_idx";
DROP INDEX IF EXISTS "Contrato_unidadeFspId_idx";
DROP INDEX IF EXISTS "Contrato_protocoloCabeca_key";

-- Novas colunas (nullable durante backfill)
ALTER TABLE "Contrato"
  ADD COLUMN IF NOT EXISTS "processoId" TEXT,
  ADD COLUMN IF NOT EXISTS "numeroGms" TEXT,
  ADD COLUMN IF NOT EXISTS "numeroContrato" TEXT,
  ADD COLUMN IF NOT EXISTS "eProtocolo" TEXT,
  ADD COLUMN IF NOT EXISTS "pilar" "PilarOrcamentario",
  ADD COLUMN IF NOT EXISTS "categoriaContratacaoId" TEXT,
  ADD COLUMN IF NOT EXISTS "naturezaObjeto" "NaturezaObjeto",
  ADD COLUMN IF NOT EXISTS "modalidadeId" TEXT,
  ADD COLUMN IF NOT EXISTS "fundamentoLegalId" TEXT,
  ADD COLUMN IF NOT EXISTS "unidadeGestoraId" TEXT,
  ADD COLUMN IF NOT EXISTS "dataAssinatura" DATE,
  ADD COLUMN IF NOT EXISTS "dataInicioVigencia" DATE,
  ADD COLUMN IF NOT EXISTS "prazoInicialValor" INTEGER,
  ADD COLUMN IF NOT EXISTS "prazoInicialUnidade" "UnidadeTempo",
  ADD COLUMN IF NOT EXISTS "dataFimVigenciaOriginal" DATE,
  ADD COLUMN IF NOT EXISTS "prorrogavel" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "limiteProrrogacaoMeses" INTEGER,
  ADD COLUMN IF NOT EXISTS "valorGlobalOriginalCents" BIGINT,
  ADD COLUMN IF NOT EXISTS "indiceReajuste" TEXT,
  ADD COLUMN IF NOT EXISTS "mesAniversarioReajuste" INTEGER,
  ADD COLUMN IF NOT EXISTS "situacao" "SituacaoContrato",
  ADD COLUMN IF NOT EXISTS "dataEncerramento" DATE,
  ADD COLUMN IF NOT EXISTS "motivoEncerramento" TEXT,
  ADD COLUMN IF NOT EXISTS "garantiaTipo" "TipoGarantia",
  ADD COLUMN IF NOT EXISTS "garantiaValorCents" BIGINT,
  ADD COLUMN IF NOT EXISTS "garantiaValidade" DATE,
  ADD COLUMN IF NOT EXISTS "reservaObservacao" TEXT,
  ADD COLUMN IF NOT EXISTS "observacoes" TEXT,
  ADD COLUMN IF NOT EXISTS "codigoLegado" TEXT;

-- Backfill: GMS, protocolo, valores, datas, situação
UPDATE "Contrato" c SET
  "numeroGms" = c."numGms"::text,
  "eProtocolo" = c."protocoloCabeca",
  "valorGlobalOriginalCents" = c."valorAnualCents"::bigint,
  "dataAssinatura" = c."dataInicio",
  "dataInicioVigencia" = COALESCE(c."dataInicio", CURRENT_DATE),
  "dataFimVigenciaOriginal" = COALESCE(
    c."dataFimOrig",
    COALESCE(c."dataInicio", CURRENT_DATE) + INTERVAL '1 year'
  ),
  "prazoInicialValor" = GREATEST(
    1,
    ROUND(
      EXTRACT(EPOCH FROM (
        COALESCE(c."dataFimOrig", COALESCE(c."dataInicio", CURRENT_DATE) + INTERVAL '1 year')
        - COALESCE(c."dataInicio", CURRENT_DATE)
      )) / (30.4375 * 24 * 3600)
    )::int
  ),
  "prazoInicialUnidade" = 'MESES',
  "prorrogavel" = true,
  "limiteProrrogacaoMeses" = 120,
  "situacao" = CASE lower(c."status")
    WHEN 'vigente' THEN 'VIGENTE'::"SituacaoContrato"
    WHEN 'encerrado' THEN 'ENCERRADO'::"SituacaoContrato"
    WHEN 'suspenso' THEN 'SUSPENSO'::"SituacaoContrato"
    WHEN 'rescindido' THEN 'RESCINDIDO'::"SituacaoContrato"
    ELSE 'VIGENTE'::"SituacaoContrato"
  END,
  "pilar" = 'SERVICOS'::"PilarOrcamentario",
  "naturezaObjeto" = CASE
    WHEN c."objeto" ILIKE '%imóvel%' OR c."objeto" ILIKE '%imovel%' THEN 'LOCACAO_IMOVEL'::"NaturezaObjeto"
    WHEN c."objeto" ILIKE '%viatura%' OR c."objeto" ILIKE '%locação%' OR c."objeto" ILIKE '%locacao%' THEN 'LOCACAO_BEM_MOVEL'::"NaturezaObjeto"
    WHEN c."objeto" ILIKE '%software%' OR c."objeto" ILIKE '%tic%' THEN 'SOLUCAO_TIC'::"NaturezaObjeto"
    WHEN c."objeto" ILIKE '%alimento%' OR c."objeto" ILIKE '%gênero%' OR c."objeto" ILIKE '%genero%' THEN 'COMPRA'::"NaturezaObjeto"
    ELSE 'SERVICO_CONTINUADO'::"NaturezaObjeto"
  END;

-- unidadeGestoraId: UnidadeFsp.sigla → UnidadeOrganizacional raiz do órgão
UPDATE "Contrato" c
SET "unidadeGestoraId" = mapped.unidade_id
FROM (
  SELECT
    uf.id AS fsp_id,
    COALESCE(
      (
        SELECT u.id
        FROM "UnidadeOrganizacional" u
        JOIN "Orgao" o ON o.id = u."orgaoId"
        WHERE o.sigla = uf.sigla
          AND u."parentId" IS NULL
          AND u.ativo = true
        ORDER BY u.sigla
        LIMIT 1
      ),
      (
        SELECT u.id
        FROM "UnidadeOrganizacional" u
        JOIN "Orgao" o ON o.id = u."orgaoId"
        WHERE o.sigla = uf.sigla AND u.ativo = true
        ORDER BY u.sigla
        LIMIT 1
      ),
      (SELECT u.id FROM "UnidadeOrganizacional" u WHERE u.ativo = true ORDER BY u.sigla LIMIT 1)
    ) AS unidade_id
  FROM "UnidadeFsp" uf
) mapped
WHERE c."unidadeFspId" = mapped.fsp_id;

-- Fallback global se ainda nulo
UPDATE "Contrato"
SET "unidadeGestoraId" = (SELECT u.id FROM "UnidadeOrganizacional" u WHERE u.ativo = true ORDER BY u.sigla LIMIT 1)
WHERE "unidadeGestoraId" IS NULL;

-- modalidadeId
UPDATE "Contrato" c
SET "modalidadeId" = dv.id
FROM "DominioValor" dv
JOIN "Dominio" d ON d.id = dv."dominioId"
WHERE d.slug = 'modalidade-licitacao'
  AND upper(dv.codigo) = upper(c."modalidade");

UPDATE "Contrato"
SET "modalidadeId" = (
  SELECT dv.id
  FROM "DominioValor" dv
  JOIN "Dominio" d ON d.id = dv."dominioId"
  WHERE d.slug = 'modalidade-licitacao' AND dv.codigo = 'DISPENSA'
  LIMIT 1
)
WHERE "modalidadeId" IS NULL;

-- categoriaContratacaoId
UPDATE "Contrato" c
SET "categoriaContratacaoId" = dv.id
FROM "DominioValor" dv
JOIN "Dominio" d ON d.id = dv."dominioId"
WHERE d.slug = 'categoria-contratacao'
  AND dv.codigo = CASE
    WHEN c."objeto" ILIKE '%viatura%' THEN 'LOCACAO_VEICULOS'
    WHEN c."objeto" ILIKE '%imóvel%' OR c."objeto" ILIKE '%imovel%' THEN 'LOCACAO_IMOVEIS'
    WHEN c."objeto" ILIKE '%alimento%' OR c."objeto" ILIKE '%gênero%' OR c."objeto" ILIKE '%genero%' THEN 'GENEROS_ALIMENTICIOS'
    WHEN c."objeto" ILIKE '%software%' THEN 'SERVICO_EVENTUAL'
    ELSE 'SERVICO_EVENTUAL'
  END;

UPDATE "Contrato"
SET "categoriaContratacaoId" = (
  SELECT dv.id
  FROM "DominioValor" dv
  JOIN "Dominio" d ON d.id = dv."dominioId"
  WHERE d.slug = 'categoria-contratacao'
  ORDER BY dv.ordem
  LIMIT 1
)
WHERE "categoriaContratacaoId" IS NULL;

-- ContratoResponsavel a partir de gestor/fiscal
CREATE TABLE "ContratoResponsavel" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT NOT NULL,
  "servidorId" TEXT NOT NULL,
  "papel" "PapelResponsavel" NOT NULL,
  "atoDesignacao" TEXT,
  "dataInicio" DATE NOT NULL,
  "dataFim" DATE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContratoResponsavel_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContratoResponsavel_contratoId_idx" ON "ContratoResponsavel"("contratoId");
CREATE INDEX "ContratoResponsavel_servidorId_papel_idx" ON "ContratoResponsavel"("servidorId", "papel");

INSERT INTO "ContratoResponsavel" ("id", "contratoId", "servidorId", "papel", "dataInicio", "createdAt")
SELECT gen_random_uuid()::text, c.id, c."gestorId", 'GESTOR'::"PapelResponsavel",
       COALESCE(c."dataInicioVigencia", CURRENT_DATE), CURRENT_TIMESTAMP
FROM "Contrato" c
WHERE c."gestorId" IS NOT NULL;

INSERT INTO "ContratoResponsavel" ("id", "contratoId", "servidorId", "papel", "dataInicio", "createdAt")
SELECT gen_random_uuid()::text, c.id, c."fiscalId", 'FISCAL_TECNICO'::"PapelResponsavel",
       COALESCE(c."dataInicioVigencia", CURRENT_DATE), CURRENT_TIMESTAMP
FROM "Contrato" c
WHERE c."fiscalId" IS NOT NULL AND c."fiscalId" <> c."gestorId";

-- Um GESTOR vigente por contrato
CREATE UNIQUE INDEX "ContratoResponsavel_um_gestor_vigente_idx"
  ON "ContratoResponsavel"("contratoId")
  WHERE "papel" = 'GESTOR' AND "dataFim" IS NULL;

ALTER TABLE "ContratoResponsavel"
  ADD CONSTRAINT "ContratoResponsavel_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContratoResponsavel"
  ADD CONSTRAINT "ContratoResponsavel_servidorId_fkey"
  FOREIGN KEY ("servidorId") REFERENCES "Servidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ContratoRateio
CREATE TABLE "ContratoRateio" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT NOT NULL,
  "unidadeId" TEXT NOT NULL,
  "percentual" DECIMAL(7,4),
  "valorCents" BIGINT,
  "quantidade" DECIMAL(14,4),
  "observacao" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContratoRateio_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContratoRateio_contratoId_unidadeId_key" ON "ContratoRateio"("contratoId", "unidadeId");
CREATE INDEX "ContratoRateio_unidadeId_idx" ON "ContratoRateio"("unidadeId");

ALTER TABLE "ContratoRateio"
  ADD CONSTRAINT "ContratoRateio_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContratoRateio"
  ADD CONSTRAINT "ContratoRateio_unidadeId_fkey"
  FOREIGN KEY ("unidadeId") REFERENCES "UnidadeOrganizacional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ContratoRateio"
  ADD CONSTRAINT "ContratoRateio_pct_ou_valor_chk"
  CHECK ("percentual" IS NOT NULL OR "valorCents" IS NOT NULL);

-- Rateio inicial 100% na unidade gestora
INSERT INTO "ContratoRateio" ("id", "contratoId", "unidadeId", "percentual", "createdAt")
SELECT gen_random_uuid()::text, c.id, c."unidadeGestoraId", 100.0000, CURRENT_TIMESTAMP
FROM "Contrato" c
WHERE c."unidadeGestoraId" IS NOT NULL;

-- NOT NULL nas colunas essenciais
ALTER TABLE "Contrato" ALTER COLUMN "numeroGms" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "pilar" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "categoriaContratacaoId" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "naturezaObjeto" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "modalidadeId" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "unidadeGestoraId" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "dataInicioVigencia" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "prazoInicialValor" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "prazoInicialUnidade" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "prazoInicialUnidade" SET DEFAULT 'MESES';
ALTER TABLE "Contrato" ALTER COLUMN "dataFimVigenciaOriginal" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "prorrogavel" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "prorrogavel" SET DEFAULT true;
ALTER TABLE "Contrato" ALTER COLUMN "valorGlobalOriginalCents" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "situacao" SET NOT NULL;
ALTER TABLE "Contrato" ALTER COLUMN "situacao" SET DEFAULT 'EM_ELABORACAO';

-- Drop colunas legadas
ALTER TABLE "Contrato"
  DROP COLUMN IF EXISTS "protocoloCabeca",
  DROP COLUMN IF EXISTS "numGms",
  DROP COLUMN IF EXISTS "unidadeFspId",
  DROP COLUMN IF EXISTS "gestorId",
  DROP COLUMN IF EXISTS "fiscalId",
  DROP COLUMN IF EXISTS "modalidade",
  DROP COLUMN IF EXISTS "valorAnualCents",
  DROP COLUMN IF EXISTS "dataInicio",
  DROP COLUMN IF EXISTS "dataFimOrig",
  DROP COLUMN IF EXISTS "status";

-- Índices e FKs novas
CREATE UNIQUE INDEX "Contrato_numeroGms_anoGms_key" ON "Contrato"("numeroGms", "anoGms");
CREATE UNIQUE INDEX "Contrato_eProtocolo_key" ON "Contrato"("eProtocolo");
CREATE INDEX "Contrato_situacao_dataFimVigenciaOriginal_idx" ON "Contrato"("situacao", "dataFimVigenciaOriginal");
CREATE INDEX "Contrato_unidadeGestoraId_idx" ON "Contrato"("unidadeGestoraId");
DROP INDEX IF EXISTS "Contrato_fornecedorId_idx";
CREATE INDEX "Contrato_fornecedorId_idx" ON "Contrato"("fornecedorId");
CREATE INDEX "Contrato_pilar_categoriaContratacaoId_idx" ON "Contrato"("pilar", "categoriaContratacaoId");
CREATE INDEX "Contrato_anoGms_idx" ON "Contrato"("anoGms");
CREATE INDEX "Contrato_modalidadeId_idx" ON "Contrato"("modalidadeId");

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_processoId_fkey"
  FOREIGN KEY ("processoId") REFERENCES "ProcessoContratacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_categoriaContratacaoId_fkey"
  FOREIGN KEY ("categoriaContratacaoId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_modalidadeId_fkey"
  FOREIGN KEY ("modalidadeId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_fundamentoLegalId_fkey"
  FOREIGN KEY ("fundamentoLegalId") REFERENCES "DominioValor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_fornecedorId_fkey"
  FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_unidadeGestoraId_fkey"
  FOREIGN KEY ("unidadeGestoraId") REFERENCES "UnidadeOrganizacional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_vigencia_chk"
  CHECK ("dataFimVigenciaOriginal" > "dataInicioVigencia");

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_valor_chk"
  CHECK ("valorGlobalOriginalCents" >= 0);

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_mes_reajuste_chk"
  CHECK ("mesAniversarioReajuste" IS NULL OR ("mesAniversarioReajuste" BETWEEN 1 AND 12));

-- Trigger: impede mesmo servidor como GESTOR e fiscal vigente
CREATE OR REPLACE FUNCTION fn_impedir_gestor_fiscal_mesmo()
RETURNS TRIGGER AS $$
DECLARE
  outro_papel "PapelResponsavel";
BEGIN
  IF NEW."papel" = 'GESTOR' THEN
    IF EXISTS (
      SELECT 1 FROM "ContratoResponsavel" r
      WHERE r."contratoId" = NEW."contratoId"
        AND r."servidorId" = NEW."servidorId"
        AND r."papel" IN ('FISCAL_TECNICO','FISCAL_ADMINISTRATIVO','FISCAL_SETORIAL','FISCAL_SUBSTITUTO')
        AND r."dataFim" IS NULL
        AND r.id IS DISTINCT FROM NEW.id
    ) THEN
      RAISE EXCEPTION 'Servidor não pode ser gestor e fiscal vigente no mesmo contrato';
    END IF;
  ELSIF NEW."papel" IN ('FISCAL_TECNICO','FISCAL_ADMINISTRATIVO','FISCAL_SETORIAL','FISCAL_SUBSTITUTO') THEN
    IF EXISTS (
      SELECT 1 FROM "ContratoResponsavel" r
      WHERE r."contratoId" = NEW."contratoId"
        AND r."servidorId" = NEW."servidorId"
        AND r."papel" = 'GESTOR'
        AND r."dataFim" IS NULL
        AND r.id IS DISTINCT FROM NEW.id
    ) THEN
      RAISE EXCEPTION 'Servidor não pode ser gestor e fiscal vigente no mesmo contrato';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_impedir_gestor_fiscal_mesmo ON "ContratoResponsavel";
CREATE TRIGGER trg_impedir_gestor_fiscal_mesmo
  BEFORE INSERT OR UPDATE ON "ContratoResponsavel"
  FOR EACH ROW EXECUTE FUNCTION fn_impedir_gestor_fiscal_mesmo();
