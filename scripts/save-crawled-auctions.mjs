/**
 * 크롤링한 대법원 경매 데이터를 Supabase에 저장
 *
 * 사용법: node scripts/save-crawled-auctions.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 사건번호에서 연도 추출
function extractYear(caseNumber) {
  const match = caseNumber.match(/(\d{4})타경/);
  return match ? parseInt(match[1], 10) : 2024;
}

// 주소에서 시도/시군구 추출
function parseAddress(address) {
  const parts = address.split(' ');
  return {
    sido: parts[0] || null,
    sigungu: parts[1] || null,
    dong: parts[2] || null
  };
}

// 크롤링된 실제 대법원 경매 데이터 (2024-12-18 기준)
const crawledAuctions = [
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2024타경4569',
    case_year: 2024,
    item_number: 1,
    property_type: '다세대',
    address: '서울특별시 관악구 조원중앙로 16, 4층405호 (신림동,모던하우스)',
    sido: '서울특별시',
    sigungu: '관악구',
    dong: '신림동',
    exclusive_area: 29.97,
    appraisal_price: 363000000,
    minimum_price: 290400000,
    deposit_amount: 29040000,
    bid_count: 1,
    case_receipt_date: '2024-09-03',
    auction_start_date: '2024-09-13',
    dividend_end_date: '2024-11-29',
    sale_date: '2025-12-18T10:00:00',
    sale_place: '경매법정(제4별관211호)',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    claim_amount: 320000000,
    note: '철근콘크리트구조 집합건물. 다세대주택으로 이용중. 지하철 구로디지털단지역 인근.'
  },
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2022타경3289',
    case_year: 2022,
    item_number: 1,
    property_type: '다세대',
    address: '서울특별시 관악구 국회단지10길 7 지1층비03호 (봉천동,선경하이츠)',
    sido: '서울특별시',
    sigungu: '관악구',
    dong: '봉천동',
    exclusive_area: 23.7,
    appraisal_price: 122000000,
    minimum_price: 4293000,
    deposit_amount: 858600,
    bid_count: 15,
    sale_date: '2025-12-23T10:00:00',
    sale_place: '경매법정',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    note: '공부상 사무소이나 현황은 주거용으로 사용중. 특별매각조건: 매수신청보증금 최저매각가격의 20%. 유찰 15회.'
  },
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2022타경104243',
    case_year: 2022,
    item_number: 5,
    property_type: '다세대',
    address: '서울특별시 관악구 남현12길 26 2층202호 (남현동,남현푸른채)',
    sido: '서울특별시',
    sigungu: '관악구',
    dong: '남현동',
    exclusive_area: 56.6,
    appraisal_price: 415000000,
    minimum_price: 169984000,
    deposit_amount: 16998400,
    bid_count: 4,
    sale_date: '2025-12-23T10:00:00',
    sale_place: '경매법정',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    note: '유찰 4회'
  },
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2022타경107433',
    case_year: 2022,
    item_number: 1,
    property_type: '아파트',
    address: '서울특별시 관악구 승방길 27 에이동 6층602호 (남현동,한울아파트)',
    sido: '서울특별시',
    sigungu: '관악구',
    dong: '남현동',
    exclusive_area: 21.62,
    appraisal_price: 257000000,
    minimum_price: 131584000,
    deposit_amount: 13158400,
    bid_count: 3,
    sale_date: '2025-12-18T10:00:00',
    sale_place: '경매법정',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    note: '제시외 건물 포함. 유찰 3회. 중복사건: 2024타경104889'
  },
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2023타경114858',
    case_year: 2023,
    item_number: 1,
    property_type: '다세대',
    address: '서울특별시 관악구 당곡6나길 27 103동 5층501호 (봉천동,태경9차)',
    sido: '서울특별시',
    sigungu: '관악구',
    dong: '봉천동',
    exclusive_area: 57.18,
    appraisal_price: 438600000,
    minimum_price: 19290000,
    deposit_amount: 1929000,
    bid_count: 14,
    sale_date: '2025-12-18T10:00:00',
    sale_place: '경매법정',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    note: '제시외 건물 포함. 유찰 14회'
  },
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2024타경1485',
    case_year: 2024,
    item_number: 1,
    property_type: '단독주택',
    address: '서울특별시 관악구 봉천동 1534-36 (장군봉13길 9)',
    sido: '서울특별시',
    sigungu: '관악구',
    dong: '봉천동',
    land_area: 116.3,
    building_area: 241.7,
    appraisal_price: 1545941840,
    minimum_price: 989404000,
    deposit_amount: 98940400,
    bid_count: 2,
    sale_date: '2025-12-18T10:00:00',
    sale_place: '경매법정',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    note: '일괄매각. 제시외 건물 포함. 유찰 2회. 토지: 대 116.3㎡, 건물: 철근콘크리트구조 3층 단독주택'
  },
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2024타경2105',
    case_year: 2024,
    item_number: 1,
    property_type: '근린시설',
    address: '서울특별시 종로구 종로 183 지2층에스에프지2009호 (인의동,효성주얼리시티)',
    sido: '서울특별시',
    sigungu: '종로구',
    dong: '인의동',
    exclusive_area: 29.54,
    appraisal_price: 293000000,
    minimum_price: 39326000,
    deposit_amount: 3932600,
    bid_count: 9,
    sale_date: '2025-12-18T10:00:00',
    sale_place: '경매법정',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    note: '유찰 9회'
  },
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2024타경2563',
    case_year: 2024,
    item_number: 1,
    property_type: '근린시설',
    address: '서울특별시 중구 다산로 293 지2층비-3호 (신당동,디오트)',
    sido: '서울특별시',
    sigungu: '중구',
    dong: '신당동',
    exclusive_area: 7.413,
    appraisal_price: 161000000,
    minimum_price: 21608000,
    deposit_amount: 4321600,
    bid_count: 9,
    sale_date: '2025-12-23T10:00:00',
    sale_place: '경매법정',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    note: '특별매각조건: 매수신청보증금 최저매각가격의 20%. 유찰 9회'
  },
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2024타경2563',
    case_year: 2024,
    item_number: 2,
    property_type: '근린시설',
    address: '서울특별시 중구 다산로 293 지2층엔-17호 (신당동,디오트)',
    sido: '서울특별시',
    sigungu: '중구',
    dong: '신당동',
    exclusive_area: 5.643,
    appraisal_price: 135000000,
    minimum_price: 18118000,
    deposit_amount: 3623600,
    bid_count: 9,
    sale_date: '2025-12-23T10:00:00',
    sale_place: '경매법정',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    note: '특별매각조건: 매수신청보증금 최저매각가격의 20%. 유찰 9회'
  }
];

// 스케줄 데이터
const scheduleData = {
  '2024타경4569-1': [
    { date: '2025-11-20T10:00:00', type: '매각기일', place: '경매법정(제4별관211호)', price: 363000000, result: '유찰' },
    { date: '2025-12-18T10:00:00', type: '매각기일', place: '경매법정(제4별관211호)', price: 290400000, result: null },
    { date: '2025-12-24T14:00:00', type: '매각결정기일', place: '배당법정(제4별관 3층 7호)', price: null, result: null }
  ]
};

async function clearTestData() {
  console.log('기존 테스트 데이터 삭제 중...');

  const { error } = await supabase
    .from('auctions')
    .delete()
    .or('case_number.like.%99999%,case_number.like.%12345%,case_number.like.%54321%');

  if (error) {
    console.error('테스트 데이터 삭제 실패:', error);
  } else {
    console.log('테스트 데이터 삭제 완료');
  }
}

async function saveAuction(auction) {
  console.log(`저장 중: ${auction.case_number} (물건${auction.item_number})`);

  // 기존 데이터 확인 (court_code, case_number, item_number로 유니크)
  const { data: existing } = await supabase
    .from('auctions')
    .select('id')
    .eq('court_code', auction.court_code)
    .eq('case_number', auction.case_number)
    .eq('item_number', auction.item_number)
    .single();

  if (existing) {
    // 업데이트
    const { error } = await supabase
      .from('auctions')
      .update({
        ...auction,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (error) {
      console.error(`업데이트 실패 (${auction.case_number}):`, error.message);
      return null;
    }
    console.log(`업데이트 완료: ${auction.case_number}`);
    return existing.id;
  } else {
    // 삽입
    const { data, error } = await supabase
      .from('auctions')
      .insert({
        ...auction,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        crawled_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error(`삽입 실패 (${auction.case_number}):`, error.message);
      return null;
    }
    console.log(`삽입 완료: ${auction.case_number}`);
    return data?.id;
  }
}

async function saveSchedules(auctionId, caseKey) {
  const schedules = scheduleData[caseKey];
  if (!schedules || !auctionId) return;

  console.log(`스케줄 저장 중: ${caseKey}`);

  // 기존 스케줄 삭제
  await supabase
    .from('auction_schedules')
    .delete()
    .eq('auction_id', auctionId);

  // 새 스케줄 삽입
  const schedulesToInsert = schedules.map((s) => ({
    auction_id: auctionId,
    schedule_date: s.date,
    schedule_type: s.type,
    schedule_place: s.place,
    minimum_price: s.price,
    result: s.result
  }));

  const { error } = await supabase
    .from('auction_schedules')
    .insert(schedulesToInsert);

  if (error) {
    console.error(`스케줄 저장 실패 (${caseKey}):`, error.message);
  } else {
    console.log(`스케줄 저장 완료: ${caseKey}`);
  }
}

async function main() {
  console.log('\n========================================');
  console.log('대법원 경매 데이터 Supabase 저장 시작');
  console.log('========================================\n');

  // 1. 테스트 데이터 삭제
  await clearTestData();

  // 2. 실제 데이터 저장
  console.log(`\n총 ${crawledAuctions.length}건의 경매 데이터 저장 시작...\n`);

  let successCount = 0;
  for (const auction of crawledAuctions) {
    const auctionId = await saveAuction(auction);
    if (auctionId) {
      successCount++;

      // 스케줄 저장
      const caseKey = `${auction.case_number}-${auction.item_number}`;
      if (scheduleData[caseKey]) {
        await saveSchedules(auctionId, caseKey);
      }
    }
  }

  // 3. 결과 확인
  const { data, count } = await supabase
    .from('auctions')
    .select('*', { count: 'exact' });

  console.log('\n========================================');
  console.log(`저장 완료! ${successCount}/${crawledAuctions.length}건 성공`);
  console.log(`총 ${count || data?.length || 0}건의 경매 데이터`);
  console.log('========================================\n');

  // 저장된 데이터 일부 표시
  if (data && data.length > 0) {
    console.log('저장된 데이터 샘플:');
    data.slice(0, 3).forEach(a => {
      console.log(`- ${a.case_number}: ${a.address.substring(0, 30)}... (${a.minimum_price?.toLocaleString()}원)`);
    });
  }
}

main().catch(console.error);
