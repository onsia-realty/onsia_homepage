-- ============================================
-- ONSIA Site Schema - 핵심 데이터 테이블
-- Target: onsia-crm Supabase (uwddeseqwdsryvuoulsm)
-- Schema: site
-- ============================================

-- ========== ENUM TYPES ==========

CREATE TYPE site.subscription_status AS ENUM ('UPCOMING', 'OPEN', 'CLOSED', 'ANNOUNCED', 'CONTRACTED', 'COMPLETED');
CREATE TYPE site.auction_item_type AS ENUM ('APARTMENT', 'VILLA', 'OFFICETEL', 'HOUSE', 'COMMERCIAL', 'LAND', 'FACTORY', 'BUILDING', 'OTHER');
CREATE TYPE site.auction_status AS ENUM ('SCHEDULED', 'BIDDING', 'SUCCESSFUL', 'FAILED', 'WITHDRAWN', 'CANCELED');
CREATE TYPE site.auction_bid_result AS ENUM ('FAILED', 'SUCCESSFUL', 'WITHDRAWN', 'POSTPONED');
CREATE TYPE site.auction_image_type AS ENUM ('PHOTO', 'SURVEY', 'APPRAISAL', 'REGISTER', 'OTHER');
CREATE TYPE site.crawler_auction_status AS ENUM ('ACTIVE', 'SOLD', 'FAILED', 'CANCELED', 'POSTPONED');

-- ========== 1. 청약 (Subscription) ==========

CREATE TABLE site.subscriptions (
  id TEXT PRIMARY KEY,
  house_manage_no TEXT UNIQUE NOT NULL,
  pblanc_no TEXT NOT NULL,
  house_name TEXT NOT NULL,
  house_type TEXT NOT NULL,
  house_detail_type TEXT NOT NULL,
  address TEXT NOT NULL,
  address_detail TEXT,
  zip_code TEXT,
  region TEXT NOT NULL,
  region_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  total_households INTEGER NOT NULL,
  recruit_date TIMESTAMPTZ,
  reception_start TIMESTAMPTZ,
  reception_end TIMESTAMPTZ,
  special_supply_date TIMESTAMPTZ,
  rank1_date TIMESTAMPTZ,
  rank2_date TIMESTAMPTZ,
  winner_announcement_date TIMESTAMPTZ,
  contract_start TIMESTAMPTZ,
  contract_end TIMESTAMPTZ,
  move_in_date TEXT,
  developer TEXT,
  contractor TEXT,
  model_house_phone TEXT,
  homepage TEXT,
  notice_url TEXT,
  avg_price INTEGER,
  avg_price_per_pyeong INTEGER,
  min_price INTEGER,
  max_price INTEGER,
  status site.subscription_status DEFAULT 'UPCOMING',
  is_hot BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  raw_data JSONB,
  asil_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sub_house_manage_no ON site.subscriptions (house_manage_no);
CREATE INDEX idx_sub_status ON site.subscriptions (status);
CREATE INDEX idx_sub_region ON site.subscriptions (region);
CREATE INDEX idx_sub_reception_start ON site.subscriptions (reception_start);

-- ========== 2. 청약 주택형 (SubscriptionHousingType) ==========

CREATE TABLE site.subscription_housing_types (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES site.subscriptions(id) ON DELETE CASCADE,
  house_ty TEXT NOT NULL,
  model_no TEXT,
  supply_area DOUBLE PRECISION NOT NULL,
  exclusive_area DOUBLE PRECISION,
  total_households INTEGER NOT NULL,
  general_households INTEGER NOT NULL,
  special_households INTEGER NOT NULL,
  top_price INTEGER,
  price_per_pyeong INTEGER,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscription_id, house_ty)
);

CREATE INDEX idx_sht_subscription ON site.subscription_housing_types (subscription_id);

-- ========== 3. 경매 물건 (AuctionItem from Neon) ==========

CREATE TABLE site.auction_items (
  id TEXT PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,
  case_number_full TEXT,
  court_code TEXT,
  court_name TEXT,
  pnu TEXT,
  address TEXT NOT NULL,
  address_detail TEXT,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  item_type site.auction_item_type NOT NULL,
  land_area DOUBLE PRECISION,
  building_area DOUBLE PRECISION,
  floor TEXT,
  appraisal_price BIGINT NOT NULL,
  minimum_price BIGINT NOT NULL,
  minimum_rate INTEGER,
  deposit BIGINT,
  sale_date TIMESTAMPTZ,
  sale_time TEXT,
  bid_count INTEGER DEFAULT 0,
  bid_end_date TIMESTAMPTZ,
  reference_date TIMESTAMPTZ,
  has_risk BOOLEAN DEFAULT FALSE,
  risk_note TEXT,
  owner TEXT,
  debtor TEXT,
  creditor TEXT,
  status site.auction_status DEFAULT 'SCHEDULED',
  featured BOOLEAN DEFAULT FALSE,
  real_price BIGINT,
  building_info TEXT,
  naver_complex_id TEXT,
  seo_title TEXT,
  seo_description TEXT,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  appraisal_date TIMESTAMPTZ,
  appraisal_org TEXT,
  approval_date TIMESTAMPTZ,
  building_appraisal_price BIGINT,
  building_structure TEXT,
  building_usage TEXT,
  facilities TEXT,
  heating_type TEXT,
  land_appraisal_price BIGINT,
  land_use_zone TEXT,
  location_note TEXT,
  nearby_facilities TEXT,
  preservation_date TIMESTAMPTZ,
  surroundings TEXT,
  total_floors TEXT,
  transportation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_status_sale ON site.auction_items (status, sale_date);
CREATE INDEX idx_ai_city_district ON site.auction_items (city, district);
CREATE INDEX idx_ai_item_type ON site.auction_items (item_type);
CREATE INDEX idx_ai_pnu ON site.auction_items (pnu);

-- ========== 4. 경매 입찰 (AuctionBid) ==========

CREATE TABLE site.auction_bids (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES site.auction_items(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  bid_date TIMESTAMPTZ,
  minimum_price BIGINT NOT NULL,
  result site.auction_bid_result NOT NULL,
  winning_price BIGINT,
  bidder_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ab_item_round ON site.auction_bids (item_id, round);

-- ========== 5. 경매 등기 (AuctionRegister) ==========

CREATE TABLE site.auction_registers (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES site.auction_items(id) ON DELETE CASCADE,
  register_type TEXT,
  register_no TEXT,
  receipt_date TIMESTAMPTZ,
  purpose TEXT,
  right_holder TEXT,
  claim_amount BIGINT,
  is_reference BOOLEAN DEFAULT FALSE,
  will_expire BOOLEAN DEFAULT TRUE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ar_item ON site.auction_registers (item_id);

-- ========== 6. 경매 이미지 (AuctionImage) ==========

CREATE TABLE site.auction_item_images (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES site.auction_items(id) ON DELETE CASCADE,
  image_type site.auction_image_type NOT NULL,
  url TEXT NOT NULL,
  original_url TEXT,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aii_item_order ON site.auction_item_images (item_id, sort_order);

-- ========== 7. 크롤러 법원코드 (from old Supabase) ==========

CREATE TABLE site.court_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== 8. 크롤러 경매 (from old Supabase) ==========

CREATE TABLE site.crawler_auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  court_code TEXT NOT NULL,
  court_name TEXT NOT NULL,
  case_number TEXT NOT NULL,
  case_year INTEGER NOT NULL,
  item_number INTEGER DEFAULT 1,
  property_type TEXT,
  address TEXT NOT NULL,
  address_road TEXT,
  sido TEXT,
  sigungu TEXT,
  dong TEXT,
  land_area DOUBLE PRECISION,
  building_area DOUBLE PRECISION,
  exclusive_area DOUBLE PRECISION,
  appraisal_price BIGINT,
  minimum_price BIGINT,
  deposit_amount BIGINT,
  bid_count INTEGER DEFAULT 0,
  case_receipt_date TEXT,
  auction_start_date TEXT,
  dividend_end_date TEXT,
  sale_date TEXT,
  sale_place TEXT,
  status site.crawler_auction_status DEFAULT 'ACTIVE',
  bid_method TEXT,
  claim_amount BIGINT,
  note TEXT,
  images TEXT[] DEFAULT '{}',
  source_url TEXT,
  crawled_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ca_court_case ON site.crawler_auctions (court_code, case_number);
CREATE INDEX idx_ca_status ON site.crawler_auctions (status);
CREATE INDEX idx_ca_sido ON site.crawler_auctions (sido);

-- ========== 9. 크롤러 경매 기일 ==========

CREATE TABLE site.crawler_auction_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES site.crawler_auctions(id) ON DELETE CASCADE,
  schedule_date TEXT,
  schedule_type TEXT,
  schedule_place TEXT,
  minimum_price BIGINT,
  result TEXT,
  sold_price BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cas_auction ON site.crawler_auction_schedules (auction_id);

-- ========== 10. 크롤러 경매 권리분석 ==========

CREATE TABLE site.crawler_auction_rights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES site.crawler_auctions(id) ON DELETE CASCADE,
  register_type TEXT,
  register_no TEXT,
  receipt_date TEXT,
  purpose TEXT,
  right_holder TEXT,
  claim_amount BIGINT,
  is_reference BOOLEAN DEFAULT FALSE,
  will_expire BOOLEAN DEFAULT TRUE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_car_auction ON site.crawler_auction_rights (auction_id);

-- ========== 11. 크롤러 경매 AI 분석 ==========

CREATE TABLE site.crawler_auction_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES site.crawler_auctions(id) ON DELETE CASCADE,
  reference_date TEXT,
  has_risk BOOLEAN DEFAULT FALSE,
  risk_note TEXT,
  tenant_info JSONB,
  total_claim BIGINT,
  expected_dividend BIGINT,
  ai_analysis JSONB,
  investment_grade TEXT,
  risk_level TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_caa_auction ON site.crawler_auction_analysis (auction_id);

-- ========== RLS POLICIES ==========

ALTER TABLE site.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.subscription_housing_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.auction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.auction_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.auction_item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.court_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.crawler_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.crawler_auction_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.crawler_auction_rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE site.crawler_auction_analysis ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "public_read" ON site.subscriptions FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.subscription_housing_types FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.auction_items FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.auction_bids FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.auction_registers FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.auction_item_images FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.court_codes FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.crawler_auctions FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.crawler_auction_schedules FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.crawler_auction_rights FOR SELECT USING (true);
CREATE POLICY "public_read" ON site.crawler_auction_analysis FOR SELECT USING (true);

-- Service role full access (via service_role key bypasses RLS anyway)
CREATE POLICY "service_insert" ON site.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "service_update" ON site.subscriptions FOR UPDATE USING (true);
CREATE POLICY "service_insert" ON site.subscription_housing_types FOR INSERT WITH CHECK (true);
CREATE POLICY "service_update" ON site.subscription_housing_types FOR UPDATE USING (true);
CREATE POLICY "service_insert" ON site.auction_items FOR INSERT WITH CHECK (true);
CREATE POLICY "service_update" ON site.auction_items FOR UPDATE USING (true);
CREATE POLICY "service_insert" ON site.auction_bids FOR INSERT WITH CHECK (true);
CREATE POLICY "service_insert" ON site.auction_registers FOR INSERT WITH CHECK (true);
CREATE POLICY "service_insert" ON site.auction_item_images FOR INSERT WITH CHECK (true);
CREATE POLICY "service_insert" ON site.court_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "service_insert" ON site.crawler_auctions FOR INSERT WITH CHECK (true);
CREATE POLICY "service_insert" ON site.crawler_auction_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "service_insert" ON site.crawler_auction_rights FOR INSERT WITH CHECK (true);
CREATE POLICY "service_insert" ON site.crawler_auction_analysis FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA site TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA site TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA site TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA site TO service_role;
