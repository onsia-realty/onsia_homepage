/**
 * 핵심 데이터 마이그레이션 스크립트
 *
 * Source 1: Neon PostgreSQL (Prisma) → 청약 + 경매
 * Source 2: Old Supabase (hwbozwggvlvqnqylunin) → 크롤러 경매
 * Target: onsia-crm Supabase (uwddeseqwdsryvuoulsm) site 스키마
 */

import pg from 'pg'
import { createClient } from '@supabase/supabase-js'

const { Pool } = pg

// ========== Configuration ==========
// 환경변수 설정: .env 파일 또는 실행 시 직접 전달
// NEON_URL, OLD_SUPABASE_URL, OLD_SUPABASE_KEY, NEW_SUPABASE_URL, NEW_SUPABASE_KEY

const NEON_URL = process.env.NEON_URL
const OLD_SUPABASE_URL = process.env.OLD_SUPABASE_URL
const OLD_SUPABASE_KEY = process.env.OLD_SUPABASE_KEY
const NEW_SUPABASE_URL = process.env.NEW_SUPABASE_URL || 'https://uwddeseqwdsryvuoulsm.supabase.co'
const NEW_SUPABASE_KEY = process.env.NEW_SUPABASE_KEY

if (!NEON_URL || !OLD_SUPABASE_KEY || !NEW_SUPABASE_KEY) {
  console.error('필수 환경변수 누락: NEON_URL, OLD_SUPABASE_KEY, NEW_SUPABASE_KEY')
  process.exit(1)
}

// ========== Clients ==========

const neonPool = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } })

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY, {
  db: { schema: 'site' },
  auth: { autoRefreshToken: false, persistSession: false }
})

// ========== Helpers ==========

function log(emoji, msg) {
  console.log(`${emoji} ${msg}`)
}

async function batchInsert(table, rows, batchSize = 100) {
  if (!rows.length) {
    log('⏭️', `${table}: 0건 (스킵)`)
    return 0
  }

  let inserted = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error } = await newSupabase.from(table).insert(batch)
    if (error) {
      log('❌', `${table} batch ${i}~${i + batch.length}: ${error.message}`)
      // 개별 insert 시도
      for (const row of batch) {
        const { error: singleErr } = await newSupabase.from(table).insert(row)
        if (singleErr) {
          log('⚠️', `${table} row ${row.id}: ${singleErr.message}`)
        } else {
          inserted++
        }
      }
    } else {
      inserted += batch.length
    }
  }
  log('✅', `${table}: ${inserted}/${rows.length}건 완료`)
  return inserted
}

// ========== 1. 청약 데이터 (Neon → site) ==========

async function migrateSubscriptions() {
  log('📋', '=== 청약 데이터 마이그레이션 ===')

  // Subscription
  const { rows: subs } = await neonPool.query('SELECT * FROM "Subscription" ORDER BY "createdAt"')
  log('📊', `Neon Subscription: ${subs.length}건`)

  const mappedSubs = subs.map(s => ({
    id: s.id,
    house_manage_no: s.houseManageNo,
    pblanc_no: s.pblancNo,
    house_name: s.houseName,
    house_type: s.houseType,
    house_detail_type: s.houseDetailType,
    address: s.address,
    address_detail: s.addressDetail,
    zip_code: s.zipCode,
    region: s.region,
    region_code: s.regionCode,
    latitude: s.latitude,
    longitude: s.longitude,
    total_households: s.totalHouseholds,
    recruit_date: s.recruitDate,
    reception_start: s.receptionStart,
    reception_end: s.receptionEnd,
    special_supply_date: s.specialSupplyDate,
    rank1_date: s.rank1Date,
    rank2_date: s.rank2Date,
    winner_announcement_date: s.winnerAnnouncementDate,
    contract_start: s.contractStart,
    contract_end: s.contractEnd,
    move_in_date: s.moveInDate,
    developer: s.developer,
    contractor: s.contractor,
    model_house_phone: s.modelHousePhone,
    homepage: s.homepage,
    notice_url: s.noticeUrl,
    avg_price: s.avgPrice,
    avg_price_per_pyeong: s.avgPricePerPyeong,
    min_price: s.minPrice,
    max_price: s.maxPrice,
    status: s.status,
    is_hot: s.isHot,
    view_count: s.viewCount,
    raw_data: s.rawData,
    asil_id: s.asilId,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  }))

  await batchInsert('subscriptions', mappedSubs)

  // SubscriptionHousingType
  const { rows: types } = await neonPool.query('SELECT * FROM "SubscriptionHousingType" ORDER BY "createdAt"')
  log('📊', `Neon SubscriptionHousingType: ${types.length}건`)

  const mappedTypes = types.map(t => ({
    id: t.id,
    subscription_id: t.subscriptionId,
    house_ty: t.houseTy,
    model_no: t.modelNo,
    supply_area: t.supplyArea,
    exclusive_area: t.exclusiveArea,
    total_households: t.totalHouseholds,
    general_households: t.generalHouseholds,
    special_households: t.specialHouseholds,
    top_price: t.topPrice,
    price_per_pyeong: t.pricePerPyeong,
    raw_data: t.rawData,
    created_at: t.createdAt,
  }))

  await batchInsert('subscription_housing_types', mappedTypes)
}

// ========== 2. Neon 경매 데이터 (Neon → site) ==========

async function migrateNeonAuctions() {
  log('⚖️', '=== Neon 경매 데이터 마이그레이션 ===')

  // AuctionItem
  const { rows: items } = await neonPool.query('SELECT * FROM "AuctionItem" ORDER BY "createdAt"')
  log('📊', `Neon AuctionItem: ${items.length}건`)

  const mappedItems = items.map(a => ({
    id: a.id,
    case_number: a.caseNumber,
    case_number_full: a.caseNumberFull,
    court_code: a.courtCode,
    court_name: a.courtName,
    pnu: a.pnu,
    address: a.address,
    address_detail: a.addressDetail,
    city: a.city,
    district: a.district,
    item_type: a.itemType,
    land_area: a.landArea,
    building_area: a.buildingArea,
    floor: a.floor,
    appraisal_price: a.appraisalPrice ? Number(a.appraisalPrice) : 0,
    minimum_price: a.minimumPrice ? Number(a.minimumPrice) : 0,
    minimum_rate: a.minimumRate,
    deposit: a.deposit ? Number(a.deposit) : null,
    sale_date: a.saleDate,
    sale_time: a.saleTime,
    bid_count: a.bidCount,
    bid_end_date: a.bidEndDate,
    reference_date: a.referenceDate,
    has_risk: a.hasRisk,
    risk_note: a.riskNote,
    owner: a.owner,
    debtor: a.debtor,
    creditor: a.creditor,
    status: a.status,
    featured: a.featured,
    real_price: a.realPrice ? Number(a.realPrice) : null,
    building_info: a.buildingInfo,
    naver_complex_id: a.naverComplexId,
    seo_title: a.seoTitle,
    seo_description: a.seoDescription,
    view_count: a.viewCount,
    inquiry_count: a.inquiryCount,
    appraisal_date: a.appraisalDate,
    appraisal_org: a.appraisalOrg,
    approval_date: a.approvalDate,
    building_appraisal_price: a.buildingAppraisalPrice ? Number(a.buildingAppraisalPrice) : null,
    building_structure: a.buildingStructure,
    building_usage: a.buildingUsage,
    facilities: a.facilities,
    heating_type: a.heatingType,
    land_appraisal_price: a.landAppraisalPrice ? Number(a.landAppraisalPrice) : null,
    land_use_zone: a.landUseZone,
    location_note: a.locationNote,
    nearby_facilities: a.nearbyFacilities,
    preservation_date: a.preservationDate,
    surroundings: a.surroundings,
    total_floors: a.totalFloors,
    transportation: a.transportation,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  }))

  await batchInsert('auction_items', mappedItems)

  // AuctionBid
  const { rows: bids } = await neonPool.query('SELECT * FROM "AuctionBid" ORDER BY "createdAt"')
  log('📊', `Neon AuctionBid: ${bids.length}건`)

  const mappedBids = bids.map(b => ({
    id: b.id,
    item_id: b.itemId,
    round: b.round,
    bid_date: b.bidDate,
    minimum_price: b.minimumPrice ? Number(b.minimumPrice) : 0,
    result: b.result,
    winning_price: b.winningPrice ? Number(b.winningPrice) : null,
    bidder_count: b.bidderCount,
    created_at: b.createdAt,
  }))

  await batchInsert('auction_bids', mappedBids)

  // AuctionRegister
  const { rows: regs } = await neonPool.query('SELECT * FROM "AuctionRegister" ORDER BY "createdAt"')
  log('📊', `Neon AuctionRegister: ${regs.length}건`)

  const mappedRegs = regs.map(r => ({
    id: r.id,
    item_id: r.itemId,
    register_type: r.registerType,
    register_no: r.registerNo,
    receipt_date: r.receiptDate,
    purpose: r.purpose,
    right_holder: r.rightHolder,
    claim_amount: r.claimAmount ? Number(r.claimAmount) : null,
    is_reference: r.isReference,
    will_expire: r.willExpire,
    note: r.note,
    created_at: r.createdAt,
  }))

  await batchInsert('auction_registers', mappedRegs)

  // AuctionImage
  const { rows: imgs } = await neonPool.query('SELECT * FROM "AuctionImage" ORDER BY "createdAt"')
  log('📊', `Neon AuctionImage: ${imgs.length}건`)

  const mappedImgs = imgs.map(i => ({
    id: i.id,
    item_id: i.itemId,
    image_type: i.imageType,
    url: i.url,
    original_url: i.originalUrl,
    alt: i.alt,
    sort_order: i.order,
    created_at: i.createdAt,
  }))

  await batchInsert('auction_item_images', mappedImgs)
}

// ========== 3. 크롤러 경매 데이터 (Old Supabase → site) ==========

async function migrateCrawlerAuctions() {
  log('🔨', '=== 크롤러 경매 데이터 마이그레이션 ===')

  // court_codes
  const { data: courts, error: courtErr } = await oldSupabase.from('court_codes').select('*')
  if (courtErr) {
    log('❌', `court_codes 읽기 실패: ${courtErr.message}`)
  } else {
    log('📊', `Old Supabase court_codes: ${courts.length}건`)
    const mappedCourts = courts.map(c => ({
      id: c.id,
      code: c.code,
      name: c.name,
      region: c.region || null,
      created_at: c.created_at,
    }))
    await batchInsert('court_codes', mappedCourts)
  }

  // auctions
  const { data: auctions, error: auctionErr } = await oldSupabase.from('auctions').select('*')
  if (auctionErr) {
    log('❌', `auctions 읽기 실패: ${auctionErr.message}`)
  } else {
    log('📊', `Old Supabase auctions: ${auctions.length}건`)

    // ID 매핑 저장 (auction_schedules, auction_rights 등에서 참조)
    const idMap = new Map()

    const mappedAuctions = auctions.map(a => {
      const newRow = {
        id: a.id,
        court_code: a.court_code,
        court_name: a.court_name,
        case_number: a.case_number,
        case_year: a.case_year,
        item_number: a.item_number || 1,
        property_type: a.property_type,
        address: a.address,
        address_road: a.address_road,
        sido: a.sido,
        sigungu: a.sigungu,
        dong: a.dong,
        land_area: a.land_area,
        building_area: a.building_area,
        exclusive_area: a.exclusive_area,
        appraisal_price: a.appraisal_price,
        minimum_price: a.minimum_price,
        deposit_amount: a.deposit_amount,
        bid_count: a.bid_count || 0,
        case_receipt_date: a.case_receipt_date,
        auction_start_date: a.auction_start_date,
        dividend_end_date: a.dividend_end_date,
        sale_date: a.sale_date,
        sale_place: a.sale_place,
        status: a.status,
        bid_method: a.bid_method,
        claim_amount: a.claim_amount,
        note: a.note,
        images: a.images || [],
        source_url: a.source_url,
        crawled_at: a.crawled_at,
        updated_at: a.updated_at,
        created_at: a.created_at,
      }
      idMap.set(a.id, a.id)
      return newRow
    })

    await batchInsert('crawler_auctions', mappedAuctions)

    // auction_schedules
    const { data: schedules, error: schedErr } = await oldSupabase.from('auction_schedules').select('*')
    if (schedErr) {
      log('❌', `auction_schedules 읽기 실패: ${schedErr.message}`)
    } else {
      log('📊', `Old Supabase auction_schedules: ${schedules.length}건`)
      const mappedSchedules = schedules.map(s => ({
        id: s.id,
        auction_id: s.auction_id,
        schedule_date: s.schedule_date,
        schedule_type: s.schedule_type,
        schedule_place: s.schedule_place,
        minimum_price: s.minimum_price,
        result: s.result,
        sold_price: s.sold_price,
        created_at: s.created_at,
      }))
      await batchInsert('crawler_auction_schedules', mappedSchedules)
    }

    // auction_rights
    const { data: rights, error: rightErr } = await oldSupabase.from('auction_rights').select('*')
    if (rightErr) {
      log('❌', `auction_rights 읽기 실패: ${rightErr.message}`)
    } else {
      log('📊', `Old Supabase auction_rights: ${rights.length}건`)
      const mappedRights = rights.map(r => ({
        id: r.id,
        auction_id: r.auction_id,
        register_type: r.register_type,
        register_no: r.register_no,
        receipt_date: r.receipt_date,
        purpose: r.purpose,
        right_holder: r.right_holder,
        claim_amount: r.claim_amount,
        is_reference: r.is_reference,
        will_expire: r.will_expire,
        note: r.note,
        created_at: r.created_at,
      }))
      await batchInsert('crawler_auction_rights', mappedRights)
    }

    // auction_analysis
    const { data: analysis, error: analysisErr } = await oldSupabase.from('auction_analysis').select('*')
    if (analysisErr) {
      log('❌', `auction_analysis 읽기 실패: ${analysisErr.message}`)
    } else {
      log('📊', `Old Supabase auction_analysis: ${analysis.length}건`)
      const mappedAnalysis = analysis.map(a => ({
        id: a.id,
        auction_id: a.auction_id,
        reference_date: a.reference_date,
        has_risk: a.has_risk,
        risk_note: a.risk_note,
        tenant_info: a.tenant_info,
        total_claim: a.total_claim,
        expected_dividend: a.expected_dividend,
        ai_analysis: a.ai_analysis,
        investment_grade: a.investment_grade,
        risk_level: a.risk_level,
        updated_at: a.updated_at,
        created_at: a.created_at,
      }))
      await batchInsert('crawler_auction_analysis', mappedAnalysis)
    }
  }
}

// ========== 4. 검증 ==========

async function verify() {
  log('🔍', '=== 데이터 검증 ===')

  const tables = [
    'subscriptions',
    'subscription_housing_types',
    'auction_items',
    'auction_bids',
    'auction_registers',
    'auction_item_images',
    'court_codes',
    'crawler_auctions',
    'crawler_auction_schedules',
    'crawler_auction_rights',
    'crawler_auction_analysis',
  ]

  for (const table of tables) {
    const { count, error } = await newSupabase.from(table).select('*', { count: 'exact', head: true })
    if (error) {
      log('❌', `${table}: 조회 실패 - ${error.message}`)
    } else {
      log('📊', `${table}: ${count}건`)
    }
  }
}

// ========== Main ==========

async function main() {
  console.log('============================================')
  console.log('  ONSIA 핵심 데이터 마이그레이션')
  console.log('  Neon + Old Supabase → onsia-crm site 스키마')
  console.log('============================================\n')

  try {
    await migrateSubscriptions()
    console.log()
    await migrateNeonAuctions()
    console.log()
    await migrateCrawlerAuctions()
    console.log()
    await verify()
  } catch (err) {
    log('🚨', `마이그레이션 실패: ${err.message}`)
    console.error(err)
  } finally {
    await neonPool.end()
    console.log('\n🏁 마이그레이션 종료')
  }
}

main()
