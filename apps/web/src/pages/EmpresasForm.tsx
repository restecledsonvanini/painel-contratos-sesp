import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Card, Input } from '@painel/ui';
import { useCreateEmpresa, useEmpresa, useUpdateEmpresa } from '../hooks/useReferences';

export default function EmpresasForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useEmpresa(id);
  const create = useCreateEmpresa();
  const update = useUpdateEmpresa();

  const form = useForm({ defaultValues: { razaoSocial: '', cnpj: '' } });
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  const formatCNPJ = (val: string) => {
    const digits = (val || '').replace(/\D/g, '').slice(0,14);
    if (!digits) return '';
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})?/, (_m, p1, p2, p3, p4, p5) => {
      return p5 ? `${p1}.${p2}.${p3}/${p4}-${p5}` : `${p1}.${p2}.${p3}/${p4}`;
    });
  };

  const handleCnpjBlur = () => {
    const raw = form.getValues('cnpj') || '';
    const formatted = formatCNPJ(raw);
    setValue('cnpj', formatted);
  };

  useEffect(() => {
    if (existing) {
      setValue('razaoSocial', existing.razaoSocial);
      setValue('cnpj', existing.cnpj);
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
      navigate('/empresas');
    } catch (err) {
      alert('Erro ao salvar');
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{id ? 'Editar Empresa' : 'Nova Empresa'}</h2>
            <Input label="Razão social" {...register('razaoSocial', { required: true })} />
            {errors.razaoSocial && <p className="text-sm text-red-600">Obrigatório</p>}
            <Input label="CNPJ" {...register('cnpj', { required: true })} onBlur={handleCnpjBlur} />
            {errors.cnpj && <p className="text-sm text-red-600">Obrigatório</p>}
            <div className="flex gap-2">
              <Button type="submit">Salvar</Button>
              <Button variant="ghost" type="button" onClick={() => navigate('/empresas')}>Cancelar</Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
