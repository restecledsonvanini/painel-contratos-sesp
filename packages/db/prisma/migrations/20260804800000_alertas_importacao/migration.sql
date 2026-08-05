-- Fatia 8: Alerta, Importacao, AuditLog.requestId, triggers de auditoria

CREATE TYPE "TipoAlerta" AS ENUM (
  'VENCIMENTO',
  'LIMITE_ACRESCIMO',
  'PRORROGACAO_ESGOTADA',
  'PUBLICACAO_PENDENTE',
  'GARANTIA_VENCENDO',
  'REAJUSTE_DEVIDO',
  'FORNECEDOR_SANCIONADO'
);

CREATE TYPE "SeveridadeAlerta" AS ENUM ('INFO', 'ATENCAO', 'CRITICO');
CREATE TYPE "SituacaoImportacao" AS ENUM ('RECEBIDO', 'VALIDADO', 'APLICADO', 'REJEITADO');

CREATE TABLE "AlertaConfig" (
  "id" TEXT NOT NULL,
  "tipo" "TipoAlerta" NOT NULL,
  "janelasDias" INTEGER[],
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "destinatarios" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AlertaConfig_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AlertaConfig_tipo_key" ON "AlertaConfig"("tipo");

CREATE TABLE "Alerta" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT NOT NULL,
  "tipo" "TipoAlerta" NOT NULL,
  "severidade" "SeveridadeAlerta" NOT NULL DEFAULT 'ATENCAO',
  "janelaDias" INTEGER,
  "mensagem" TEXT NOT NULL,
  "dataReferencia" DATE NOT NULL,
  "reconhecidoPorId" TEXT,
  "reconhecidoEm" TIMESTAMP(3),
  "resolvidoEm" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Alerta_contratoId_tipo_dataReferencia_key"
  ON "Alerta"("contratoId", "tipo", "dataReferencia");
CREATE INDEX "Alerta_tipo_severidade_idx" ON "Alerta"("tipo", "severidade");
CREATE INDEX "Alerta_contratoId_idx" ON "Alerta"("contratoId");
ALTER TABLE "Alerta"
  ADD CONSTRAINT "Alerta_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ImportacaoLote" (
  "id" TEXT NOT NULL,
  "nomeArquivo" TEXT NOT NULL,
  "tipoEntidade" TEXT NOT NULL,
  "situacao" "SituacaoImportacao" NOT NULL DEFAULT 'RECEBIDO',
  "totalLinhas" INTEGER NOT NULL DEFAULT 0,
  "linhasValidas" INTEGER NOT NULL DEFAULT 0,
  "linhasComErro" INTEGER NOT NULL DEFAULT 0,
  "executadoPorId" TEXT,
  "dryRun" BOOLEAN NOT NULL DEFAULT true,
  "resumo" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ImportacaoLote_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ImportacaoLote_tipoEntidade_situacao_idx"
  ON "ImportacaoLote"("tipoEntidade", "situacao");
CREATE INDEX "ImportacaoLote_createdAt_idx" ON "ImportacaoLote"("createdAt");

CREATE TABLE "ImportacaoLinha" (
  "id" TEXT NOT NULL,
  "loteId" TEXT NOT NULL,
  "numeroLinha" INTEGER NOT NULL,
  "payloadOriginal" JSONB NOT NULL,
  "payloadNormalizado" JSONB,
  "erros" JSONB,
  "registroCriadoId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ImportacaoLinha_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ImportacaoLinha_loteId_numeroLinha_idx"
  ON "ImportacaoLinha"("loteId", "numeroLinha");
ALTER TABLE "ImportacaoLinha"
  ADD CONSTRAINT "ImportacaoLinha_loteId_fkey"
  FOREIGN KEY ("loteId") REFERENCES "ImportacaoLote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "requestId" TEXT;
CREATE INDEX IF NOT EXISTS "AuditLog_tabela_registroId_idx" ON "AuditLog"("tabela", "registroId");
CREATE INDEX IF NOT EXISTS "AuditLog_changedAt_idx" ON "AuditLog"("changedAt");

-- Seed configs padrão
INSERT INTO "AlertaConfig" ("id", "tipo", "janelasDias", "ativo", "destinatarios")
VALUES
  (gen_random_uuid()::text, 'VENCIMENTO', ARRAY[30,60,90,120], true, '[]'::jsonb),
  (gen_random_uuid()::text, 'LIMITE_ACRESCIMO', ARRAY[]::int[], true, '[]'::jsonb),
  (gen_random_uuid()::text, 'PRORROGACAO_ESGOTADA', ARRAY[]::int[], true, '[]'::jsonb),
  (gen_random_uuid()::text, 'PUBLICACAO_PENDENTE', ARRAY[10], true, '[]'::jsonb),
  (gen_random_uuid()::text, 'GARANTIA_VENCENDO', ARRAY[30,60], true, '[]'::jsonb),
  (gen_random_uuid()::text, 'REAJUSTE_DEVIDO', ARRAY[]::int[], true, '[]'::jsonb),
  (gen_random_uuid()::text, 'FORNECEDOR_SANCIONADO', ARRAY[]::int[], true, '[]'::jsonb)
ON CONFLICT ("tipo") DO NOTHING;

-- Auditoria genérica por trigger
CREATE OR REPLACE FUNCTION fn_audit_row()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_id TEXT;
  v_action TEXT;
  v_diff JSONB;
  v_user TEXT;
  v_req TEXT;
BEGIN
  BEGIN
    v_user := current_setting('app.current_user', true);
  EXCEPTION WHEN OTHERS THEN
    v_user := NULL;
  END;
  BEGIN
    v_req := current_setting('app.request_id', true);
  EXCEPTION WHEN OTHERS THEN
    v_req := NULL;
  END;

  IF TG_OP = 'DELETE' THEN
    v_action := 'delete';
    v_id := OLD."id"::text;
    v_diff := to_jsonb(OLD);
  ELSIF TG_OP = 'INSERT' THEN
    v_action := 'create';
    v_id := NEW."id"::text;
    v_diff := to_jsonb(NEW);
  ELSE
    v_action := 'update';
    v_id := NEW."id"::text;
    v_diff := jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW));
  END IF;

  INSERT INTO "AuditLog" ("id", "tabela", "registroId", "action", "diff", "changedBy", "source", "requestId", "changedAt")
  VALUES (
    gen_random_uuid()::text,
    TG_TABLE_NAME,
    v_id,
    v_action,
    v_diff,
    NULLIF(v_user, ''),
    'trigger',
    NULLIF(v_req, ''),
    CURRENT_TIMESTAMP
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'Contrato',
    'AlteracaoContratual',
    'ItemContrato',
    'Fornecedor',
    'Servidor',
    'Empenho',
    'Publicacao',
    'Documento',
    'ContratoDotacao',
    'Alerta'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_audit_%s ON %I', lower(t), t);
    EXECUTE format(
      'CREATE TRIGGER trg_audit_%s AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION fn_audit_row()',
      lower(t), t
    );
  END LOOP;
END
$$;
