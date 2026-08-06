import { http } from './http';

/** Baixa um blob da API e dispara download no navegador. */
export async function downloadApiFile(path: string, filename: string) {
  const res = await http.get(path, { responseType: 'blob', timeout: 60_000 });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
