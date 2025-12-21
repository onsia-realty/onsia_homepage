#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.subscriptionImage.groupBy({
    by: ['category'],
    _count: true,
  });

  console.log('📊 DB 이미지 카테고리별 개수:\n');

  let total = 0;
  categories.forEach(cat => {
    console.log(`  ${cat.category}: ${cat._count}개`);
    total += cat._count;
  });

  console.log(`\n✅ 총 ${total}개 이미지`);

  // 샘플 1개 확인
  console.log('\n🔍 샘플 이미지 URL 확인:');
  const sample = await prisma.subscriptionImage.findFirst({
    select: {
      url: true,
      category: true,
      subscription: {
        select: {
          houseName: true,
        }
      }
    }
  });
  console.log(`  ${sample.category}: ${sample.url}`);
  console.log(`  현장명: ${sample.subscription.houseName}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
