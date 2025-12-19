#!/usr/bin/env node
/**
 * 청약홈 API 데이터 크롤러 → DB 저장
 *
 * 사용법:
 *   node scripts/crawl-subscriptions.mjs
 *   node scripts/crawl-subscriptions.mjs --perPage 50
 *   node scripts/crawl-subscriptions.mjs --ids 2025000524 2025000581
 *
 * 기능:
 *   1. 청약홈 API에서 분양 목록 조회
 *   2. 각 분양별 상세 정보 조회 (주택형, 경쟁률)
 *   3. 주소 → 좌표 변환 (카카오맵 API)
 *   4. DB에 저장 (Subscription + SubscriptionHousingType)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 환경 변수
const CHEONGYAK_API_KEY = process.env.DATA_GO_KR_API_KEY || process.env.NEXT_PUBLIC_CHEONGYAK_API_KEY || '4e6d79764872613937394558456c43';
const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

// 청약홈 API 엔드포인트
const API_BASE = 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1';

// 딜레이 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 청약 목록 조회
 */
async function fetchSubscriptionList(page = 1, perPage = 100) {
  const url = `${API_BASE}/getAPTLttotPblancDetail?page=${page}&perPage=${perPage}`;

  console.log(`\n📡 청약 목록 조회 (페이지 ${page})...`);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Infuser ${CHEONGYAK_API_KEY}`,
      }
    });
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      console.log('   ⚠️  데이터 없음');
      return [];
    }

    console.log(`   ✅ ${data.data.length}개 조회`);
    return data.data;
  } catch (error) {
    console.error('   ❌ API 오류:', error.message);
    return [];
  }
}

/**
 * 주택형별 정보 조회
 */
async function fetchHousingTypes(houseManageNo, pblancNo) {
  const url = `${API_BASE}/getAPTLttotPblancMdl?page=1&perPage=100&cond[HOUSE_MANAGE_NO::EQ]=${houseManageNo}&cond[PBLANC_NO::EQ]=${pblancNo}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Infuser ${CHEONGYAK_API_KEY}`,
      }
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('     주택형 조회 실패:', error.message);
    return [];
  }
}

/**
 * 카카오맵 지오코딩 (주소 → 좌표)
 */
async function geocodeAddress(address) {
  if (!KAKAO_API_KEY) {
    console.log('     ⚠️  카카오맵 API 키 없음, 좌표 스킵');
    return null;
  }

  const cleanAddress = address.replace(/\(.*?\)/g, '').trim(); // 괄호 제거
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(cleanAddress)}`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `KakaoAK ${KAKAO_API_KEY}` }
    });
    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const { x, y } = data.documents[0];
      return { latitude: parseFloat(y), longitude: parseFloat(x) };
    }
  } catch (error) {
    console.error('     지오코딩 실패:', error.message);
  }

  return null;
}

/**
 * 날짜 문자열 → DateTime 변환
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  try {
    const cleaned = dateStr.replace(/\s+/g, '');
    return new Date(cleaned);
  } catch {
    return null;
  }
}

/**
 * 청약 상태 계산
 */
function calculateStatus(item) {
  const now = new Date();
  const receptionStart = parseDate(item.RCEPT_BGNDE);
  const receptionEnd = parseDate(item.RCEPT_ENDDE);
  const winnerDate = parseDate(item.PRZWNER_PRESNATN_DE);

  if (receptionStart && receptionEnd) {
    if (now >= receptionStart && now <= receptionEnd) {
      return 'OPEN'; // 접수중
    }
    if (now < receptionStart) {
      return 'UPCOMING'; // 접수예정
    }
    if (now > receptionEnd && winnerDate && now < winnerDate) {
      return 'CLOSED'; // 접수마감
    }
    if (winnerDate && now >= winnerDate) {
      return 'ANNOUNCED'; // 당첨자발표
    }
  }

  return 'UPCOMING';
}

/**
 * 청약 데이터 저장
 */
async function saveSubscription(item) {
  const houseManageNo = item.HOUSE_MANAGE_NO;
  const pblancNo = item.PBLANC_NO;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 ${item.HOUSE_NM} (${houseManageNo})`);
  console.log('='.repeat(60));

  // 1. 주택형 정보 조회
  console.log('  🏠 주택형 정보 조회...');
  await delay(300); // API 부하 방지
  const housingTypesData = await fetchHousingTypes(houseManageNo, pblancNo);
  console.log(`     ✅ ${housingTypesData.length}개 타입 조회`);

  // 2. 지오코딩
  console.log('  🗺️  주소 → 좌표 변환...');
  await delay(300);
  const coords = await geocodeAddress(item.HSSPLY_ADRES);
  if (coords) {
    console.log(`     ✅ (${coords.latitude}, ${coords.longitude})`);
  }

  // 3. 가격 정보 계산
  const prices = housingTypesData
    .filter(t => t.LTTOT_TOP_AMOUNT)
    .map(t => Number(t.LTTOT_TOP_AMOUNT));

  const avgPrice = prices.length > 0
    ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length)
    : null;

  const avgPricePerPyeong = housingTypesData.length > 0
    ? Math.round(
        housingTypesData
          .filter(t => t.LTTOT_TOP_AMOUNT && t.SUPLY_AR)
          .map(t => Number(t.LTTOT_TOP_AMOUNT) / (Number(t.SUPLY_AR) / 3.3058))
          .reduce((sum, p) => sum + p, 0) / housingTypesData.length
      )
    : null;

  // 4. DB 저장
  console.log('  💾 DB 저장...');

  const subscriptionData = {
    houseManageNo,
    pblancNo,
    houseName: item.HOUSE_NM,
    houseType: item.HOUSE_SECD_NM || 'APT',
    houseDetailType: item.HOUSE_DTL_SECD_NM || '민영',
    address: item.HSSPLY_ADRES,
    zipCode: item.HSSPLY_ZIP,
    region: item.SUBSCRPT_AREA_CODE_NM,
    regionCode: item.SUBSCRPT_AREA_CODE,
    latitude: coords?.latitude,
    longitude: coords?.longitude,
    totalHouseholds: item.TOT_SUPLY_HSHLDCO,
    recruitDate: parseDate(item.RCRIT_PBLANC_DE),
    receptionStart: parseDate(item.RCEPT_BGNDE),
    receptionEnd: parseDate(item.RCEPT_ENDDE),
    specialSupplyDate: parseDate(item.SPSPLY_RCEPT_BGNDE),
    rank1Date: parseDate(item.GNRL_RNK1_CRSPAREA_RCPTDE),
    rank2Date: parseDate(item.GNRL_RNK2_CRSPAREA_RCPTDE),
    winnerAnnouncementDate: parseDate(item.PRZWNER_PRESNATN_DE),
    contractStart: parseDate(item.CNTRCT_CNCLS_BGNDE),
    contractEnd: parseDate(item.CNTRCT_CNCLS_ENDDE),
    moveInDate: item.MVN_PREARNGE_YM,
    developer: item.CNSTRCT_ENTRPS_NM,
    contractor: item.BSNS_MBY_NM,
    modelHousePhone: item.MDHS_TELNO,
    homepage: item.HMPG_ADRES,
    noticeUrl: item.PBLANC_URL,
    avgPrice,
    avgPricePerPyeong,
    minPrice: prices.length > 0 ? Math.min(...prices) : null,
    maxPrice: prices.length > 0 ? Math.max(...prices) : null,
    status: calculateStatus(item),
    rawData: item,
  };

  const subscription = await prisma.subscription.upsert({
    where: { houseManageNo },
    create: subscriptionData,
    update: subscriptionData,
  });

  console.log(`     ✅ Subscription 저장 완료`);

  // 5. 주택형 저장
  if (housingTypesData.length > 0) {
    console.log(`  🏗️  주택형 ${housingTypesData.length}개 저장...`);

    // 기존 주택형 삭제
    await prisma.subscriptionHousingType.deleteMany({
      where: { subscriptionId: subscription.id }
    });

    // 새 주택형 저장
    for (const type of housingTypesData) {
      const supplyArea = Number(type.SUPLY_AR) || 0;
      const topPrice = type.LTTOT_TOP_AMOUNT ? Number(type.LTTOT_TOP_AMOUNT) : null;
      const pricePerPyeong = topPrice && supplyArea > 0
        ? Math.round(topPrice / (supplyArea / 3.3058))
        : null;

      await prisma.subscriptionHousingType.create({
        data: {
          subscriptionId: subscription.id,
          houseTy: type.HOUSE_TY,
          modelNo: type.MODEL_NO,
          supplyArea,
          exclusiveArea: supplyArea, // 일단 공급면적과 동일하게
          totalHouseholds: type.SUPLY_HSHLDCO + (type.SPSPLY_HSHLDCO || 0),
          generalHouseholds: type.SUPLY_HSHLDCO,
          specialHouseholds: type.SPSPLY_HSHLDCO || 0,
          topPrice,
          pricePerPyeong,
          rawData: type,
        },
      });
    }

    console.log(`     ✅ 주택형 저장 완료`);
  }

  console.log(`  ✨ 완료!`);
  return subscription;
}

/**
 * 메인 실행
 */
async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           🏠 청약홈 데이터 크롤러 → DB 저장                ║
╚════════════════════════════════════════════════════════════╝
`);

  const args = process.argv.slice(2);
  let subscriptions = [];

  // 특정 ID 크롤링
  if (args.includes('--ids')) {
    const idsIndex = args.indexOf('--ids');
    const ids = args.slice(idsIndex + 1).filter(arg => !arg.startsWith('--'));

    console.log(`📋 지정된 ID ${ids.length}개 크롤링: ${ids.join(', ')}\n`);

    for (const id of ids) {
      const url = `${API_BASE}/getAPTLttotPblancDetail?page=1&perPage=1&cond[HOUSE_MANAGE_NO::EQ]=${id}`;

      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Infuser ${CHEONGYAK_API_KEY}`,
          }
        });
        const data = await response.json();
        console.log(`  ID ${id} 응답:`, JSON.stringify(data, null, 2).substring(0, 500));
        if (data.data && data.data[0]) {
          subscriptions.push(data.data[0]);
        }
      } catch (error) {
        console.error(`  ❌ ID ${id} 조회 실패:`, error.message);
      }

      await delay(500);
    }
  } else {
    // 전체 목록 크롤링
    const perPageIndex = args.indexOf('--perPage');
    const perPage = perPageIndex >= 0 ? parseInt(args[perPageIndex + 1]) : 50;

    subscriptions = await fetchSubscriptionList(1, perPage);
  }

  if (subscriptions.length === 0) {
    console.log('❌ 크롤링할 데이터가 없습니다.');
    return;
  }

  console.log(`\n📊 총 ${subscriptions.length}개 분양 처리 시작\n`);

  let successCount = 0;
  let failCount = 0;

  for (const item of subscriptions) {
    try {
      await saveSubscription(item);
      successCount++;
    } catch (error) {
      console.error(`\n❌ ${item.HOUSE_NM} 저장 실패:`, error.message);
      failCount++;
    }

    await delay(1000); // 다음 항목 처리 전 딜레이
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('📈 크롤링 결과');
  console.log('═'.repeat(60));
  console.log(`  ✅ 성공: ${successCount}개`);
  console.log(`  ❌ 실패: ${failCount}개`);
  console.log(`  📊 전체: ${subscriptions.length}개`);
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
