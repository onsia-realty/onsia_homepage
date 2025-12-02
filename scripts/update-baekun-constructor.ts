import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.property.updateMany({
    where: { title: { contains: '백운호수' } },
    data: { constructor: '대우건설' }
  });
  console.log('✅ Updated:', result.count, 'properties with constructor: 대우건설');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
