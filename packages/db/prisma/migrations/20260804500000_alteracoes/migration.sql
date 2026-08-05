-- Fatia 5: AlteracaoContratual + AlteracaoItem; backfill Aditivo; triggers legais

CREATE TYPE "TipoAlteracao" AS ENUM (
  'ADITIVO_PRAZO',
  'ADITIVO_ACRESCIMO_QUANTITATIVO',
  'ADITIVO_SUPRESSAO',
  'ADITIVO_PRAZO_VALOR',
  'ADITIVO_QUALITATIVO',
  'ADITIVO_SUBROGACAO',
  'APOSTILAMENTO_REAJUSTE',
  'APOSTILAMENTO_REPACTUACAO',
  'APOSTILAMENTO_REEQUILIBRIO',
  'APOSTILAMENTO_DOTACAO',
  'APOSTILAMENTO_FISCALIZACAO',
  'APOSTILAMENTO_CORRECAO_MATERIAL'
);

CREATE TYPE "SituacaoAlteracao" AS ENUM (
  'MINUTA',
  'ASSINADO',
  'PUBLICADO',
  'CANCELADO'
);

CREATE TABLE "AlteracaoContratual" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT NOT NULL,
  "tipo" "TipoAlteracao" NOT NULL,
  "numero" INTEGER NOT NULL,
  "eProtocolo" TEXT,
  "objetoDescricao" TEXT NOT NULL,
  "fundamentoLegalId" TEXT,
  "justificativa" TEXT,
  "justificativaExcepcional" TEXT,
  "dataAssinatura" DATE NOT NULL,
  "dataInicioEfeito" DATE,
  "prazoAcrescidoValor" INTEGER,
  "prazoAcrescidoUnidade" "UnidadeTempo",
  "novaDataFimVigencia" DATE,
  "valorAcrescidoCents" BIGINT NOT NULL DEFAULT 0,
  "valorSuprimidoCents" BIGINT NOT NULL DEFAULT 0,
  "percentualReajuste" DECIMAL(7,4),
  "situacao" "SituacaoAlteracao" NOT NULL DEFAULT 'MINUTA',
  "codigoLegado" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AlteracaoContratual_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AlteracaoContratual_valores_chk" CHECK (
    "valorAcrescidoCents" >= 0 AND "valorSuprimidoCents" >= 0
  )
);

CREATE UNIQUE INDEX "AlteracaoContratual_contratoId_tipo_numero_key"
  ON "AlteracaoContratual"("contratoId", "tipo", "numero");
CREATE INDEX "AlteracaoContratual_contratoId_situacao_idx"
  ON "AlteracaoContratual"("contratoId", "situacao");
CREATE INDEX "AlteracaoContratual_dataAssinatura_idx"
  ON "AlteracaoContratual"("dataAssinatura");

ALTER TABLE "AlteracaoContratual"
  ADD CONSTRAINT "AlteracaoContratual_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AlteracaoContratual"
  ADD CONSTRAINT "AlteracaoContratual_fundamentoLegalId_fkey"
  FOREIGN KEY ("fundamentoLegalId") REFERENCES "DominioValor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "AlteracaoItem" (
  "id" TEXT NOT NULL,
  "alteracaoId" TEXT NOT NULL,
  "itemContratoId" TEXT,
  "catalogoItemId" TEXT,
  "quantidadeDelta" DECIMAL(14,4) NOT NULL,
  "valorUnitarioNovoCents" BIGINT,
  "observacao" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AlteracaoItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AlteracaoItem_alteracaoId_idx" ON "AlteracaoItem"("alteracaoId");
CREATE INDEX "AlteracaoItem_itemContratoId_idx" ON "AlteracaoItem"("itemContratoId");

ALTER TABLE "AlteracaoItem"
  ADD CONSTRAINT "AlteracaoItem_alteracaoId_fkey"
  FOREIGN KEY ("alteracaoId") REFERENCES "AlteracaoContratual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AlteracaoItem"
  ADD CONSTRAINT "AlteracaoItem_itemContratoId_fkey"
  FOREIGN KEY ("itemContratoId") REFERENCES "ItemContrato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AlteracaoItem"
  ADD CONSTRAINT "AlteracaoItem_catalogoItemId_fkey"
  FOREIGN KEY ("catalogoItemId") REFERENCES "CatalogoItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill Aditivo → AlteracaoContratual
INSERT INTO "AlteracaoContratual" (
  "id",
  "contratoId",
  "tipo",
  "numero",
  "eProtocolo",
  "objetoDescricao",
  "dataAssinatura",
  "novaDataFimVigencia",
  "valorAcrescidoCents",
  "valorSuprimidoCents",
  "situacao",
  "codigoLegado",
  "createdAt",
  "updatedAt"
)
SELECT
  a."id",
  a."contratoId",
  CASE
    WHEN a."novoFimVigencia" IS NOT NULL
      AND COALESCE(a."valorAdicionalCents", 0) > 0 THEN 'ADITIVO_PRAZO_VALOR'::"TipoAlteracao"
    WHEN a."novoFimVigencia" IS NOT NULL THEN 'ADITIVO_PRAZO'::"TipoAlteracao"
    WHEN COALESCE(a."valorAdicionalCents", 0) > 0 THEN 'ADITIVO_ACRESCIMO_QUANTITATIVO'::"TipoAlteracao"
    ELSE 'ADITIVO_PRAZO'::"TipoAlteracao"
  END,
  a."numAditivo",
  a."protocoloAdit",
  'Migrado de Aditivo legado',
  COALESCE(a."createdAt"::date, CURRENT_DATE),
  a."novoFimVigencia",
  COALESCE(a."valorAdicionalCents", 0)::bigint,
  0,
  'ASSINADO'::"SituacaoAlteracao",
  a."id",
  a."createdAt",
  a."createdAt"
FROM "Aditivo" a;

DROP TABLE IF EXISTS "Aditivo";

-- Vigência atual auxiliar (maior novaDataFim entre alterações ativas de prazo)
CREATE OR REPLACE FUNCTION fn_data_fim_vigencia_atual(p_contrato_id TEXT)
RETURNS DATE
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_original DATE;
  v_atual DATE;
BEGIN
  SELECT c."dataFimVigenciaOriginal" INTO v_original
  FROM "Contrato" c WHERE c."id" = p_contrato_id;

  SELECT GREATEST(
    v_original,
    COALESCE(MAX(a."novaDataFimVigencia"), v_original)
  )
  INTO v_atual
  FROM "AlteracaoContratual" a
  WHERE a."contratoId" = p_contrato_id
    AND a."situacao" <> 'CANCELADO'
    AND a."tipo" IN (
      'ADITIVO_PRAZO',
      'ADITIVO_PRAZO_VALOR'
    )
    AND a."novaDataFimVigencia" IS NOT NULL;

  RETURN COALESCE(v_atual, v_original);
END;
$$;

CREATE OR REPLACE FUNCTION fn_validar_alteracao()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_contrato RECORD;
  v_fim_atual DATE;
  v_acrescido BIGINT;
  v_suprimido BIGINT;
  v_limite_pct NUMERIC;
  v_pct NUMERIC;
  v_meses INT;
  v_is_aditivo_prazo BOOLEAN;
  v_is_aditivo_valor BOOLEAN;
  v_is_apostilamento BOOLEAN;
BEGIN
  IF NEW."situacao" = 'CANCELADO' THEN
    RETURN NEW;
  END IF;

  SELECT * INTO v_contrato FROM "Contrato" WHERE "id" = NEW."contratoId";
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contrato % não encontrado', NEW."contratoId"
      USING ERRCODE = 'check_violation';
  END IF;

  v_is_aditivo_prazo := NEW."tipo" IN ('ADITIVO_PRAZO', 'ADITIVO_PRAZO_VALOR');
  v_is_aditivo_valor := NEW."tipo" IN (
    'ADITIVO_ACRESCIMO_QUANTITATIVO',
    'ADITIVO_SUPRESSAO',
    'ADITIVO_PRAZO_VALOR'
  );
  v_is_apostilamento := NEW."tipo"::text LIKE 'APOSTILAMENTO_%';

  -- Apostilamento não altera valor global por acréscimo/supressão nem prazo
  IF v_is_apostilamento THEN
    IF NEW."valorAcrescidoCents" > 0 OR NEW."valorSuprimidoCents" > 0 THEN
      RAISE EXCEPTION 'Apostilamento não pode alterar valor global por acréscimo/supressão'
        USING ERRCODE = 'check_violation';
    END IF;
    IF NEW."novaDataFimVigencia" IS NOT NULL OR NEW."prazoAcrescidoValor" IS NOT NULL THEN
      RAISE EXCEPTION 'Apostilamento não pode alterar prazo de vigência'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF v_is_aditivo_prazo THEN
    IF NEW."novaDataFimVigencia" IS NULL THEN
      RAISE EXCEPTION 'Aditivo de prazo exige novaDataFimVigencia'
        USING ERRCODE = 'check_violation';
    END IF;
    IF NOT v_contrato."prorrogavel" THEN
      RAISE EXCEPTION 'Contrato não é prorrogável'
        USING ERRCODE = 'check_violation';
    END IF;

    v_fim_atual := fn_data_fim_vigencia_atual(NEW."contratoId");
    -- Em UPDATE, ignorar a própria linha na vigência atual
    IF TG_OP = 'UPDATE' AND OLD."novaDataFimVigencia" IS NOT NULL THEN
      SELECT GREATEST(
        v_contrato."dataFimVigenciaOriginal",
        COALESCE(MAX(a."novaDataFimVigencia"), v_contrato."dataFimVigenciaOriginal")
      )
      INTO v_fim_atual
      FROM "AlteracaoContratual" a
      WHERE a."contratoId" = NEW."contratoId"
        AND a."id" <> NEW."id"
        AND a."situacao" <> 'CANCELADO'
        AND a."tipo" IN ('ADITIVO_PRAZO', 'ADITIVO_PRAZO_VALOR')
        AND a."novaDataFimVigencia" IS NOT NULL;
    END IF;

    IF NEW."novaDataFimVigencia" <= v_fim_atual THEN
      RAISE EXCEPTION 'novaDataFimVigencia deve ser posterior à vigência atual (%)', v_fim_atual
        USING ERRCODE = 'check_violation';
    END IF;

    IF v_contrato."limiteProrrogacaoMeses" IS NOT NULL THEN
      v_meses := (
        (EXTRACT(YEAR FROM NEW."novaDataFimVigencia") - EXTRACT(YEAR FROM v_contrato."dataFimVigenciaOriginal")) * 12
        + (EXTRACT(MONTH FROM NEW."novaDataFimVigencia") - EXTRACT(MONTH FROM v_contrato."dataFimVigenciaOriginal"))
      )::int;
      IF v_meses > v_contrato."limiteProrrogacaoMeses"
         AND (NEW."justificativaExcepcional" IS NULL OR btrim(NEW."justificativaExcepcional") = '') THEN
        RAISE EXCEPTION 'Prorrogação acumulada (% meses) excede limite (%) — justificativaExcepcional obrigatória',
          v_meses, v_contrato."limiteProrrogacaoMeses"
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;

  IF v_is_aditivo_valor THEN
    SELECT
      COALESCE(SUM(a."valorAcrescidoCents"), 0),
      COALESCE(SUM(a."valorSuprimidoCents"), 0)
    INTO v_acrescido, v_suprimido
    FROM "AlteracaoContratual" a
    WHERE a."contratoId" = NEW."contratoId"
      AND a."situacao" <> 'CANCELADO'
      AND (TG_OP = 'INSERT' OR a."id" <> NEW."id");

    v_acrescido := v_acrescido + COALESCE(NEW."valorAcrescidoCents", 0);
    v_suprimido := v_suprimido + COALESCE(NEW."valorSuprimidoCents", 0);

    v_limite_pct := CASE
      WHEN v_contrato."naturezaObjeto" IN ('OBRA', 'SERVICO_ENGENHARIA') THEN 50
      ELSE 25
    END;

    IF v_contrato."valorGlobalOriginalCents" > 0 THEN
      v_pct := (v_acrescido::numeric / v_contrato."valorGlobalOriginalCents"::numeric) * 100;
      IF v_pct > v_limite_pct
         AND (NEW."justificativaExcepcional" IS NULL OR btrim(NEW."justificativaExcepcional") = '') THEN
        RAISE EXCEPTION 'Acréscimo acumulado (% %%) excede limite (% %%) — justificativaExcepcional obrigatória',
          round(v_pct, 2), v_limite_pct
          USING ERRCODE = 'check_violation';
      END IF;

      v_pct := (v_suprimido::numeric / v_contrato."valorGlobalOriginalCents"::numeric) * 100;
      IF v_pct > 25
         AND (NEW."justificativaExcepcional" IS NULL OR btrim(NEW."justificativaExcepcional") = '') THEN
        RAISE EXCEPTION 'Supressão acumulada (% %%) excede 25%% — justificativaExcepcional obrigatória',
          round(v_pct, 2)
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_alteracao
  BEFORE INSERT OR UPDATE ON "AlteracaoContratual"
  FOR EACH ROW EXECUTE FUNCTION fn_validar_alteracao();

-- Dispensa/inexigibilidade exige fundamento legal no contrato
CREATE OR REPLACE FUNCTION fn_exigir_fundamento_legal()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_codigo TEXT;
BEGIN
  -- Só exige a partir de assinatura/vigência (minutas podem incompletar)
  IF NEW."situacao" NOT IN ('ASSINADO', 'VIGENTE', 'SUSPENSO') THEN
    RETURN NEW;
  END IF;

  SELECT dv."codigo" INTO v_codigo
  FROM "DominioValor" dv
  WHERE dv."id" = NEW."modalidadeId";

  IF v_codigo IS NOT NULL
     AND upper(v_codigo) IN ('DISPENSA', 'INEXIGIBILIDADE')
     AND NEW."fundamentoLegalId" IS NULL THEN
    RAISE EXCEPTION 'Modalidade % exige fundamentoLegalId', v_codigo
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_exigir_fundamento_legal ON "Contrato";
CREATE TRIGGER trg_exigir_fundamento_legal
  BEFORE INSERT OR UPDATE OF "modalidadeId", "fundamentoLegalId", "situacao" ON "Contrato"
  FOR EACH ROW EXECUTE FUNCTION fn_exigir_fundamento_legal();

-- Soma de percentual de rateio ≤ 100
CREATE OR REPLACE FUNCTION fn_validar_soma_rateio()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_contrato_id TEXT;
  v_soma NUMERIC;
BEGIN
  v_contrato_id := COALESCE(NEW."contratoId", OLD."contratoId");

  SELECT COALESCE(SUM(r."percentual"), 0)
  INTO v_soma
  FROM "ContratoRateio" r
  WHERE r."contratoId" = v_contrato_id
    AND (TG_OP = 'DELETE' OR r."id" <> COALESCE(NEW."id", '00000000-0000-0000-0000-000000000000'));

  IF TG_OP <> 'DELETE' AND NEW."percentual" IS NOT NULL THEN
    v_soma := v_soma + NEW."percentual";
  END IF;

  IF v_soma > 100.0001 THEN
    RAISE EXCEPTION 'Soma de percentuais de rateio (% %%) excede 100%%', round(v_soma, 4)
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_validar_soma_rateio ON "ContratoRateio";
CREATE TRIGGER trg_validar_soma_rateio
  BEFORE INSERT OR UPDATE OR DELETE ON "ContratoRateio"
  FOR EACH ROW EXECUTE FUNCTION fn_validar_soma_rateio();
