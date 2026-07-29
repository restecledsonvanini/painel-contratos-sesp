import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContractCreateSchema } from '../../../../packages/schema/src/contracts.ts';
import { Button, Card, Input, Textarea } from '@painel/ui';
import { useCreateContract, useUpdateContract, useContract } from '../hooks/useContracts';

export default function ContractForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const { data: existingContract, isLoading: isContractLoading, error: contractError } = useContract(id);

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

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
    return <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">Carregando contrato...</div>;
  }

  if (id && contractError) {
    return <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">Erro ao carregar contrato.</div>;
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
    } catch (err) {
      alert('Erro ao salvar contrato.');
    }
  };

  const handleCancel = () => navigate('/contracts');

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{id ? 'Editar contrato' : 'Novo contrato'}</p>
            <h2 className="text-3xl font-semibold text-[var(--text)]">{id ? 'Atualizar contratos' : 'Cadastro de contrato'}</h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Preencha os dados principais para iniciar o cadastro. A partir daqui, será possível acompanhar prazos e aditivos.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input label="Protocolo de cabeça" {...register('protocoloCabeca')} />
            </div>

            <div className="space-y-2">
              <Input label="Número GMS" type="number" {...register('numGms', { valueAsNumber: true })} />
              {errors.numGms && <p className="text-sm text-red-600">{errors.numGms.message}</p>}
            </div>
            <div className="space-y-2">
              <Input label="Ano GMS" type="number" {...register('anoGms', { valueAsNumber: true })} />
              {errors.anoGms && <p className="text-sm text-red-600">{errors.anoGms.message}</p>}
            </div>

            <div className="space-y-2">
              <Input label="Valor anual (R$)" type="number" step="0.01" {...register('valorAnual', { valueAsNumber: true })} />
              {errors.valorAnual && <p className="text-sm text-red-600">{errors.valorAnual.message}</p>}
            </div>
            <div className="space-y-2">
              <Input label="Unidade FSP" {...register('unidadeFspId')} />
              {errors.unidadeFspId && <p className="text-sm text-red-600">{errors.unidadeFspId.message}</p>}
            </div>

            <div className="space-y-2">
              <Input label="Modalidade" {...register('modalidade')} />
              {errors.modalidade && <p className="text-sm text-red-600">{errors.modalidade.message}</p>}
            </div>
            <div className="space-y-2">
              <Input label="Gestor ID" {...register('gestorId')} />
              {errors.gestorId && <p className="text-sm text-red-600">{errors.gestorId.message}</p>}
            </div>

            <div className="space-y-2">
              <Input label="Fiscal ID" {...register('fiscalId')} />
              {errors.fiscalId && <p className="text-sm text-red-600">{errors.fiscalId.message}</p>}
            </div>
            <div className="space-y-2">
              <Input label="Empresa ID" {...register('empresaId')} />
              {errors.empresaId && <p className="text-sm text-red-600">{errors.empresaId.message}</p>}
            </div>

            <div className="space-y-2">
              <Input label="Data início" type="date" {...register('dataInicio')} />
            </div>
            <div className="space-y-2">
              <Input label="Data fim original" type="date" {...register('dataFimOrig')} />
            </div>

            <div className="md:col-span-2 grid gap-6 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Input label="Status" {...register('status')} />
                {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
              </div>
              <div className="space-y-2">
                <Input label="Empresa ID" {...register('empresaId')} />
                {errors.empresaId && <p className="text-sm text-red-600">{errors.empresaId.message}</p>}
              </div>
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Objetivo / objeto"
                {...register('objeto')}
                rows={4}
                placeholder="Descreva brevemente o objeto do contrato"
              />
              {errors.objeto && <p className="text-sm text-red-600">{errors.objeto.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Observações"
                {...register('observacoes')}
                rows={4}
                placeholder="Observações internas ou informações de compliance"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" type="button" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createContract.isLoading || updateContract.isLoading || isContractLoading}>
              {id ? (updateContract.isLoading ? 'Atualizando...' : 'Atualizar contrato') : createContract.isLoading ? 'Salvando...' : 'Salvar contrato'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
