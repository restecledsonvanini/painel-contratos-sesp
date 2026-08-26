import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input, Page, useToast } from '@painel/ui';
import type { ServidorCreateInput, ServidorUpdateInput } from '@painel/schema';
import { useCreateServidor, useServidor, useUpdateServidor } from '../../../hooks/useReferences';
import { getErrorMessage } from '../../../lib/http';
import { maskCpf, onlyDigits } from '../../../lib/masks';

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
    cargo: data.cargo || null,
    email: data.email || null,
    telefone: data.telefone || null,
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
            <div className="app-form__span-2">
              <Input label="Nome" {...register('nome', { required: true })} />
              {errors.nome && <p className="field-error">Obrigatório</p>}
            </div>
            <div>
              <Input
                label="CPF"
                {...register('cpf')}
                onBlur={() => setValue('cpf', maskCpf(getValues('cpf') || ''))}
              />
            </div>
            <div>
              <Input label="Cargo" {...register('cargo')} />
            </div>
            <div>
              <Input label="E-mail" type="email" {...register('email')} />
            </div>
            <div>
              <Input label="Telefone" {...register('telefone')} />
            </div>
          </div>
          <div className="app-form__actions">
            <Button type="submit">Salvar</Button>
            <Button variant="ghost" type="button" onClick={() => navigate('/servidores')}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Page>
  );
}
