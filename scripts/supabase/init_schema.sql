-- Supabase / Postgres initialization script for the Hub de Inteligência Contratual
-- Includes extensions, tables, constraints, indices, triggers and sample seed data

-- 1) Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) Lookup / support tables
CREATE TABLE IF NOT EXISTS unidades_fsp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sigla text UNIQUE NOT NULL,
  nome text NOT NULL
);

CREATE TABLE IF NOT EXISTS entidades_gestoras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cpf text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS municipios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  uf text NOT NULL
);

CREATE TABLE IF NOT EXISTS empresas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj text UNIQUE NOT NULL,
  razao_social text NOT NULL
);

-- 3) Core tables: contratos + aditivos
CREATE TABLE IF NOT EXISTS contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo_cabeca text UNIQUE,
  num_gms int NOT NULL,
  ano_gms int NOT NULL,
  unidade_fsp_id uuid NOT NULL REFERENCES unidades_fsp(id),
  gestor_id uuid NOT NULL REFERENCES entidades_gestoras(id),
  fiscal_id uuid NOT NULL REFERENCES entidades_gestoras(id),
  empresa_id uuid NOT NULL REFERENCES empresas(id),
  modalidade text NOT NULL,
  objeto text NOT NULL,
  valor_anual_cents bigint NOT NULL,
  data_inicio date,
  data_fim_orig date,
  status text NOT NULL DEFAULT 'vigente',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT chk_gestor_fiscal CHECK (gestor_id <> fiscal_id),
  UNIQUE (num_gms, ano_gms)
);

CREATE INDEX IF NOT EXISTS idx_contratos_datafim ON contratos (data_fim_orig);
CREATE INDEX IF NOT EXISTS idx_contratos_unidade ON contratos (unidade_fsp_id);
CREATE INDEX IF NOT EXISTS idx_contratos_empresa ON contratos (empresa_id);

CREATE TABLE IF NOT EXISTS aditivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  num_aditivo int NOT NULL,
  protocolo_adit text,
  novo_fim_vigencia date,
  valor_adicional_cents bigint,
  created_at timestamptz DEFAULT now()
);

-- 4) Audit log (append-only)
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela text NOT NULL,
  registro_id uuid,
  action text NOT NULL,    -- 'insert'|'update'|'delete'
  diff jsonb,
  changed_by uuid,
  changed_at timestamptz DEFAULT now(),
  source text -- e.g., 'google_sheets:<sheet_name>' or 'ui:contract-form'
);

-- 5) Trigger functions: updated_at and audit

-- updated_at
CREATE OR REPLACE FUNCTION fn_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_contratos_set_timestamp BEFORE UPDATE ON contratos
FOR EACH ROW EXECUTE FUNCTION fn_set_timestamp();

-- audit function: records insert/update/delete into audit_logs
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
    INSERT INTO audit_logs(tabela, registro_id, action, diff, changed_by, changed_at, source)
      VALUES (TG_TABLE_NAME, OLD.id::uuid, 'delete', to_jsonb(OLD), v_user, now(), v_source);
    RETURN OLD;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs(tabela, registro_id, action, diff, changed_by, changed_at, source)
      VALUES (TG_TABLE_NAME, NEW.id::uuid, 'insert', to_jsonb(NEW), v_user, now(), v_source);
    RETURN NEW;
  ELSE
    INSERT INTO audit_logs(tabela, registro_id, action, diff, changed_by, changed_at, source)
      VALUES (TG_TABLE_NAME, NEW.id::uuid, 'update', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)), v_user, now(), v_source);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Attach audit triggers
CREATE TRIGGER tr_contratos_audit AFTER INSERT OR UPDATE OR DELETE ON contratos
FOR EACH ROW EXECUTE FUNCTION fn_audit();

CREATE TRIGGER tr_aditivos_audit AFTER INSERT OR UPDATE OR DELETE ON aditivos
FOR EACH ROW EXECUTE FUNCTION fn_audit();

-- 6) Helpful views (example: consolidated view)
CREATE OR REPLACE VIEW view_consolidada AS
SELECT
  c.id,
  c.protocolo_cabeca,
  c.num_gms,
  c.ano_gms,
  u.sigla as unidade_sigla,
  e.nome as empresa_razao,
  c.modalidade,
  c.objeto,
  c.valor_anual_cents,
  c.data_inicio,
  c.data_fim_orig,
  c.status
FROM contratos c
LEFT JOIN unidades_fsp u ON u.id = c.unidade_fsp_id
LEFT JOIN empresas e ON e.id = c.empresa_id;

-- 7) Sample seed data (insert only if not exists)
INSERT INTO unidades_fsp (sigla, nome)
  SELECT 'PMPR', 'Polícia Militar' WHERE NOT EXISTS (SELECT 1 FROM unidades_fsp WHERE sigla='PMPR');
INSERT INTO unidades_fsp (sigla, nome)
  SELECT 'PCPR', 'Polícia Civil' WHERE NOT EXISTS (SELECT 1 FROM unidades_fsp WHERE sigla='PCPR');
INSERT INTO unidades_fsp (sigla, nome)
  SELECT 'CB', 'Corpo de Bombeiros' WHERE NOT EXISTS (SELECT 1 FROM unidades_fsp WHERE sigla='CB');

-- End of script
