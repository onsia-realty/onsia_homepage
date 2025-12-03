import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const p = await prisma.property.findFirst({
    where: { title: { contains: '신광교' } },
    select: { id: true, slug: true, investmentGrade: true }
  });
  console.log('ID:', p?.id);
  console.log('Slug:', p?.slug);
  console.log('Grade:', p?.investmentGrade);
}

main().finally(() => prisma.$disconnect());
