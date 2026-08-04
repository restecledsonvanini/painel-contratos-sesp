import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContractCreateSchema } from '../../../../packages/schema/src/contracts.ts';
import { Button, Input, Page, Textarea } from '@painel/ui';
import { useCreateContract, useUpdateContract, useContract } from '../hooks/useContracts';
import { useEmpresas, useEntidadesGestoras, useUnidadesFsp } from '../hooks/useReferences';

export default function ContractForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const { data: existingContract, isLoading: isContractLoading, error: contractError } = useContract(id);
  const { data: unidadesFsp, isLoading: unidadesLoading } = useUnidadesFsp();
  const { data: empresas, isLoading: empresasLoading } = useEmpresas();
  const { data: entidadesGestoras, isLoading: entidadesLoading } = useEntidadesGestoras();

  const form = useForm({
    resolver: zodResolver(ContractCreateSchema as any),
    defaultValues: {
      numGms: undefined,
      anoGms: undefined,
      valorAnual: undefined,
      unidadeFspId: '',
      protocoloCabeca: '',
      modalidade: '',
      objeto: '',
      gestorId: '',
      fiscalId: '',
      empresaId: '',
      dataInicio: '',
      dataFimOrig: '',
      status: 'vigente',
      observacoes: '',
    },
  });

  const { register, handleSubmit, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (existingContract && id) {
      setValue('protocoloCabeca', existingContract.protocoloCabeca || '');
      setValue('numGms', existingContract.numGms);
      setValue('anoGms', existingContract.anoGms);
      setValue('valorAnual', existingContract.valorAnual ?? undefined);
      setValue('unidadeFspId', existingContract.unidadeFspId);
      setValue('modalidade', existingContract.modalidade || '');
      setValue('objeto', existingContract.objeto || '');
      setValue('gestorId', existingContract.gestorId || '');
      setValue('fiscalId', existingContract.fiscalId || '');
      setValue('empresaId', existingContract.empresaId || '');
      setValue('dataInicio', existingContract.dataInicio || '');
      setValue('dataFimOrig', existingContract.dataFimOrig || '');
      setValue('status', existingContract.status || 'vigente');
      setValue('observacoes', '');
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
        alert('Contrato atualizado.');
      } else {
        await createContract.mutateAsync(data);
        alert('Contrato criado.');
      }
      navigate('/contracts');
    } catch {
      alert('Erro ao salvar contrato.');
    }
  };

  const saving =
    Boolean((createContract as any).isPending ?? (createContract as any).isLoading) ||
    Boolean((updateContract as any).isPending ?? (updateContract as any).isLoading);

  return (
    <Page
      title={id ? 'Editar contrato' : 'Novo contrato'}
      description="Preencha os dados principais em grade responsiva."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="app-form Form-Grade">
        <div className="app-form__panel">
          <div className="app-form__grid is-dense">
            <div className="app-form__span-3">
              <Input label="Protocolo de cabeça" {...register('protocoloCabeca')} />
            </div>

            <Input label="Número GMS" type="number" {...register('numGms', { valueAsNumber: true })} />
            <Input label="Ano GMS" type="number" {...register('anoGms', { valueAsNumber: true })} />
            <Input label="Valor anual (R$)" type="number" step="0.01" {...register('valorAnual', { valueAsNumber: true })} />

            <div>
              <span className="field-label">Unidade FSP</span>
              <select className="select-field" {...register('unidadeFspId')} disabled={unidadesLoading}>
                <option value="">Selecione a unidade FSP</option>
                {unidadesFsp?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sigla} — {item.nome}
                  </option>
                ))}
              </select>
              {errors.unidadeFspId && <p className="field-error">{String(errors.unidadeFspId.message)}</p>}
            </div>

            <Input label="Modalidade" {...register('modalidade')} />

            <div>
              <span className="field-label">Status</span>
              <select className="select-field" {...register('status')}>
                <option value="vigente">Vigente</option>
                <option value="encerrado">Encerrado</option>
                <option value="suspenso">Suspenso</option>
              </select>
            </div>

            <div>
              <span className="field-label">Gestor</span>
              <select className="select-field" {...register('gestorId')} disabled={entidadesLoading}>
                <option value="">Selecione o gestor</option>
                {entidadesGestoras?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome} — {item.cpf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="field-label">Fiscal</span>
              <select className="select-field" {...register('fiscalId')} disabled={entidadesLoading}>
                <option value="">Selecione o fiscal</option>
                {entidadesGestoras?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome} — {item.cpf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="field-label">Empresa</span>
              <select className="select-field" {...register('empresaId')} disabled={empresasLoading}>
                <option value="">Selecione a empresa</option>
                {empresas?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.razaoSocial} — {item.cnpj}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Data início" type="date" {...register('dataInicio')} />
            <Input label="Data fim original" type="date" {...register('dataFimOrig')} />

            <div className="app-form__span-3">
              <Textarea label="Objetivo / objeto" rows={4} {...register('objeto')} />
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
