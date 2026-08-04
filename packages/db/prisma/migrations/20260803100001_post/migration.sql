-- Post-migration: checks, triggers and consolidated view (idempotent)

ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "chk_gestor_fiscal";
ALTER TABLE "Contrato" ADD CONSTRAINT "chk_gestor_fiscal" CHECK ("gestorId" <> "fiscalId");

CREATE OR REPLACE FUNCTION fn_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_contrato_set_timestamp ON "Contrato";
CREATE TRIGGER tr_contrato_set_timestamp
  BEFORE UPDATE ON "Contrato"
  FOR EACH ROW EXECUTE FUNCTION fn_set_timestamp();

CREATE OR REPLACE FUNCTION fn_audit()
RETURNS TRIGGER AS $$
DECLARE
  v_user text := NULL;
  v_source text := NULL;
BEGIN
  BEGIN
    v_user := current_setting('app.current_user', true);
  EXCEPTION WHEN OTHERS THEN
    v_user := NULL;
  END;
  BEGIN
    v_source := current_setting('app.current_user_source', true);
  EXCEPTION WHEN OTHERS THEN
    v_source := NULL;
  END;

  IF (TG_OP = 'DELETE') THEN
    INSERT INTO "AuditLog"("tabela", "registroId", "action", "diff", "changedBy", "changedAt", "source")
      VALUES (TG_TABLE_NAME, OLD.id::text, 'delete', to_jsonb(OLD), v_user, now(), v_source);
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO "AuditLog"("tabela", "registroId", "action", "diff", "changedBy", "changedAt", "source")
      VALUES (TG_TABLE_NAME, NEW.id::text, 'insert', to_jsonb(NEW), v_user, now(), v_source);
    RETURN NEW;
  ELSE
    INSERT INTO "AuditLog"("tabela", "registroId", "action", "diff", "changedBy", "changedAt", "source")
      VALUES (TG_TABLE_NAME, NEW.id::text, 'update', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)), v_user, now(), v_source);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_contratos_audit ON "Contrato";
CREATE TRIGGER tr_contratos_audit
  AFTER INSERT OR UPDATE OR DELETE ON "Contrato"
  FOR EACH ROW EXECUTE FUNCTION fn_audit();

DROP TRIGGER IF EXISTS tr_aditivos_audit ON "Aditivo";
CREATE TRIGGER tr_aditivos_audit
  AFTER INSERT OR UPDATE OR DELETE ON "Aditivo"
  FOR EACH ROW EXECUTE FUNCTION fn_audit();

CREATE OR REPLACE VIEW view_consolidada AS
SELECT
  c."id",
  c."protocoloCabeca",
  c."numGms",
  c."anoGms",
  u."sigla" as unidade_sigla,
  e."razaoSocial" as empresa_razao,
  c."modalidade",
  c."objeto",
  c."valorAnualCents",
  c."dataInicio",
  c."dataFimOrig",
  c."status"
FROM "Contrato" c
LEFT JOIN "UnidadeFsp" u ON u.id = c."unidadeFspId"
LEFT JOIN "Empresa" e ON e.id = c."empresaId";
