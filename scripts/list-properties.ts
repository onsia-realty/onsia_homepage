import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany({
    select: { id: true, title: true, status: true }
  });
  console.log('ID | Status | Title');
  console.log('---'.repeat(20));
  properties.forEach(p => console.log(`${p.id} | ${p.status} | ${p.title}`));
}

main().finally(() => prisma.$disconnect());
