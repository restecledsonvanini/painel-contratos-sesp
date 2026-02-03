import { z } from "zod";

// Basic helpers
const moneyToCents = (value: number) => Math.round(value * 100);

export const AditivoCreateSchema = z.object({
  numAditivo: z.number().int().nonnegative(),
  protocoloAdit: z.string().min(1),
  novoFimVigencia: z.string().nullable(), // expect ISO date string (YYYY-MM-DD)
  valorAdicional: z.number().nonnegative().optional(), // in BRL, will transform to cents server-side
});

export const ContractCreateSchema = z.object({
  protocoloCabeca: z.string().optional().nullable(),
  numGms: z.number().int().nonnegative(),
  anoGms: z.number().int().gte(2000),
  unidadeFspId: z.string().uuid(),
  gestorId: z.string().uuid(),
  fiscalId: z.string().uuid(),
  empresaId: z.string().uuid(),
  modalidade: z.string().min(1),
  objeto: z.string().min(1),
  valorAnual: z.number().nonnegative(), // float in BRL, convert to cents
  dataInicio: z.string().nullable(), // ISO date or empty
  dataFimOrig: z.string().nullable(),
  status: z.string().optional(),
  aditivos: z.array(AditivoCreateSchema).optional(),
}).transform((raw: any) => {
  // Transform monetary values to integer cents and normalize optional dates
  return {
    ...raw,
    valorAnualCents: Math.round(raw.valorAnual * 100),
    dataInicio: raw.dataInicio || null,
    dataFimOrig: raw.dataFimOrig || null,
  } as any;
});

export type ContractCreateInput = z.infer<typeof ContractCreateSchema>;
export type AditivoCreateInput = z.infer<typeof AditivoCreateSchema>;
