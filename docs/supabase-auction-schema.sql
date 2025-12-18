-- =====================================================
-- ONSIA 경매 데이터 Supabase 스키마
-- 실행: Supabase Dashboard > SQL Editor에서 실행
-- =====================================================

-- 1. 경매 물건 기본 정보
CREATE TABLE IF NOT EXISTS auctions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 사건 정보
  court_code VARCHAR(10) NOT NULL,           -- 법원 코드 (예: 000210)
  court_name VARCHAR(50) NOT NULL,           -- 법원명 (예: 서울중앙지방법원)
  case_number VARCHAR(20) NOT NULL,          -- 사건번호 (예: 2022타경3289)
  case_year INT NOT NULL,                    -- 사건연도
  item_number INT DEFAULT 1,                 -- 물건번호

  -- 물건 정보
  property_type VARCHAR(50),                 -- 물건종류 (아파트, 다세대, 토지 등)
  address TEXT NOT NULL,                     -- 소재지
  address_road TEXT,                         -- 도로명주소
  sido VARCHAR(20),                          -- 시도
  sigungu VARCHAR(30),                       -- 시군구
  dong VARCHAR(30),                          -- 동/읍/면

  -- 면적 정보
  land_area DECIMAL(15,2),                   -- 토지면적 (㎡)
  building_area DECIMAL(15,2),               -- 건물면적 (㎡)
  exclusive_area DECIMAL(15,2),              -- 전용면적 (㎡)

  -- 가격 정보
  appraisal_price BIGINT,                    -- 감정가
  minimum_price BIGINT,                      -- 최저매각가격
  deposit_amount BIGINT,                     -- 매수신청보증금
  bid_count INT DEFAULT 0,                   -- 유찰횟수

  -- 날짜 정보
  case_receipt_date DATE,                    -- 사건접수일
  auction_start_date DATE,                   -- 경매개시일
  dividend_end_date DATE,                    -- 배당요구종기
  sale_date TIMESTAMP,                       -- 매각기일
  sale_place VARCHAR(100),                   -- 매각장소

  -- 상태 정보
  status VARCHAR(20) DEFAULT 'ACTIVE',       -- ACTIVE, SOLD, FAILED, CANCELED, POSTPONED
  bid_method VARCHAR(20),                    -- 입찰방법 (기일입찰, 기간입찰)

  -- 채권 정보
  claim_amount BIGINT,                       -- 청구금액

  -- 비고
  note TEXT,                                 -- 물건비고

  -- 이미지
  images JSONB DEFAULT '[]',                 -- 이미지 URL 배열

  -- 메타데이터
  source_url TEXT,                           -- 원본 URL
  crawled_at TIMESTAMP DEFAULT NOW(),        -- 크롤링 시간
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),

  -- 유니크 제약조건
  UNIQUE(court_code, case_number, item_number)
);

-- 2. 기일 내역
CREATE TABLE IF NOT EXISTS auction_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,

  schedule_date TIMESTAMP NOT NULL,          -- 기일
  schedule_type VARCHAR(30),                 -- 매각기일, 매각결정기일, 대금지급기한
  schedule_place VARCHAR(100),               -- 장소
  minimum_price BIGINT,                      -- 최저매각가격
  result VARCHAR(30),                        -- 유찰, 매각, 취하, 변경, 미납 등
  sold_price BIGINT,                         -- 매각가격 (매각된 경우)

  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. 경매 서류
CREATE TABLE IF NOT EXISTS auction_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,

  doc_type VARCHAR(20) NOT NULL,             -- APPRAISAL(감정평가서), SURVEY(현황조사서), SALE_STATEMENT(매각물건명세서)
  doc_url TEXT,                              -- PDF URL
  doc_content JSONB,                         -- 파싱된 내용 (JSON)

  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 권리분석 (등기 내역)
CREATE TABLE IF NOT EXISTS auction_rights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,

  register_type VARCHAR(10),                 -- 갑구, 을구
  register_no VARCHAR(20),                   -- 순위번호
  receipt_date DATE,                         -- 접수일
  purpose VARCHAR(100),                      -- 등기목적 (근저당권설정, 압류 등)
  right_holder VARCHAR(100),                 -- 권리자
  claim_amount BIGINT,                       -- 채권액
  is_reference BOOLEAN DEFAULT FALSE,        -- 말소기준등기 여부
  will_expire BOOLEAN DEFAULT TRUE,          -- 소멸 여부
  note TEXT,                                 -- 비고

  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. 권리분석 요약
CREATE TABLE IF NOT EXISTS auction_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,

  reference_date DATE,                       -- 말소기준일
  has_risk BOOLEAN DEFAULT FALSE,            -- 위험물건 여부
  risk_note TEXT,                            -- 위험 사유
  tenant_info JSONB,                         -- 임차인 정보
  total_claim BIGINT,                        -- 총 채권액
  expected_dividend BIGINT,                  -- 예상 배당금

  -- AI 분석 결과
  ai_analysis JSONB,                         -- AI 권리분석 결과
  investment_grade VARCHAR(10),              -- 투자등급 (A, B, C, D, F)
  risk_level VARCHAR(10),                    -- 위험도 (LOW, MEDIUM, HIGH)

  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(auction_id)
);

-- 6. 법원 코드 테이블
CREATE TABLE IF NOT EXISTS court_codes (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  region VARCHAR(20),                        -- 지역 (서울, 경기, 부산 등)
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_sale_date ON auctions(sale_date);
CREATE INDEX IF NOT EXISTS idx_auctions_court_code ON auctions(court_code);
CREATE INDEX IF NOT EXISTS idx_auctions_sido ON auctions(sido);
CREATE INDEX IF NOT EXISTS idx_auctions_property_type ON auctions(property_type);
CREATE INDEX IF NOT EXISTS idx_auctions_minimum_price ON auctions(minimum_price);
CREATE INDEX IF NOT EXISTS idx_auction_schedules_auction_id ON auction_schedules(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_rights_auction_id ON auction_rights(auction_id);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auctions_updated_at
  BEFORE UPDATE ON auctions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER auction_analysis_updated_at
  BEFORE UPDATE ON auction_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security) 설정
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_analysis ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (누구나 조회 가능)
CREATE POLICY "Allow public read access on auctions" ON auctions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on auction_schedules" ON auction_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public read access on auction_documents" ON auction_documents FOR SELECT USING (true);
CREATE POLICY "Allow public read access on auction_rights" ON auction_rights FOR SELECT USING (true);
CREATE POLICY "Allow public read access on auction_analysis" ON auction_analysis FOR SELECT USING (true);

-- 서비스 역할만 쓰기 가능 (크롤러용)
CREATE POLICY "Allow service role write on auctions" ON auctions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on auction_schedules" ON auction_schedules FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on auction_documents" ON auction_documents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on auction_rights" ON auction_rights FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on auction_analysis" ON auction_analysis FOR ALL USING (auth.role() = 'service_role');

-- 기본 법원 코드 삽입 (주요 법원만)
INSERT INTO court_codes (code, name, region) VALUES
  ('000210', '서울중앙지방법원', '서울'),
  ('000211', '서울동부지방법원', '서울'),
  ('000212', '서울서부지방법원', '서울'),
  ('000213', '서울남부지방법원', '서울'),
  ('000214', '서울북부지방법원', '서울'),
  ('000310', '의정부지방법원', '경기'),
  ('000410', '인천지방법원', '경기'),
  ('000510', '수원지방법원', '경기'),
  ('000610', '춘천지방법원', '강원'),
  ('000710', '대전지방법원', '충청'),
  ('000810', '청주지방법원', '충청'),
  ('000910', '대구지방법원', '경상'),
  ('001010', '부산지방법원', '경상'),
  ('001110', '울산지방법원', '경상'),
  ('001210', '창원지방법원', '경상'),
  ('001310', '광주지방법원', '전라'),
  ('001410', '전주지방법원', '전라'),
  ('001510', '제주지방법원', '제주')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 실행 완료 후 확인:
-- SELECT * FROM auctions LIMIT 5;
-- SELECT * FROM court_codes;
-- =====================================================
