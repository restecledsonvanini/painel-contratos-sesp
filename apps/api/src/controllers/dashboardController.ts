import { Request, Response } from 'express';
import { routeParam } from '../lib/params';
import { dashboardService } from '../services/dashboardService';

function etagFrom(payload: unknown) {
  const raw = JSON.stringify(payload);
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) hash = (hash * 31 + raw.charCodeAt(i)) | 0;
  return `"w/${Math.abs(hash).toString(16)}"`;
}

function sendCached(req: Request, res: Response, body: unknown) {
  const etag = etagFrom(body);
  res.setHeader('ETag', etag);
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }
  return res.status(200).json(body);
}

export async function getKpis(req: Request, res: Response) {
  const body = await dashboardService.kpis();
  if (body) {
    for (const [k, v] of Object.entries(body)) {
      if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) {
        body[k] = Number(v);
      }
    }
  }
  return sendCached(req, res, body);
}

export async function getVencimentos(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.vencimentos());
}

export async function getPorOrgao(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.porOrgao());
}

export async function getCustos(req: Request, res: Response) {
  const agrupar = typeof req.query.agrupar === 'string' ? req.query.agrupar : undefined;
  return sendCached(req, res, await dashboardService.custos(agrupar));
}

export async function getAditivos(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.aditivos());
}

export async function getFornecedores(req: Request, res: Response) {
  const limite = req.query.limite != null ? Number(req.query.limite) : 10;
  return sendCached(req, res, await dashboardService.fornecedores(limite));
}

export async function getFiscalizacao(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.fiscalizacao());
}

export async function getPublicidade(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.publicidade());
}

export async function getModalidade(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.modalidade());
}

export async function getFrota(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.frota());
}

export async function getImoveis(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.imoveis());
}

export async function getPostos(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.postos());
}

export async function getAlimentacao(req: Request, res: Response) {
  return sendCached(req, res, await dashboardService.alimentacao());
}

export async function getItens(req: Request, res: Response) {
  const categoria =
    typeof req.query.categoriaItemId === 'string'
      ? req.query.categoriaItemId
      : typeof req.query.categoria === 'string'
        ? req.query.categoria
        : undefined;
  return sendCached(req, res, await dashboardService.itens(categoria));
}

export async function refreshAnalytics(_req: Request, res: Response) {
  return res.status(200).json(await dashboardService.refresh());
}

export async function getTimeline(req: Request, res: Response) {
  return res.status(200).json(await dashboardService.timeline(routeParam(req, 'id')));
}

export async function getLimites(req: Request, res: Response) {
  return res.status(200).json(await dashboardService.limites(routeParam(req, 'id')));
}

export async function getFinanceiro(req: Request, res: Response) {
  return res.status(200).json(await dashboardService.financeiro(routeParam(req, 'id')));
}
