import { randomBytes, scryptSync } from 'node:crypto';
import { createPrismaClient } from '../packages/db/src/client.ts';

process.env.DATABASE_URL ||= 'postgresql://painel:pass@localhost:5434/painel_db';
const prisma = createPrismaClient(process.env.DATABASE_URL);

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

async function main() {
  const users = [
    {
      email: 'visitante@sesp.pr.gov.br',
      nome: 'Visitante',
      password: 'visitante123',
      role: 'VISITANTE',
    },
    {
      email: 'analista@sesp.pr.gov.br',
      nome: 'Analista',
      password: 'analista123',
      role: 'ANALISTA',
    },
    { email: 'admin@sesp.pr.gov.br', nome: 'Admin', password: 'admin123', role: 'ADMIN' },
  ] as const;

  // Papéis fora de ADMIN só enxergam o próprio órgão; sem vínculo a API nega
  // o acesso, então os usuários demo precisam nascer com órgão.
  const sesp = await prisma.orgao.findFirst({ where: { sigla: 'SESP' } });
  if (!sesp) throw new Error('Órgão SESP não encontrado: rode as migrations/seed antes.');

  for (const u of users) {
    const orgaoId = u.role === 'ADMIN' ? null : sesp.id;
    const existing = await prisma.usuario.findUnique({ where: { email: u.email } });
    if (existing) {
      await prisma.usuario.update({
        where: { email: u.email },
        data: {
          passwordHash: hashPassword(u.password),
          role: u.role,
          ativo: true,
          nome: u.nome,
          orgaoId,
        },
      });
      console.log('updated', u.email);
    } else {
      await prisma.usuario.create({
        data: {
          email: u.email,
          nome: u.nome,
          role: u.role,
          orgaoId,
          passwordHash: hashPassword(u.password),
          ativo: true,
        },
      });
      console.log('created', u.email);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
