/**
 * 마이옥션에서 크롤링한 데이터로 Supabase 업데이트
 *
 * 사용법: node scripts/update-from-myauction.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 2024타경1485 크롤링 데이터 (마이옥션에서 추출)
const auction1485Data = {
  case_number: '2024타경1485',
  court_code: '000210',
  court_name: '서울중앙지방법원',
  case_year: 2024,
  item_number: 1,
  property_type: '주택',

  // 주소 정보
  address: '서울특별시 관악구 봉천동 1534-36',
  address_road: '서울특별시 관악구 장군봉13길 9',
  sido: '서울특별시',
  sigungu: '관악구',
  dong: '봉천동',

  // 면적 정보
  land_area: 116.3,  // 토지 35.18평
  building_area: 250.42,  // 건물 75.75평

  // 가격 정보
  appraisal_price: 1545941840,  // 감정가
  minimum_price: 989404000,  // 최저매각가 (64%)
  deposit_amount: 98940400,  // 입찰보증금 (10%)
  claim_amount: 322619360,  // 청구금액

  // 사건 진행 정보
  bid_count: 4,  // 현재 4차 (3회 유찰 후)
  case_receipt_date: '2024-03-12',
  auction_start_date: '2024-04-01',
  dividend_end_date: '2024-07-01',

  // 다음 매각기일
  sale_date: '2025-12-18T10:00:00',
  sale_place: '서울중앙지방법원 경매법정',

  // 상태
  status: 'ACTIVE',
  bid_method: '기일입찰',

  // 상세 정보 (note 필드에 통합)
  note: `일괄매각. 제시외 건물 포함 (조립식패널조 3층 약 14㎡).

【당사자 정보】
- 소유자/채무자: 백재일
- 채권자: 안양동부새마을금고 (청구금액: 322,619,360원)
- 근저당권자: 한국자산관리공사 (411,190,000원 + 229,580,000원)
- 가압류권자: 최영은(119,500,000원), 서한석(294,000,000원), 유영민(350,000,000원), 하지우(120,000,000원)
- 압류권자: 국(기흥세무서장)

【임차인 현황】 총 10명
- 권건우(301호): 보증금 94,000,000원 (소액임차인)
- 김광명(201호): 보증금 120,000,000원
- 김상수(302호): 보증금 102,000,000원
- 김예지(203호): 보증금 70,000,000원 (소액임차인)
- 김수현(401호): 보증금 80,000,000원 (소액임차인)
- 윤성준(303호): 보증금 100,000,000원 (소액임차인)
- 이윤아(202호): 보증금 99,000,000원 (소액임차인)
- 김효범, 이용준, 이한솔 등

【위반건축물】
- 주택과-38862(2019.10.15.)호에 의거 위반건축물 표기
- 내역: 3층 14㎡ 조립식패널조 단독주택
- 원상회복의무 및 이행강제금 부과 가능성 있음

【건물 구조】
- 철근콘크리트구조 3층 단독주택(다중주택)
- 지하1층: 64.68㎡, 1층: 64.68㎡, 2층: 64.68㎡, 3층: 47.86㎡
- 옥탑1층: 8.52㎡(연면적 제외)
- 사용승인일: 2017.05.31

【교통】
- 봉천역 2호선 (375m)
- 서원역 신림선 (587m)
- 신림역 2호선 (1,011m)

【토지이용계획】
대공방어협조구역, 도시지역, 과밀억제권역, 중점경관관리구역, 제2종일반주거지역, 토지거래계약에관한허가구역, 상대보호구역`,

  // 업데이트 시간
  updated_at: new Date().toISOString(),
  crawled_at: new Date().toISOString()
};

// 이미지 데이터
const auction1485Images = [
  'https://photo.nuriauction.com/admin/data/2024/000210/1002/20240130001485/pic_courtauction_0.jpg',
  'https://photo.nuriauction.com/admin/data/2024/000210/1002/20240130001485/pic_courtauction_1.jpg',
  'https://photo.nuriauction.com/admin/data/2024/000210/1002/20240130001485/pic_courtauction_2.jpg'
];

// 기일내역 데이터
const auction1485Schedules = [
  {
    schedule_date: '2025-02-06T10:00:00',
    schedule_type: '매각기일',
    schedule_place: '서울중앙지방법원 경매법정',
    minimum_price: 1545941840,
    result: '유찰'
  },
  {
    schedule_date: '2025-03-13T10:00:00',
    schedule_type: '매각기일',
    schedule_place: '서울중앙지방법원 경매법정',
    minimum_price: 1236753000,
    result: '변경'
  },
  {
    schedule_date: '2025-11-20T10:00:00',
    schedule_type: '매각기일',
    schedule_place: '서울중앙지방법원 경매법정',
    minimum_price: 1236754000,
    result: '유찰'
  },
  {
    schedule_date: '2025-12-18T10:00:00',
    schedule_type: '매각기일',
    schedule_place: '서울중앙지방법원 경매법정',
    minimum_price: 989404000,
    result: null  // 진행중
  }
];

async function updateAuction1485() {
  console.log('========================================');
  console.log('2024타경1485 마이옥션 데이터로 업데이트');
  console.log('========================================\n');

  // 1. 기존 데이터 조회
  const { data: existing, error: fetchError } = await supabase
    .from('auctions')
    .select('id')
    .eq('case_number', '2024타경1485')
    .single();

  if (fetchError) {
    console.error('기존 데이터 조회 실패:', fetchError);
    return;
  }

  const auctionId = existing.id;
  console.log('기존 데이터 ID:', auctionId);

  // 2. 경매 데이터 업데이트
  const { error: updateError } = await supabase
    .from('auctions')
    .update(auction1485Data)
    .eq('id', auctionId);

  if (updateError) {
    console.error('경매 데이터 업데이트 실패:', updateError);
    return;
  }
  console.log('✅ 경매 데이터 업데이트 완료');

  // 3. 기존 스케줄 삭제 후 새 스케줄 삽입
  await supabase
    .from('auction_schedules')
    .delete()
    .eq('auction_id', auctionId);

  const schedulesToInsert = auction1485Schedules.map(s => ({
    auction_id: auctionId,
    ...s
  }));

  const { error: scheduleError } = await supabase
    .from('auction_schedules')
    .insert(schedulesToInsert);

  if (scheduleError) {
    console.error('스케줄 저장 실패:', scheduleError);
  } else {
    console.log('✅ 기일내역 저장 완료 (4건)');
  }

  // 4. 기존 이미지 삭제 후 새 이미지 삽입
  await supabase
    .from('auction_images')
    .delete()
    .eq('auction_id', auctionId);

  const imagesToInsert = auction1485Images.map((url, idx) => ({
    auction_id: auctionId,
    image_url: url,
    image_order: idx + 1
  }));

  const { error: imageError } = await supabase
    .from('auction_images')
    .insert(imagesToInsert);

  if (imageError) {
    console.error('이미지 저장 실패:', imageError);
  } else {
    console.log('✅ 이미지 저장 완료 (3건)');
  }

  // 5. 업데이트된 데이터 확인
  const { data: updated } = await supabase
    .from('auctions')
    .select('*')
    .eq('id', auctionId)
    .single();

  console.log('\n========================================');
  console.log('업데이트 완료 확인');
  console.log('========================================');
  console.log('사건번호:', updated.case_number);
  console.log('물건종류:', updated.property_type);
  console.log('주소:', updated.address);
  console.log('감정평가액:', updated.appraisal_price?.toLocaleString(), '원');
  console.log('최저매각가:', updated.minimum_price?.toLocaleString(), '원');
  console.log('매각기일:', updated.sale_date);
  console.log('현재 차수:', updated.bid_count, '차');
}

updateAuction1485().catch(console.error);
