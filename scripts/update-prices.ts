import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('💰 매물 분양가 업데이트 시작...');

  // 1. 용인 경남아너스빌: 4억8천
  const anorsville = await prisma.property.updateMany({
    where: { title: { contains: '경남아너스빌' } },
    data: {
      basePrice: BigInt(480000000), // 4억8천
      priceDisplay: '4억8천',
    },
  });
  console.log(`✅ 용인 경남아너스빌: 4억8천 (${anorsville.count}건 업데이트)`);

  // 2. 신광교 클라우드: 4억~7억
  const singwangyo = await prisma.property.updateMany({
    where: { title: { contains: '신광교' } },
    data: {
      basePrice: BigInt(400000000), // 최저가 4억
      priceDisplay: '4억~7억',
    },
  });
  console.log(`✅ 신광교 클라우드: 4억~7억 (${singwangyo.count}건 업데이트)`);

  // 3. 왕십리 어반홈스: 5억3000만
  const wangsimni = await prisma.property.updateMany({
    where: { title: { contains: '왕십리' } },
    data: {
      basePrice: BigInt(530000000), // 5억3천
      priceDisplay: '5억3000만',
    },
  });
  console.log(`✅ 왕십리 어반홈스: 5억3000만 (${wangsimni.count}건 업데이트)`);

  // 4. 이천 부발역 에피트: 5억대
  const icheon = await prisma.property.updateMany({
    where: { title: { contains: '부발' } },
    data: {
      basePrice: BigInt(500000000), // 5억
      priceDisplay: '5억대',
    },
  });
  console.log(`✅ 이천 부발역 에피트: 5억대 (${icheon.count}건 업데이트)`);

  // 결과 확인
  const properties = await prisma.property.findMany({
    where: { featured: true },
    select: { title: true, basePrice: true, priceDisplay: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log('\n📋 업데이트된 매물 목록:');
  properties.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}: ${p.priceDisplay || p.basePrice?.toString()}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
