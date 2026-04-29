-- ============================================
-- 누락된 테이블 추가 (site 스키마)
-- 1. subscription_images (Neon SubscriptionImage 4595건 대상)
-- 2. auction_tenants (Neon AuctionTenant - 0건이지만 schema 일관성 위해 생성)
-- ============================================

-- ========== ENUM ==========
CREATE TYPE site.subscription_image_category AS ENUM (
  'MODELHOUSE', 'LOCATION', 'LAYOUT', 'UNIT_LAYOUT',
  'FLOORPLAN', 'GALLERY', 'NOTICE_PDF', 'PREMIUM', 'COMMUNITY'
);

-- ========== 1. SubscriptionImage ==========
CREATE TABLE site.subscription_images (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES site.subscriptions(id) ON DELETE CASCADE,
  category site.subscription_image_category NOT NULL,
  url TEXT NOT NULL,
  original_url TEXT,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sub_img_subscription_category_order
  ON site.subscription_images (subscription_id, category, sort_order);

-- ========== 2. AuctionTenant ==========
CREATE TABLE site.auction_tenants (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES site.auction_items(id) ON DELETE CASCADE,
  tenant_name TEXT,
  has_priority BOOLEAN,
  occupied_part TEXT,
  move_in_date TIMESTAMPTZ,
  fixed_date TIMESTAMPTZ,
  has_bid_request BOOLEAN,
  deposit BIGINT,
  monthly_rent BIGINT,
  analysis TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auction_tenants_item ON site.auction_tenants (item_id);
