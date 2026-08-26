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
  FieldArrayList,
  Input,
  Meter,
  Page,
  Stepper,
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
        <div className="app-form__panel">Carregando contrato...</div>
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
      <form onSubmit={onSubmit} className="app-form Form-Grade space-y-4">
        <div className="app-form__panel">
          <Stepper
            steps={stepperSteps}
            onStepClick={(stepId) => setStep(stepId as ContractWizardStepId)}
          />
        </div>

        <div className="app-form__panel" aria-live="polite">
          {currentStep === 'identificacao' && (
            <div className="app-form__grid is-dense">
              <div className="app-form__span-3">
                <Input label="e-Protocolo" {...register('protocoloCabeca')} />
              </div>
              <Input label="Nº do contrato" {...register('numeroContrato')} />
              <Input label="Número GMS" type="number" {...register('numGms', { valueAsNumber: true })} />
              <Input label="Ano GMS" type="number" {...register('anoGms', { valueAsNumber: true })} />
              <div>
                <Controller
                  name="modalidade"
                  control={control}
                  render={({ field }) => (
                    <LookupSelect
                      slug="modalidade-licitacao"
                      label="Modalidade"
                      valueMode="codigo"
                      value={field.value || ''}
                      onChange={field.onChange}
                      error={errors.modalidade ? String(errors.modalidade.message) : undefined}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="fundamentoLegalId"
                  control={control}
                  render={({ field }) => (
                    <LookupSelect
                      slug="fundamento-legal"
                      label="Fundamento legal"
                      valueMode="id"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div>
                <span className="field-label" id="label-pilar">
                  Pilar
                </span>
                <select className="select-field" aria-labelledby="label-pilar" {...register('pilar')}>
                  <option value="CUSTEIO">Custeio</option>
                  <option value="INVESTIMENTO">Investimento</option>
                  <option value="SERVICOS">Serviços</option>
                </select>
              </div>
              <div>
                <span className="field-label" id="label-natureza">
                  Natureza do objeto
                </span>
                <select
                  className="select-field"
                  aria-labelledby="label-natureza"
                  {...register('naturezaObjeto')}
                >
                  <option value="SERVICO_CONTINUADO">Serviço continuado</option>
                  <option value="SERVICO_NAO_CONTINUADO">Serviço não continuado</option>
                  <option value="COMPRA">Compra</option>
                  <option value="LOCACAO_BEM_MOVEL">Locação de bem móvel</option>
                  <option value="LOCACAO_IMOVEL">Locação de imóvel</option>
                  <option value="SOLUCAO_TIC">Solução de TIC</option>
                  <option value="OBRA">Obra</option>
                  <option value="SERVICO_ENGENHARIA">Serviço de engenharia</option>
                </select>
              </div>
              <div className="app-form__span-3">
                <Textarea label="Objeto" rows={4} {...register('objeto')} />
                {errors.objeto && <p className="field-error">{String(errors.objeto.message)}</p>}
              </div>
            </div>
          )}

          {currentStep === 'partes' && (
            <div className="app-form__grid is-dense">
              <div className="app-form__span-3">
                <span className="field-label" id="label-unidade-gestora">
                  Unidade gestora (força / SESP)
                </span>
                <select
                  className="select-field"
                  aria-labelledby="label-unidade-gestora"
                  {...register('unidadeGestoraId')}
                  disabled={orgaosLoading}
                  onChange={(e) => {
                    setValue('unidadeGestoraId', e.target.value, { shouldDirty: true });
                    setValue('subunidadeId', '');
                  }}
                >
                  <option value="">Selecione a força</option>
                  {orgaos?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.sigla} — {item.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="app-form__span-3">
                <span className="field-label" id="label-subunidade">
                  Subunidade (opcional)
                </span>
                <select
                  className="select-field"
                  aria-labelledby="label-subunidade"
                  {...register('subunidadeId')}
                  disabled={unidadesLoading || !unidadeGestoraId}
                >
                  <option value="">Sem subunidade</option>
                  {unidades
                    ?.filter((u) => (u.orgaoId || u.orgao?.id) === unidadeGestoraId)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.sigla} — {item.nome}
                      </option>
                    ))}
                </select>
              </div>
              <div className="app-form__span-3">
                <span className="field-label" id="label-fornecedor">
                  Fornecedor
                </span>
                <select
                  className="select-field"
                  aria-labelledby="label-fornecedor"
                  {...register('fornecedorId')}
                  disabled={fornecedoresLoading}
                >
                  <option value="">Selecione o fornecedor</option>
                  {fornecedores?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.razaoSocial} — {item.documento}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="field-label" id="label-gestor">
                  Gestor
                </span>
                <select
                  className="select-field"
                  aria-labelledby="label-gestor"
                  {...register('gestorId')}
                  disabled={servidoresLoading}
                >
                  <option value="">Selecione o gestor</option>
                  {servidores
                    ?.filter((item) => /gestor/i.test(item.cargo || item.nome || ''))
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                        {item.cargo ? ` — ${item.cargo}` : ''}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <span className="field-label" id="label-fiscal">
                  Fiscal
                </span>
                <select
                  className="select-field"
                  aria-labelledby="label-fiscal"
                  {...register('fiscalId')}
                  disabled={servidoresLoading}
                >
                  <option value="">Selecione o fiscal</option>
                  {servidores
                    ?.filter((item) => /fiscal/i.test(item.cargo || item.nome || ''))
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                        {item.cargo ? ` — ${item.cargo}` : ''}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 'itens' && (
            <div className="app-form__span-3">
              {id ? (
                <div className="space-y-2">
                  {existingContract?.itens?.length ? (
                    existingContract.itens.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-[var(--font-size-sm)]"
                      >
                        <strong>{item.catalogoNome || item.catalogoItemId}</strong>
                        {' · '}
                        {item.quantidade} {item.unidadeMedida || 'un'}
                        {' · '}
                        {formatCurrencyFromReais(item.valorUnitario ?? 0)}
                      </div>
                    ))
                  ) : (
                    <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                      Nenhum item cadastrado neste contrato.
                    </p>
                  )}
                </div>
              ) : (
                <FieldArrayList
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
                  addLabel="Adicionar item"
                  emptyLabel="Nenhum item — opcional no rascunho."
                  renderItem={(_item, index) => (
                    <div className="app-form__grid is-dense">
                      <div className="app-form__span-3">
                        <span className="field-label">Item do catálogo</span>
                        <select
                          className="select-field"
                          {...register(`itens.${index}.catalogoItemId` as const)}
                        >
                          <option value="">Selecione…</option>
                          {catalogo?.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.categoriaItem?.codigo ? `${c.categoriaItem.codigo} · ` : ''}
                              {c.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Quantidade"
                        type="number"
                        step="0.0001"
                        {...register(`itens.${index}.quantidade` as const, { valueAsNumber: true })}
                      />
                      <Input
                        label="Valor unitário (R$)"
                        type="number"
                        step="0.01"
                        {...register(`itens.${index}.valorUnitario` as const, { valueAsNumber: true })}
                      />
                      <div>
                        <span className="field-label">Periodicidade</span>
                        <select
                          className="select-field"
                          {...register(`itens.${index}.periodicidade` as const)}
                        >
                          <option value="UNICA">Única</option>
                          <option value="DIARIA">Diária</option>
                          <option value="MENSAL">Mensal</option>
                          <option value="ANUAL">Anual</option>
                        </select>
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
          )}

          {currentStep === 'vigencia' && (
            <div className="app-form__grid is-dense">
              <Input label="Início da vigência" type="date" {...register('dataInicio')} />
              <Input
                label="Prazo inicial"
                type="number"
                {...register('prazoInicialValor', { valueAsNumber: true })}
              />
              <div>
                <span className="field-label" id="label-prazo-unidade">
                  Unidade do prazo
                </span>
                <select
                  className="select-field"
                  aria-labelledby="label-prazo-unidade"
                  {...register('prazoInicialUnidade')}
                >
                  <option value="DIAS">Dias</option>
                  <option value="MESES">Meses</option>
                  <option value="ANOS">Anos</option>
                </select>
              </div>
              <Input label="Fim original (sugerido)" type="date" {...register('dataFimOrig')} />
              <Input
                label="Limite de prorrogação (meses)"
                type="number"
                {...register('limiteProrrogacaoMeses', { valueAsNumber: true })}
              />
              <Input label="Índice de reajuste" {...register('indiceReajuste')} />
              <Input
                label="Mês aniversário reajuste"
                type="number"
                min={1}
                max={12}
                {...register('mesAniversarioReajuste', { valueAsNumber: true })}
              />
              <label className="flex items-center gap-2 text-[var(--font-size-sm)]">
                <input type="checkbox" {...register('prorrogavel')} />
                Contrato prorrogável
              </label>
            </div>
          )}

          {currentStep === 'orcamento' && (
            <div className="app-form__grid is-dense">
              <Input
                label="Valor global (R$)"
                type="number"
                step="0.01"
                {...register('valorAnual', { valueAsNumber: true })}
              />
              <div className="app-form__span-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                Dotações, reservas e empenhos detalhados ficam na ficha do contrato (aba Financeiro)
                após salvar o rascunho. Aqui basta o valor global.
              </div>
            </div>
          )}

          {currentStep === 'rateio' && (
            <div className="space-y-4">
              <Meter
                label="Soma dos percentuais"
                value={rateioPct}
                max={100}
                thresholds={{ amber: 80, red: 100 }}
              />
              {id ? (
                <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                  Rateio já gravado é editável na ficha do contrato. Inclua linhas novas só na criação.
                </p>
              ) : (
                <FieldArrayList
                  items={rateiosArray.fields}
                  onAdd={() => rateiosArray.append({ unidadeId: '', percentual: 0, valorCents: null })}
                  onRemove={(index) => rateiosArray.remove(index)}
                  addLabel="Adicionar unidade"
                  emptyLabel="Sem rateio — opcional no rascunho."
                  renderItem={(_item, index) => (
                    <div className="app-form__grid is-dense">
                      <div className="app-form__span-3">
                        <span className="field-label">Unidade</span>
                        <select
                          className="select-field"
                          {...register(`rateios.${index}.unidadeId` as const)}
                        >
                          <option value="">Selecione…</option>
                          {unidades?.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.orgao?.sigla ? `${u.orgao.sigla} / ` : ''}
                              {u.sigla}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Percentual %"
                        type="number"
                        step="0.01"
                        {...register(`rateios.${index}.percentual` as const, { valueAsNumber: true })}
                      />
                    </div>
                  )}
                />
              )}
              {rateioPct > 100 && (
                <p className="field-error">A soma dos percentuais não pode ultrapassar 100%.</p>
              )}
            </div>
          )}

          {currentStep === 'publicidade' && (
            <div className="app-form__grid is-dense">
              <div className="app-form__span-3">
                <Textarea label="Observações" rows={4} {...register('observacoes')} />
              </div>
              <div className="app-form__span-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                Publicações (PNCP/DOE) e anexos são registrados na ficha do contrato após salvar o
                rascunho. Sem publicação no PNCP o contrato permanece em elaboração até a revisão.
              </div>
            </div>
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

          <div className="app-form__actions mt-6 flex flex-wrap gap-2">
            <Button variant="ghost" type="button" onClick={() => navigate('/contracts')}>
              Cancelar
            </Button>
            <Button variant="ghost" type="button" onClick={goPrev} disabled={currentStep === 'identificacao'}>
              Anterior
            </Button>
            {currentStep !== 'revisao' && (
              <Button type="button" variant="secondary" onClick={goNext}>
                Próxima
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={() => void saveDraft()} disabled={saving || rateioPct > 100}>
              {saving ? 'Salvando…' : 'Salvar rascunho'}
            </Button>
            {currentStep === 'revisao' && (
              <Button type="button" onClick={() => void publish()} disabled={saving || rateioPct > 100}>
                {saving ? 'Publicando…' : 'Publicar contrato'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Page>
  );
}
