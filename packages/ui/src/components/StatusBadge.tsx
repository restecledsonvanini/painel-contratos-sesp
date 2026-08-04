import React from 'react';
import { Badge, badgeVariantFromStatus } from './Badge';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string | null;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const variant = badgeVariantFromStatus(status);

  return (
    <Badge variant={variant} className={className} {...props}>
      {status || 'Sem status'}
    </Badge>
  );
}
