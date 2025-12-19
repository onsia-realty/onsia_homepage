/**
 * 2024타경1485 경매 데이터 정확한 정보로 업데이트
 *
 * 크롤링한 실제 대법원 데이터 기반
 * - 당사자 정보 추가
 * - 위반건축물 정보 추가
 * - 기일내역 정확하게 수정
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateAuction1485() {
  console.log('========================================');
  console.log('2024타경1485 데이터 업데이트 시작');
  console.log('========================================\n');

  // 1. 기존 데이터 조회
  const { data: existing, error: fetchError } = await supabase
    .from('auctions')
    .select('*')
    .eq('case_number', '2024타경1485')
    .single();

  if (fetchError) {
    console.error('기존 데이터 조회 실패:', fetchError);
    return;
  }

  console.log('기존 데이터 ID:', existing.id);
  console.log('기존 최저가:', existing.minimum_price?.toLocaleString());
  console.log('기존 유찰횟수:', existing.bid_count);

  // 2. 정확한 데이터로 업데이트
  const updatedData = {
    // 기본 정보 (정확하게 업데이트)
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2024타경1485',
    case_year: 2024,
    item_number: 1,
    property_type: '단독주택',

    // 주소 정보
    address: '서울특별시 관악구 봉천동 1534-36',
    address_road: '서울특별시 관악구 장군봉13길 9',  // 스키마에 맞게 수정
    sido: '서울특별시',
    sigungu: '관악구',
    dong: '봉천동',

    // 면적 정보
    land_area: 116.3,  // 토지: 대 116.3㎡
    building_area: 241.9,  // 건물: 지1(64.68) + 1층(64.68) + 2층(64.68) + 3층(47.86) = 241.9㎡

    // 가격 정보
    appraisal_price: 1545941840,  // 감정평가액
    minimum_price: 989404000,  // 현재 최저매각가격 (3차)
    deposit_amount: 98940400,  // 매수신청보증금
    claim_amount: 322619360,  // 청구금액

    // 사건 진행 정보
    bid_count: 3,  // 현재 3차 매각기일 (2회 유찰 후)
    case_receipt_date: '2024-03-12',  // 사건접수일
    auction_start_date: '2024-04-01',  // 경매개시일
    dividend_end_date: '2024-07-01',  // 배당요구종기일

    // 다음 매각기일
    sale_date: '2025-12-18T10:00:00',
    sale_place: '경매법정(제4별관211호)',

    // 상태
    status: 'ACTIVE',
    bid_method: '기일입찰',

    // 위반건축물 + 비고 + 당사자 정보 (note 필드에 통합)
    note: `일괄매각. 제시외 건물 포함 (조립식패널조 3층 약 14㎡).

【당사자 정보】
- 채무자겸소유자: 백OO
- 채권자: 안OOOOOOOOO OOO OOOOOOOO
- 승계인: 한OOOOOOO
- 근저당권자: 안OOOOOOOO
- 가압류권자: 최OO, 서OO, 유OO, 하OO (4명)
- 압류권자: 기OOOO
- 교부권자: 관OOOO, 기OOOO, 서OOOO OOO
- 배당요구권자: 송OO
- 임차인: 김OO, 이OO, 윤OO, 권OO 등 다수

【위반건축물】주택과-38862(2019.10.15.)호에 의거 위반건축물 표기
- 내역: 3층 14㎡ 조립식패널조 단독주택
- 원상회복의무 및 이행강제금 부과 가능성 있음

【건물 구조】철근콘크리트구조 3층 단독주택(다중주택)
- 지하1층: 64.68㎡, 1층: 64.68㎡, 2층: 64.68㎡, 3층: 47.86㎡
- 옥탑1층: 8.52㎡(연면적 제외)`,

    // 업데이트 시간
    updated_at: new Date().toISOString(),
    crawled_at: new Date().toISOString()
  };

  const { error: updateError } = await supabase
    .from('auctions')
    .update(updatedData)
    .eq('id', existing.id);

  if (updateError) {
    console.error('업데이트 실패:', updateError);
    return;
  }

  console.log('\n✅ 경매 데이터 업데이트 완료!');

  // 3. 기일내역(스케줄) 업데이트
  console.log('\n기일내역 업데이트 중...');

  // 기존 스케줄 삭제
  await supabase
    .from('auction_schedules')
    .delete()
    .eq('auction_id', existing.id);

  // 정확한 기일내역 삽입
  const schedules = [
    {
      auction_id: existing.id,
      schedule_date: '2025-02-06T10:00:00',
      schedule_type: '매각기일',
      schedule_place: '경매법정(제4별관211호)',
      minimum_price: 1545941840,
      result: '유찰'
    },
    {
      auction_id: existing.id,
      schedule_date: '2025-11-20T10:00:00',
      schedule_type: '매각기일',
      schedule_place: '경매법정(제4별관211호)',
      minimum_price: 1236754000,
      result: '유찰'
    },
    {
      auction_id: existing.id,
      schedule_date: '2025-12-18T10:00:00',
      schedule_type: '매각기일',
      schedule_place: '경매법정(제4별관211호)',
      minimum_price: 989404000,
      result: null  // 예정
    },
    {
      auction_id: existing.id,
      schedule_date: '2025-12-24T14:00:00',
      schedule_type: '매각결정기일',
      schedule_place: '배당법정(제4별관 3층 7호)',
      minimum_price: null,
      result: null  // 예정
    }
  ];

  const { error: scheduleError } = await supabase
    .from('auction_schedules')
    .insert(schedules);

  if (scheduleError) {
    console.error('스케줄 저장 실패:', scheduleError);
  } else {
    console.log('✅ 기일내역 저장 완료! (4건)');
  }

  // 4. 업데이트된 데이터 확인
  const { data: updated } = await supabase
    .from('auctions')
    .select('*')
    .eq('id', existing.id)
    .single();

  console.log('\n========================================');
  console.log('업데이트된 데이터 확인');
  console.log('========================================');
  console.log('사건번호:', updated.case_number);
  console.log('주소:', updated.address);
  console.log('도로명:', updated.road_address);
  console.log('감정평가액:', updated.appraisal_price?.toLocaleString(), '원');
  console.log('최저매각가:', updated.minimum_price?.toLocaleString(), '원');
  console.log('매각기일:', updated.sale_date);
  console.log('유찰횟수(현재 차수):', updated.bid_count, '차');
  console.log('채무자:', updated.debtor);
  console.log('채권자:', updated.creditor);
  console.log('\n비고(위반건축물 포함):');
  console.log(updated.note?.substring(0, 200) + '...');
}

updateAuction1485().catch(console.error);
