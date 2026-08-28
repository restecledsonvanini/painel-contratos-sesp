export type MaskType = 'cnpj' | 'cpf' | 'gms' | 'protocolo';

interface MaskConfig {
  pattern: RegExp;
  format: (digits: string) => string;
  maxLength: number;
}

const masks: Record<MaskType, MaskConfig> = {
  cnpj: {
    pattern: /^\d{0,14}$/,
    maxLength: 14,
    format: (d) =>
      d
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 18),
  },
  cpf: {
    pattern: /^\d{0,11}$/,
    maxLength: 11,
    format: (d) =>
      d
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2')
        .slice(0, 14),
  },
  gms: {
    pattern: /^\d{0,20}$/,
    maxLength: 20,
    format: (d) => d.replace(/^(\d{4})(\d)/, '$1/$2').slice(0, 25),
  },
  protocolo: {
    pattern: /^\d{0,30}$/,
    maxLength: 30,
    format: (d) =>
      d
        .replace(/^(\d{4})(\d)/, '$1.$2')
        .replace(/^(\d{4})\.(\d{2})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{2})(\d)/, '.$1.$2')
        .slice(0, 40),
  },
};

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Formatação livre para exibição em listas/formulários (sem MaskedInput). */
export function maskCnpj(value: string): string {
  return applyMask('cnpj', value).display;
}

export function maskCpf(value: string): string {
  return applyMask('cpf', value).display;
}

export function maskGms(value: string): string {
  return value.replace(/[^\d/]/g, '').slice(0, 20);
}

export function maskProtocolo(value: string): string {
  return value.replace(/[^\d.\-/]/g, '').slice(0, 40);
}

export function maskPlaca(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 7)
    .replace(/^([A-Z]{3})(\d)/, '$1-$2');
}

export function applyMask(mask: MaskType, raw: string): { display: string; digits: string } {
  const config = masks[mask];
  const digits = raw.replace(/\D/g, '').slice(0, config.maxLength);
  if (!config.pattern.test(digits)) {
    return { display: config.format(digits), digits };
  }
  return { display: config.format(digits), digits };
}

export function getMaskPlaceholder(mask: MaskType): string {
  switch (mask) {
    case 'cnpj':
      return '00.000.000/0000-00';
    case 'cpf':
      return '000.000.000-00';
    case 'gms':
      return '0000/000000';
    case 'protocolo':
      return '0000.00.000000';
    default:
      return '';
  }
}
