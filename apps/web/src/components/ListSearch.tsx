import React from 'react';
import { Button, Input } from '@painel/ui';

export function ListSearch({
  q,
  onSearch,
  placeholder = 'Buscar…',
}: {
  q: string;
  onSearch: (q: string) => void;
  placeholder?: string;
}) {
  return (
    <form
      className="mb-3 flex max-w-xl items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSearch(String(fd.get('q') || '').trim());
      }}
    >
      <div className="min-w-0 flex-1">
        <Input name="q" defaultValue={q} placeholder={placeholder} aria-label="Buscar na lista" />
      </div>
      <Button type="submit" variant="secondary">
        Buscar
      </Button>
    </form>
  );
}
