#!/usr/bin/env node
/**
 * 홈페이지 있는 청약 필터링 및 건설사별 분류
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 지원 가능한 건설사 패턴
const SUPPORTED_BUILDERS = {
  prugio: {
    name: '푸르지오',
    patterns: ['prugio.com'],
    supported: true,
  },
  xi: {
    name: '자이',
    patterns: ['xi.co.kr'],
    supported: true,
  },
  hillstate: {
    name: '힐스테이트',
    patterns: ['hillstate.co.kr'],
    supported: false, // TODO: 크롤러 개발 필요
  },
  raemian: {
    name: '래미안',
    patterns: ['raemian.co.kr', 'raemian.com'],
    supported: false, // TODO: 크롤러 개발 필요
  },
  ipark: {
    name: '아이파크',
    patterns: ['i-park.com'],
    supported: false, // TODO: 크롤러 개발 필요
  },
  elife: {
    name: 'e편한세상',
    patterns: ['efineasy.com'],
    supported: false, // TODO: 크롤러 개발 필요
  },
};

/**
 * 홈페이지에서 건설사 감지
 */
function detectBuilder(homepage) {
  if (!homepage) return null;

  for (const [key, builder] of Object.entries(SUPPORTED_BUILDERS)) {
    if (builder.patterns.some(pattern => homepage.includes(pattern))) {
      return { key, ...builder };
    }
  }

  return { key: 'other', name: '기타', supported: false };
}

async function main() {
  console.log('\n📊 홈페이지 있는 청약 필터링\n');
  console.log('='.repeat(60));

  // 전체 청약 조회
  const allSubscriptions = await prisma.subscription.findMany({
    orderBy: {
      recruitDate: 'desc',
    },
  });

  console.log(`전체 청약: ${allSubscriptions.length}개\n`);

  // 홈페이지 있는 것만 필터링
  const withHomepage = allSubscriptions.filter(s => s.homepage);
  const withoutHomepage = allSubscriptions.filter(s => !s.homepage);

  console.log(`홈페이지 있음: ${withHomepage.length}개`);
  console.log(`홈페이지 없음: ${withoutHomepage.length}개\n`);

  // 건설사별 분류
  const byBuilder = {};

  withHomepage.forEach(sub => {
    const builder = detectBuilder(sub.homepage);
    const key = builder.key;

    if (!byBuilder[key]) {
      byBuilder[key] = {
        name: builder.name,
        supported: builder.supported,
        subscriptions: [],
      };
    }

    byBuilder[key].subscriptions.push(sub);
  });

  console.log('='.repeat(60));
  console.log('건설사별 분류\n');

  // 지원 가능한 건설사
  console.log('✅ 크롤링 지원 가능:');
  Object.entries(byBuilder)
    .filter(([_, data]) => data.supported)
    .forEach(([key, data]) => {
      console.log(`\n  ${data.name}: ${data.subscriptions.length}개`);
      data.subscriptions.forEach(sub => {
        console.log(`    - ${sub.houseName} (${sub.houseManageNo})`);
        console.log(`      ${sub.homepage}`);
      });
    });

  // 지원 예정 건설사
  console.log('\n\n⏳ 크롤링 지원 예정 (개발 필요):');
  Object.entries(byBuilder)
    .filter(([_, data]) => !data.supported && _.key !== 'other')
    .forEach(([key, data]) => {
      console.log(`\n  ${data.name}: ${data.subscriptions.length}개`);
      data.subscriptions.slice(0, 3).forEach(sub => {
        console.log(`    - ${sub.houseName} (${sub.houseManageNo})`);
        console.log(`      ${sub.homepage}`);
      });
      if (data.subscriptions.length > 3) {
        console.log(`    ... 외 ${data.subscriptions.length - 3}개`);
      }
    });

  // 기타
  if (byBuilder.other) {
    console.log('\n\n🔍 기타 (건설사 분류 필요):');
    console.log(`\n  총 ${byBuilder.other.subscriptions.length}개`);
    byBuilder.other.subscriptions.slice(0, 5).forEach(sub => {
      console.log(`    - ${sub.houseName} (${sub.houseManageNo})`);
      console.log(`      ${sub.homepage}`);
    });
    if (byBuilder.other.subscriptions.length > 5) {
      console.log(`    ... 외 ${byBuilder.other.subscriptions.length - 5}개`);
    }
  }

  // 통계 요약
  console.log('\n\n' + '='.repeat(60));
  console.log('📈 크롤링 가능 통계\n');

  const supportedCount = Object.values(byBuilder)
    .filter(data => data.supported)
    .reduce((sum, data) => sum + data.subscriptions.length, 0);

  const pendingCount = Object.values(byBuilder)
    .filter(data => !data.supported)
    .reduce((sum, data) => sum + data.subscriptions.length, 0);

  console.log(`✅ 지금 크롤링 가능: ${supportedCount}개`);
  console.log(`⏳ 개발 필요: ${pendingCount}개`);
  console.log(`❌ 홈페이지 없음: ${withoutHomepage.length}개`);

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 다음 단계:\n');
  console.log(`1. 지원 가능한 ${supportedCount}개 청약 이미지 크롤링:`);
  console.log(`   node scripts/crawl-all-supported.mjs\n`);

  if (pendingCount > 0) {
    console.log(`2. 추가 건설사 크롤러 개발 (${pendingCount}개 대상):`);
    Object.entries(byBuilder)
      .filter(([_, data]) => !data.supported && data.subscriptions.length > 0)
      .forEach(([key, data]) => {
        console.log(`   - ${data.name}: ${data.subscriptions.length}개`);
      });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
