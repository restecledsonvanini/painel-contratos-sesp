-- Fatia 2: Fornecedor unificado + Servidor; drop Empresa / EntidadeGestora

-- View legada depende de Empresa — remove antes do drop
DROP VIEW IF EXISTS "view_consolidada" CASCADE;

CREATE TYPE "TipoPessoa" AS ENUM ('JURIDICA', 'FISICA');
CREATE TYPE "PorteEmpresa" AS ENUM ('MEI', 'ME', 'EPP', 'DEMAIS');
CREATE TYPE "SituacaoFornecedor" AS ENUM ('ATIVO', 'INATIVO', 'IMPEDIDO', 'INIDONEO');
CREATE TYPE "TipoSancao" AS ENUM ('ADVERTENCIA', 'MULTA', 'IMPEDIMENTO_LICITAR', 'DECLARACAO_INIDONEIDADE');

-- Servidor (preserva IDs de EntidadeGestora)
CREATE TABLE "Servidor" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "cpf" TEXT,
  "rgFuncional" TEXT,
  "cargo" TEXT,
  "orgaoId" TEXT,
  "unidadeId" TEXT,
  "email" TEXT,
  "telefone" TEXT,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Servidor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Servidor_cpf_key" ON "Servidor"("cpf");
CREATE UNIQUE INDEX "Servidor_rgFuncional_key" ON "Servidor"("rgFuncional");
CREATE INDEX "Servidor_nome_idx" ON "Servidor"("nome");
CREATE INDEX "Servidor_orgaoId_idx" ON "Servidor"("orgaoId");

INSERT INTO "Servidor" ("id", "nome", "cpf", "ativo", "createdAt", "updatedAt")
SELECT "id", "nome", "cpf", true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "EntidadeGestora";

ALTER TABLE "Servidor"
  ADD CONSTRAINT "Servidor_orgaoId_fkey"
  FOREIGN KEY ("orgaoId") REFERENCES "Orgao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Servidor"
  ADD CONSTRAINT "Servidor_unidadeId_fkey"
  FOREIGN KEY ("unidadeId") REFERENCES "UnidadeOrganizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Snapshot do Fornecedor antigo
CREATE TABLE "_Fornecedor_legado" AS
SELECT * FROM "Fornecedor";

-- Drop FKs de Contrato que apontam para Empresa / EntidadeGestora
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "Contrato_empresaId_fkey";
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "Contrato_gestorId_fkey";
ALTER TABLE "Contrato" DROP CONSTRAINT IF EXISTS "Contrato_fiscalId_fkey";

DROP TABLE "Fornecedor";

CREATE TABLE "Fornecedor" (
  "id" TEXT NOT NULL,
  "tipoPessoa" "TipoPessoa" NOT NULL DEFAULT 'JURIDICA',
  "documento" TEXT NOT NULL,
  "razaoSocial" TEXT NOT NULL,
  "nomeFantasia" TEXT,
  "inscricaoEstadual" TEXT,
  "porte" "PorteEmpresa",
  "municipioId" TEXT,
  "situacao" "SituacaoFornecedor" NOT NULL DEFAULT 'ATIVO',
  "codigoLegado" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Fornecedor_documento_key" ON "Fornecedor"("documento");
CREATE INDEX "Fornecedor_razaoSocial_idx" ON "Fornecedor"("razaoSocial");
CREATE INDEX "Fornecedor_situacao_idx" ON "Fornecedor"("situacao");

-- Empresas → Fornecedor (mesmo UUID)
INSERT INTO "Fornecedor" ("id", "tipoPessoa", "documento", "razaoSocial", "situacao", "codigoLegado", "createdAt", "updatedAt")
SELECT
  "id",
  'JURIDICA',
  regexp_replace("cnpj", '\D', '', 'g'),
  "razaoSocial",
  'ATIVO',
  'empresa:' || "id",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Empresa"
ON CONFLICT ("id") DO NOTHING;

-- Fornecedores órfãos (CNPJ não coberto por Empresa)
INSERT INTO "Fornecedor" ("id", "tipoPessoa", "documento", "razaoSocial", "situacao", "codigoLegado", "createdAt", "updatedAt")
SELECT
  l."id",
  CASE WHEN length(regexp_replace(COALESCE(l."cnpj", ''), '\D', '', 'g')) = 11 THEN 'FISICA'::"TipoPessoa" ELSE 'JURIDICA'::"TipoPessoa" END,
  CASE
    WHEN regexp_replace(COALESCE(l."cnpj", ''), '\D', '', 'g') = '' THEN 'LEGADO-' || l."id"
    ELSE regexp_replace(l."cnpj", '\D', '', 'g')
  END,
  l."nome",
  'ATIVO',
  'fornecedor_legado:' || l."id",
  COALESCE(l."createdAt", CURRENT_TIMESTAMP),
  CURRENT_TIMESTAMP
FROM "_Fornecedor_legado" l
WHERE NOT EXISTS (
  SELECT 1 FROM "Fornecedor" f
  WHERE f."documento" = regexp_replace(COALESCE(l."cnpj", ''), '\D', '', 'g')
    AND regexp_replace(COALESCE(l."cnpj", ''), '\D', '', 'g') <> ''
)
AND NOT EXISTS (SELECT 1 FROM "Fornecedor" f2 WHERE f2."id" = l."id")
ON CONFLICT ("documento") DO NOTHING;

DROP TABLE "_Fornecedor_legado";

ALTER TABLE "Fornecedor"
  ADD CONSTRAINT "Fornecedor_municipioId_fkey"
  FOREIGN KEY ("municipioId") REFERENCES "Municipio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CHECK documento por tipo
ALTER TABLE "Fornecedor" ADD CONSTRAINT "chk_fornecedor_documento_len"
  CHECK (
    ("tipoPessoa" = 'JURIDICA' AND char_length("documento") = 14)
    OR ("tipoPessoa" = 'FISICA' AND char_length("documento") = 11)
    OR "documento" LIKE 'LEGADO-%'
  );

CREATE TABLE "FornecedorContato" (
  "id" TEXT NOT NULL,
  "fornecedorId" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "cargo" TEXT,
  "email" TEXT,
  "telefone" TEXT,
  "principal" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FornecedorContato_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "FornecedorContato_fornecedorId_idx" ON "FornecedorContato"("fornecedorId");
ALTER TABLE "FornecedorContato"
  ADD CONSTRAINT "FornecedorContato_fornecedorId_fkey"
  FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "FornecedorSancao" (
  "id" TEXT NOT NULL,
  "fornecedorId" TEXT NOT NULL,
  "tipo" "TipoSancao" NOT NULL,
  "processo" TEXT,
  "dataInicio" DATE NOT NULL,
  "dataFim" DATE,
  "abrangencia" TEXT,
  "fonte" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FornecedorSancao_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "FornecedorSancao_fornecedorId_idx" ON "FornecedorSancao"("fornecedorId");
CREATE INDEX "FornecedorSancao_dataFim_idx" ON "FornecedorSancao"("dataFim");
ALTER TABLE "FornecedorSancao"
  ADD CONSTRAINT "FornecedorSancao_fornecedorId_fkey"
  FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Contrato: empresaId → fornecedorId
ALTER TABLE "Contrato" RENAME COLUMN "empresaId" TO "fornecedorId";
DROP INDEX IF EXISTS "Contrato_empresaId_idx";
CREATE INDEX "Contrato_fornecedorId_idx" ON "Contrato"("fornecedorId");

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_fornecedorId_fkey"
  FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_gestorId_fkey"
  FOREIGN KEY ("gestorId") REFERENCES "Servidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Contrato"
  ADD CONSTRAINT "Contrato_fiscalId_fkey"
  FOREIGN KEY ("fiscalId") REFERENCES "Servidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TABLE "Empresa";
DROP TABLE "EntidadeGestora";
