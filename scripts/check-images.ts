import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany({
    include: { images: true },
    orderBy: { title: 'asc' }
  });

  console.log('=== 매물별 이미지 현황 ===\n');

  properties.forEach(p => {
    const imageCount = p.images.length;
    const status = imageCount > 0 ? '✅' : '❌';
    console.log(`${status} ${p.title}: ${imageCount}개 이미지`);
  });

  const withImages = properties.filter(p => p.images.length > 0).length;
  const withoutImages = properties.filter(p => p.images.length === 0).length;

  console.log(`\n총: ${properties.length}개 매물`);
  console.log(`이미지 있음: ${withImages}개`);
  console.log(`이미지 없음: ${withoutImages}개`);

  if (withoutImages > 0) {
    console.log('\n--- 이미지 필요한 매물 목록 ---');
    properties.filter(p => p.images.length === 0).forEach(p => {
      console.log(`- ${p.title}`);
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
