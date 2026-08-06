import { Router, Request, Response } from 'express';
import { asyncHandler } from '../lib/errors';
import { getOrgaoScope } from '../lib/audit';
import { getPrisma } from '../lib/prisma';
import { requireMinRole } from '../middleware/rbac';
import {
  contractsToCsv,
  contractsToXlsx,
  emitidoPor,
  listContractsForExport,
  loadContractForExport,
  contractToPdf,
  parseExportFilters,
} from '../services/exportService';

async function exportAcervoCsv(req: Request, res: Response) {
  const rows = await listContractsForExport(req, parseExportFilters(req.query));
  const csv = contractsToCsv(rows);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="contratos.csv"');
  return res.status(200).send(csv);
}

async function exportAcervoXlsx(req: Request, res: Response) {
  const rows = await listContractsForExport(req, parseExportFilters(req.query));
  const buf = await contractsToXlsx(rows);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', 'attachment; filename="contratos.xlsx"');
  return res.status(200).send(buf);
}

async function globalSearch(req: Request, res: Response) {
  const q = String(req.query.q || '').trim();
  if (q.length < 2) return res.status(200).json({ contratos: [], fornecedores: [], servidores: [] });
  const scope = getOrgaoScope(req);
  const db = getPrisma();

  const [contratos, fornecedores, servidores] = await Promise.all([
    db.contrato.findMany({
      where: {
        ...(scope.orgaoId ? { unidadeGestoraId: scope.orgaoId } : {}),
        OR: [
          { numeroGms: { contains: q, mode: 'insensitive' } },
          { objeto: { contains: q, mode: 'insensitive' } },
          { eProtocolo: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 8,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        numeroGms: true,
        anoGms: true,
        objeto: true,
        situacao: true,
      },
    }),
    db.fornecedor.findMany({
      where: {
        OR: [
          { razaoSocial: { contains: q, mode: 'insensitive' } },
          { nomeFantasia: { contains: q, mode: 'insensitive' } },
          { documento: { contains: q.replace(/\D/g, '') || q } },
        ],
      },
      take: 8,
      orderBy: { razaoSocial: 'asc' },
      select: { id: true, razaoSocial: true, documento: true },
    }),
    db.servidor.findMany({
      where: {
        ativo: true,
        ...(scope.orgaoId ? { orgaoId: scope.orgaoId } : {}),
        OR: [
          { nome: { contains: q, mode: 'insensitive' } },
          { cpf: { contains: q.replace(/\D/g, '') || q } },
        ],
      },
      take: 8,
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true, cargo: true },
    }),
  ]);

  return res.status(200).json({
    contratos: contratos.map((c) => ({
      id: c.id,
      label: `GMS ${c.numeroGms}/${c.anoGms} — ${c.objeto.slice(0, 60)}`,
      to: `/contracts/${c.id}`,
    })),
    fornecedores: fornecedores.map((f) => ({
      id: f.id,
      label: `${f.razaoSocial} (${f.documento})`,
      to: `/fornecedores/${f.id}/edit`,
    })),
    servidores: servidores.map((s) => ({
      id: s.id,
      label: s.cargo ? `${s.nome} — ${s.cargo}` : s.nome,
      to: `/servidores/${s.id}/edit`,
    })),
  });
}

export async function exportContractCsv(req: Request, res: Response) {
  const contract = await loadContractForExport(String(req.params.id), req);
  const csv = contractsToCsv([contract]);
  const name = `contrato-${contract.numeroGms || contract.id}.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  return res.status(200).send(csv);
}

export async function exportContractXlsx(req: Request, res: Response) {
  const contract = await loadContractForExport(String(req.params.id), req);
  const buf = await contractsToXlsx([contract]);
  const name = `contrato-${contract.numeroGms || contract.id}.xlsx`;
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  return res.status(200).send(buf);
}

export async function exportContractPdf(req: Request, res: Response) {
  const contract = await loadContractForExport(String(req.params.id), req);
  const buf = await contractToPdf(contract, { emitidoPor: emitidoPor(req) });
  const name = `contrato-${contract.numeroGms || contract.id}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  return res.status(200).send(buf);
}

const router = Router();
const exportRoles = requireMinRole('ANALISTA');
router.get('/exports/contratos.csv', exportRoles, asyncHandler(exportAcervoCsv));
router.get('/exports/contratos.xlsx', exportRoles, asyncHandler(exportAcervoXlsx));
router.get('/search', exportRoles, asyncHandler(globalSearch));

export default router;
