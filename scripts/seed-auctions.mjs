/**
 * 경매 데이터 Supabase 시딩 스크립트
 * 실행: node scripts/seed-auctions.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwbozwggvlvqnqylunin.supabase.co'
const serviceRoleKey = 'sb_secret_HtYGngWKRRnN2aFnnFixyg_lqlZRupz'

// service_role 권한으로 클라이언트 생성 (쓰기 가능)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 테스트 경매 데이터
const auctionData = [
  {
    court_code: '000510',
    court_name: '수원지방법원',
    case_number: '2024타경85191',
    case_year: 2024,
    item_number: 1,
    property_type: '아파트',
    address: '경기도 용인시 수지구 성복2로 126, 312동 1층104호 (성복동,성동마을엘지빌리지3차)',
    address_road: '경기도 용인시 수지구 성복2로 126',
    sido: '경기',
    sigungu: '용인시 수지구',
    dong: '성복동',
    exclusive_area: 84.99,
    appraisal_price: 965000000,
    minimum_price: 675500000,
    deposit_amount: 67550000,
    bid_count: 1,
    case_receipt_date: '2024-08-20',
    auction_start_date: '2024-08-21',
    dividend_end_date: '2024-11-04',
    sale_date: '2026-01-07T10:00:00',
    sale_place: '수원지방법원 경매5계',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    claim_amount: 720000000,
    source_url: 'https://www.courtauction.go.kr'
  },
  // 추가 테스트 데이터 - 서울 아파트
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2024타경12345',
    case_year: 2024,
    item_number: 1,
    property_type: '아파트',
    address: '서울특별시 강남구 테헤란로 123, 456동 7층801호',
    address_road: '서울특별시 강남구 테헤란로 123',
    sido: '서울',
    sigungu: '강남구',
    dong: '역삼동',
    exclusive_area: 59.76,
    appraisal_price: 1250000000,
    minimum_price: 875000000,
    deposit_amount: 87500000,
    bid_count: 2,
    case_receipt_date: '2024-06-15',
    auction_start_date: '2024-06-20',
    dividend_end_date: '2024-09-15',
    sale_date: '2025-12-20T10:00:00',
    sale_place: '서울중앙지방법원 경매3계',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    claim_amount: 980000000,
    source_url: 'https://www.courtauction.go.kr'
  },
  // 추가 테스트 데이터 - 다세대
  {
    court_code: '000410',
    court_name: '인천지방법원',
    case_number: '2024타경54321',
    case_year: 2024,
    item_number: 1,
    property_type: '다세대',
    address: '인천광역시 부평구 부평대로 200, 3층301호',
    address_road: '인천광역시 부평구 부평대로 200',
    sido: '인천',
    sigungu: '부평구',
    dong: '부평동',
    exclusive_area: 45.32,
    appraisal_price: 280000000,
    minimum_price: 196000000,
    deposit_amount: 19600000,
    bid_count: 0,
    case_receipt_date: '2024-10-01',
    auction_start_date: '2024-10-05',
    dividend_end_date: '2025-01-05',
    sale_date: '2025-12-25T14:00:00',
    sale_place: '인천지방법원 경매2계',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    claim_amount: 220000000,
    source_url: 'https://www.courtauction.go.kr'
  },
  // 추가 테스트 데이터 - 토지
  {
    court_code: '000510',
    court_name: '수원지방법원',
    case_number: '2024타경77777',
    case_year: 2024,
    item_number: 1,
    property_type: '토지',
    address: '경기도 화성시 동탄면 신리 산123-4',
    sido: '경기',
    sigungu: '화성시',
    dong: '동탄면',
    land_area: 1500.00,
    appraisal_price: 450000000,
    minimum_price: 315000000,
    deposit_amount: 31500000,
    bid_count: 1,
    case_receipt_date: '2024-07-10',
    auction_start_date: '2024-07-15',
    dividend_end_date: '2024-10-10',
    sale_date: '2026-01-15T10:00:00',
    sale_place: '수원지방법원 경매4계',
    status: 'ACTIVE',
    bid_method: '기일입찰',
    claim_amount: 380000000,
    source_url: 'https://www.courtauction.go.kr'
  },
  // 매각된 물건
  {
    court_code: '000210',
    court_name: '서울중앙지방법원',
    case_number: '2023타경99999',
    case_year: 2023,
    item_number: 1,
    property_type: '아파트',
    address: '서울특별시 서초구 반포대로 50, 101동 15층1502호',
    address_road: '서울특별시 서초구 반포대로 50',
    sido: '서울',
    sigungu: '서초구',
    dong: '반포동',
    exclusive_area: 114.52,
    appraisal_price: 2800000000,
    minimum_price: 2240000000,
    deposit_amount: 224000000,
    bid_count: 3,
    case_receipt_date: '2023-03-20',
    auction_start_date: '2023-03-25',
    dividend_end_date: '2023-06-20',
    sale_date: '2024-11-15T10:00:00',
    sale_place: '서울중앙지방법원 경매1계',
    status: 'SOLD',
    bid_method: '기일입찰',
    claim_amount: 2100000000,
    source_url: 'https://www.courtauction.go.kr'
  }
]

// 기일 내역 데이터
const scheduleData = [
  // 2024타경85191 기일 내역
  { case_number: '2024타경85191', schedule_date: '2025-11-28T10:00:00', schedule_type: '매각기일', minimum_price: 772200000, result: '유찰' },
  { case_number: '2024타경85191', schedule_date: '2026-01-07T10:00:00', schedule_type: '매각기일', minimum_price: 675500000, result: null },

  // 2024타경12345 기일 내역
  { case_number: '2024타경12345', schedule_date: '2025-10-15T10:00:00', schedule_type: '매각기일', minimum_price: 1000000000, result: '유찰' },
  { case_number: '2024타경12345', schedule_date: '2025-11-20T10:00:00', schedule_type: '매각기일', minimum_price: 875000000, result: '유찰' },
  { case_number: '2024타경12345', schedule_date: '2025-12-20T10:00:00', schedule_type: '매각기일', minimum_price: 875000000, result: null },

  // 2023타경99999 기일 내역 (매각됨)
  { case_number: '2023타경99999', schedule_date: '2024-08-10T10:00:00', schedule_type: '매각기일', minimum_price: 2800000000, result: '유찰' },
  { case_number: '2023타경99999', schedule_date: '2024-09-15T10:00:00', schedule_type: '매각기일', minimum_price: 2520000000, result: '유찰' },
  { case_number: '2023타경99999', schedule_date: '2024-10-20T10:00:00', schedule_type: '매각기일', minimum_price: 2240000000, result: '유찰' },
  { case_number: '2023타경99999', schedule_date: '2024-11-15T10:00:00', schedule_type: '매각기일', minimum_price: 2240000000, result: '매각', sold_price: 2350000000 }
]

async function seedAuctions() {
  console.log('🚀 경매 데이터 시딩 시작...\n')

  // 1. 경매 물건 삽입
  console.log('📦 경매 물건 삽입 중...')

  for (const auction of auctionData) {
    const { data, error } = await supabase
      .from('auctions')
      .upsert(auction, {
        onConflict: 'court_code,case_number,item_number',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.log(`   ❌ ${auction.case_number}: ${error.message}`)
    } else {
      console.log(`   ✅ ${auction.case_number} - ${auction.property_type} (${auction.court_name})`)
    }
  }

  // 2. 기일 내역 삽입
  console.log('\n📅 기일 내역 삽입 중...')

  for (const schedule of scheduleData) {
    // 먼저 auction_id 조회
    const { data: auction } = await supabase
      .from('auctions')
      .select('id')
      .eq('case_number', schedule.case_number)
      .single()

    if (!auction) {
      console.log(`   ⚠️ ${schedule.case_number} 물건 없음, 기일 스킵`)
      continue
    }

    const { error } = await supabase
      .from('auction_schedules')
      .insert({
        auction_id: auction.id,
        schedule_date: schedule.schedule_date,
        schedule_type: schedule.schedule_type,
        minimum_price: schedule.minimum_price,
        result: schedule.result,
        sold_price: schedule.sold_price || null
      })

    if (error) {
      // 중복 무시
      if (!error.message.includes('duplicate')) {
        console.log(`   ❌ ${schedule.case_number} ${schedule.schedule_date}: ${error.message}`)
      }
    } else {
      console.log(`   ✅ ${schedule.case_number} - ${schedule.schedule_date.split('T')[0]} (${schedule.result || '예정'})`)
    }
  }

  // 3. 결과 확인
  console.log('\n📊 시딩 결과 확인...')

  const { data: auctions, error: auctionsError } = await supabase
    .from('auctions')
    .select('case_number, court_name, property_type, status')

  const { data: schedules, error: schedulesError } = await supabase
    .from('auction_schedules')
    .select('id')

  console.log(`   - 총 경매 물건: ${auctions?.length || 0}건`)
  console.log(`   - 총 기일 내역: ${schedules?.length || 0}건`)

  console.log('\n✨ 시딩 완료!')
}

seedAuctions().catch(console.error)
