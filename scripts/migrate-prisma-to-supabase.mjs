/**
 * Prisma 경매 데이터 → Supabase 마이그레이션 스크립트
 *
 * 실행: node scripts/migrate-prisma-to-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// .env 파일 로드
config();

// Supabase 설정 (쓰기 작업은 service_role_key 필요)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 환경 변수 필요: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Prisma 데이터 로드
const prismaData = JSON.parse(readFileSync('./prisma-auction-export.json', 'utf-8'));

console.log('═'.repeat(50));
console.log(' Prisma → Supabase 마이그레이션');
console.log('═'.repeat(50));
console.log(`\n📦 ${prismaData.length}개 물건 발견\n`);

// 사건번호에서 연도 추출
function extractCaseYear(caseNumber) {
  const match = caseNumber.match(/(\d{4})/);
  return match ? parseInt(match[1]) : new Date().getFullYear();
}

// 상태 맵핑 (Prisma → Supabase)
function mapStatus(prismaStatus) {
  const statusMap = {
    'SCHEDULED': 'ACTIVE',
    'BIDDING': 'ACTIVE',
    'SOLD': 'SOLD',
    'FAILED': 'FAILED',
    'WITHDRAWN': 'CANCELED',
    'CANCELED': 'CANCELED',
  };
  return statusMap[prismaStatus] || 'ACTIVE';
}

// 이미지 배열 변환
function transformImages(images) {
  if (!images || images.length === 0) return [];
  return images.map(img => ({
    url: img.url,
    type: img.imageType,  // PHOTO, SURVEY, APPRAISAL
    alt: img.alt || '',
    order: img.order || 0,
  }));
}

// 물건 종류 맵핑
function mapPropertyType(itemType) {
  const typeMap = {
    'APARTMENT': '아파트',
    'VILLA': '다세대/연립',
    'OFFICETEL': '오피스텔',
    'HOUSE': '단독주택',
    'COMMERCIAL': '상업시설',
    'LAND': '토지',
    'FACTORY': '공장',
    'BUILDING': '건물',
  };
  return typeMap[itemType] || itemType;
}

async function migrateAuction(item) {
  console.log(`\n📍 처리 중: ${item.caseNumber}`);
  console.log(`   주소: ${item.address}`);

  // 1. 메인 경매 데이터 변환
  const auctionData = {
    court_code: item.courtCode,
    court_name: item.courtName,
    case_number: item.caseNumber,
    case_year: extractCaseYear(item.caseNumber),
    item_number: 1,

    property_type: mapPropertyType(item.itemType),
    address: item.address,
    sido: item.city,
    sigungu: item.district,
    dong: item.addressDetail,

    land_area: item.landArea,
    building_area: item.buildingArea,

    appraisal_price: parseInt(item.appraisalPrice) || null,
    minimum_price: parseInt(item.minimumPrice) || null,
    deposit_amount: parseInt(item.deposit) || null,
    bid_count: item.bidCount || 0,

    sale_date: item.saleDate,
    dividend_end_date: item.bidEndDate ? item.bidEndDate.split('T')[0] : null,

    status: mapStatus(item.status),

    // 당사자 정보
    owner: item.owner || null,
    debtor: item.debtor || null,
    creditor: item.creditor || null,

    note: [
      item.surroundings,
      item.transportation,
      item.nearbyFacilities ? `주변시설: ${item.nearbyFacilities}` : null,
      item.heatingType ? `난방: ${item.heatingType}` : null,
      item.locationNote,
    ].filter(Boolean).join('\n\n'),

    images: transformImages(item.images),

    source_url: `https://www.dooinauction.com/ca/caView.php?tid=${item.caseNumberFull}`,
  };

  console.log(`   이미지: ${auctionData.images.length}개`);

  // 2. Supabase에 삽입 (upsert)
  const { data: auction, error: auctionError } = await supabase
    .from('auctions')
    .upsert(auctionData, {
      onConflict: 'court_code,case_number,item_number',
    })
    .select()
    .single();

  if (auctionError) {
    console.log(`   ❌ 경매 저장 실패:`, auctionError.message);
    return null;
  }

  console.log(`   ✅ 경매 저장 완료 (ID: ${auction.id})`);

  // 3. 권리분석 (auction_rights) 저장
  if (item.registers && item.registers.length > 0) {
    const rightsData = item.registers.map(reg => ({
      auction_id: auction.id,
      register_type: reg.registerType,
      register_no: reg.registerNo,
      receipt_date: reg.receiptDate ? reg.receiptDate.split('T')[0] : null,
      purpose: reg.purpose,
      right_holder: reg.rightHolder,
      claim_amount: reg.claimAmount ? parseInt(reg.claimAmount) : null,
      is_reference: reg.isReference || false,
      will_expire: reg.willExpire || false,
      note: reg.note,
    }));

    // 기존 데이터 삭제 후 삽입
    await supabase
      .from('auction_rights')
      .delete()
      .eq('auction_id', auction.id);

    const { error: rightsError } = await supabase
      .from('auction_rights')
      .insert(rightsData);

    if (rightsError) {
      console.log(`   ⚠️ 권리분석 저장 실패:`, rightsError.message);
    } else {
      console.log(`   ✅ 권리분석 ${rightsData.length}건 저장`);
    }
  }

  // 4. 기일 내역 (auction_schedules) 저장
  if (item.bids && item.bids.length > 0) {
    const schedulesData = item.bids.map(bid => ({
      auction_id: auction.id,
      schedule_date: bid.bidDate,
      schedule_type: '매각기일',
      minimum_price: bid.minimumPrice ? parseInt(bid.minimumPrice) : null,
      result: bid.result === 'FAILED' ? '유찰' :
              bid.result === 'SUCCESSFUL' ? '매각' :
              bid.result === 'POSTPONED' ? '연기' : bid.result,
      sold_price: bid.winningPrice ? parseInt(bid.winningPrice) : null,
    }));

    // 기존 데이터 삭제 후 삽입
    await supabase
      .from('auction_schedules')
      .delete()
      .eq('auction_id', auction.id);

    const { error: schedulesError } = await supabase
      .from('auction_schedules')
      .insert(schedulesData);

    if (schedulesError) {
      console.log(`   ⚠️ 기일내역 저장 실패:`, schedulesError.message);
    } else {
      console.log(`   ✅ 기일내역 ${schedulesData.length}건 저장`);
    }
  }

  // 5. 권리분석 요약 (auction_analysis) 저장
  const analysisData = {
    auction_id: auction.id,
    reference_date: item.referenceDate ? item.referenceDate.split('T')[0] : null,
    has_risk: item.hasRisk || false,
    risk_note: item.riskNote,
    investment_grade: item.hasRisk ? 'C' : 'B',
    risk_level: item.hasRisk ? 'HIGH' : 'LOW',
  };

  const { error: analysisError } = await supabase
    .from('auction_analysis')
    .upsert(analysisData, {
      onConflict: 'auction_id',
    });

  if (analysisError) {
    console.log(`   ⚠️ 분석결과 저장 실패:`, analysisError.message);
  } else {
    console.log(`   ✅ 분석결과 저장 완료`);
  }

  return auction;
}

async function main() {
  const results = {
    success: 0,
    failed: 0,
  };

  for (const item of prismaData) {
    try {
      const auction = await migrateAuction(item);
      if (auction) {
        results.success++;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.log(`   ❌ 에러:`, error.message);
      results.failed++;
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log(' 마이그레이션 완료');
  console.log('═'.repeat(50));
  console.log(`✅ 성공: ${results.success}건`);
  console.log(`❌ 실패: ${results.failed}건`);

  // 결과 확인
  console.log('\n📊 Supabase 데이터 확인...');
  const { data: auctions, error } = await supabase
    .from('auctions')
    .select('id, case_number, address, images, status')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.log('❌ 조회 실패:', error.message);
  } else {
    console.log(`\n총 ${auctions.length}개 물건 조회됨:\n`);
    auctions.forEach((a, i) => {
      const imgCount = a.images?.length || 0;
      console.log(`${i+1}. ${a.case_number}`);
      console.log(`   ${a.address?.substring(0, 40)}...`);
      console.log(`   이미지: ${imgCount}개, 상태: ${a.status}`);
    });
  }
}

main().catch(console.error);
