/** Centavos (BigInt do Prisma) → número. */
export function centsToNumber(value: bigint | number | null | undefined): number | undefined {
  if (value == null) return undefined;
  return Number(value);
}

/** Centavos → reais. */
export function centsToReais(value: bigint | number | null | undefined): number | undefined {
  const cents = centsToNumber(value);
  return cents == null ? undefined : cents / 100;
}
