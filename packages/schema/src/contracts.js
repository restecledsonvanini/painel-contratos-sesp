"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractCreateSchema = exports.AditivoCreateSchema = void 0;
const zod_1 = require("zod");
// Basic helpers
const moneyToCents = (value) => Math.round(value * 100);
exports.AditivoCreateSchema = zod_1.z.object({
    numAditivo: zod_1.z.number().int().nonnegative(),
    protocoloAdit: zod_1.z.string().min(1),
    novoFimVigencia: zod_1.z.string().nullable(), // expect ISO date string (YYYY-MM-DD)
    valorAdicional: zod_1.z.number().nonnegative().optional(), // in BRL, will transform to cents server-side
});
exports.ContractCreateSchema = zod_1.z.object({
    protocoloCabeca: zod_1.z.string().optional().nullable(),
    numGms: zod_1.z.number().int().nonnegative(),
    anoGms: zod_1.z.number().int().gte(2000),
    unidadeFspId: zod_1.z.string().uuid(),
    gestorId: zod_1.z.string().uuid(),
    fiscalId: zod_1.z.string().uuid(),
    empresaId: zod_1.z.string().uuid(),
    modalidade: zod_1.z.string().min(1),
    objeto: zod_1.z.string().min(1),
    valorAnual: zod_1.z.number().nonnegative(), // float in BRL, convert to cents
    dataInicio: zod_1.z.string().nullable(), // ISO date or empty
    dataFimOrig: zod_1.z.string().nullable(),
    status: zod_1.z.string().optional(),
    aditivos: zod_1.z.array(exports.AditivoCreateSchema).optional(),
}).transform((raw) => {
    // Transform monetary values to integer cents and normalize optional dates
    return {
        ...raw,
        valorAnualCents: Math.round(raw.valorAnual * 100),
        dataInicio: raw.dataInicio || null,
        dataFimOrig: raw.dataFimOrig || null,
    };
});
