#!/usr/bin/env node
/**
 * 공식 홈페이지 크롤러
 *
 * 청약 단지의 공식 홈페이지에서 이미지 수집
 * - 푸르지오, 자이, 힐스테이트, 래미안, e편한세상 등 지원
 *
 * 사용법:
 *   node scripts/crawl-homepage.mjs 2025000524
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// 건설사별 페이지 패턴
const BUILDER_PATTERNS = {
  prugio: {
    name: '푸르지오',
    urlPattern: /prugio\.com/,
    pages: [
      { name: '평면안내', path: '/pages/unit.asp', imageSelector: 'img[alt*="unit"]' },
      { name: '단지배치도', path: '/pages/place.asp', imageSelector: 'img[src*="place"]' },
      { name: '동호수표', path: '/pages/architecture.asp', imageSelector: 'img' },
    ]
  },
  xi: {
    name: '자이',
    urlPattern: /xi\.co\.kr/,
    pages: [
      { name: '평면정보', path: '/view?cmsMenuSeq=29127', imageSelector: 'img[alt*="평형정보"]' },
      { name: '단지배치도', path: '/view?cmsMenuSeq=29121', imageSelector: 'img[alt*="단지배치도"]' },
      { name: '동호수배치도', path: '/view?cmsMenuSeq=29122', imageSelector: 'img[alt*="배치도"]' },
    ]
  },
};

/**
 * 건설사 패턴 감지
 */
function detectBuilder(homepage) {
  for (const [key, pattern] of Object.entries(BUILDER_PATTERNS)) {
    if (pattern.urlPattern.test(homepage)) {
      return { key, ...pattern };
    }
  }
  return null;
}

/**
 * 이미지 다운로드 (Playwright 브라우저 컨텍스트 사용)
 */
async function downloadImage(page, url, savePath) {
  try {
    // Playwright 브라우저 컨텍스트로 이미지 다운로드
    const imageBuffer = await page.evaluate(async (imageUrl) => {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      // ArrayBuffer를 Base64로 변환 (브라우저 → Node.js 전달용)
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }, url);

    // Base64 → Buffer 변환 후 저장
    const buffer = Buffer.from(imageBuffer, 'base64');
    await fs.promises.writeFile(savePath, buffer);

    return true;
  } catch (error) {
    console.error(`  ❌ 다운로드 실패 (${url}):`, error.message);
    return false;
  }
}

/**
 * 페이지에서 이미지 수집
 */
async function collectImagesFromPage(page, baseUrl, pagePath, imageSelector) {
  try {
    const fullUrl = baseUrl + pagePath;
    console.log(`  🔍 ${fullUrl} 접속 중...`);

    await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000); // 이미지 로딩 대기

    // 이미지 URL 수집
    const images = await page.evaluate((selector) => {
      const imgs = document.querySelectorAll(selector);
      return Array.from(imgs)
        .map(img => ({
          src: img.src,
          alt: img.alt || '',
          width: img.naturalWidth,
          height: img.naturalHeight
        }))
        .filter(img => img.width > 500); // 작은 아이콘 제외
    }, imageSelector);

    console.log(`  ✅ 이미지 ${images.length}개 발견`);
    return images;

  } catch (error) {
    console.error(`  ❌ 페이지 접속 실패:`, error.message);
    return [];
  }
}

/**
 * 이미지 카테고리 분류
 */
function categorizeImage(filename, alt) {
  const lower = `${filename} ${alt}`.toLowerCase();

  if (lower.includes('unit') || lower.includes('평면') || lower.includes('평형')) {
    return 'FLOORPLAN';
  }
  if (lower.includes('place') || lower.includes('배치')) {
    return 'LAYOUT';
  }
  if (lower.includes('architecture') || lower.includes('동호수')) {
    return 'UNIT_LAYOUT';
  }
  if (lower.includes('modelhouse') || lower.includes('모델하우스')) {
    return 'MODELHOUSE';
  }
  if (lower.includes('location') || lower.includes('입지') || lower.includes('환경')) {
    return 'LOCATION';
  }

  return 'GALLERY';
}

/**
 * 메인 크롤링
 */
async function crawlHomepage(houseManageNo) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 ${houseManageNo} 공식 홈페이지 크롤링`);
  console.log('='.repeat(60));

  // 1. DB에서 청약 정보 조회
  const subscription = await prisma.subscription.findUnique({
    where: { houseManageNo },
    select: {
      id: true,
      houseName: true,
      homepage: true,
    }
  });

  if (!subscription) {
    console.log(`  ❌ DB에 청약 정보 없음`);
    return { success: 0, failed: 0 };
  }

  if (!subscription.homepage) {
    console.log(`  ❌ 홈페이지 URL 없음`);
    return { success: 0, failed: 0 };
  }

  console.log(`  📌 ${subscription.houseName}`);
  console.log(`  🌐 ${subscription.homepage}`);

  // 2. 건설사 패턴 감지
  const builder = detectBuilder(subscription.homepage);
  if (!builder) {
    console.log(`  ❌ 지원하지 않는 건설사`);
    return { success: 0, failed: 0 };
  }

  console.log(`  🏢 건설사: ${builder.name}`);

  // 3. 출력 디렉토리 생성
  const outputDir = path.join(
    __dirname,
    '..',
    'public',
    'uploads',
    'subscriptions',
    houseManageNo
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 4. Playwright로 크롤링
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const allImages = [];
  let successCount = 0;
  let failedCount = 0;

  try {
    // 각 페이지 순회
    for (const pageConfig of builder.pages) {
      console.log(`\n  📄 ${pageConfig.name} 페이지`);

      const images = await collectImagesFromPage(
        page,
        subscription.homepage,
        pageConfig.path,
        pageConfig.imageSelector
      );

      // 이미지 다운로드
      for (const img of images) {
        const url = new URL(img.src);
        const filename = path.basename(url.pathname).split('?')[0];
        const category = categorizeImage(filename, img.alt);
        const localPath = `/uploads/subscriptions/${houseManageNo}/${filename}`;
        const savePath = path.join(outputDir, filename);

        console.log(`    💾 ${filename} (${img.width}x${img.height})`);

        const success = await downloadImage(page, img.src, savePath);

        if (success) {
          allImages.push({
            url: img.src,
            localPath,
            filename,
            category,
            alt: img.alt,
            width: img.width,
            height: img.height,
          });
          successCount++;
        } else {
          failedCount++;
        }
      }
    }

  } finally {
    await browser.close();
  }

  // 5. 크롤링 결과 저장
  const resultPath = path.join(outputDir, 'crawl-result-homepage.json');
  await fs.promises.writeFile(
    resultPath,
    JSON.stringify({
      houseManageNo,
      houseName: subscription.houseName,
      homepage: subscription.homepage,
      builder: builder.name,
      crawledAt: new Date().toISOString(),
      totalImages: allImages.length,
      images: allImages,
    }, null, 2)
  );

  console.log(`\n  ✅ 성공: ${successCount}개`);
  console.log(`  ❌ 실패: ${failedCount}개`);
  console.log(`  📝 결과 저장: ${resultPath}`);

  return { success: successCount, failed: failedCount };
}

/**
 * 메인 실행
 */
async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           🏠 공식 홈페이지 크롤러                           ║
╚════════════════════════════════════════════════════════════╝
`);

  const houseManageNos = process.argv.slice(2);

  if (houseManageNos.length === 0) {
    console.log('사용법: node scripts/crawl-homepage.mjs <분양번호> [분양번호2] ...');
    console.log('\n예시:');
    console.log('  node scripts/crawl-homepage.mjs 2025000524');
    console.log('  node scripts/crawl-homepage.mjs 2025000524 2025000581\n');
    return;
  }

  console.log(`📋 ${houseManageNos.length}개 홈페이지 크롤링\n`);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const houseManageNo of houseManageNos) {
    const result = await crawlHomepage(houseManageNo);
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
