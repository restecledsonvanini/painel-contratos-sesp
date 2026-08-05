import { Request, Response } from 'express';
import { AlertaQuerySchema, ImportacaoCreateSchema } from '@painel/schema';
import { routeParam } from '../lib/params';
import { alertaService, importacaoService } from '../services/operacaoService';

export async function listAlertas(req: Request, res: Response) {
  const query = AlertaQuerySchema.parse(req.query);
  return res.status(200).json(await alertaService.list(query));
}

export async function listAlertaConfigs(_req: Request, res: Response) {
  return res.status(200).json(await alertaService.configs());
}

export async function reconhecerAlerta(req: Request, res: Response) {
  return res.status(200).json(await alertaService.reconhecer(routeParam(req, 'id')));
}

export async function gerarAlertas(_req: Request, res: Response) {
  return res.status(200).json(await alertaService.gerar());
}

export async function createImportacao(req: Request, res: Response) {
  const parsed = ImportacaoCreateSchema.parse(req.body);
  return res.status(201).json(await importacaoService.create(parsed));
}

export async function getImportacao(req: Request, res: Response) {
  return res.status(200).json(await importacaoService.get(routeParam(req, 'id')));
}

export async function aplicarImportacao(req: Request, res: Response) {
  return res.status(200).json(await importacaoService.aplicar(routeParam(req, 'id')));
}
