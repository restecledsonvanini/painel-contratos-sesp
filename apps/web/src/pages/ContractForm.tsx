import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContractCreateSchema } from '@painel/schema';
import { Button, Input, Page, Textarea, useToast } from '@painel/ui';
import { useCreateContract, useUpdateContract, useContract } from '../hooks/useContracts';
import {
  useFornecedores,
  useServidores,
  useUnidadesOrganizacionais,
} from '../hooks/useReferences';
import { LookupSelect } from '../components/LookupSelect';
import { getErrorMessage } from '../lib/http';

export default function ContractForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const { data: existingContract, isLoading: isContractLoading, error: contractError } = useContract(id);
  const { data: unidades, isLoading: unidadesLoading } = useUnidadesOrganizacionais();
  const { data: fornecedores, isLoading: fornecedoresLoading } = useFornecedores();
  const { data: servidores, isLoading: servidoresLoading } = useServidores();

  const form = useForm({
    resolver: zodResolver(ContractCreateSchema as any),
    defaultValues: {
      numGms: undefined,
      anoGms: undefined,
      valorAnual: undefined,
      unidadeGestoraId: '',
      protocoloCabeca: '',
      modalidade: '',
      pilar: 'SERVICOS',
      naturezaObjeto: 'SERVICO_CONTINUADO',
      objeto: '',
      gestorId: '',
      fiscalId: '',
      fornecedorId: '',
      dataInicio: '',
      dataFimOrig: '',
      status: 'vigente',
      observacoes: '',
    },
  });

  const { register, handleSubmit, setValue, control, formState: { errors } } = form;

  useEffect(() => {
    if (existingContract && id) {
      setValue('protocoloCabeca', existingContract.eProtocolo || existingContract.protocoloCabeca || '');
      setValue('numGms', existingContract.numGms);
      setValue('anoGms', existingContract.anoGms);
      setValue('valorAnual', existingContract.valorAnual ?? undefined);
      setValue(
        'unidadeGestoraId',
        existingContract.unidadeGestoraId || existingContract.unidadeFspId || '',
      );
      setValue('modalidade', existingContract.modalidade || '');
      setValue('pilar', existingContract.pilar || 'SERVICOS');
      setValue('naturezaObjeto', existingContract.naturezaObjeto || 'SERVICO_CONTINUADO');
      setValue('objeto', existingContract.objeto || '');
      setValue('gestorId', existingContract.gestorId || '');
      setValue('fiscalId', existingContract.fiscalId || '');
      setValue('fornecedorId', existingContract.fornecedorId || existingContract.empresaId || '');
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
      setValue('status', existingContract.status || 'vigente');
      setValue('observacoes', existingContract.observacoes || '');
    }
  }, [existingContract, id, setValue]);

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

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        await updateContract.mutateAsync({ id, payload: data });
        toast.success('Contrato atualizado.');
      } else {
        await createContract.mutateAsync(data);
        toast.success('Contrato criado.');
      }
      navigate('/contracts');
    } catch (err) {
      toast.error('Erro ao salvar contrato.', getErrorMessage(err));
    }
  };

  const saving =
    Boolean((createContract as any).isPending ?? (createContract as any).isLoading) ||
    Boolean((updateContract as any).isPending ?? (updateContract as any).isLoading);

  return (
    <Page
      title={id ? 'Editar contrato' : 'Novo contrato'}
      description="Identificação, partes, vigência e valor — responsáveis viram designações no servidor."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="app-form Form-Grade">
        <div className="app-form__panel">
          <div className="app-form__grid is-dense">
            <div className="app-form__span-3">
              <Input label="e-Protocolo" {...register('protocoloCabeca')} />
            </div>

            <Input label="Número GMS" type="number" {...register('numGms', { valueAsNumber: true })} />
            <Input label="Ano GMS" type="number" {...register('anoGms', { valueAsNumber: true })} />
            <Input
              label="Valor global (R$)"
              type="number"
              step="0.01"
              {...register('valorAnual', { valueAsNumber: true })}
            />

            <div>
              <span className="field-label">Unidade gestora</span>
              <select className="select-field" {...register('unidadeGestoraId')} disabled={unidadesLoading}>
                <option value="">Selecione a unidade</option>
                {unidades?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.orgao?.sigla ? `${item.orgao.sigla} / ` : ''}
                    {item.sigla} — {item.nome}
                  </option>
                ))}
              </select>
              {errors.unidadeGestoraId && (
                <p className="field-error">{String(errors.unidadeGestoraId.message)}</p>
              )}
            </div>

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
              <span className="field-label">Pilar</span>
              <select className="select-field" {...register('pilar')}>
                <option value="CUSTEIO">Custeio</option>
                <option value="INVESTIMENTO">Investimento</option>
                <option value="SERVICOS">Serviços</option>
              </select>
            </div>

            <div>
              <span className="field-label">Natureza do objeto</span>
              <select className="select-field" {...register('naturezaObjeto')}>
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

            <div>
              <span className="field-label">Situação</span>
              <select className="select-field" {...register('status')}>
                <option value="vigente">Vigente</option>
                <option value="encerrado">Encerrado</option>
                <option value="suspenso">Suspenso</option>
              </select>
            </div>

            <div>
              <span className="field-label">Gestor</span>
              <select className="select-field" {...register('gestorId')} disabled={servidoresLoading}>
                <option value="">Selecione o gestor</option>
                {servidores?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                    {item.cargo ? ` — ${item.cargo}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="field-label">Fiscal</span>
              <select className="select-field" {...register('fiscalId')} disabled={servidoresLoading}>
                <option value="">Selecione o fiscal</option>
                {servidores?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                    {item.cargo ? ` — ${item.cargo}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="field-label">Fornecedor</span>
              <select
                className="select-field"
                {...register('fornecedorId')}
                disabled={fornecedoresLoading}
              >
                <option value="">Selecione o fornecedor</option>
                {fornecedores?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.razaoSocial || item.nome} — {item.documento || item.cnpj}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Início da vigência" type="date" {...register('dataInicio')} />
            <Input label="Fim original da vigência" type="date" {...register('dataFimOrig')} />

            <div className="app-form__span-3">
              <Textarea label="Objeto" rows={4} {...register('objeto')} />
              {errors.objeto && <p className="field-error">{String(errors.objeto.message)}</p>}
            </div>
            <div className="app-form__span-3">
              <Textarea label="Observações" rows={3} {...register('observacoes')} />
            </div>
          </div>

          <div className="app-form__actions">
            <Button variant="ghost" type="button" onClick={() => navigate('/contracts')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {id ? (saving ? 'Atualizando...' : 'Atualizar contrato') : saving ? 'Salvando...' : 'Salvar contrato'}
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
