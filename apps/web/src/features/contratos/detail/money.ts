import { formatCents } from '../../../lib/format';

export function num(v: unknown) {
  return Number(v ?? 0);
}

export function money(cents: unknown) {
  return formatCents(num(cents));
}
