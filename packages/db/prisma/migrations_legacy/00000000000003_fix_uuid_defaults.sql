-- Fix: Add UUID defaults to all id columns that were missing them
ALTER TABLE "UnidadeFsp" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "EntidadeGestora" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Municipio" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Empresa" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Contrato" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Aditivo" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "AuditLog" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
