import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugData() {
  const property = await prisma.property.findFirst({
    where: { title: { contains: '검단' } },
    select: {
      title: true,
      totalUnits: true,
      basePrice: true,
      pricePerPyeong: true,
      moveInDate: true,
      constructor: true,
      keyFeature: true,
      description: true
    }
  });

  console.log('=== 검단 동부센트레빌 Raw Data ===');
  console.log(JSON.stringify(property, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  , 2));

  // 수동으로 값 확인
  if (property) {
    console.log('\n=== 값 타입 확인 ===');
    console.log('basePrice:', property.basePrice, '| toString:', property.basePrice?.toString());
    console.log('pricePerPyeong:', property.pricePerPyeong, '| toString:', property.pricePerPyeong?.toString());
    console.log('moveInDate:', property.moveInDate);
  }
}

debugData().catch(console.error).finally(() => prisma.$disconnect());
