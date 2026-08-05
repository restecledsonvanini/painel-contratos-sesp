-- Fatia 4: CatalogoItem + ItemAtributoDef + ItemContrato; migra Servico

CREATE TYPE "Periodicidade" AS ENUM ('UNICA', 'DIARIA', 'MENSAL', 'ANUAL');
CREATE TYPE "TipoAtributo" AS ENUM (
  'TEXTO', 'TEXTO_LONGO', 'NUMERO', 'MOEDA', 'DATA', 'BOOLEANO',
  'SELECAO', 'MULTI_SELECAO', 'MUNICIPIO', 'UNIDADE'
);

CREATE TABLE "CatalogoItem" (
  "id" TEXT NOT NULL,
  "categoriaItemId" TEXT NOT NULL,
  "codigo" TEXT,
  "nome" TEXT NOT NULL,
  "descricao" TEXT,
  "unidadeMedidaPadraoId" TEXT NOT NULL,
  "atributosPadrao" JSONB,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CatalogoItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CatalogoItem_categoriaItemId_nome_key" ON "CatalogoItem"("categoriaItemId", "nome");
CREATE INDEX "CatalogoItem_nome_idx" ON "CatalogoItem"("nome");
CREATE INDEX "CatalogoItem_ativo_idx" ON "CatalogoItem"("ativo");

ALTER TABLE "CatalogoItem"
  ADD CONSTRAINT "CatalogoItem_categoriaItemId_fkey"
  FOREIGN KEY ("categoriaItemId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CatalogoItem"
  ADD CONSTRAINT "CatalogoItem_unidadeMedidaPadraoId_fkey"
  FOREIGN KEY ("unidadeMedidaPadraoId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ItemAtributoDef" (
  "id" TEXT NOT NULL,
  "categoriaItemId" TEXT NOT NULL,
  "chave" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "tipo" "TipoAtributo" NOT NULL,
  "dominioSlug" TEXT,
  "obrigatorio" BOOLEAN NOT NULL DEFAULT false,
  "unidade" TEXT,
  "ordem" INTEGER NOT NULL DEFAULT 0,
  "ajuda" TEXT,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ItemAtributoDef_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ItemAtributoDef_categoriaItemId_chave_key" ON "ItemAtributoDef"("categoriaItemId", "chave");
CREATE INDEX "ItemAtributoDef_categoriaItemId_ativo_ordem_idx" ON "ItemAtributoDef"("categoriaItemId", "ativo", "ordem");

ALTER TABLE "ItemAtributoDef"
  ADD CONSTRAINT "ItemAtributoDef_categoriaItemId_fkey"
  FOREIGN KEY ("categoriaItemId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ItemContrato" (
  "id" TEXT NOT NULL,
  "contratoId" TEXT NOT NULL,
  "sequencia" INTEGER NOT NULL,
  "catalogoItemId" TEXT NOT NULL,
  "descricaoComplementar" TEXT,
  "quantidade" DECIMAL(14,4) NOT NULL,
  "unidadeMedidaId" TEXT NOT NULL,
  "valorUnitarioCents" BIGINT NOT NULL,
  "periodicidade" "Periodicidade" NOT NULL DEFAULT 'UNICA',
  "unidadeDestinoId" TEXT,
  "municipioExecucaoId" TEXT,
  "enderecoExecucao" TEXT,
  "atributos" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ItemContrato_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ItemContrato_contratoId_sequencia_key" ON "ItemContrato"("contratoId", "sequencia");
CREATE INDEX "ItemContrato_catalogoItemId_idx" ON "ItemContrato"("catalogoItemId");
CREATE INDEX "ItemContrato_unidadeDestinoId_idx" ON "ItemContrato"("unidadeDestinoId");
CREATE INDEX "ItemContrato_atributos_gin_idx" ON "ItemContrato" USING GIN ("atributos" jsonb_path_ops);

ALTER TABLE "ItemContrato"
  ADD CONSTRAINT "ItemContrato_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ItemContrato"
  ADD CONSTRAINT "ItemContrato_catalogoItemId_fkey"
  FOREIGN KEY ("catalogoItemId") REFERENCES "CatalogoItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ItemContrato"
  ADD CONSTRAINT "ItemContrato_unidadeMedidaId_fkey"
  FOREIGN KEY ("unidadeMedidaId") REFERENCES "DominioValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ItemContrato"
  ADD CONSTRAINT "ItemContrato_unidadeDestinoId_fkey"
  FOREIGN KEY ("unidadeDestinoId") REFERENCES "UnidadeOrganizacional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ItemContrato"
  ADD CONSTRAINT "ItemContrato_municipioExecucaoId_fkey"
  FOREIGN KEY ("municipioExecucaoId") REFERENCES "Municipio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ItemContrato"
  ADD CONSTRAINT "ItemContrato_qtd_valor_chk"
  CHECK ("quantidade" > 0 AND "valorUnitarioCents" >= 0);

-- Índices de expressão para atributos analíticos
CREATE INDEX "ItemContrato_attr_caracterizacao_idx"
  ON "ItemContrato" (("atributos"->>'caracterizacao'));
CREATE INDEX "ItemContrato_attr_metragem_idx"
  ON "ItemContrato" (((NULLIF("atributos"->>'metragemM2', ''))::numeric));
CREATE INDEX "ItemContrato_attr_tipo_veiculo_idx"
  ON "ItemContrato" (("atributos"->>'tipoVeiculo'));

-- Backfill Servico → CatalogoItem (categoria SERVICO)
INSERT INTO "CatalogoItem" (
  "id", "categoriaItemId", "codigo", "nome", "descricao",
  "unidadeMedidaPadraoId", "ativo", "createdAt", "updatedAt"
)
SELECT
  s.id,
  cat.id,
  NULL,
  s.titulo,
  s.descricao,
  um.id,
  true,
  s."createdAt",
  CURRENT_TIMESTAMP
FROM "Servico" s
CROSS JOIN LATERAL (
  SELECT dv.id
  FROM "DominioValor" dv
  JOIN "Dominio" d ON d.id = dv."dominioId"
  WHERE d.slug = 'categoria-item' AND dv.codigo = 'SERVICO'
  LIMIT 1
) cat
CROSS JOIN LATERAL (
  SELECT dv.id
  FROM "DominioValor" dv
  JOIN "Dominio" d ON d.id = dv."dominioId"
  WHERE d.slug = 'unidade-medida' AND dv.codigo = 'SERVICO'
  LIMIT 1
) um
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS "Servico";
