import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContractCreateSchema } from '../../../../packages/schema/src/contracts.ts';
import { Button, Card, Input, Textarea } from '@painel/ui';
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
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="space-y-8 border border-[var(--border)] bg-[var(--surface)]/95 p-6 shadow-sm">
          <div className="space-y-3 border-b border-[var(--border)] pb-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{id ? 'Editar contrato' : 'Novo contrato'}</p>
            <h2 className="text-3xl font-semibold text-[var(--text)]">{id ? 'Atualizar contrato' : 'Cadastro de contrato'}</h2>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Preencha os dados principais em uma estrutura organizada, com campos agrupados por categoria e validação imediata.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2 md:col-span-2 xl:col-span-3">
              <Input label="Protocolo de cabeça" {...register('protocoloCabeca')} />
              {errors.protocoloCabeca && <p className="text-sm text-red-600">{errors.protocoloCabeca.message}</p>}
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
              <label className="block text-sm font-medium text-slate-700">Unidade FSP</label>
              <select
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[#4c5b8b] focus:ring-2 focus:ring-[#4c5b8b]/20"
                {...register('unidadeFspId')}
                disabled={unidadesLoading}
              >
                <option value="">Selecione a unidade FSP</option>
                {unidadesFsp?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sigla} — {item.nome}
                  </option>
                ))}
              </select>
              {errors.unidadeFspId && <p className="text-sm text-red-600">{errors.unidadeFspId.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Modalidade</label>
              <Input label="" {...register('modalidade')} />
              {errors.modalidade && <p className="text-sm text-red-600">{errors.modalidade.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[#4c5b8b] focus:ring-2 focus:ring-[#4c5b8b]/20"
                {...register('status')}
              >
                <option value="vigente">Vigente</option>
                <option value="encerrado">Encerrado</option>
                <option value="suspenso">Suspenso</option>
              </select>
              {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Gestor</label>
              <select
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[#4c5b8b] focus:ring-2 focus:ring-[#4c5b8b]/20"
                {...register('gestorId')}
                disabled={entidadesLoading}
              >
                <option value="">Selecione o gestor</option>
                {entidadesGestoras?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome} — {item.cpf}
                  </option>
                ))}
              </select>
              {errors.gestorId && <p className="text-sm text-red-600">{errors.gestorId.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Fiscal</label>
              <select
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[#4c5b8b] focus:ring-2 focus:ring-[#4c5b8b]/20"
                {...register('fiscalId')}
                disabled={entidadesLoading}
              >
                <option value="">Selecione o fiscal</option>
                {entidadesGestoras?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome} — {item.cpf}
                  </option>
                ))}
              </select>
              {errors.fiscalId && <p className="text-sm text-red-600">{errors.fiscalId.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Empresa</label>
              <select
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[#4c5b8b] focus:ring-2 focus:ring-[#4c5b8b]/20"
                {...register('empresaId')}
                disabled={empresasLoading}
              >
                <option value="">Selecione a empresa</option>
                {empresas?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.razaoSocial} — {item.cnpj}
                  </option>
                ))}
              </select>
              {errors.empresaId && <p className="text-sm text-red-600">{errors.empresaId.message}</p>}
            </div>

            <div className="space-y-2">
              <Input label="Data início" type="date" {...register('dataInicio')} />
              {errors.dataInicio && <p className="text-sm text-red-600">{errors.dataInicio.message}</p>}
            </div>
            <div className="space-y-2">
              <Input label="Data fim original" type="date" {...register('dataFimOrig')} />
              {errors.dataFimOrig && <p className="text-sm text-red-600">{errors.dataFimOrig.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2 xl:col-span-3">
              <Textarea
                label="Objetivo / objeto"
                {...register('objeto')}
                rows={4}
                placeholder="Descreva brevemente o objeto do contrato"
              />
              {errors.objeto && <p className="text-sm text-red-600">{errors.objeto.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2 xl:col-span-3">
              <Textarea
                label="Observações"
                {...register('observacoes')}
                rows={4}
                placeholder="Observações internas ou informações de compliance"
              />
              {errors.observacoes && <p className="text-sm text-red-600">{errors.observacoes.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
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
