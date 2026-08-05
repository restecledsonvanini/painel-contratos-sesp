import { Request, Response } from 'express';
import {
  AlteracaoContratualCreateSchema,
  AlteracaoContratualUpdateSchema,
  AlteracaoSimularSchema,
} from '@painel/schema';
import { routeParam } from '../lib/params';
import { alteracaoService } from '../services/alteracaoService';

export async function listAlteracoes(req: Request, res: Response) {
  return res.status(200).json(await alteracaoService.list(routeParam(req, 'id')));
}

export async function getAlteracao(req: Request, res: Response) {
  return res
    .status(200)
    .json(await alteracaoService.get(routeParam(req, 'id'), routeParam(req, 'alteracaoId')));
}

export async function createAlteracao(req: Request, res: Response) {
  const parsed = AlteracaoContratualCreateSchema.parse(req.body);
  return res.status(201).json(await alteracaoService.create(routeParam(req, 'id'), parsed));
}

export async function updateAlteracao(req: Request, res: Response) {
  const parsed = AlteracaoContratualUpdateSchema.parse(req.body);
  return res
    .status(200)
    .json(
      await alteracaoService.update(
        routeParam(req, 'id'),
        routeParam(req, 'alteracaoId'),
        parsed,
      ),
    );
}

export async function deleteAlteracao(req: Request, res: Response) {
  return res
    .status(200)
    .json(await alteracaoService.remove(routeParam(req, 'id'), routeParam(req, 'alteracaoId')));
}

export async function simularAlteracao(req: Request, res: Response) {
  const parsed = AlteracaoSimularSchema.parse(req.body);
  return res.status(200).json(await alteracaoService.simular(routeParam(req, 'id'), parsed));
}

/** Alias: POST /alteracoes/:id/simular onde :id = contratoId */
export async function simularAlteracaoAlias(req: Request, res: Response) {
  const parsed = AlteracaoSimularSchema.parse(req.body);
  return res.status(200).json(await alteracaoService.simular(routeParam(req, 'id'), parsed));
}
