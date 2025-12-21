#!/usr/bin/env node
/**
 * 청약홈 모집공고 페이지 테스트 크롤링
 */
import { chromium } from 'playwright';

async function testCrawl(houseManageNo) {
  const url = `https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=${houseManageNo}&pblancNo=${houseManageNo}`;

  console.log(`\n📦 청약홈 모집공고 페이지 분석`);
  console.log(`🌐 ${url}\n`);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 스크린샷 찍기
    await page.screenshot({
      path: `.playwright-mcp/applyhome-${houseManageNo}.png`,
      fullPage: true
    });
    console.log(`📸 스크린샷 저장: .playwright-mcp/applyhome-${houseManageNo}.png`);

    // 모든 이미지 찾기
    const images = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).map(img => ({
        src: img.src,
        alt: img.alt || '',
        width: img.width,
        height: img.height,
        className: img.className,
      }));
    });

    console.log(`\n✅ 발견된 이미지: ${images.length}개\n`);

    // 큰 이미지만 필터링
    const largeImages = images.filter(img => img.width > 500 && img.height > 500);
    console.log(`📊 큰 이미지 (500px 이상): ${largeImages.length}개\n`);

    largeImages.forEach((img, i) => {
      console.log(`${i + 1}. ${img.src}`);
      console.log(`   크기: ${img.width}x${img.height}`);
      console.log(`   alt: ${img.alt}`);
      console.log(`   class: ${img.className}`);
      console.log('');
    });

    // 링크 확인 (PDF, 첨부파일 등)
    const links = await page.evaluate(() => {
      const anchors = document.querySelectorAll('a');
      return Array.from(anchors)
        .filter(a => a.href.includes('download') || a.href.includes('.pdf') || a.href.includes('file'))
        .map(a => ({
          href: a.href,
          text: a.textContent.trim(),
        }));
    });

    if (links.length > 0) {
      console.log('\n📎 첨부파일/다운로드 링크:\n');
      links.forEach((link, i) => {
        console.log(`${i + 1}. ${link.text}`);
        console.log(`   ${link.href}`);
        console.log('');
      });
    }

    // 5초 대기 (수동 확인용)
    console.log('\n⏳ 5초 대기 (브라우저 확인)...');
    await page.waitForTimeout(5000);

  } finally {
    await browser.close();
  }
}

const houseManageNo = process.argv[2] || '2025000524';
testCrawl(houseManageNo).catch(console.error);
