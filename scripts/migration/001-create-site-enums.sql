-- ============================================
-- ONSIA Site Schema - Part 1: Enum Types
-- Target: onsia-crm Supabase (uwddeseqwdsryvuoulsm)
-- Schema: site
-- ============================================

-- User roles
CREATE TYPE site.user_role AS ENUM ('USER', 'ADMIN');

-- Post
CREATE TYPE site.post_category AS ENUM ('NEWS', 'REAL_ESTATE', 'AI_TECH', 'BLOCKCHAIN', 'MARKET_ANALYSIS');
CREATE TYPE site.post_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- Property
CREATE TYPE site.property_status AS ENUM ('AVAILABLE', 'SOLD_OUT', 'COMING_SOON', 'SUSPENDED');
CREATE TYPE site.building_type AS ENUM ('APARTMENT', 'OFFICETEL', 'KNOWLEDGE_INDUSTRY', 'COMMERCIAL', 'SPECIAL', 'VILLA', 'TOWNHOUSE');
CREATE TYPE site.image_type AS ENUM ('EXTERIOR', 'INTERIOR', 'FLOOR_PLAN', 'SITE_PLAN', 'AMENITY');
CREATE TYPE site.inquiry_type AS ENUM ('GENERAL', 'VIEWING', 'INVESTMENT', 'CONSULTATION');
CREATE TYPE site.inquiry_status AS ENUM ('PENDING', 'RESPONDED', 'CLOSED');

-- Auction (Neon Prisma)
CREATE TYPE site.auction_item_type AS ENUM ('APARTMENT', 'VILLA', 'OFFICETEL', 'HOUSE', 'COMMERCIAL', 'LAND', 'FACTORY', 'BUILDING', 'OTHER');
CREATE TYPE site.auction_status AS ENUM ('SCHEDULED', 'BIDDING', 'SUCCESSFUL', 'FAILED', 'WITHDRAWN', 'CANCELED');
CREATE TYPE site.auction_bid_result AS ENUM ('FAILED', 'SUCCESSFUL', 'WITHDRAWN', 'POSTPONED');
CREATE TYPE site.auction_image_type AS ENUM ('PHOTO', 'SURVEY', 'APPRAISAL', 'REGISTER', 'OTHER');

-- Subscription
CREATE TYPE site.subscription_status AS ENUM ('UPCOMING', 'OPEN', 'CLOSED', 'ANNOUNCED', 'CONTRACTED', 'COMPLETED');
CREATE TYPE site.subscription_image_category AS ENUM ('MODELHOUSE', 'LOCATION', 'LAYOUT', 'UNIT_LAYOUT', 'FLOORPLAN', 'GALLERY', 'NOTICE_PDF', 'PREMIUM', 'COMMUNITY');

-- Favorites
CREATE TYPE site.favorite_type AS ENUM ('PROPERTY', 'SUBSCRIPTION', 'AUCTION');

-- Crawler auction status
CREATE TYPE site.crawler_auction_status AS ENUM ('ACTIVE', 'SOLD', 'FAILED', 'CANCELED', 'POSTPONED');
