import React from 'react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

type ButtonProps = React.ComponentProps<typeof Button>;

type IconButtonProps = Omit<ButtonProps, 'size' | 'children'> & {
  label: string;
  children: React.ReactNode;
  to?: string;
};

export function IconButton({
  label,
  children,
  variant = 'ghost',
  to,
  ...props
}: IconButtonProps) {
  return (
    <Tooltip content={label}>
      <Button size="icon" variant={variant} aria-label={label} to={to} {...props}>
        {children}
      </Button>
    </Tooltip>
  );
}
