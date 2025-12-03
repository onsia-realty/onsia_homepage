import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function rawCheck() {
  const properties = await prisma.property.findMany({
    where: {
      title: {
        notIn: ['용인 경남아너스빌', '신광교 클라우드시티', '이천 부발역 에피트']
      }
    },
    select: {
      title: true,
      totalUnits: true,
      basePrice: true,
      pricePerPyeong: true,
      moveInDate: true,
      constructor: true,
      keyFeature: true
    },
    orderBy: { title: 'asc' },
    take: 5
  });

  console.log('=== Raw 데이터 확인 (처음 5개) ===\n');

  for (const p of properties) {
    console.log(`${p.title}:`);
    console.log(`  totalUnits: ${p.totalUnits} (type: ${typeof p.totalUnits})`);
    console.log(`  basePrice: ${p.basePrice} (type: ${typeof p.basePrice})`);
    console.log(`  pricePerPyeong: ${p.pricePerPyeong} (type: ${typeof p.pricePerPyeong})`);
    console.log(`  moveInDate: ${p.moveInDate} (type: ${typeof p.moveInDate})`);
    console.log(`  constructor: ${p.constructor}`);
    console.log(`  keyFeature: ${p.keyFeature}`);
    console.log('');
  }
}

rawCheck().catch(console.error).finally(() => prisma.$disconnect());
