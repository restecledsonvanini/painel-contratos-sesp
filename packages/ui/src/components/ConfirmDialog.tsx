import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  requireText?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  requireText,
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('');
  const canConfirm = !requireText || typed === requireText;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    await onConfirm();
    setTyped('');
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setTyped('');
    onOpenChange(next);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={() => handleOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
          >
            {loading ? 'Aguarde…' : confirmLabel}
          </Button>
        </>
      }
    >
      {requireText && (
        <div className="mt-[var(--space-sm)]">
          <p className="mb-2 text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Digite <strong className="text-[var(--text)]">{requireText}</strong> para confirmar.
          </p>
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={requireText}
            autoComplete="off"
          />
        </div>
      )}
    </Modal>
  );
}
