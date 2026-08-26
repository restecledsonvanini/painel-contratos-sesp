import { centsToNumber, centsToReais } from '../lib/money';

type Label = { id: string; codigo?: string | null; label?: string | null };

type DotacaoRow = {
  naturezaDespesa?: Label | null;
  fonteRecurso?: Label | null;
  [key: string]: unknown;
};

type ContratoDotacaoRow = {
  id: string;
  contratoId: string;
  dotacaoId: string;
  exercicio: number;
  valorPrevistoCents: bigint | number;
  dotacao?: {
    id: string;
    codigo: string;
    exercicio: number;
    naturezaDespesa?: Label | null;
    fonteRecurso?: Label | null;
    descricao?: string | null;
  } | null;
};

type EmpenhoRow = {
  id: string;
  contratoId: string;
  dotacaoId?: string | null;
  dotacao?: unknown;
  numero: string;
  exercicio: number;
  tipo: string;
  data: Date;
  valorCents: bigint | number;
  valorLiquidadoCents?: bigint | number | null;
  valorPagoCents?: bigint | number | null;
  situacao: string;
};

type ReservaRow = {
  valorCents?: bigint | number | null;
  [key: string]: unknown;
};

type PublicacaoRow = {
  id: string;
  contratoId?: string | null;
  alteracaoId?: string | null;
  veiculoId: string;
  veiculo?: unknown;
  dataPublicacao: Date;
  numeroEdicao?: string | null;
  idPncp?: string | null;
  url?: string | null;
};

type DocumentoRow = {
  id: string;
  contratoId?: string | null;
  alteracaoId?: string | null;
  processoId?: string | null;
  tipoDocumentoId?: string | null;
  tipoDocumento?: unknown;
  nome: string;
  storageKey?: string | null;
  urlExterna?: string | null;
  mimeType?: string | null;
  tamanhoBytes?: number | null;
  uploadedById?: string | null;
  createdAt: Date;
};

export function mapDotacao(r: DotacaoRow) {
  return {
    ...r,
    naturezaDespesa: r.naturezaDespesa,
    fonteRecurso: r.fonteRecurso,
  };
}

export function mapContratoDotacao(r: ContratoDotacaoRow) {
  return {
    id: r.id,
    contratoId: r.contratoId,
    dotacaoId: r.dotacaoId,
    exercicio: r.exercicio,
    valorPrevistoCents: centsToNumber(r.valorPrevistoCents),
    valorPrevisto: centsToReais(r.valorPrevistoCents),
    dotacao: r.dotacao
      ? {
          id: r.dotacao.id,
          codigo: r.dotacao.codigo,
          exercicio: r.dotacao.exercicio,
          naturezaDespesa: r.dotacao.naturezaDespesa,
          fonteRecurso: r.dotacao.fonteRecurso,
          descricao: r.dotacao.descricao,
        }
      : undefined,
  };
}

export function mapEmpenho(r: EmpenhoRow) {
  return {
    id: r.id,
    contratoId: r.contratoId,
    dotacaoId: r.dotacaoId,
    dotacao: r.dotacao,
    numero: r.numero,
    exercicio: r.exercicio,
    tipo: r.tipo,
    data: r.data,
    valorCents: centsToNumber(r.valorCents),
    valor: centsToReais(r.valorCents),
    valorLiquidadoCents: centsToNumber(r.valorLiquidadoCents),
    valorLiquidado: centsToReais(r.valorLiquidadoCents),
    valorPagoCents: centsToNumber(r.valorPagoCents),
    valorPago: centsToReais(r.valorPagoCents),
    situacao: r.situacao,
  };
}

export function mapReserva(r: ReservaRow) {
  return {
    ...r,
    valorCents: centsToNumber(r.valorCents),
    valor: centsToReais(r.valorCents),
  };
}

export function mapPublicacao(r: PublicacaoRow) {
  return {
    id: r.id,
    contratoId: r.contratoId,
    alteracaoId: r.alteracaoId,
    veiculoId: r.veiculoId,
    veiculo: r.veiculo,
    dataPublicacao: r.dataPublicacao,
    numeroEdicao: r.numeroEdicao,
    idPncp: r.idPncp,
    url: r.url,
  };
}

export function mapDocumento(r: DocumentoRow) {
  return {
    id: r.id,
    contratoId: r.contratoId,
    alteracaoId: r.alteracaoId,
    processoId: r.processoId,
    tipoDocumentoId: r.tipoDocumentoId,
    tipoDocumento: r.tipoDocumento,
    nome: r.nome,
    storageKey: r.storageKey,
    urlExterna: r.urlExterna,
    mimeType: r.mimeType,
    tamanhoBytes: r.tamanhoBytes,
    uploadedById: r.uploadedById,
    createdAt: r.createdAt,
  };
}
