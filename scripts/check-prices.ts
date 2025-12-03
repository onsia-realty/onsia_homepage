import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const props = await prisma.property.findMany({
    select: {
      title: true,
      basePrice: true,
      moveInDate: true
    }
  });

  console.log('Properties basePrice check:');
  props.forEach(p => {
    console.log(`${p.title}:`);
    console.log(`  basePrice = ${p.basePrice} (type: ${typeof p.basePrice})`);
    console.log(`  moveInDate = ${p.moveInDate}`);
    console.log('');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
