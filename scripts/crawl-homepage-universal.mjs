#!/usr/bin/env node
/**
 * 범용 홈페이지 크롤러 v3
 *
 * 핵심 전략:
 *   1. 헤더 메뉴를 왼쪽부터 순서대로 수집 (텍스트 무관)
 *   2. F12 소스에서 이미지 URL 직접 추출
 *   3. Playwright route interception으로 이미지 캡처
 *   4. 충분한 대기 시간 + 팝업 자동 닫기
 *
 * 사용법:
 *   node scripts/crawl-homepage-universal.mjs 2025000524
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// 카테고리 패턴 (파일명/URL 기반 자동 분류)
const CATEGORY_PATTERNS = {
  FLOORPLAN: ['평면', '세대', '타입', 'unit', 'plane', 'floor'],
  LAYOUT: ['단지', '배치', 'layout', 'place', '조감', '전경'],
  UNIT_LAYOUT: ['동호수', 'dongho', '동배치', '호배치'],
  PREMIUM: ['프리미엄', '특장점', 'premium', '명품'],
  LOCATION: ['입지', '환경', 'location', 'environment', '교통', 'position'],
  COMMUNITY: ['커뮤니티', 'community', 'comu', '편의', '부대'],
};

/**
 * 팝업 자동 닫기
 */
async function closePopups(page) {
  try {
    const closeSelectors = [
      '[class*="close"]',
      '[class*="popup-close"]',
      '[class*="modal-close"]',
      'button[aria-label="닫기"]',
      'button[aria-label="Close"]',
      '.btn-close',
      '[onclick*="close"]',
    ];

    for (const selector of closeSelectors) {
      try {
        const buttons = await page.$$(selector);
        for (const button of buttons) {
          await button.click({ timeout: 500 }).catch(() => {});
        }
      } catch {
        // 무시
      }
    }
  } catch (error) {
    // 무시
  }
}

/**
 * 헤더 메뉴 링크 순서대로 수집
 */
async function collectHeaderLinks(page) {
  const links = await page.evaluate(() => {
    // 다양한 헤더 셀렉터 시도
    const headerSelectors = [
      'header nav a',
      'header .menu a',
      'header .gnb a',
      'header ul a',
      '.header nav a',
      '.header .menu a',
      '.gnb a',
      '#gnb a',
      'nav a',
      '.nav a',
    ];

    let allLinks = [];

    for (const selector of headerSelectors) {
      const links = document.querySelectorAll(selector);
      if (links.length >= 3) { // 최소 3개 이상
        allLinks = Array.from(links).map(a => ({
          text: a.textContent.trim(),
          href: a.href,
        }));
        break;
      }
    }

    // 유효한 링크만 필터링
    return allLinks.filter(link =>
      link.href &&
      link.href.startsWith('http') &&
      !link.href.includes('javascript:') &&
      !link.href.includes('void(0)') &&
      !link.href.endsWith('#') &&
      link.text.length > 0
    );
  });

  return links;
}

/**
 * 페이지 소스에서 이미지 URL 추출
 */
async function extractImagesFromSource(page, minSize = 500) {
  const images = await page.evaluate((minSize) => {
    const foundImages = [];
    const seen = new Set();

    // 1. img 태그에서 추출
    const imgs = document.querySelectorAll('img');
    for (const img of imgs) {
      if (img.src &&
          img.src.startsWith('http') &&
          img.naturalWidth >= minSize &&
          img.naturalHeight >= minSize &&
          !img.src.includes('logo') &&
          !img.src.includes('icon')) {
        if (!seen.has(img.src)) {
          seen.add(img.src);
          foundImages.push({
            src: img.src,
            alt: img.alt || '',
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }
      }
    }

    // 2. 소스 코드에서 이미지 URL 패턴 찾기
    const bodyHTML = document.body.innerHTML;
    const urlPatterns = [
      /src=["']([^"']*\.(?:jpg|jpeg|png|gif|webp)[^"']*)["']/gi,
      /url\(["']?([^"')]*\.(?:jpg|jpeg|png|gif|webp)[^"')]*)["']?\)/gi,
    ];

    for (const pattern of urlPatterns) {
      let match;
      while ((match = pattern.exec(bodyHTML)) !== null) {
        let url = match[1];

        // 상대 경로를 절대 경로로 변환
        if (url.startsWith('/')) {
          url = window.location.origin + url;
        } else if (url.startsWith('./')) {
          url = window.location.origin + url.substring(1);
        } else if (!url.startsWith('http')) {
          url = window.location.origin + '/' + url;
        }

        if (!seen.has(url) && url.startsWith('http')) {
          seen.add(url);
          foundImages.push({
            src: url,
            alt: '',
            width: 0,
            height: 0,
          });
        }
      }
    }

    return foundImages;
  }, minSize);

  return images;
}

/**
 * 이미지 다운로드 (Playwright route interception)
 */
async function downloadImageWithRoute(page, url, savePath) {
  try {
    // 새 페이지 컨텍스트에서 다운로드
    const response = await page.request.get(url);

    if (response.ok()) {
      const buffer = await response.body();
      await fs.promises.writeFile(savePath, buffer);
      return true;
    } else {
      console.error(`     ❌ HTTP ${response.status()}`);
      return false;
    }
  } catch (error) {
    // Fallback: 브라우저 fetch
    try {
      const imageBuffer = await page.evaluate(async (imageUrl) => {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      }, url);

      const buffer = Buffer.from(imageBuffer, 'base64');
      await fs.promises.writeFile(savePath, buffer);
      return true;
    } catch (fallbackError) {
      console.error(`     ❌ 다운로드 실패: ${error.message}`);
      return false;
    }
  }
}

/**
 * 이미지 카테고리 자동 분류
 */
function categorizeImage(url, alt) {
  const text = `${url} ${alt}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_PATTERNS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'GALLERY';
}

/**
 * 메인 크롤링
 */
async function crawlHomepage(houseManageNo) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📦 ${houseManageNo} 범용 크롤러 v3 시작`);
  console.log('='.repeat(70));

  // 1. DB에서 청약 정보 조회
  const subscription = await prisma.subscription.findUnique({
    where: { houseManageNo },
    select: {
      id: true,
      houseName: true,
      homepage: true,
    }
  });

  if (!subscription || !subscription.homepage) {
    console.log(`  ❌ 홈페이지 정보 없음`);
    return { success: 0, failed: 0 };
  }

  console.log(`  📌 ${subscription.houseName}`);
  console.log(`  🌐 ${subscription.homepage}`);

  // 2. 출력 디렉토리 생성
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

  // 3. Playwright 시작
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allImages = [];
  let successCount = 0;
  let failedCount = 0;

  try {
    // 4. 메인 페이지 로딩 (충분한 대기)
    console.log(`\n  🌐 메인 페이지 로딩...`);
    await page.goto(subscription.homepage, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000); // 10초 대기 (팝업, 영상 로딩)

    // 팝업 닫기
    await closePopups(page);
    await page.waitForTimeout(2000);

    console.log(`     ✅ 페이지 로딩 완료`);

    // 5. 헤더 메뉴 링크 순서대로 수집
    console.log(`\n  📋 헤더 메뉴 분석...`);
    const headerLinks = await collectHeaderLinks(page);
    console.log(`     ✅ ${headerLinks.length}개 메뉴 발견`);

    if (headerLinks.length > 0) {
      headerLinks.forEach((link, idx) => {
        console.log(`        ${idx + 1}. ${link.text}`);
      });
    }

    // 6. 메인 페이지 이미지 수집
    console.log(`\n  📸 메인 페이지 이미지 수집...`);
    const mainImages = await extractImagesFromSource(page);
    console.log(`     ✅ ${mainImages.length}개 발견`);

    // 7. 각 헤더 메뉴 페이지 방문 (순서대로)
    const pagesToVisit = [
      { url: subscription.homepage, text: '메인' },
      ...headerLinks.slice(0, 15).map(link => ({ url: link.href, text: link.text })),
    ];

    for (const pageInfo of pagesToVisit) {
      if (pageInfo.url === subscription.homepage && pageInfo.text !== '메인') {
        continue; // 메인 페이지 중복 방지
      }

      console.log(`\n  📄 ${pageInfo.text} 페이지 크롤링...`);

      try {
        await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);

        const images = await extractImagesFromSource(page);
        console.log(`     ✅ ${images.length}개 이미지 발견`);

        // 8. 이미지 다운로드
        for (const img of images) {
          try {
            const url = new URL(img.src);
            let filename = path.basename(url.pathname).split('?')[0];

            if (!filename || filename.length < 3) {
              filename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
            }

            // 중복 체크
            if (allImages.some(i => i.filename === filename)) {
              continue;
            }

            const localPath = `/uploads/subscriptions/${houseManageNo}/${filename}`;
            const savePath = path.join(outputDir, filename);

            // 이미 다운로드된 파일 스킵
            if (fs.existsSync(savePath)) {
              continue;
            }

            console.log(`     💾 ${filename} (${img.width}x${img.height})`);

            const success = await downloadImageWithRoute(page, img.src, savePath);

            if (success) {
              const category = categorizeImage(img.src, img.alt);

              // 실제 파일 크기 확인
              const stats = await fs.promises.stat(savePath);
              if (stats.size < 1000) {
                // 1KB 이하면 유효하지 않은 이미지
                await fs.promises.unlink(savePath);
                failedCount++;
                continue;
              }

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
          } catch (error) {
            console.error(`     ❌ 처리 실패: ${error.message}`);
            failedCount++;
          }
        }

        // 페이지 간 딜레이
        await page.waitForTimeout(2000);

      } catch (error) {
        console.error(`     ❌ 페이지 접속 실패: ${error.message}`);
      }
    }

  } finally {
    await browser.close();
  }

  // 9. 크롤링 결과 저장
  const resultPath = path.join(outputDir, 'crawl-result-homepage.json');
  await fs.promises.writeFile(
    resultPath,
    JSON.stringify({
      houseManageNo,
      houseName: subscription.houseName,
      homepage: subscription.homepage,
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
╔════════════════════════════════════════════════════════════════════╗
║           🏠 범용 홈페이지 크롤러 v3                                ║
╚════════════════════════════════════════════════════════════════════╝
`);

  const houseManageNos = process.argv.slice(2);

  if (houseManageNos.length === 0) {
    console.log('사용법: node scripts/crawl-homepage-universal.mjs <분양번호> [분양번호2] ...');
    console.log('\n예시:');
    console.log('  node scripts/crawl-homepage-universal.mjs 2025000524');
    console.log('  node scripts/crawl-homepage-universal.mjs 2025000524 2025000581\n');
    return;
  }

  console.log(`📋 ${houseManageNos.length}개 홈페이지 크롤링\n`);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const houseManageNo of houseManageNos) {
    const result = await crawlHomepage(houseManageNo);
    totalSuccess += result.success;
    totalFailed += result.failed;

    // 다음 청약 크롤링 전 딜레이
    if (houseManageNos.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log('📊 전체 결과');
  console.log('═'.repeat(70));
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
