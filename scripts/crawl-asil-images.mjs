#!/usr/bin/env node
/**
 * 아실(ASIL) 분양 이미지 크롤러
 *
 * 사용법:
 *   node scripts/crawl-asil-images.mjs 2025000524
 *   node scripts/crawl-asil-images.mjs 2025000524 2025000525 2025000526
 *
 * URL 패턴:
 *   이미지: https://asil.kr/photo/buny/{분양번호}/{카테고리}-{순번}.jpg
 *   PDF:   https://asil.kr/photo/buny_pdf/{분양번호}.pdf
 *
 * 카테고리:
 *   2: 모델하우스 위치
 *   3: 입지환경
 *   4: 단지배치도
 *   5: 동호수배치표
 *   6: 면적표(평면도)
 *   9: 사진갤러리
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://asil.kr';
const PHOTO_PATH = '/photo/buny';
const PDF_PATH = '/photo/buny_pdf';

// 카테고리 정의
const CATEGORIES = {
  2: { name: 'modelhouse', label: '모델하우스 위치', maxCount: 3 },
  3: { name: 'location', label: '입지환경', maxCount: 5 },
  4: { name: 'layout', label: '단지배치도', maxCount: 3 },
  5: { name: 'unit-layout', label: '동호수배치표', maxCount: 10 },
  6: { name: 'floorplan', label: '면적표', maxCount: 15 },
  9: { name: 'gallery', label: '사진갤러리', maxCount: 20 },
};

// 저장 경로
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'uploads', 'subscriptions');

// 딜레이 함수 (서버 부하 방지)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 이미지 다운로드
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://asil.kr/',
      }
    });

    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || (!contentType.includes('image') && !contentType.includes('pdf'))) {
      return false;
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return true;
  } catch (error) {
    return false;
  }
}

// 분양번호별 이미지 크롤링
async function crawlSubscription(houseManageNo) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 분양번호: ${houseManageNo}`);
  console.log('='.repeat(60));

  const subscriptionDir = path.join(OUTPUT_DIR, houseManageNo);

  // 디렉토리 생성
  if (!fs.existsSync(subscriptionDir)) {
    fs.mkdirSync(subscriptionDir, { recursive: true });
  }

  const results = {
    total: 0,
    success: 0,
    failed: 0,
    files: [],
  };

  // 1. PDF 다운로드
  console.log(`\n📄 모집공고문 PDF 다운로드...`);
  const pdfUrl = `${BASE_URL}${PDF_PATH}/${houseManageNo}.pdf`;
  const pdfPath = path.join(subscriptionDir, 'notice.pdf');

  results.total++;
  if (await downloadImage(pdfUrl, pdfPath)) {
    console.log(`   ✅ notice.pdf`);
    results.success++;
    results.files.push({ type: 'pdf', name: 'notice.pdf', url: pdfUrl });
  } else {
    console.log(`   ❌ PDF 없음`);
    results.failed++;
  }

  await delay(300);

  // 2. 카테고리별 이미지 다운로드
  for (const [catId, catInfo] of Object.entries(CATEGORIES)) {
    console.log(`\n🖼️  ${catInfo.label} (${catInfo.name})...`);

    const catDir = path.join(subscriptionDir, catInfo.name);
    if (!fs.existsSync(catDir)) {
      fs.mkdirSync(catDir, { recursive: true });
    }

    let foundCount = 0;
    let consecutiveFails = 0;

    for (let i = 1; i <= catInfo.maxCount; i++) {
      const imageUrl = `${BASE_URL}${PHOTO_PATH}/${houseManageNo}/${catId}-${i}.jpg`;
      const imagePath = path.join(catDir, `${i}.jpg`);

      results.total++;

      if (await downloadImage(imageUrl, imagePath)) {
        console.log(`   ✅ ${catInfo.name}/${i}.jpg`);
        results.success++;
        results.files.push({
          type: catInfo.name,
          name: `${i}.jpg`,
          url: imageUrl,
          localPath: `/uploads/subscriptions/${houseManageNo}/${catInfo.name}/${i}.jpg`
        });
        foundCount++;
        consecutiveFails = 0;
      } else {
        results.failed++;
        consecutiveFails++;

        // 연속 3번 실패하면 해당 카테고리 스킵
        if (consecutiveFails >= 3) {
          console.log(`   ⏭️  더 이상 이미지 없음 (${foundCount}개 발견)`);
          break;
        }
      }

      await delay(200); // 요청 간 딜레이
    }

    if (foundCount === 0) {
      console.log(`   ⚠️  이미지 없음`);
      // 빈 디렉토리 삭제
      fs.rmdirSync(catDir, { recursive: true });
    }
  }

  // 결과 요약 저장
  const summaryPath = path.join(subscriptionDir, 'crawl-result.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    houseManageNo,
    crawledAt: new Date().toISOString(),
    ...results
  }, null, 2));

  console.log(`\n📊 결과: 성공 ${results.success}개 / 전체 ${results.total}개`);
  console.log(`📁 저장 위치: ${subscriptionDir}`);

  return results;
}

// 메인 실행
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
아실(ASIL) 분양 이미지 크롤러
=============================

사용법:
  node scripts/crawl-asil-images.mjs <분양번호> [분양번호2] [분양번호3] ...

예시:
  node scripts/crawl-asil-images.mjs 2025000524
  node scripts/crawl-asil-images.mjs 2025000524 2025000525 2025000526

분양번호는 청약홈 HOUSE_MANAGE_NO와 동일합니다.
    `);
    process.exit(1);
  }

  console.log(`
╔════════════════════════════════════════════════════════════╗
║           🏠 아실(ASIL) 분양 이미지 크롤러                 ║
╚════════════════════════════════════════════════════════════╝
`);

  const allResults = [];

  for (const houseManageNo of args) {
    const result = await crawlSubscription(houseManageNo);
    allResults.push({ houseManageNo, ...result });

    // 다음 분양번호 처리 전 딜레이
    if (args.indexOf(houseManageNo) < args.length - 1) {
      console.log(`\n⏳ 다음 분양번호 처리 대기 중...`);
      await delay(1000);
    }
  }

  // 전체 결과 요약
  console.log(`\n${'═'.repeat(60)}`);
  console.log('📈 전체 크롤링 결과');
  console.log('═'.repeat(60));

  let totalSuccess = 0;
  let totalFiles = 0;

  for (const result of allResults) {
    console.log(`  ${result.houseManageNo}: ${result.success}/${result.total} 파일`);
    totalSuccess += result.success;
    totalFiles += result.total;
  }

  console.log('─'.repeat(60));
  console.log(`  총합: ${totalSuccess}/${totalFiles} 파일 다운로드 완료`);
  console.log(`\n✨ 완료!`);
}

main().catch(console.error);
