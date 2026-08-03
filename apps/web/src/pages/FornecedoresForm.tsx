import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Card, Input } from '@painel/ui';
import { useCreateFornecedor, useFornecedor, useUpdateFornecedor } from '../hooks/useReferences';

export default function FornecedoresForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: existing } = useFornecedor(id);
  const create = useCreateFornecedor();
  const update = useUpdateFornecedor();

  const form = useForm({ defaultValues: { nome: '', cnpj: '' } });
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
      setValue('nome', existing.nome);
      setValue('cnpj', existing.cnpj || '');
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
      navigate('/fornecedores');
    } catch {
      alert('Erro ao salvar');
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{id ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
            <Input label="Nome" {...register('nome', { required: true })} />
            {errors.nome && <p className="text-sm text-red-600">Obrigatório</p>}
            <Input label="CNPJ" {...register('cnpj')} onBlur={handleCnpjBlur} />
            <div className="flex gap-2">
              <Button type="submit">Salvar</Button>
              <Button variant="ghost" type="button" onClick={() => navigate('/fornecedores')}>Cancelar</Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
