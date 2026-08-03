import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Card, Input, Textarea } from '@painel/ui';
import { useCreateServico, useServico, useUpdateServico } from '../hooks/useReferences';

export default function ServicosForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useServico(id);
  const create = useCreateServico();
  const update = useUpdateServico();

  const form = useForm({ defaultValues: { titulo: '', descricao: '' } });
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  useEffect(() => {
    if (existing) {
      setValue('titulo', existing.titulo);
      setValue('descricao', existing.descricao || '');
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
      navigate('/servicos');
    } catch {
      alert('Erro ao salvar');
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{id ? 'Editar Serviço' : 'Novo Serviço'}</h2>
            <Input label="Título" {...register('titulo', { required: true })} />
            {errors.titulo && <p className="text-sm text-red-600">Obrigatório</p>}
            <Textarea label="Descrição" {...register('descricao')} rows={4} />
            <div className="flex gap-2">
              <Button type="submit">Salvar</Button>
              <Button variant="ghost" type="button" onClick={() => navigate('/servicos')}>Cancelar</Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
