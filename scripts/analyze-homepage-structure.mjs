#!/usr/bin/env node
/**
 * 홈페이지 네비게이션 구조 분석
 */
import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeHomepage(homepage, houseName) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📦 ${houseName}`);
  console.log(`🌐 ${homepage}`);
  console.log('='.repeat(70));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(homepage, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 네비게이션 메뉴 찾기
    const navStructure = await page.evaluate(() => {
      // 다양한 네비게이션 패턴 시도
      const navSelectors = [
        'nav a',
        '.nav a',
        '.menu a',
        '.gnb a',
        'header a',
        '.navigation a',
        '[role="navigation"] a',
      ];

      let allLinks = [];

      for (const selector of navSelectors) {
        const links = document.querySelectorAll(selector);
        if (links.length > 0) {
          allLinks = Array.from(links).map(a => ({
            text: a.textContent.trim(),
            href: a.href,
          }));
          break;
        }
      }

      // 중복 제거 및 필터링
      const uniqueLinks = [];
      const seen = new Set();

      for (const link of allLinks) {
        const key = `${link.text}-${link.href}`;
        if (!seen.has(key) && link.text.length > 0 && link.text.length < 50) {
          seen.add(key);
          uniqueLinks.push(link);
        }
      }

      return uniqueLinks;
    });

    console.log(`\n📋 네비게이션 메뉴 (${navStructure.length}개):\n`);

    navStructure.forEach((link, i) => {
      console.log(`${i + 1}. ${link.text}`);
      if (link.href !== homepage) {
        const shortHref = link.href.replace(homepage, '');
        console.log(`   ${shortHref || '(홈)'}`);
      }
    });

  } catch (error) {
    console.error(`❌ 분석 실패:`, error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║           🏠 홈페이지 네비게이션 구조 분석                          ║
╚════════════════════════════════════════════════════════════════════╝
`);

  // 다양한 건설사 샘플 선택
  const samples = [
    { id: '2025000524', builder: '푸르지오' },
    { id: '2025000566', builder: '자이' },
    { id: '2025000606', builder: '힐스테이트' },
    { id: '2025000601', builder: '아이파크' },
    { id: '2025000581', builder: '기타' },
  ];

  for (const sample of samples) {
    const subscription = await prisma.subscription.findUnique({
      where: { houseManageNo: sample.id },
      select: { houseName: true, homepage: true },
    });

    if (subscription && subscription.homepage) {
      console.log(`\n[${sample.builder}]`);
      await analyzeHomepage(subscription.homepage, subscription.houseName);

      // 다음 분석 전 대기
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n\n${'═'.repeat(70)}`);
  console.log('✨ 분석 완료!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
