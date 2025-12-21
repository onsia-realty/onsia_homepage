#!/usr/bin/env node
/**
 * 청약홈 모집공고 URL 패턴 분석
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n📊 청약홈 모집공고 URL 패턴 분석\n');
  console.log('='.repeat(70));

  const subscriptions = await prisma.subscription.findMany({
    take: 20,
    orderBy: { recruitDate: 'desc' },
    select: {
      houseName: true,
      houseManageNo: true,
      noticeUrl: true,
      homepage: true,
    },
  });

  console.log('\n샘플 20개:\n');

  subscriptions.forEach((sub, i) => {
    console.log(`${i + 1}. ${sub.houseName}`);
    console.log(`   ID: ${sub.houseManageNo}`);
    console.log(`   📄 모집공고: ${sub.noticeUrl || 'N/A'}`);
    console.log(`   🌐 홈페이지: ${sub.homepage || 'N/A'}`);
    console.log('');
  });

  // URL 패턴 분석
  console.log('='.repeat(70));
  console.log('\nURL 도메인 분석:\n');

  const noticeUrls = subscriptions
    .filter(s => s.noticeUrl)
    .map(s => {
      try {
        const url = new URL(s.noticeUrl);
        return url.hostname;
      } catch {
        return 'invalid';
      }
    });

  const uniqueDomains = [...new Set(noticeUrls)];
  console.log('모집공고 도메인:', uniqueDomains);

  const homepageUrls = subscriptions
    .filter(s => s.homepage)
    .map(s => {
      try {
        const url = new URL(s.homepage);
        return url.hostname;
      } catch {
        return 'invalid';
      }
    });

  const uniqueHomepageDomains = [...new Set(homepageUrls)];
  console.log('\n홈페이지 도메인:', uniqueHomepageDomains.slice(0, 10));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
