import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, FormActions, FormField, Input, Page, useToast } from '@painel/ui';
import type { ServidorCreateInput, ServidorUpdateInput } from '@painel/schema';
import { useCreateServidor, useServidor, useUpdateServidor } from '../../../hooks/useReferences';
import { getErrorMessage } from '../../../lib/http';
import { maskCpf, onlyDigits } from '@painel/ui';

/** UI (máscara CPF / strings vazias) ≠ payload API. */
type FormValues = {
  nome: string;
  cpf: string;
  cargo: string;
  email: string;
  telefone: string;
};

function toCreateBody(data: FormValues): ServidorCreateInput {
  return {
    nome: data.nome,
    cpf: data.cpf ? onlyDigits(data.cpf) : null,
    rgFuncional: null,
    cargo: data.cargo || null,
    orgaoId: null,
    unidadeId: null,
    email: data.email || null,
    telefone: data.telefone || null,
    ativo: true,
  };
}

export default function ServidoresForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useServidor(id);
  const create = useCreateServidor();
  const update = useUpdateServidor();
  const toast = useToast();
  const form = useForm<FormValues>({
    defaultValues: { nome: '', cpf: '', cargo: '', email: '', telefone: '' },
  });
  const { register, handleSubmit, setValue, formState: { errors }, getValues } = form;

  useEffect(() => {
    if (existing) {
      setValue('nome', existing.nome);
      setValue('cpf', existing.cpf || '');
      setValue('cargo', existing.cargo || '');
      setValue('email', existing.email || '');
      setValue('telefone', existing.telefone || '');
    }
  }, [existing, setValue]);

  const onSubmit = async (data: FormValues) => {
    const payload = toCreateBody(data);
    try {
      if (id) {
        const updatePayload: ServidorUpdateInput = payload;
        await update.mutateAsync({ id, payload: updatePayload });
        toast.success('Servidor atualizado.');
      } else {
        await create.mutateAsync(payload);
        toast.success('Servidor criado.');
      }
      navigate('/servidores');
    } catch (err) {
      toast.error('Erro ao salvar', getErrorMessage(err));
    }
  };

  return (
    <Page title={id ? 'Editar servidor' : 'Novo servidor'}>
      <form onSubmit={handleSubmit(onSubmit)} className="app-form">
        <div className="app-form__panel">
          <div className="app-form__grid">
            <FormField label="Nome" error={errors.nome ? 'Obrigatório' : undefined} className="app-form__col-8">
              <Input {...register('nome', { required: true })} />
            </FormField>
            <FormField label="CPF" className="app-form__col-4">
              <Input
                {...register('cpf')}
                onBlur={() => setValue('cpf', maskCpf(getValues('cpf') || ''))}
              />
            </FormField>
            <FormField label="Cargo" className="app-form__col-4">
              <Input {...register('cargo')} />
            </FormField>
            <FormField label="E-mail" className="app-form__col-4">
              <Input type="email" {...register('email')} />
            </FormField>
            <FormField label="Telefone" className="app-form__col-4">
              <Input {...register('telefone')} />
            </FormField>
          </div>
          <FormActions>
            <Button variant="ghost" type="button" onClick={() => navigate('/servidores')}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </FormActions>
        </div>
      </form>
    </Page>
  );
}
