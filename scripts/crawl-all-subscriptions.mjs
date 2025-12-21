#!/usr/bin/env node
/**
 * 전체 청약 일괄 크롤링
 *
 * DB에서 홈페이지 있는 모든 청약을 자동으로 크롤링
 *
 * 사용법:
 *   node scripts/crawl-all-subscriptions.mjs
 *   node scripts/crawl-all-subscriptions.mjs --skip-existing  (이미 이미지 있는 청약 제외)
 *   node scripts/crawl-all-subscriptions.mjs --limit 10       (최대 10개만)
 */

import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

// 로그 파일 경로
const LOG_FILE = './crawl-all-subscriptions.log';

/**
 * 로그 저장
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  console.log(message);
  fs.appendFileSync(LOG_FILE, logMessage);
}

/**
 * 청약 크롤링 실행
 */
async function crawlSubscription(subscription, index, total) {
  const { houseManageNo, houseName, homepage } = subscription;

  log(`\n${'='.repeat(70)}`);
  log(`진행: ${index}/${total}`);
  log(`📦 ${houseName} (${houseManageNo})`);
  log(`🌐 ${homepage}`);
  log('='.repeat(70));

  try {
    // 1. 크롤링 실행
    log('  🔍 크롤링 시작...');
    const crawlCommand = `node scripts/crawl-homepage-universal.mjs ${houseManageNo}`;

    const { stdout, stderr } = await execAsync(crawlCommand, {
      cwd: process.cwd(),
      timeout: 180000, // 3분 타임아웃
    });

    // 성공 여부 판단 (stdout에서 "✅ 성공" 확인)
    const successMatch = stdout.match(/✅ 성공: (\d+)개/);
    const failedMatch = stdout.match(/❌ 실패: (\d+)개/);

    const successCount = successMatch ? parseInt(successMatch[1]) : 0;
    const failedCount = failedMatch ? parseInt(failedMatch[1]) : 0;

    if (successCount > 0) {
      log(`  ✅ 크롤링 성공: ${successCount}개 이미지`);

      // 2. DB 저장
      log('  💾 DB 저장 중...');
      const saveCommand = `node scripts/save-homepage-images.mjs ${houseManageNo}`;

      const { stdout: saveStdout } = await execAsync(saveCommand, {
        cwd: process.cwd(),
        timeout: 30000,
      });

      const saveMatch = saveStdout.match(/✅ 성공: (\d+)개/);
      const savedCount = saveMatch ? parseInt(saveMatch[1]) : 0;

      log(`  ✅ DB 저장 완료: ${savedCount}개`);

      return { status: 'success', imageCount: savedCount };
    } else {
      log(`  ⚠️  이미지 없음`);
      return { status: 'no_images', imageCount: 0 };
    }

  } catch (error) {
    log(`  ❌ 크롤링 실패: ${error.message}`);
    return { status: 'failed', imageCount: 0, error: error.message };
  }
}

/**
 * 메인 실행
 */
async function main() {
  log(`
╔════════════════════════════════════════════════════════════════════╗
║           🏠 전체 청약 일괄 크롤링                                  ║
╚════════════════════════════════════════════════════════════════════╝
`);

  // 옵션 파싱
  const args = process.argv.slice(2);
  const skipExisting = args.includes('--skip-existing');
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1]) : null;

  log(`옵션:`);
  log(`  - 이미 이미지 있는 청약 제외: ${skipExisting ? 'YES' : 'NO'}`);
  log(`  - 최대 크롤링 수: ${limit || '제한없음'}`);

  // 1. DB에서 홈페이지 있는 청약 조회
  log(`\n📋 크롤링 대상 조회 중...`);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      homepage: { not: null },
    },
    include: {
      images: true,
    },
    orderBy: {
      recruitDate: 'desc',
    },
  });

  log(`  ✅ 홈페이지 있는 청약: ${subscriptions.length}개`);

  // 2. 필터링
  let targetSubscriptions = subscriptions;

  if (skipExisting) {
    targetSubscriptions = subscriptions.filter(s => s.images.length === 0);
    log(`  ✅ 이미지 없는 청약: ${targetSubscriptions.length}개`);
  }

  if (limit) {
    targetSubscriptions = targetSubscriptions.slice(0, limit);
    log(`  ✅ 제한 적용: ${targetSubscriptions.length}개`);
  }

  if (targetSubscriptions.length === 0) {
    log('\n✨ 크롤링할 청약이 없습니다!');
    return;
  }

  // 3. 크롤링 시작 (5개씩 병렬)
  const BATCH_SIZE = 5;
  const totalBatches = Math.ceil(targetSubscriptions.length / BATCH_SIZE);

  log(`\n${'='.repeat(70)}`);
  log(`🚀 크롤링 시작: ${targetSubscriptions.length}개 (${BATCH_SIZE}개씩 병렬)`);
  log('='.repeat(70));

  const results = {
    success: [],
    no_images: [],
    failed: [],
  };

  for (let batchStart = 0; batchStart < targetSubscriptions.length; batchStart += BATCH_SIZE) {
    const batch = targetSubscriptions.slice(batchStart, batchStart + BATCH_SIZE);
    const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1;

    log(`\n${'='.repeat(70)}`);
    log(`📦 배치 ${batchNum}/${totalBatches}: ${batch.length}개 병렬 크롤링`);
    log('='.repeat(70));

    // 배치 내 병렬 크롤링
    const batchPromises = batch.map((subscription, idx) => {
      const globalIndex = batchStart + idx + 1;
      return crawlSubscription(subscription, globalIndex, targetSubscriptions.length)
        .then(result => ({ subscription, result }));
    });

    const batchResults = await Promise.all(batchPromises);

    // 결과 분류
    batchResults.forEach(({ subscription, result }) => {
      if (result.status === 'success') {
        results.success.push({
          houseManageNo: subscription.houseManageNo,
          houseName: subscription.houseName,
          imageCount: result.imageCount,
        });
      } else if (result.status === 'no_images') {
        results.no_images.push({
          houseManageNo: subscription.houseManageNo,
          houseName: subscription.houseName,
        });
      } else {
        results.failed.push({
          houseManageNo: subscription.houseManageNo,
          houseName: subscription.houseName,
          error: result.error,
        });
      }
    });

    // 배치 간 대기
    if (batchStart + BATCH_SIZE < targetSubscriptions.length) {
      log('\n⏳ 다음 배치 전 5초 대기 중...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // 4. 최종 결과 출력
  log(`\n\n${'═'.repeat(70)}`);
  log('📊 크롤링 최종 결과');
  log('═'.repeat(70));

  log(`\n✅ 성공 (${results.success.length}개):`);
  results.success.forEach((item, i) => {
    log(`  ${i + 1}. ${item.houseName} - ${item.imageCount}개 이미지`);
  });

  log(`\n⚠️  이미지 없음 (${results.no_images.length}개):`);
  results.no_images.forEach((item, i) => {
    log(`  ${i + 1}. ${item.houseName}`);
  });

  log(`\n❌ 실패 (${results.failed.length}개):`);
  results.failed.forEach((item, i) => {
    log(`  ${i + 1}. ${item.houseName}`);
    log(`     에러: ${item.error}`);
  });

  log(`\n${'═'.repeat(70)}`);
  log('📈 통계 요약');
  log('═'.repeat(70));
  log(`  전체: ${targetSubscriptions.length}개`);
  log(`  ✅ 성공: ${results.success.length}개`);
  log(`  ⚠️  이미지 없음: ${results.no_images.length}개`);
  log(`  ❌ 실패: ${results.failed.length}개`);

  const totalImages = results.success.reduce((sum, item) => sum + item.imageCount, 0);
  log(`  📸 총 이미지: ${totalImages}개`);

  log(`\n✨ 완료!`);
  log(`📝 로그 파일: ${LOG_FILE}`);
}

main()
  .catch(error => {
    log(`❌ 크롤러 실행 오류: ${error.message}`);
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
