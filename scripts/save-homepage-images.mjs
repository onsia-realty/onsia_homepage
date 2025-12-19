#!/usr/bin/env node
/**
 * 홈페이지 크롤링 이미지 → DB 저장
 *
 * 사용법:
 *   node scripts/save-homepage-images.mjs 2025000524
 *   node scripts/save-homepage-images.mjs 2025000524 2025000581
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

/**
 * 크롤링 결과 JSON 읽기
 */
function readCrawlResult(houseManageNo) {
  const resultPath = path.join(
    __dirname,
    '..',
    'public',
    'uploads',
    'subscriptions',
    houseManageNo,
    'crawl-result-homepage.json'
  );

  if (!fs.existsSync(resultPath)) {
    console.log(`  ⚠️  크롤링 결과 파일 없음: ${resultPath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(resultPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`  ❌ JSON 파싱 실패:`, error.message);
    return null;
  }
}

/**
 * 이미지 저장
 */
async function saveImages(houseManageNo) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 ${houseManageNo} 이미지 저장`);
  console.log('='.repeat(60));

  // 1. Subscription 조회
  const subscription = await prisma.subscription.findUnique({
    where: { houseManageNo },
  });

  if (!subscription) {
    console.log(`  ❌ DB에 청약 정보 없음`);
    return { success: 0, failed: 0 };
  }

  console.log(`  ✅ Subscription 찾음: ${subscription.houseName}`);

  // 2. 크롤링 결과 읽기
  const crawlResult = readCrawlResult(houseManageNo);
  if (!crawlResult || !crawlResult.images) {
    console.log(`  ❌ 크롤링 결과 없음`);
    return { success: 0, failed: 0 };
  }

  console.log(`  📁 이미지 ${crawlResult.images.length}개 발견`);

  // 3. 기존 이미지 삭제
  const deleted = await prisma.subscriptionImage.deleteMany({
    where: { subscriptionId: subscription.id },
  });
  console.log(`  🗑️  기존 이미지 ${deleted.count}개 삭제`);

  // 4. 새 이미지 저장
  let successCount = 0;
  let failedCount = 0;

  for (const [index, image] of crawlResult.images.entries()) {
    try {
      await prisma.subscriptionImage.create({
        data: {
          subscriptionId: subscription.id,
          category: image.category,
          url: image.localPath,
          originalUrl: image.url,
          alt: image.alt || `${subscription.houseName} ${image.category}`,
          order: index,
        },
      });

      successCount++;
    } catch (error) {
      console.error(`  ❌ ${image.filename} 저장 실패:`, error.message);
      failedCount++;
    }
  }

  console.log(`  ✅ 성공: ${successCount}개`);
  console.log(`  ❌ 실패: ${failedCount}개`);

  return { success: successCount, failed: failedCount };
}

/**
 * 메인 실행
 */
async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           🖼️  홈페이지 이미지 DB 저장                      ║
╚════════════════════════════════════════════════════════════╝
`);

  const houseManageNos = process.argv.slice(2);

  if (houseManageNos.length === 0) {
    console.log('사용법: node scripts/save-homepage-images.mjs <분양번호> [분양번호2] ...');
    console.log('\n예시:');
    console.log('  node scripts/save-homepage-images.mjs 2025000524');
    console.log('  node scripts/save-homepage-images.mjs 2025000524 2025000581\n');
    return;
  }

  console.log(`📋 ${houseManageNos.length}개 분양 이미지 저장\n`);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const houseManageNo of houseManageNos) {
    const result = await saveImages(houseManageNo);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('📊 전체 결과');
  console.log('═'.repeat(60));
  console.log(`  ✅ 성공: ${totalSuccess}개`);
  console.log(`  ❌ 실패: ${totalFailed}개`);
  console.log(`  📊 전체: ${totalSuccess + totalFailed}개`);
  console.log(`\n✨ 완료!`);
}

main()
  .catch(error => {
    console.error('❌ 오류:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
