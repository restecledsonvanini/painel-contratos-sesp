-- CreateTable
CREATE TABLE "UnidadeFsp" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "UnidadeFsp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntidadeGestora" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "EntidadeGestora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "uf" TEXT NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "protocoloCabeca" TEXT,
    "numGms" INTEGER NOT NULL,
    "anoGms" INTEGER NOT NULL,
    "unidadeFspId" TEXT NOT NULL,
    "gestorId" TEXT NOT NULL,
    "fiscalId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "objeto" TEXT NOT NULL,
    "valorAnualCents" INTEGER NOT NULL,
    "dataInicio" DATE,
    "dataFimOrig" DATE,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aditivo" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "numAditivo" INTEGER NOT NULL,
    "protocoloAdit" TEXT NOT NULL,
    "novoFimVigencia" DATE,
    "valorAdicionalCents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aditivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "tabela" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "diff" JSONB NOT NULL,
    "changedBy" TEXT,
    "source" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "sub" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'colaborador',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnidadeFsp_sigla_key" ON "UnidadeFsp"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "EntidadeGestora_cpf_key" ON "EntidadeGestora"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_protocoloCabeca_key" ON "Contrato"("protocoloCabeca");

-- CreateIndex
CREATE INDEX "Contrato_dataFimOrig_idx" ON "Contrato"("dataFimOrig");

-- CreateIndex
CREATE INDEX "Contrato_unidadeFspId_idx" ON "Contrato"("unidadeFspId");

-- CreateIndex
CREATE INDEX "Contrato_empresaId_idx" ON "Contrato"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_numGms_anoGms_key" ON "Contrato"("numGms", "anoGms");

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_unidadeFspId_fkey" FOREIGN KEY ("unidadeFspId") REFERENCES "UnidadeFsp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "EntidadeGestora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_fiscalId_fkey" FOREIGN KEY ("fiscalId") REFERENCES "EntidadeGestora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aditivo" ADD CONSTRAINT "Aditivo_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

