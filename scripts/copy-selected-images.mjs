#!/usr/bin/env node

/**
 * DB에 저장된 이미지만 선별해서 배포용 폴더로 복사
 *
 * 작동 방식:
 * 1. DB에서 실제 사용 중인 이미지 URL 조회
 * 2. public/uploads/subscriptions/ → public/images/subscriptions/ 복사
 * 3. DB의 이미지 URL 경로 업데이트 (/uploads → /images)
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const prisma = new PrismaClient();

// 경로 설정
const SOURCE_DIR = path.join(projectRoot, 'public/uploads/subscriptions');
const TARGET_DIR = path.join(projectRoot, 'public/images/subscriptions');

/**
 * 파일시스템에 안전한 폴더명 생성
 * - 특수문자 제거
 * - 공백 유지 (윈도우에서 허용)
 */
function sanitizeFolderName(houseName) {
  return houseName
    .replace(/[<>:"/\\|?*]/g, '') // 윈도우 금지 문자 제거
    .replace(/\s+/g, ' ')          // 연속 공백 → 단일 공백
    .trim();
}

/**
 * DB 카테고리 → 폴더명 매핑
 */
function getCategoryFolder(category) {
  const categoryMap = {
    'GALLERY': 'gallery',
    'FLOORPLAN': 'floorplan',
    'LAYOUT': 'layout',
    'UNIT_LAYOUT': 'unit-layout',
    'LOCATION': 'location',
    'MODELHOUSE': 'modelhouse',
    'PREMIUM': 'premium',
    'COMMUNITY': 'community',
    'NOTICE_PDF': 'notice',
  };
  return categoryMap[category] || 'other';
}

async function main() {
  console.log('🚀 DB에 저장된 이미지 복사 시작...\n');

  try {
    // 1. DB에서 모든 청약 이미지 조회 (청약 정보 + 카테고리 포함)
    const images = await prisma.subscriptionImage.findMany({
      select: {
        id: true,
        url: true,
        category: true,
        subscriptionId: true,
        subscription: {
          select: {
            houseManageNo: true,
            houseName: true,
          },
        },
      },
    });

    if (images.length === 0) {
      console.log('⚠️  DB에 저장된 이미지가 없습니다.');
      return;
    }

    console.log(`📊 총 ${images.length}개 이미지 발견\n`);

    // 2. 대상 디렉토리 생성
    await fs.mkdir(TARGET_DIR, { recursive: true });

    let successCount = 0;
    let failCount = 0;
    const updates = [];

    // 3. 이미지 복사 및 URL 업데이트 (카테고리별 폴더 생성)
    for (const image of images) {
      try {
        // 현장명으로 폴더명 생성
        const folderName = sanitizeFolderName(image.subscription.houseName);
        const categoryFolder = getCategoryFolder(image.category);
        const fileName = path.basename(image.url);

        // 원본 경로: /uploads/subscriptions/2025000524/gallery/main.jpg 또는
        //           /uploads/subscriptions/2025000524/main.jpg (카테고리 없는 경우)
        const houseManageNo = image.subscription.houseManageNo;

        // 카테고리 폴더가 있는 경로 먼저 시도
        let sourcePath = path.join(SOURCE_DIR, houseManageNo, categoryFolder, fileName);

        // 카테고리 폴더가 없으면 루트에서 찾기
        if (!await fs.access(sourcePath).then(() => true).catch(() => false)) {
          sourcePath = path.join(SOURCE_DIR, houseManageNo, fileName);
        }

        // 새 URL: /images/subscriptions/용인 푸르지오 원클러스터파크/gallery/main.jpg
        const newUrl = `/images/subscriptions/${folderName}/${categoryFolder}/${fileName}`;
        const targetPath = path.join(projectRoot, 'public', newUrl);

        // 대상 디렉토리 생성 (카테고리 폴더 포함)
        await fs.mkdir(path.dirname(targetPath), { recursive: true });

        // 파일 복사
        await fs.copyFile(sourcePath, targetPath);

        // URL 업데이트 준비
        updates.push({
          id: image.id,
          newUrl: newUrl,
        });

        successCount++;
        console.log(`✅ [${successCount}/${images.length}] ${folderName}/${categoryFolder}/${fileName}`);

      } catch (error) {
        failCount++;
        console.error(`❌ 실패: ${image.url}`);
        console.error(`   사유: ${error.message}`);
      }
    }

    // 4. DB URL 일괄 업데이트
    console.log('\n📝 DB URL 업데이트 중...');

    for (const update of updates) {
      await prisma.subscriptionImage.update({
        where: { id: update.id },
        data: { url: update.newUrl },
      });
    }

    // 5. 결과 출력
    console.log('\n' + '='.repeat(50));
    console.log('✨ 복사 완료!');
    console.log('='.repeat(50));
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${failCount}개`);
    console.log(`📁 대상 폴더: ${TARGET_DIR}`);
    console.log('\n💡 이제 vercel --prod 배포 가능합니다.');

  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
