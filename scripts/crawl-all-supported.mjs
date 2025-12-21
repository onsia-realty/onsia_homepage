#!/usr/bin/env node
/**
 * 지원 가능한 모든 청약 이미지 자동 크롤링
 *
 * 사용법:
 *   node scripts/crawl-all-supported.mjs
 */
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

// 지원 가능한 건설사 패턴
const SUPPORTED_PATTERNS = ['prugio.com', 'xi.co.kr'];

/**
 * 홈페이지에서 건설사 감지
 */
function isSupported(homepage) {
  if (!homepage) return false;
  return SUPPORTED_PATTERNS.some(pattern => homepage.includes(pattern));
}

/**
 * 청약 이미지 크롤링 (홈페이지 → 다운로드 → DB 저장)
 */
async function crawlSubscription(subscription) {
  const { houseManageNo, houseName, homepage } = subscription;

  console.log(`\n${'='.repeat(70)}`);
  console.log(`📦 ${houseName} (${houseManageNo})`);
  console.log(`🌐 ${homepage}`);
  console.log('='.repeat(70));

  try {
    // 1. 이미지 다운로드
    console.log('\n1️⃣ 홈페이지 크롤링 시작...');
    const crawlCommand = `node scripts/crawl-homepage.mjs ${houseManageNo}`;

    try {
      const { stdout, stderr } = await execAsync(crawlCommand, {
        cwd: process.cwd(),
        timeout: 180000, // 3분 타임아웃
      });

      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (error) {
      // 크롤링 실패해도 계속 진행 (이미 이미지가 있을 수 있음)
      console.log('   ⚠️  크롤링 스킵 (이미 있거나 실패)');
    }

    // 2. DB 저장
    console.log('\n2️⃣ 이미지 DB 저장...');
    const saveCommand = `node scripts/save-homepage-images.mjs ${houseManageNo}`;

    try {
      const { stdout, stderr } = await execAsync(saveCommand, {
        cwd: process.cwd(),
        timeout: 30000, // 30초 타임아웃
      });

      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);

      console.log('   ✅ 완료!');
    } catch (error) {
      console.error('   ❌ DB 저장 실패:', error.message);
    }

  } catch (error) {
    console.error(`\n❌ ${houseName} 크롤링 실패:`, error.message);
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║         🏠 지원 가능한 청약 이미지 자동 크롤링                       ║
╚════════════════════════════════════════════════════════════════════╝
`);

  // 지원 가능한 청약 조회
  const allSubscriptions = await prisma.subscription.findMany({
    orderBy: {
      recruitDate: 'desc',
    },
    include: {
      images: true,
    },
  });

  const supportedSubscriptions = allSubscriptions.filter(s => isSupported(s.homepage));

  console.log(`📊 크롤링 대상: ${supportedSubscriptions.length}개\n`);

  // 이미지가 이미 있는 것 제외
  const needCrawling = supportedSubscriptions.filter(s => s.images.length === 0);
  const alreadyHaveImages = supportedSubscriptions.filter(s => s.images.length > 0);

  console.log(`✅ 이미지 이미 있음: ${alreadyHaveImages.length}개`);
  if (alreadyHaveImages.length > 0) {
    alreadyHaveImages.forEach(s => {
      console.log(`   - ${s.houseName} (이미지 ${s.images.length}개)`);
    });
  }

  console.log(`\n🔄 크롤링 필요: ${needCrawling.length}개`);
  if (needCrawling.length > 0) {
    needCrawling.forEach(s => {
      console.log(`   - ${s.houseName}`);
    });
  }

  if (needCrawling.length === 0) {
    console.log('\n✨ 모든 청약에 이미지가 있습니다!');
    return;
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('🚀 크롤링 시작\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < needCrawling.length; i++) {
    const subscription = needCrawling[i];

    console.log(`\n진행: ${i + 1}/${needCrawling.length}`);

    try {
      await crawlSubscription(subscription);
      successCount++;

      // 다음 청약 크롤링 전 딜레이 (서버 부하 방지)
      if (i < needCrawling.length - 1) {
        console.log('\n⏳ 5초 대기 중...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`\n❌ ${subscription.houseName} 처리 실패:`, error.message);
      failCount++;
    }
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log('📈 크롤링 결과');
  console.log('═'.repeat(70));
  console.log(`  ✅ 성공: ${successCount}개`);
  console.log(`  ❌ 실패: ${failCount}개`);
  console.log(`  📊 전체: ${needCrawling.length}개`);
  console.log(`\n✨ 완료!`);
}

main()
  .catch(error => {
    console.error('❌ 크롤러 실행 오류:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
