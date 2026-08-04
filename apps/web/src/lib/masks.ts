export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskCnpj(value: string): string {
  const d = onlyDigits(value).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
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
