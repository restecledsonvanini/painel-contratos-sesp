import { Request, Response } from 'express';
import {
  ContratoDotacaoCreateSchema,
  DocumentoCreateSchema,
  DotacaoCreateSchema,
  EmpenhoCreateSchema,
  EmpenhoUpdateSchema,
  PublicacaoCreateSchema,
  ReservaCreateSchema,
} from '@painel/schema';
import { routeParam } from '../lib/params';
import { orcamentoService } from '../services/orcamentoService';

export async function listDotacoes(req: Request, res: Response) {
  return res.status(200).json(await orcamentoService.listDotacoes(req.query as Record<string, unknown>));
}

export async function getDotacao(req: Request, res: Response) {
  return res.status(200).json(await orcamentoService.getDotacao(routeParam(req, 'id')));
}

export async function createDotacao(req: Request, res: Response) {
  const parsed = DotacaoCreateSchema.parse(req.body);
  return res.status(201).json(await orcamentoService.createDotacao(parsed));
}

export async function updateDotacao(req: Request, res: Response) {
  return res
    .status(200)
    .json(await orcamentoService.updateDotacao(routeParam(req, 'id'), req.body));
}

export async function deleteDotacao(req: Request, res: Response) {
  return res.status(200).json(await orcamentoService.deleteDotacao(routeParam(req, 'id')));
}

export async function listContratoDotacoes(req: Request, res: Response) {
  return res.status(200).json(await orcamentoService.listContratoDotacoes(routeParam(req, 'id')));
}

export async function createContratoDotacao(req: Request, res: Response) {
  const parsed = ContratoDotacaoCreateSchema.parse(req.body);
  return res
    .status(201)
    .json(await orcamentoService.linkContratoDotacao(routeParam(req, 'id'), parsed));
}

export async function deleteContratoDotacao(req: Request, res: Response) {
  return res
    .status(200)
    .json(
      await orcamentoService.unlinkContratoDotacao(
        routeParam(req, 'id'),
        routeParam(req, 'dotacaoLinkId'),
      ),
    );
}

export async function listEmpenhos(req: Request, res: Response) {
  return res.status(200).json(await orcamentoService.listEmpenhos(routeParam(req, 'id')));
}

export async function createEmpenho(req: Request, res: Response) {
  const parsed = EmpenhoCreateSchema.parse(req.body);
  return res.status(201).json(await orcamentoService.createEmpenho(routeParam(req, 'id'), parsed));
}

export async function updateEmpenho(req: Request, res: Response) {
  const parsed = EmpenhoUpdateSchema.parse(req.body);
  return res
    .status(200)
    .json(
      await orcamentoService.updateEmpenho(
        routeParam(req, 'id'),
        routeParam(req, 'empenhoId'),
        parsed,
      ),
    );
}

export async function deleteEmpenho(req: Request, res: Response) {
  return res
    .status(200)
    .json(
      await orcamentoService.deleteEmpenho(routeParam(req, 'id'), routeParam(req, 'empenhoId')),
    );
}

export async function listReservas(req: Request, res: Response) {
  const contratoId =
    typeof req.query.contratoId === 'string' ? req.query.contratoId : undefined;
  return res.status(200).json(await orcamentoService.listReservas(contratoId));
}

export async function createReserva(req: Request, res: Response) {
  const parsed = ReservaCreateSchema.parse(req.body);
  return res.status(201).json(await orcamentoService.createReserva(parsed));
}

export async function deleteReserva(req: Request, res: Response) {
  return res.status(200).json(await orcamentoService.deleteReserva(routeParam(req, 'id')));
}

export async function listPublicacoes(req: Request, res: Response) {
  return res.status(200).json(
    await orcamentoService.listPublicacoes({
      contratoId: typeof req.query.contratoId === 'string' ? req.query.contratoId : undefined,
      alteracaoId: typeof req.query.alteracaoId === 'string' ? req.query.alteracaoId : undefined,
    }),
  );
}

export async function listContratoPublicacoes(req: Request, res: Response) {
  return res
    .status(200)
    .json(await orcamentoService.listPublicacoes({ contratoId: routeParam(req, 'id') }));
}

export async function createPublicacao(req: Request, res: Response) {
  const parsed = PublicacaoCreateSchema.parse(req.body);
  return res.status(201).json(await orcamentoService.createPublicacao(parsed));
}

export async function createContratoPublicacao(req: Request, res: Response) {
  const parsed = PublicacaoCreateSchema.parse({
    ...req.body,
    contratoId: routeParam(req, 'id'),
    alteracaoId: null,
  });
  return res.status(201).json(await orcamentoService.createPublicacao(parsed));
}

export async function deletePublicacao(req: Request, res: Response) {
  return res.status(200).json(await orcamentoService.deletePublicacao(routeParam(req, 'id')));
}

export async function listDocumentos(req: Request, res: Response) {
  return res.status(200).json(
    await orcamentoService.listDocumentos({
      contratoId: typeof req.query.contratoId === 'string' ? req.query.contratoId : undefined,
      alteracaoId: typeof req.query.alteracaoId === 'string' ? req.query.alteracaoId : undefined,
      processoId: typeof req.query.processoId === 'string' ? req.query.processoId : undefined,
    }),
  );
}

export async function listContratoDocumentos(req: Request, res: Response) {
  return res
    .status(200)
    .json(await orcamentoService.listDocumentos({ contratoId: routeParam(req, 'id') }));
}

export async function createDocumento(req: Request, res: Response) {
  const parsed = DocumentoCreateSchema.parse(req.body);
  return res.status(201).json(await orcamentoService.createDocumento(parsed));
}

export async function createContratoDocumento(req: Request, res: Response) {
  const parsed = DocumentoCreateSchema.parse({
    ...req.body,
    contratoId: routeParam(req, 'id'),
  });
  return res.status(201).json(await orcamentoService.createDocumento(parsed));
}

export async function deleteDocumento(req: Request, res: Response) {
  return res.status(200).json(await orcamentoService.deleteDocumento(routeParam(req, 'id')));
}
