import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Card, Input } from '@painel/ui';
import { useCreateEntidadeGestora, useEntidadeGestora, useUpdateEntidadeGestora } from '../hooks/useReferences';

export default function EntidadesGestorasForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useEntidadeGestora(id);
  const create = useCreateEntidadeGestora();
  const update = useUpdateEntidadeGestora();

  const form = useForm({ defaultValues: { nome: '', cpf: '' } });
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  const formatCPF = (val: string) => {
    const digits = (val || '').replace(/\D/g, '').slice(0,11);
    if (!digits) return '';
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})?/, (_m, a, b, c, d) => {
      return d ? `${a}.${b}.${c}-${d}` : `${a}.${b}.${c}`;
    });
  };

  const handleCpfBlur = () => {
    const raw = form.getValues('cpf') || '';
    const formatted = formatCPF(raw);
    setValue('cpf', formatted);
  };

  useEffect(() => {
    if (existing) {
      setValue('nome', existing.nome);
      setValue('cpf', existing.cpf);
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
      navigate('/entidades-gestoras');
    } catch (err) {
      alert('Erro ao salvar');
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{id ? 'Editar Entidade' : 'Nova Entidade'}</h2>
            <Input label="Nome" {...register('nome', { required: true })} />
            {errors.nome && <p className="text-sm text-red-600">Obrigatório</p>}
            <Input label="CPF" {...register('cpf', { required: true })} onBlur={handleCpfBlur} />
            {errors.cpf && <p className="text-sm text-red-600">Obrigatório</p>}
            <div className="flex gap-2">
              <Button type="submit">Salvar</Button>
              <Button variant="ghost" type="button" onClick={() => navigate('/entidades-gestoras')}>Cancelar</Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
