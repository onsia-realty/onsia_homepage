import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database...');

  const propertyCount = await prisma.property.count();
  console.log('Total properties:', propertyCount);

  const properties = await prisma.property.findMany({
    select: {
      id: true,
      title: true,
      featured: true,
      status: true
    }
  });

  console.log('\nAll properties:');
  properties.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title} (featured: ${p.featured}, status: ${p.status})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
