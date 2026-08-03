import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Card, Input } from '@painel/ui';
import { useCreateUnidadeFsp, useUnidadeFspById, useUpdateUnidadeFsp } from '../hooks/useReferences';

export default function UnidadesFspForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useUnidadeFspById(id);
  const create = useCreateUnidadeFsp();
  const update = useUpdateUnidadeFsp();

  const form = useForm({ defaultValues: { sigla: '', nome: '' } });
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (existing) {
      setValue('sigla', existing.sigla);
      setValue('nome', existing.nome);
    }
  }, [existing, setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        await update.mutateAsync({ id, payload: data });
        alert('Atualizado');
      } else {
        await create.mutateAsync(data);
        alert('Criado');
      }
      navigate('/unidades-fsp');
    } catch (err) {
      alert('Erro ao salvar');
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{id ? 'Editar Unidade FSP' : 'Nova Unidade FSP'}</h2>
            <Input label="Sigla" {...register('sigla', { required: true })} />
            {errors.sigla && <p className="text-sm text-red-600">Obrigatório</p>}
            <Input label="Nome" {...register('nome', { required: true })} />
            {errors.nome && <p className="text-sm text-red-600">Obrigatório</p>}
            <div className="flex gap-2">
              <Button type="submit">Salvar</Button>
              <Button variant="ghost" type="button" onClick={() => navigate('/unidades-fsp')}>Cancelar</Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
