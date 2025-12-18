-- =====================================================
-- 테스트 데이터: 수원지방법원 2024타경85191
-- 실행: Supabase Dashboard > SQL Editor에서 실행
-- =====================================================

-- 1. 경매 물건 기본 정보 삽입
INSERT INTO auctions (
  court_code,
  court_name,
  case_number,
  case_year,
  item_number,
  property_type,
  address,
  address_road,
  sido,
  sigungu,
  dong,
  land_area,
  building_area,
  exclusive_area,
  appraisal_price,
  minimum_price,
  deposit_amount,
  bid_count,
  case_receipt_date,
  auction_start_date,
  dividend_end_date,
  sale_date,
  sale_place,
  status,
  bid_method,
  claim_amount,
  note,
  images,
  source_url
) VALUES (
  '000510',                                          -- 수원지방법원 코드
  '수원지방법원',
  '2024타경85191',
  2024,
  1,
  '아파트',
  '경기도 용인시 수지구 성복2로 126, 312동 1층104호 (성복동,성동마을엘지빌리지3차)',
  '경기도 용인시 수지구 성복2로 126',
  '경기',
  '용인시 수지구',
  '성복동',
  NULL,                                              -- 토지면적 (아파트는 대지권)
  NULL,                                              -- 건물면적
  84.99,                                             -- 전용면적 (추정 - 실제 확인 필요)
  965000000,                                         -- 감정가 9억6,500만원
  675500000,                                         -- 최저가 6억7,550만원 (70%)
  67550000,                                          -- 보증금 6,755만원
  1,                                                 -- 유찰횟수
  '2024-08-20',                                      -- 접수일
  '2024-08-21',                                      -- 개시결정일
  '2024-11-04',                                      -- 배당요구종기
  '2026-01-07 10:00:00',                             -- 매각기일
  '수원지방법원 경매5계',                              -- 매각장소
  'ACTIVE',                                          -- 진행중
  '기일입찰',                                         -- 입찰방법
  720000000,                                         -- 청구금액 7억2,000만원
  NULL,                                              -- 비고
  '[]',                                              -- 이미지 (추후 추가)
  'https://www.courtauction.go.kr'                   -- 원본 URL
)
ON CONFLICT (court_code, case_number, item_number)
DO UPDATE SET
  minimum_price = EXCLUDED.minimum_price,
  bid_count = EXCLUDED.bid_count,
  sale_date = EXCLUDED.sale_date,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 2. 기일 내역 삽입 (유찰 기록)
INSERT INTO auction_schedules (
  auction_id,
  schedule_date,
  schedule_type,
  schedule_place,
  minimum_price,
  result,
  sold_price
)
SELECT
  id,
  '2025-11-28 10:00:00',                            -- 유찰일
  '매각기일',
  '수원지방법원 경매5계',
  772200000,                                         -- 1차 최저가 (80%) 추정
  '유찰',
  NULL
FROM auctions
WHERE case_number = '2024타경85191' AND court_code = '000510';

-- 3. 다음 매각기일 예정 삽입
INSERT INTO auction_schedules (
  auction_id,
  schedule_date,
  schedule_type,
  schedule_place,
  minimum_price,
  result,
  sold_price
)
SELECT
  id,
  '2026-01-07 10:00:00',                            -- 다음 기일
  '매각기일',
  '수원지방법원 경매5계',
  675500000,                                         -- 2차 최저가 (70%)
  NULL,                                              -- 미정
  NULL
FROM auctions
WHERE case_number = '2024타경85191' AND court_code = '000510';

-- =====================================================
-- 확인 쿼리
-- =====================================================

-- 삽입된 경매 물건 확인
SELECT
  id,
  court_name,
  case_number,
  property_type,
  address,
  appraisal_price,
  minimum_price,
  bid_count,
  status,
  sale_date
FROM auctions
WHERE case_number = '2024타경85191';

-- 기일 내역 확인
SELECT
  s.schedule_date,
  s.schedule_type,
  s.minimum_price,
  s.result
FROM auction_schedules s
JOIN auctions a ON s.auction_id = a.id
WHERE a.case_number = '2024타경85191'
ORDER BY s.schedule_date;
