import React from 'react';
import { Select } from '@painel/ui';
import { useDominio } from '../providers/LookupsProvider';

type Props = {
  slug: string;
  value?: string;
  onChange?: (value: string) => void;
  /** `codigo` persiste o código estável (ex. PREGAO_ELETRONICO); `id` persiste o uuid */
  valueMode?: 'codigo' | 'id';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  parentId?: string | null;
  className?: string;
};

export function LookupSelect({
  slug,
  value,
  onChange,
  valueMode = 'codigo',
  label,
  placeholder,
  disabled,
  error,
  parentId,
  className,
}: Props) {
  const { options, isLoading, meta } = useDominio(slug);

  const filtered = parentId
    ? options.filter((o) => o.parentId === parentId)
    : options;

  const selectOptions = filtered
    .map((o) => ({
      id: valueMode === 'codigo' ? (o.codigo ?? o.id) : o.id,
      label: o.label,
    }))
    .filter((o) => Boolean(o.id));

  return (
    <Select
      label={label ?? meta?.nome}
      options={selectOptions}
      value={value?.trim() ? value : ''}
      onChange={onChange}
      placeholder={isLoading ? 'Carregando…' : placeholder ?? 'Selecione…'}
      disabled={disabled || isLoading}
      error={error}
      className={className}
    />
  );
}
