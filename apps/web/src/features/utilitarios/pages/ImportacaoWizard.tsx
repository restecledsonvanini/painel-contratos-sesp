import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, FormField, Page, Select, Textarea } from '@painel/ui';
import { http, getErrorMessage } from '../../../lib/http';
import { useCanAct } from '../../../lib/access';
import { useAuth } from '../../../providers/AuthProvider';

type TipoEntidade = 'fornecedor' | 'servidor' | 'dotacao' | 'unidade';

type Lote = {
  id: string;
  nomeArquivo: string;
  tipoEntidade: string;
  situacao: string;
  totalLinhas: number;
  linhasValidas: number;
  linhasComErro: number;
  dryRun: boolean;
  linhas: Array<{
    id: string;
    numeroLinha: number;
    erros?: unknown;
    registroCriadoId?: string | null;
    payloadOriginal: Record<string, unknown>;
  }>;
};

const SAMPLES: Record<TipoEntidade, string> = {
  fornecedor: `documento,razaoSocial,tipoPessoa,nomeFantasia
11222333000181,Fornecedor Import Demo LTDA,JURIDICA,Import Demo
00011122233,Pessoa Física Inválida CNPJ,JURIDICA,`,
  servidor: `cpf,nome,cargo,email
39053344705,Servidor Import Demo,Analista,servidor.demo@sesp.pr.gov.br
123,Nome Sem CPF Valido,Auxiliar,`,
  dotacao: `exercicio,codigo,naturezaDespesaCodigo,fonteRecursoCodigo,descricao
2026,10.10.0.1.33903900.1,33903900,TESOURO_ESTADO,Serviços PJ — exemplo
2026,,33903900,FUNESP,Sem código`,
  unidade: `orgaoSigla,sigla,nome,nivel,parentSigla
PMPR,CRPM-IMP-1,1º Comando Regional Import Demo,COMANDO_REGIONAL,CG-PMPR
PMPR,BBM-IMP-X,Batalhão Import Demo,BATALHAO,CG-PMPR
PMPR,,Sem sigla,BATALHAO,`,
};

const COLUNAS: Record<TipoEntidade, string> = {
  fornecedor: 'documento (CNPJ 14 / CPF 11), razaoSocial, tipoPessoa?, nomeFantasia?',
  servidor: 'cpf (11 dígitos), nome, cargo?, email?',
  dotacao:
    'exercicio, codigo, naturezaDespesaCodigo, fonteRecursoCodigo, unidadeOrcamentaria?, funcionalProgramatica?, descricao?',
  unidade: 'orgaoSigla, sigla, nome, nivel?, parentSigla?, ativo?',
};

function formatErros(erros: unknown): string {
  if (!Array.isArray(erros)) return String(erros);
  return erros
    .map((e) => {
      if (!e || typeof e !== 'object') return String(e);
      const err = e as { path?: unknown[]; message?: string };
      const path = Array.isArray(err.path) ? err.path.join('.') : '';
      return path ? `${path}: ${err.message ?? 'inválido'}` : (err.message ?? 'inválido');
    })
    .join('; ');
}

export default function ImportacaoWizard() {
  const { user } = useAuth();
  const canImport = useCanAct('ANALISTA');
  const fileRef = useRef<HTMLInputElement>(null);
  const [tipoEntidade, setTipoEntidade] = useState<TipoEntidade>('fornecedor');
  const [csv, setCsv] = useState(SAMPLES.fornecedor);
  const [nomeArquivo, setNomeArquivo] = useState('fornecedor.csv');
  const [lote, setLote] = useState<Lote | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onChangeTipo(next: TipoEntidade) {
    const prevSample = SAMPLES[tipoEntidade];
    setTipoEntidade(next);
    setLote(null);
    setError(null);
    setNomeArquivo(`${next}.csv`);
    if (csv.trim() === prevSample.trim() || !csv.trim()) {
      setCsv(SAMPLES[next]);
    }
  }

  function onFileSelected(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setCsv(text);
      setNomeArquivo(file.name || `${tipoEntidade}.csv`);
      setLote(null);
      setError(null);
    };
    reader.onerror = () => setError('Falha ao ler o arquivo CSV.');
    reader.readAsText(file, 'UTF-8');
  }

  const dryRun = useMutation({
    mutationFn: async () =>
      (
        await http.post<Lote>('/importacoes', {
          nomeArquivo,
          tipoEntidade,
          csv,
          dryRun: true,
        })
      ).data,
    onSuccess: (data) => {
      setError(null);
      setLote(data);
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  const aplicar = useMutation({
    mutationFn: async (id: string) => (await http.post<Lote>(`/importacoes/${id}/aplicar`)).data,
    onSuccess: (data) => {
      setError(null);
      setLote(data);
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  return (
    <Page
      title="Importação CSV"
      description="Dry-run linha a linha com Zod; aplique apenas lotes sem erro."
      actions={
        <Button to="/painel?tab=alertas" variant="ghost">
          Alertas
        </Button>
      }
    >
      <Card variant="bordered" className="space-y-4 p-4">
        {!canImport ? (
          <p className="text-sm text-red-700">
            Importação exige papel <strong>ANALISTA</strong> ou superior
            {user?.role ? ` (seu papel: ${user.role})` : ''}.{' '}
            {!user ? (
              <Link to="/login" className="underline">
                Fazer login
              </Link>
            ) : (
              'Peça elevação de perfil a um administrador.'
            )}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3 items-center">
          <FormField label="Entidade" className="min-w-[12rem]">
            <Select
              disabled={!canImport}
              value={tipoEntidade}
              onChange={(v) => onChangeTipo(v as TipoEntidade)}
              options={[
                { id: 'fornecedor', label: 'Fornecedor' },
                { id: 'servidor', label: 'Servidor' },
                { id: 'dotacao', label: 'Dotação' },
                { id: 'unidade', label: 'Unidade' },
              ]}
            />
          </FormField>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onFileSelected(e.target.files?.[0])}
          />
          <Button
            variant="ghost"
            disabled={!canImport}
            onClick={() => fileRef.current?.click()}
          >
            Carregar arquivo
          </Button>
          <Button
            variant="ghost"
            disabled={!canImport}
            onClick={() => {
              setCsv(SAMPLES[tipoEntidade]);
              setNomeArquivo(`${tipoEntidade}.csv`);
              setLote(null);
              setError(null);
            }}
          >
            Restaurar exemplo
          </Button>
          <Button onClick={() => dryRun.mutate()} disabled={!canImport || dryRun.isPending}>
            {dryRun.isPending ? 'Validando…' : '1. Dry-run'}
          </Button>
          <Button
            variant="ghost"
            disabled={
              !canImport ||
              !lote ||
              lote.linhasComErro > 0 ||
              lote.situacao === 'APLICADO' ||
              aplicar.isPending
            }
            onClick={() => lote && aplicar.mutate(lote.id)}
          >
            {aplicar.isPending ? 'Aplicando…' : '2. Aplicar'}
          </Button>
        </div>

        <p className="text-sm text-[var(--text-muted)]">
          Colunas esperadas para <strong>{tipoEntidade}</strong>: {COLUNAS[tipoEntidade]}
          {nomeArquivo ? ` · arquivo: ${nomeArquivo}` : null}
        </p>

        <Textarea
          rows={10}
          value={csv}
          disabled={!canImport}
          onChange={(e) => setCsv(e.target.value)}
          className="font-mono text-sm"
        />

        {error && <p className="text-sm text-red-700">{error}</p>}

        {lote && (
          <div className="space-y-2 text-sm">
            <p>
              Lote <strong>{lote.id}</strong> ({lote.tipoEntidade}) — {lote.situacao}:{' '}
              {lote.linhasValidas} válidas / {lote.linhasComErro} com erro (total {lote.totalLinhas})
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {lote.linhas.map((l) => (
                <li key={l.id}>
                  Linha {l.numeroLinha}:{' '}
                  {l.erros
                    ? `erro — ${formatErros(l.erros)}`
                    : l.registroCriadoId
                      ? `criado ${l.registroCriadoId}`
                      : 'ok (dry-run)'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </Page>
  );
}
