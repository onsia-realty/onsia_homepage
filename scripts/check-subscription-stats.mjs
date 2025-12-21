#!/usr/bin/env node
/**
 * 청약 데이터 통계 확인
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n📊 청약 데이터 현황\n');
  console.log('='.repeat(60));

  // 전체 청약 개수
  const totalCount = await prisma.subscription.count();
  console.log(`전체 청약: ${totalCount}개`);

  // 이미지가 있는 청약 개수
  const withImages = await prisma.subscription.findMany({
    include: {
      images: true,
    },
  });

  const withImagesCount = withImages.filter(s => s.images.length > 0).length;
  console.log(`이미지 있는 청약: ${withImagesCount}개`);
  console.log(`이미지 없는 청약: ${totalCount - withImagesCount}개`);

  console.log('\n' + '='.repeat(60));
  console.log('이미지가 있는 청약 목록:\n');

  withImages
    .filter(s => s.images.length > 0)
    .forEach((s, i) => {
      console.log(`${i + 1}. ${s.houseName}`);
      console.log(`   ID: ${s.houseManageNo}`);
      console.log(`   이미지: ${s.images.length}개`);
      console.log(`   홈페이지: ${s.homepage || 'N/A'}`);
      console.log('');
    });

  console.log('='.repeat(60));
  console.log('\n청약 상태별 분포:\n');

  const byStatus = await prisma.subscription.groupBy({
    by: ['status'],
    _count: true,
  });

  byStatus.forEach(stat => {
    console.log(`  ${stat.status}: ${stat._count}개`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n최근 청약 10개:\n');

  const recent = await prisma.subscription.findMany({
    take: 10,
    orderBy: {
      recruitDate: 'desc',
    },
    select: {
      houseName: true,
      houseManageNo: true,
      status: true,
      recruitDate: true,
      homepage: true,
      images: {
        select: {
          id: true,
        },
      },
    },
  });

  recent.forEach((s, i) => {
    console.log(`${i + 1}. ${s.houseName} (${s.houseManageNo})`);
    console.log(`   상태: ${s.status} | 이미지: ${s.images.length}개`);
    console.log(`   모집공고일: ${s.recruitDate?.toLocaleDateString() || 'N/A'}`);
    console.log(`   홈페이지: ${s.homepage || 'N/A'}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
