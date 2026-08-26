import { Request, Response } from 'express';
import { globalSearch } from '../services/searchService';
import {
  contractsToCsv,
  contractsToXlsx,
  emitidoPor,
  listContractsForExport,
  loadContractForExport,
  contractToPdf,
  parseExportFilters,
} from '../services/exportService';

export async function exportAcervoCsv(req: Request, res: Response) {
  const rows = await listContractsForExport(req, parseExportFilters(req.query));
  const csv = contractsToCsv(rows);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="contratos.csv"');
  return res.status(200).send(csv);
}

export async function exportAcervoXlsx(req: Request, res: Response) {
  const rows = await listContractsForExport(req, parseExportFilters(req.query));
  const buf = await contractsToXlsx(rows);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', 'attachment; filename="contratos.xlsx"');
  return res.status(200).send(buf);
}

export async function searchGlobal(req: Request, res: Response) {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  return res.status(200).json(await globalSearch(q, req));
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
