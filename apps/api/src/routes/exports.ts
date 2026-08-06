import { Router, Request, Response } from 'express';
import { asyncHandler } from '../lib/errors';
import { getOrgaoScope } from '../lib/audit';
import { getPrisma } from '../lib/prisma';
import { contratoService } from '../services/contratoService';

function csvEscape(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function contractsToCsv(rows: Array<Record<string, unknown>>): string {
  const headers = [
    'id',
    'numeroGms',
    'anoGms',
    'protocolo',
    'objeto',
    'situacao',
    'fornecedor',
    'unidade',
    'orgao',
    'valorGlobalOriginal',
    'dataInicioVigencia',
    'dataFimVigenciaOriginal',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    const gestora = r.unidadeGestora as { sigla?: string } | undefined;
    const sub = r.subunidade as { sigla?: string } | undefined;
    const fsp = r.unidadeFsp as { sigla?: string } | undefined;
    lines.push(
      [
        r.id,
        r.numeroGms,
        r.anoGms,
        r.protocoloCabeca ?? r.eProtocolo ?? '',
        r.objeto,
        r.situacao ?? r.status,
        r.fornecedorName ?? '',
        sub?.sigla ?? gestora?.sigla ?? fsp?.sigla ?? '',
        gestora?.sigla ?? fsp?.sigla ?? '',
        r.valorAnual ?? r.valorGlobalOriginal ?? '',
        r.dataInicioVigencia ?? '',
        r.dataFimVigenciaOriginal ?? r.fimVigencia ?? '',
      ]
        .map(csvEscape)
        .join(','),
    );
  }
  return `\uFEFF${lines.join('\n')}\n`;
}

async function exportContratos(req: Request, res: Response) {
  const rows = await contratoService.list(getOrgaoScope(req));
  const csv = contractsToCsv(rows as Array<Record<string, unknown>>);
  const asXlsx = req.path.endsWith('.xlsx');
  res.setHeader(
    'Content-Type',
    asXlsx ? 'application/vnd.ms-excel; charset=utf-8' : 'text/csv; charset=utf-8',
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="contratos.csv"`,
  );
  return res.status(200).send(csv);
}

/** Busca global leve para CommandPalette. */
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

const router = Router();
router.get('/exports/contratos.csv', asyncHandler(exportContratos));
router.get('/exports/contratos.xlsx', asyncHandler(exportContratos));
router.get('/search', asyncHandler(globalSearch));

export default router;
