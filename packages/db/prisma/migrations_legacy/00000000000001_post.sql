-- Post-migration SQL: extensions, triggers, checks, views and seed

-- 1) Ensure pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) Add CHECK constraint for gestor != fiscal
ALTER TABLE "Contrato" ADD CONSTRAINT "chk_gestor_fiscal" CHECK ("gestorId" <> "fiscalId");

-- 3) updated_at trigger
CREATE OR REPLACE FUNCTION fn_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_contrato_set_timestamp BEFORE UPDATE ON "Contrato"
FOR EACH ROW EXECUTE FUNCTION fn_set_timestamp();

-- 4) Audit function (simplified; uses app.current_user and app.current_user_source if set)
CREATE OR REPLACE FUNCTION fn_audit()
RETURNS TRIGGER AS $$
DECLARE
  v_user uuid := NULL;
  v_source text := NULL;
BEGIN
  BEGIN
    v_user := current_setting('app.current_user', true)::uuid;
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
      VALUES (TG_TABLE_NAME, OLD.id::uuid, 'delete', to_jsonb(OLD), v_user, now(), v_source);
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO "AuditLog"("tabela", "registroId", "action", "diff", "changedBy", "changedAt", "source")
      VALUES (TG_TABLE_NAME, NEW.id::uuid, 'insert', to_jsonb(NEW), v_user, now(), v_source);
    RETURN NEW;
  ELSE
    INSERT INTO "AuditLog"("tabela", "registroId", "action", "diff", "changedBy", "changedAt", "source")
      VALUES (TG_TABLE_NAME, NEW.id::uuid, 'update', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)), v_user, now(), v_source);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_contratos_audit AFTER INSERT OR UPDATE OR DELETE ON "Contrato"
FOR EACH ROW EXECUTE FUNCTION fn_audit();

CREATE TRIGGER tr_aditivos_audit AFTER INSERT OR UPDATE OR DELETE ON "Aditivo"
FOR EACH ROW EXECUTE FUNCTION fn_audit();

-- 5) Create view consolidada
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

-- 6) Seed (insert if not exists)
INSERT INTO "UnidadeFsp" ("id","sigla", "nome")
  SELECT gen_random_uuid(), 'PMPR', 'Polícia Militar' WHERE NOT EXISTS (SELECT 1 FROM "UnidadeFsp" WHERE "sigla"='PMPR');

INSERT INTO "UnidadeFsp" ("id","sigla", "nome")
  SELECT gen_random_uuid(), 'PCPR', 'Polícia Civil' WHERE NOT EXISTS (SELECT 1 FROM "UnidadeFsp" WHERE "sigla"='PCPR');

INSERT INTO "UnidadeFsp" ("id","sigla", "nome")
  SELECT gen_random_uuid(), 'CB', 'Corpo de Bombeiros' WHERE NOT EXISTS (SELECT 1 FROM "UnidadeFsp" WHERE "sigla"='CB');

-- Sample empresa
INSERT INTO "Empresa" ("id","cnpj","razaoSocial")
  SELECT gen_random_uuid(), '00000000000191', 'Fornecedor Exemplo LTDA' WHERE NOT EXISTS (SELECT 1 FROM "Empresa" WHERE "cnpj"='00000000000191');

-- Sample gestores
INSERT INTO "EntidadeGestora" ("id","nome","cpf")
  SELECT gen_random_uuid(), 'Gestor Exemplo', '12345678901' WHERE NOT EXISTS (SELECT 1 FROM "EntidadeGestora" WHERE "cpf"='12345678901');

INSERT INTO "EntidadeGestora" ("id","nome","cpf")
  SELECT gen_random_uuid(), 'Fiscal Exemplo', '98765432100' WHERE NOT EXISTS (SELECT 1 FROM "EntidadeGestora" WHERE "cpf"='98765432100');
