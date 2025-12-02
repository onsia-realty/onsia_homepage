import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  console.log('=== 매물별 이미지 현황 ===\n');
  properties.forEach(p => {
    console.log(`[${p.featured ? '추천' : '일반'}] ${p.title}`);
    if (p.images.length > 0) {
      p.images.forEach(img => console.log(`  -> ${img.url}`));
    } else {
      console.log('  -> (이미지 없음 - placeholder 사용됨)');
    }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
