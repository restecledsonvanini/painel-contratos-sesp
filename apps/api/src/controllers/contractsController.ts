import { Request, Response } from 'express';
import { ContractCreateSchema, ContractUpdateSchema } from '@painel/schema';
import { getOrgaoScope } from '../lib/scope';
import { routeParam } from '../lib/params';
import { contratoService } from '../services/contratoService';

export async function listContracts(req: Request, res: Response) {
  return res.status(200).json(
    await contratoService.list(getOrgaoScope(req), req.query as Record<string, unknown>),
  );
}

export async function getContract(req: Request, res: Response) {
  return res.status(200).json(await contratoService.getById(routeParam(req, 'id'), req));
}

export async function createContract(req: Request, res: Response) {
  const parsed = ContractCreateSchema.parse(req.body);
  return res.status(201).json(await contratoService.create(parsed, req));
}

export async function updateContract(req: Request, res: Response) {
  const parsed = ContractUpdateSchema.parse(req.body);
  return res.status(200).json(await contratoService.update(routeParam(req, 'id'), parsed, req));
}

export async function deleteContract(req: Request, res: Response) {
  return res.status(200).json(await contratoService.remove(routeParam(req, 'id'), req));
}
