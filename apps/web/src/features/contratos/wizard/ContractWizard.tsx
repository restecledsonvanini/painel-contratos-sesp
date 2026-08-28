import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CONTRACT_WIZARD_STEPS,
  ContractCreateSchema,
  ContractStepIdentificacaoSchema,
  ContractStepOrcamentoSchema,
  ContractStepPartesSchema,
  ContractStepVigenciaSchema,
  type ContractWizardStepId,
} from '@painel/schema';
import { limiteProrrogacaoMesesDefault } from '@painel/domain';
import {
  Button,
  DescriptionList,
  FieldArrayTable,
  FormActions,
  FormField,
  Input,
  Meter,
  Page,
  Select,
  Skeleton,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  useToast,
  type StepStatus,
} from '@painel/ui';
import { useCreateContract, useUpdateContract, useContract } from '../../../hooks/useContracts';
import {
  useFornecedores,
  useServidores,
  useUnidadesOrganizacionais,
} from '../../../hooks/useReferences';
import { useOrgaos } from '../../../hooks/useOrganizacao';
import { LookupSelect } from '../../../components/LookupSelect';
import { getErrorMessage } from '../../../lib/http';
import { formatCurrencyFromReais } from '../../../lib/format';
import { sugerirDataFim } from '../../../lib/prazo';
import { wizardPrefetch } from '../../../lib/wizardPrefetch';
import { useCatalogoWizard } from './useCatalogoWizard';

type FormValues = {
  numGms?: number;
  anoGms?: number;
  valorAnual?: number;
  unidadeGestoraId: string;
  subunidadeId: string;
  protocoloCabeca: string;
  numeroContrato: string;
  modalidade: string;
  fundamentoLegalId: string;
  pilar: 'CUSTEIO' | 'INVESTIMENTO' | 'SERVICOS';
  naturezaObjeto: string;
  objeto: string;
  gestorId: string;
  fiscalId: string;
  fornecedorId: string;
  dataInicio: string;
  dataFimOrig: string;
  prazoInicialValor?: number;
  prazoInicialUnidade: 'DIAS' | 'MESES' | 'ANOS';
  prorrogavel: boolean;
  limiteProrrogacaoMeses?: number | null;
  indiceReajuste: string;
  mesAniversarioReajuste?: number | null;
  status: string;
  observacoes: string;
  itens: Array<{
    catalogoItemId: string;
    quantidade: number;
    valorUnitario: number;
    periodicidade: 'UNICA' | 'DIARIA' | 'MENSAL' | 'ANUAL';
  }>;
  rateios: Array<{
    unidadeId: string;
    percentual?: number | null;
    valorCents?: number | null;
  }>;
};

const PILAR_OPTIONS = [
  { id: 'CUSTEIO', label: 'Custeio' },
  { id: 'INVESTIMENTO', label: 'Investimento' },
  { id: 'SERVICOS', label: 'Serviços' },
];

const NATUREZA_OPTIONS = [
  { id: 'SERVICO_CONTINUADO', label: 'Serviço continuado' },
  { id: 'SERVICO_NAO_CONTINUADO', label: 'Serviço não continuado' },
  { id: 'COMPRA', label: 'Compra' },
  { id: 'LOCACAO_BEM_MOVEL', label: 'Locação de bem móvel' },
  { id: 'LOCACAO_IMOVEL', label: 'Locação de imóvel' },
  { id: 'SOLUCAO_TIC', label: 'Solução de TIC' },
  { id: 'OBRA', label: 'Obra' },
  { id: 'SERVICO_ENGENHARIA', label: 'Serviço de engenharia' },
];

const PRAZO_UNIDADE_OPTIONS = [
  { id: 'DIAS', label: 'Dias' },
  { id: 'MESES', label: 'Meses' },
  { id: 'ANOS', label: 'Anos' },
];

const PERIODICIDADE_OPTIONS = [
  { id: 'UNICA', label: 'Única' },
  { id: 'DIARIA', label: 'Diária' },
  { id: 'MENSAL', label: 'Mensal' },
  { id: 'ANUAL', label: 'Anual' },
];

const STEP_IDS = CONTRACT_WIZARD_STEPS.map((s) => s.id);

function isStepId(value: string | null): value is ContractWizardStepId {
  return Boolean(value && STEP_IDS.includes(value as ContractWizardStepId));
}

function emptyToUndef(value?: string | null) {
  return value && value.trim() ? value : undefined;
}

function buildPayload(data: FormValues, mode: 'draft' | 'publish') {
  return {
    ...data,
    protocoloCabeca: emptyToUndef(data.protocoloCabeca) ?? null,
    numeroContrato: emptyToUndef(data.numeroContrato) ?? null,
    fundamentoLegalId: emptyToUndef(data.fundamentoLegalId) ?? null,
    subunidadeId: emptyToUndef(data.subunidadeId) ?? null,
    gestorId: emptyToUndef(data.gestorId),
    fiscalId: emptyToUndef(data.fiscalId),
    indiceReajuste: emptyToUndef(data.indiceReajuste) ?? null,
    observacoes: emptyToUndef(data.observacoes) ?? null,
    status: mode === 'draft' ? 'elaborado' : 'vigente',
    situacao: mode === 'draft' ? 'EM_ELABORACAO' : 'VIGENTE',
    itens: (data.itens ?? []).filter((item) => Boolean(item.catalogoItemId)),
    rateios: (data.rateios ?? [])
      .filter((r) => Boolean(r.unidadeId))
      .map((r) => ({
        unidadeId: r.unidadeId,
        percentual: r.percentual ?? null,
        valorCents: r.valorCents ?? null,
      })),
  };
}

export default function ContractForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const stepParam = searchParams.get('step');
  const currentStep: ContractWizardStepId = isStepId(stepParam) ? stepParam : 'identificacao';
  const prefetch = wizardPrefetch(currentStep);
  const { data: existingContract, isLoading: isContractLoading, error: contractError } = useContract(id);
  const { data: orgaos, isLoading: orgaosLoading } = useOrgaos({ enabled: prefetch.partes });
  const { data: unidades, isLoading: unidadesLoading } = useUnidadesOrganizacionais({
    enabled: prefetch.unidades,
  });
  const { data: fornecedoresPage, isLoading: fornecedoresLoading } = useFornecedores(
    { pageSize: 100 },
    { enabled: prefetch.partes },
  );
  const { data: servidoresPage, isLoading: servidoresLoading } = useServidores(
    { pageSize: 100 },
    { enabled: prefetch.partes },
  );
  const fornecedores = fornecedoresPage?.data;
  const servidores = servidoresPage?.data;
  const { data: catalogo } = useCatalogoWizard(prefetch.itens);
  const [stepErrors, setStepErrors] = useState<Partial<Record<ContractWizardStepId, string>>>({});
  const [dirtyGuard, setDirtyGuard] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(ContractCreateSchema as never),
    defaultValues: {
      numGms: undefined,
      anoGms: new Date().getFullYear(),
      valorAnual: undefined,
      unidadeGestoraId: '',
      subunidadeId: '',
      protocoloCabeca: '',
      numeroContrato: '',
      modalidade: '',
      fundamentoLegalId: '',
      pilar: 'SERVICOS',
      naturezaObjeto: 'SERVICO_CONTINUADO',
      objeto: '',
      gestorId: '',
      fiscalId: '',
      fornecedorId: '',
      dataInicio: '',
      dataFimOrig: '',
      prazoInicialValor: 12,
      prazoInicialUnidade: 'MESES',
      prorrogavel: true,
      limiteProrrogacaoMeses: 120,
      indiceReajuste: '',
      mesAniversarioReajuste: null,
      status: 'elaborado',
      observacoes: '',
      itens: [],
      rateios: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isDirty },
  } = form;
  const itensArray = useFieldArray({ control, name: 'itens' });
  const rateiosArray = useFieldArray({ control, name: 'rateios' });

  const unidadeGestoraId = useWatch({ control, name: 'unidadeGestoraId' });
  const naturezaObjeto = useWatch({ control, name: 'naturezaObjeto' });
  const dataInicio = useWatch({ control, name: 'dataInicio' });
  const prazoValor = useWatch({ control, name: 'prazoInicialValor' });
  const prazoUnidade = useWatch({ control, name: 'prazoInicialUnidade' });
  const rateiosWatch = useWatch({ control, name: 'rateios' });
  const valoresWatch = useWatch({ control });

  useEffect(() => {
    if (existingContract && id) {
      setValue('protocoloCabeca', existingContract.eProtocolo || existingContract.protocoloCabeca || '');
      setValue('numGms', existingContract.numGms);
      setValue('anoGms', existingContract.anoGms);
      setValue('valorAnual', existingContract.valorAnual ?? existingContract.valorGlobalOriginal ?? undefined);
      setValue(
        'unidadeGestoraId',
        existingContract.unidadeGestoraId || '',
      );
      setValue('subunidadeId', existingContract.subunidadeId || '');
      setValue('modalidade', existingContract.modalidade || '');
      setValue('fundamentoLegalId', existingContract.fundamentoLegalId || '');
      setValue('pilar', (existingContract.pilar as FormValues['pilar']) || 'SERVICOS');
      setValue('naturezaObjeto', existingContract.naturezaObjeto || 'SERVICO_CONTINUADO');
      setValue('objeto', existingContract.objeto || '');
      setValue('gestorId', existingContract.gestorId || '');
      setValue('fiscalId', existingContract.fiscalId || '');
      setValue('fornecedorId', existingContract.fornecedorId || '');
      setValue(
        'dataInicio',
        (existingContract.dataInicioVigencia || existingContract.dataInicio || '').toString().slice(0, 10),
      );
      setValue(
        'dataFimOrig',
        (existingContract.dataFimVigenciaOriginal || existingContract.dataFimOrig || '')
          .toString()
          .slice(0, 10),
      );
      setValue(
        'status',
        existingContract.status ||
          (existingContract.situacao === 'EM_ELABORACAO' ? 'elaborado' : 'vigente'),
      );
      setValue('observacoes', existingContract.observacoes || '');
      setDirtyGuard(false);
    }
  }, [existingContract, id, setValue]);

  useEffect(() => {
    if (id) return; // não sobrescrever limite ao editar contrato existente
    const limite = limiteProrrogacaoMesesDefault(naturezaObjeto as never);
    setValue('limiteProrrogacaoMeses', limite);
    setValue('prorrogavel', limite != null);
  }, [naturezaObjeto, setValue, id]);

  useEffect(() => {
    if (!dataInicio || !prazoValor) return;
    const sugestao = sugerirDataFim(dataInicio, Number(prazoValor), prazoUnidade || 'MESES');
    if (sugestao) setValue('dataFimOrig', sugestao, { shouldDirty: true });
  }, [dataInicio, prazoValor, prazoUnidade, setValue]);

  useEffect(() => {
    if (isDirty) setDirtyGuard(true);
  }, [isDirty]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyGuard) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirtyGuard]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void saveDraft();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const setStep = useCallback(
    (stepId: ContractWizardStepId) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('step', stepId);
        return next;
      });
    },
    [setSearchParams],
  );

  const validateStep = useCallback(
    (stepId: ContractWizardStepId): boolean => {
      const values = getValues();
      let result: { success: boolean; error?: { issues: Array<{ message: string }> } };

      switch (stepId) {
        case 'identificacao':
          result = ContractStepIdentificacaoSchema.safeParse(values);
          break;
        case 'partes':
          result = ContractStepPartesSchema.safeParse(values);
          break;
        case 'vigencia':
          result = ContractStepVigenciaSchema.safeParse(values);
          break;
        case 'orcamento':
          result = ContractStepOrcamentoSchema.safeParse(values);
          break;
        case 'itens':
        case 'rateio':
        case 'publicidade':
        case 'revisao':
          result = { success: true };
          break;
        default:
          result = { success: true };
      }

      if (!result.success) {
        const message = result.error?.issues?.[0]?.message || 'Etapa incompleta';
        setStepErrors((prev) => ({ ...prev, [stepId]: message }));
        toast.error('Etapa incompleta', message);
        return false;
      }
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[stepId];
        return next;
      });
      return true;
    },
    [getValues, toast],
  );

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    const idx = STEP_IDS.indexOf(currentStep);
    if (idx < STEP_IDS.length - 1) setStep(STEP_IDS[idx + 1] as ContractWizardStepId);
  };

  const goPrev = () => {
    const idx = STEP_IDS.indexOf(currentStep);
    if (idx > 0) setStep(STEP_IDS[idx - 1] as ContractWizardStepId);
  };

  const persist = async (mode: 'draft' | 'publish') => {
    const coreOk =
      validateStep('identificacao') &&
      validateStep('partes') &&
      validateStep('vigencia') &&
      validateStep('orcamento');
    if (!coreOk) {
      toast.error('Preencha identificação, partes, vigência e orçamento antes de salvar.');
      return;
    }

    const data = getValues();
    if (mode === 'publish') {
      const full = ContractCreateSchema.safeParse(buildPayload(data, 'publish'));
      if (!full.success) {
        toast.error('Não é possível publicar', full.error.issues[0]?.message || 'Revise os campos');
        setStep('revisao');
        return;
      }
    }

    const payload = buildPayload(data, mode);
    try {
      if (id) {
        const { itens: _itens, rateios: _rateios, ...updatePayload } = payload;
        await updateContract.mutateAsync({ id, payload: updatePayload });
        toast.success(mode === 'draft' ? 'Rascunho salvo.' : 'Contrato publicado.');
        setDirtyGuard(false);
        if (mode === 'publish') navigate(`/contracts/${id}`);
      } else {
        const created = await createContract.mutateAsync(payload as never);
        toast.success(mode === 'draft' ? 'Rascunho criado.' : 'Contrato publicado.');
        setDirtyGuard(false);
        if (mode === 'publish') {
          navigate(`/contracts/${created.id}`);
        } else {
          navigate(`/contracts/${created.id}/edit?step=${currentStep}`, { replace: true });
        }
      }
    } catch (err) {
      toast.error('Erro ao salvar contrato.', getErrorMessage(err));
    }
  };

  const saveDraft = () => persist('draft');
  const publish = () => persist('publish');

  const onSubmit = handleSubmit(async () => {
    await persist(currentStep === 'revisao' ? 'publish' : 'draft');
  });

  const saving =
    Boolean((createContract as { isPending?: boolean; isLoading?: boolean }).isPending ??
      (createContract as { isLoading?: boolean }).isLoading) ||
    Boolean((updateContract as { isPending?: boolean; isLoading?: boolean }).isPending ??
      (updateContract as { isLoading?: boolean }).isLoading);

  const rateioPct = useMemo(
    () => (rateiosWatch ?? []).reduce((sum, r) => sum + (Number(r?.percentual) || 0), 0),
    [rateiosWatch],
  );

  const stepperSteps = CONTRACT_WIZARD_STEPS.map((step) => {
    let status: StepStatus = 'pending';
    if (stepErrors[step.id]) status = 'error';
    else if (step.id === currentStep) status = 'current';
    else if (STEP_IDS.indexOf(step.id) < STEP_IDS.indexOf(currentStep)) status = 'completed';
    return { id: step.id, label: step.label, status };
  });

  if (id && isContractLoading) {
    return (
      <Page title="Editar contrato">
        <Skeleton variant="card" lines={6} />
      </Page>
    );
  }

  if (id && contractError) {
    return (
      <Page title="Editar contrato">
        <div className="app-form__panel" style={{ color: 'var(--danger)' }}>
          Erro ao carregar contrato.
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={id ? 'Editar contrato' : 'Novo contrato'}
      description="Wizard em 8 etapas com rascunho no servidor (Ctrl+S). Publique só quando a revisão estiver completa."
    >
      <form onSubmit={onSubmit} className="app-form space-y-4">
        <div className="app-form__panel">
          <Stepper
            steps={stepperSteps}
            onStepClick={(stepId) => setStep(stepId as ContractWizardStepId)}
          />
        </div>

        <div className="app-form__panel" aria-live="polite">
          {currentStep === 'identificacao' && (
            <fieldset className="app-form__grid m-0 min-w-0 border-0 p-0">
              <legend className="app-form__legend">Identificação</legend>
              <FormField label="Protocolo" hint="e-Protocolo" className="app-form__col-5">
                <Input {...register('protocoloCabeca')} />
              </FormField>
              <FormField label="Contrato nº" className="app-form__col-3">
                <Input {...register('numeroContrato')} />
              </FormField>
              <FormField label="GMS" className="app-form__col-2">
                <Input type="number" {...register('numGms', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Ano" className="app-form__col-2">
                <Input type="number" {...register('anoGms', { valueAsNumber: true })} />
              </FormField>
              <Controller
                name="modalidade"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Modalidade"
                    className="app-form__col-4"
                    error={errors.modalidade ? String(errors.modalidade.message) : undefined}
                  >
                    <LookupSelect
                      hideLabel
                      slug="modalidade-licitacao"
                      valueMode="codigo"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="fundamentoLegalId"
                control={control}
                render={({ field }) => (
                  <FormField label="Fundamento" className="app-form__col-4">
                    <LookupSelect
                      hideLabel
                      slug="fundamento-legal"
                      valueMode="id"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="pilar"
                control={control}
                render={({ field }) => (
                  <FormField label="Pilar" className="app-form__col-4">
                    <Select
                      options={PILAR_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="naturezaObjeto"
                control={control}
                render={({ field }) => (
                  <FormField label="Natureza" className="app-form__col-6">
                    <Select
                      options={NATUREZA_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormField>
                )}
              />
              <FormField
                label="Objeto"
                error={errors.objeto ? String(errors.objeto.message) : undefined}
                className="app-form__col-12"
              >
                <Textarea rows={2} className="app-form__textarea" {...register('objeto')} />
              </FormField>
            </fieldset>
          )}

          {currentStep === 'partes' && (
            <fieldset className="app-form__grid m-0 min-w-0 border-0 p-0">
              <legend className="app-form__legend">Partes</legend>
              <Controller
                name="unidadeGestoraId"
                control={control}
                render={({ field }) => (
                  <FormField label="Unidade" hint="Força / SESP" className="app-form__col-6">
                    <Select
                      options={(orgaos ?? []).map((item) => ({
                        id: item.id,
                        label: `${item.sigla} — ${item.nome}`,
                      }))}
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v);
                        setValue('subunidadeId', '');
                      }}
                      disabled={orgaosLoading}
                      placeholder="Selecione"
                    />
                  </FormField>
                )}
              />
              <Controller
                name="subunidadeId"
                control={control}
                render={({ field }) => (
                  <FormField label="Subunidade" hint="Opcional" className="app-form__col-6">
                    <Select
                      options={(unidades ?? [])
                        .filter((u) => (u.orgaoId || u.orgao?.id) === unidadeGestoraId)
                        .map((item) => ({
                          id: item.id,
                          label: `${item.sigla} — ${item.nome}`,
                        }))}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={unidadesLoading || !unidadeGestoraId}
                      placeholder="Nenhuma"
                    />
                  </FormField>
                )}
              />
              <Controller
                name="fornecedorId"
                control={control}
                render={({ field }) => (
                  <FormField label="Fornecedor" className="app-form__col-12">
                    <Select
                      options={(fornecedores ?? []).map((item) => ({
                        id: item.id,
                        label: `${item.razaoSocial} — ${item.documento}`,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={fornecedoresLoading}
                      placeholder="Selecione"
                    />
                  </FormField>
                )}
              />
              <Controller
                name="gestorId"
                control={control}
                render={({ field }) => (
                  <FormField label="Gestor" className="app-form__col-6">
                    <Select
                      options={(servidores ?? [])
                        .filter((item) => /gestor/i.test(item.cargo || item.nome || ''))
                        .map((item) => ({
                          id: item.id,
                          label: item.cargo ? `${item.nome} — ${item.cargo}` : item.nome,
                        }))}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={servidoresLoading}
                      placeholder="Selecione"
                    />
                  </FormField>
                )}
              />
              <Controller
                name="fiscalId"
                control={control}
                render={({ field }) => (
                  <FormField label="Fiscal" className="app-form__col-6">
                    <Select
                      options={(servidores ?? [])
                        .filter((item) => /fiscal/i.test(item.cargo || item.nome || ''))
                        .map((item) => ({
                          id: item.id,
                          label: item.cargo ? `${item.nome} — ${item.cargo}` : item.nome,
                        }))}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={servidoresLoading}
                      placeholder="Selecione"
                    />
                  </FormField>
                )}
              />
            </fieldset>
          )}

          {currentStep === 'itens' && (
            <fieldset className="app-form__grid m-0 min-w-0 border-0 p-0">
              <legend className="app-form__legend">Itens</legend>
              <div className="app-form__col-12 min-w-0">
                {id ? (
                  existingContract?.itens?.length ? (
                    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)]">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableHeader>Item</TableHeader>
                            <TableHeader className="text-right">Qtd.</TableHeader>
                            <TableHeader className="text-right">Valor un.</TableHeader>
                            <TableHeader>Período</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {existingContract.itens.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <strong>{item.catalogoNome || item.catalogoItemId}</strong>
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {item.quantidade} {item.unidadeMedida || 'un'}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {formatCurrencyFromReais(item.valorUnitario ?? 0)}
                              </TableCell>
                              <TableCell>{item.periodicidade || '—'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                      Nenhum item cadastrado neste contrato.
                    </p>
                  )
                ) : (
                  <FieldArrayTable
                    columns={[
                      { id: 'item', header: 'Item', width: '42%' },
                      { id: 'qtd', header: 'Qtd.', width: '12%', align: 'right' },
                      { id: 'valor', header: 'Valor un.', width: '16%', align: 'right' },
                      { id: 'periodo', header: 'Período', width: '18%' },
                    ]}
                    items={itensArray.fields}
                    onAdd={() =>
                      itensArray.append({
                        catalogoItemId: '',
                        quantidade: 1,
                        valorUnitario: 0,
                        periodicidade: 'UNICA',
                      })
                    }
                    onRemove={(index) => itensArray.remove(index)}
                    addLabel="Linha"
                    emptyLabel="Nenhum item — opcional no rascunho."
                    renderCells={(_item, index) => [
                      <Controller
                        key="item"
                        name={`itens.${index}.catalogoItemId`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            aria-label="Item do catálogo"
                            options={(catalogo ?? []).map((c) => ({
                              id: c.id,
                              label: `${c.categoriaItem?.codigo ? `${c.categoriaItem.codigo} · ` : ''}${c.nome}`,
                            }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Selecione"
                          />
                        )}
                      />,
                      <Input
                        key="qtd"
                        type="number"
                        step="0.0001"
                        aria-label="Quantidade"
                        {...register(`itens.${index}.quantidade` as const, { valueAsNumber: true })}
                      />,
                      <Input
                        key="valor"
                        type="number"
                        step="0.01"
                        aria-label="Valor unitário"
                        {...register(`itens.${index}.valorUnitario` as const, { valueAsNumber: true })}
                      />,
                      <Controller
                        key="periodo"
                        name={`itens.${index}.periodicidade`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            aria-label="Periodicidade"
                            options={PERIODICIDADE_OPTIONS}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />,
                    ]}
                  />
                )}
              </div>
            </fieldset>
          )}

          {currentStep === 'vigencia' && (
            <fieldset className="app-form__grid m-0 min-w-0 border-0 p-0">
              <legend className="app-form__legend">Vigência</legend>
              <FormField label="Início" className="app-form__col-3">
                <Input type="date" {...register('dataInicio')} />
              </FormField>
              <FormField label="Prazo" className="app-form__col-2">
                <Input type="number" {...register('prazoInicialValor', { valueAsNumber: true })} />
              </FormField>
              <Controller
                name="prazoInicialUnidade"
                control={control}
                render={({ field }) => (
                  <FormField label="Unidade" className="app-form__col-2">
                    <Select options={PRAZO_UNIDADE_OPTIONS} value={field.value} onChange={field.onChange} />
                  </FormField>
                )}
              />
              <FormField label="Fim" hint="Sugerido" className="app-form__col-3">
                <Input type="date" {...register('dataFimOrig')} />
              </FormField>
              <FormField label="Limite prorrog." hint="Meses" className="app-form__col-2">
                <Input type="number" {...register('limiteProrrogacaoMeses', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Índice" className="app-form__col-4">
                <Input {...register('indiceReajuste')} />
              </FormField>
              <FormField label="Mês aniv." hint="Reajuste" className="app-form__col-2">
                <Input
                  type="number"
                  min={1}
                  max={12}
                  {...register('mesAniversarioReajuste', { valueAsNumber: true })}
                />
              </FormField>
              <FormField label="Prorrogação" className="app-form__col-4">
                <label className="flex min-h-[2.5rem] items-center gap-2 text-[var(--font-size-sm)]">
                  <input type="checkbox" className="shrink-0" {...register('prorrogavel')} />
                  Permitida
                </label>
              </FormField>
            </fieldset>
          )}

          {currentStep === 'orcamento' && (
            <fieldset className="app-form__grid m-0 min-w-0 border-0 p-0">
              <legend className="app-form__legend">Orçamento</legend>
              <FormField label="Valor global" hint="Reais, valor anual" className="app-form__col-4">
                <Input type="number" step="0.01" {...register('valorAnual', { valueAsNumber: true })} />
              </FormField>
              <p className="app-form__col-12 m-0 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                Dotações e empenhos detalhados ficam na ficha, após o rascunho.
              </p>
            </fieldset>
          )}

          {currentStep === 'rateio' && (
            <fieldset className="app-form__grid m-0 min-w-0 border-0 p-0">
              <legend className="app-form__legend">Rateio</legend>
              <div className="app-form__col-12">
                <Meter
                  label="Soma dos percentuais"
                  value={rateioPct}
                  max={100}
                  thresholds={{ amber: 80, red: 100 }}
                />
              </div>
              {id ? (
                <p className="app-form__col-12 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                  Rateio já gravado é editável na ficha do contrato. Inclua linhas novas só na criação.
                </p>
              ) : (
                <div className="app-form__col-12 min-w-0">
                  <FieldArrayTable
                    columns={[
                      { id: 'unidade', header: 'Unidade', width: '78%' },
                      { id: 'pct', header: '%', width: '14%', align: 'right' },
                    ]}
                    items={rateiosArray.fields}
                    onAdd={() => rateiosArray.append({ unidadeId: '', percentual: 0, valorCents: null })}
                    onRemove={(index) => rateiosArray.remove(index)}
                    addLabel="Linha"
                    emptyLabel="Sem rateio — opcional no rascunho."
                    renderCells={(_item, index) => [
                      <Controller
                        key="unidade"
                        name={`rateios.${index}.unidadeId`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            aria-label="Unidade de rateio"
                            options={(unidades ?? []).map((u) => ({
                              id: u.id,
                              label: `${u.orgao?.sigla ? `${u.orgao.sigla} / ` : ''}${u.sigla}`,
                            }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Selecione"
                          />
                        )}
                      />,
                      <Input
                        key="pct"
                        type="number"
                        step="0.01"
                        aria-label="Percentual"
                        className="text-right tabular-nums"
                        {...register(`rateios.${index}.percentual` as const, { valueAsNumber: true })}
                      />,
                    ]}
                  />
                </div>
              )}
              {rateioPct > 100 && (
                <p className="app-form__col-12 field-error">A soma dos percentuais não pode ultrapassar 100%.</p>
              )}
            </fieldset>
          )}

          {currentStep === 'publicidade' && (
            <fieldset className="app-form__grid m-0 min-w-0 border-0 p-0">
              <legend className="app-form__legend">Publicidade</legend>
              <FormField label="Observações" className="app-form__col-12">
                <Textarea rows={2} className="app-form__textarea" {...register('observacoes')} />
              </FormField>
              <p className="app-form__col-12 m-0 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                PNCP/DOE e anexos ficam na ficha depois do rascunho.
              </p>
            </fieldset>
          )}

          {currentStep === 'revisao' && (
            <div className="space-y-4">
              <DescriptionList
                columns={2}
                items={[
                  { term: 'GMS', detail: `${valoresWatch.numGms ?? '—'}/${valoresWatch.anoGms ?? '—'}` },
                  { term: 'Modalidade', detail: valoresWatch.modalidade || '—' },
                  { term: 'Pilar', detail: valoresWatch.pilar || '—' },
                  { term: 'Natureza', detail: valoresWatch.naturezaObjeto || '—' },
                  {
                    term: 'Valor global',
                    detail:
                      valoresWatch.valorAnual != null
                        ? formatCurrencyFromReais(valoresWatch.valorAnual)
                        : '—',
                  },
                  {
                    term: 'Vigência',
                    detail: `${valoresWatch.dataInicio || '—'} → ${valoresWatch.dataFimOrig || '—'}`,
                  },
                  { term: 'Objeto', detail: valoresWatch.objeto || '—' },
                  {
                    term: 'Itens',
                    detail: String((valoresWatch.itens ?? []).filter((i) => i.catalogoItemId).length),
                  },
                  { term: 'Rateio %', detail: `${rateioPct.toFixed(1)}%` },
                ]}
              />
              {Object.keys(stepErrors).length > 0 && (
                <p className="field-error" role="alert">
                  Há etapas com pendência: {Object.keys(stepErrors).join(', ')}.
                </p>
              )}
            </div>
          )}

          <FormActions className="mt-6" align="between">
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" type="button" onClick={() => navigate('/contracts')}>
                Cancelar
              </Button>
              <Button variant="ghost" type="button" onClick={goPrev} disabled={currentStep === 'identificacao'}>
                Voltar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentStep !== 'revisao' && (
                <Button type="button" variant="secondary" onClick={goNext}>
                  Avançar
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={() => void saveDraft()}
                disabled={saving || rateioPct > 100}
              >
                {saving ? 'Salvando…' : 'Rascunho'}
              </Button>
              {currentStep === 'revisao' && (
                <Button type="button" onClick={() => void publish()} disabled={saving || rateioPct > 100}>
                  {saving ? 'Publicando…' : 'Publicar'}
                </Button>
              )}
            </div>
          </FormActions>
        </div>
      </form>
    </Page>
  );
}
