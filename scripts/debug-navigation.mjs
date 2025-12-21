#!/usr/bin/env node
/**
 * 네비게이션 디버깅 스크립트
 */
import { chromium } from 'playwright';

const url = process.argv[2] || 'http://www.detre-yj1.co.kr';

async function debug() {
  console.log(`\n🔍 ${url} 네비게이션 구조 분석\n`);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 스크린샷
    await page.screenshot({
      path: `.playwright-mcp/debug-${Date.now()}.png`,
      fullPage: true
    });

    // 모든 a 태그 찾기
    const allLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      return Array.from(links).map(a => ({
        text: a.textContent.trim(),
        href: a.href,
        className: a.className,
        parentClass: a.parentElement?.className || '',
        parentTag: a.parentElement?.tagName || '',
      }));
    });

    console.log(`📋 전체 링크: ${allLinks.length}개\n`);

    // 메뉴로 보이는 링크만 필터링
    const menuLinks = allLinks.filter(link =>
      link.text.length > 0 &&
      link.text.length < 20 &&
      !link.href.includes('javascript:void')
    );

    console.log(`📋 메뉴 후보: ${menuLinks.length}개\n`);

    menuLinks.slice(0, 30).forEach((link, i) => {
      console.log(`${i + 1}. ${link.text}`);
      console.log(`   href: ${link.href}`);
      console.log(`   class: ${link.className}`);
      console.log(`   parent: <${link.parentTag}> class="${link.parentClass}"`);
      console.log('');
    });

    // 5초 대기
    console.log('\n⏳ 5초 대기 (브라우저 확인)...');
    await page.waitForTimeout(5000);

  } finally {
    await browser.close();
  }
}

debug().catch(console.error);
