/**
 * 나머지 Neon 데이터 마이그레이션
 * User, Developer, Company, Property, Post, Video 등
 */

import pg from 'pg'
import { createClient } from '@supabase/supabase-js'

const { Pool } = pg

// 환경변수: NEON_URL, NEW_SUPABASE_URL, NEW_SUPABASE_KEY
const NEON_URL = process.env.NEON_URL
const NEW_SUPABASE_URL = process.env.NEW_SUPABASE_URL || 'https://uwddeseqwdsryvuoulsm.supabase.co'
const NEW_SUPABASE_KEY = process.env.NEW_SUPABASE_KEY

if (!NEON_URL || !NEW_SUPABASE_KEY) {
  console.error('필수 환경변수 누락: NEON_URL, NEW_SUPABASE_KEY')
  process.exit(1)
}

const neonPool = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } })
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY, {
  db: { schema: 'site' },
  auth: { autoRefreshToken: false, persistSession: false }
})

function log(emoji, msg) { console.log(`${emoji} ${msg}`) }

async function batchInsert(table, rows, batchSize = 100) {
  if (!rows.length) { log('⏭️', `${table}: 0건 (스킵)`); return 0 }
  let inserted = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error } = await newSupabase.from(table).insert(batch)
    if (error) {
      log('⚠️', `${table} batch ${i}~${i + batch.length}: ${error.message}`)
      for (const row of batch) {
        const { error: e } = await newSupabase.from(table).insert(row)
        if (e) log('❌', `${table} row ${row.id || 'no-id'}: ${e.message}`)
        else inserted++
      }
    } else {
      inserted += batch.length
    }
  }
  log('✅', `${table}: ${inserted}/${rows.length}건 완료`)
  return inserted
}

function bigintToNum(v) { return v != null ? Number(v) : null }

async function main() {
  console.log('============================================')
  console.log('  나머지 Neon 데이터 마이그레이션')
  console.log('============================================\n')

  try {
    // 1. Users
    const { rows: users } = await neonPool.query('SELECT * FROM "User"')
    log('📊', `User: ${users.length}건`)
    await batchInsert('users', users.map(u => ({
      id: u.id, email: u.email, name: u.name, phone: u.phone,
      role: u.role, email_verified: u.emailVerified, image: u.image,
      created_at: u.createdAt, updated_at: u.updatedAt,
    })))

    // 2. Accounts
    const { rows: accounts } = await neonPool.query('SELECT * FROM "Account"')
    log('📊', `Account: ${accounts.length}건`)
    await batchInsert('accounts', accounts.map(a => ({
      id: a.id, user_id: a.userId, type: a.type, provider: a.provider,
      provider_account_id: a.providerAccountId, refresh_token: a.refresh_token,
      access_token: a.access_token, expires_at: a.expires_at,
      token_type: a.token_type, scope: a.scope, id_token: a.id_token,
      session_state: a.session_state, refresh_token_expires_in: a.refresh_token_expires_in,
    })))

    // 3. Sessions
    const { rows: sessions } = await neonPool.query('SELECT * FROM "Session"')
    log('📊', `Session: ${sessions.length}건`)
    await batchInsert('sessions', sessions.map(s => ({
      id: s.id, session_token: s.sessionToken, user_id: s.userId, expires: s.expires,
    })))

    // 4. VerificationToken
    const { rows: tokens } = await neonPool.query('SELECT * FROM "VerificationToken"')
    log('📊', `VerificationToken: ${tokens.length}건`)
    await batchInsert('verification_tokens', tokens.map(t => ({
      identifier: t.identifier, token: t.token, expires: t.expires,
    })))

    // 5. Developers
    const { rows: devs } = await neonPool.query('SELECT * FROM "Developer"')
    log('📊', `Developer: ${devs.length}건`)
    await batchInsert('developers', devs.map(d => ({
      id: d.id, name: d.name, description: d.description, logo_url: d.logoUrl,
      website: d.website, total_projects: d.totalProjects, rating: d.rating,
      created_at: d.createdAt, updated_at: d.updatedAt,
    })))

    // 6. Companies
    const { rows: companies } = await neonPool.query('SELECT * FROM "Company"')
    log('📊', `Company: ${companies.length}건`)
    await batchInsert('companies', companies.map(c => ({
      id: c.id, name: c.name, description: c.description,
      mission: c.mission, vision: c.vision, patents: c.patents,
      achievements: c.achievements, team_members: c.teamMembers,
      created_at: c.createdAt, updated_at: c.updatedAt,
    })))

    // 7. Properties
    const { rows: props } = await neonPool.query('SELECT * FROM "Property"')
    log('📊', `Property: ${props.length}건`)
    await batchInsert('properties', props.map(p => ({
      id: p.id, title: p.title, slug: p.slug, description: p.description,
      address: p.address, district: p.district, city: p.city, zip_code: p.zipCode,
      total_units: p.totalUnits, available_units: p.availableUnits,
      building_type: p.buildingType, completion_date: p.completionDate,
      move_in_date: p.moveInDate, base_price: bigintToNum(p.basePrice),
      price_per_pyeong: bigintToNum(p.pricePerPyeong),
      contract_deposit: bigintToNum(p.contractDeposit),
      interim_payments: p.interimPayments, rights_fee: bigintToNum(p.rightsFee),
      profit_rate: p.profitRate, investment_grade: p.investmentGrade,
      constructor: p.constructor, key_feature: p.keyFeature,
      total_building_count: p.totalBuildingCount, parking_spaces: p.parkingSpaces,
      facilities: p.facilities, status: p.status, featured: p.featured,
      pdf_url: p.pdfUrl, youtube_video_id: p.youtubeVideoId,
      location_desc: p.locationDesc, pyeong_types: p.pyeongTypes,
      subdomain: p.subdomain, is_premium: p.isPremium,
      seo_title: p.seoTitle, seo_description: p.seoDescription,
      view_count: p.viewCount, inquiry_count: p.inquiryCount,
      published_at: p.publishedAt, developer_id: p.developerId,
      author_id: p.authorId, loan_ratio: p.loanRatio,
      key_features: p.keyFeatures, price_display: p.priceDisplay,
      created_at: p.createdAt, updated_at: p.updatedAt,
    })))

    // 8. PropertyImages
    const { rows: pImgs } = await neonPool.query('SELECT * FROM "PropertyImage"')
    log('📊', `PropertyImage: ${pImgs.length}건`)
    await batchInsert('property_images', pImgs.map(i => ({
      id: i.id, url: i.url, alt: i.alt, caption: i.caption,
      sort_order: i.order, type: i.type, property_id: i.propertyId,
      created_at: i.createdAt,
    })))

    // 9. PropertyInquiries
    const { rows: inqs } = await neonPool.query('SELECT * FROM "PropertyInquiry"')
    log('📊', `PropertyInquiry: ${inqs.length}건`)
    await batchInsert('property_inquiries', inqs.map(i => ({
      id: i.id, name: i.name, email: i.email, phone: i.phone,
      message: i.message, inquiry_type: i.inquiryType, status: i.status,
      source: i.source, responded_at: i.respondedAt,
      property_id: i.propertyId, user_id: i.userId,
      created_at: i.createdAt, updated_at: i.updatedAt,
    })))

    // 10. Investments
    const { rows: invs } = await neonPool.query('SELECT * FROM "Investment"')
    log('📊', `Investment: ${invs.length}건`)
    await batchInsert('investments', invs.map(i => ({
      id: i.id, current_value: bigintToNum(i.currentValue),
      projected_value: bigintToNum(i.projectedValue),
      profit_amount: bigintToNum(i.profitAmount),
      profit_rate: i.profitRate, investment_period: i.investmentPeriod,
      risk_level: i.riskLevel, market_analysis: i.marketAnalysis,
      property_id: i.propertyId,
      created_at: i.createdAt, updated_at: i.updatedAt,
    })))

    // 11. Tags
    const { rows: tags } = await neonPool.query('SELECT * FROM "Tag"')
    log('📊', `Tag: ${tags.length}건`)
    await batchInsert('tags', tags.map(t => ({
      id: t.id, name: t.name, color: t.color,
    })))

    // 12. Posts
    const { rows: posts } = await neonPool.query('SELECT * FROM "Post"')
    log('📊', `Post: ${posts.length}건`)
    await batchInsert('posts', posts.map(p => ({
      id: p.id, title: p.title, slug: p.slug, content: p.content,
      excerpt: p.excerpt, category: p.category, status: p.status,
      featured_image: p.featuredImage, seo_title: p.seoTitle,
      seo_description: p.seoDescription, published_at: p.publishedAt,
      author_id: p.authorId, created_at: p.createdAt, updated_at: p.updatedAt,
    })))

    // 13. PostTags
    const { rows: postTags } = await neonPool.query('SELECT * FROM "PostTag"')
    log('📊', `PostTag: ${postTags.length}건`)
    await batchInsert('post_tags', postTags.map(pt => ({
      post_id: pt.postId, tag_id: pt.tagId,
    })))

    // 14. Videos
    const { rows: videos } = await neonPool.query('SELECT * FROM "Video"')
    log('📊', `Video: ${videos.length}건`)
    await batchInsert('videos', videos.map(v => ({
      id: v.id, youtube_id: v.youtubeId, title: v.title,
      description: v.description, thumbnail: v.thumbnail,
      duration: v.duration, published_at: v.publishedAt,
      category: v.category, tags: v.tags,
      view_count: v.viewCount, like_count: v.likeCount,
      comment_count: v.commentCount, seo_title: v.seoTitle,
      seo_description: v.seoDescription,
      created_at: v.createdAt, updated_at: v.updatedAt,
    })))

    // 15. Favorites
    const { rows: favs } = await neonPool.query('SELECT * FROM "Favorite"')
    log('📊', `Favorite: ${favs.length}건`)
    await batchInsert('favorites', favs.map(f => ({
      id: f.id, user_id: f.userId, item_type: f.itemType,
      property_id: f.propertyId, subscription_id: f.subscriptionId,
      auction_id: f.auctionId, created_at: f.createdAt,
    })))

    // 16. ViewHistory
    const { rows: views } = await neonPool.query('SELECT * FROM "ViewHistory"')
    log('📊', `ViewHistory: ${views.length}건`)
    await batchInsert('view_history', views.map(v => ({
      id: v.id, user_id: v.userId, item_type: v.itemType,
      property_id: v.propertyId, subscription_id: v.subscriptionId,
      auction_id: v.auctionId, viewed_at: v.viewedAt,
    })))

    // ===== 검증 =====
    console.log('\n🔍 === 전체 데이터 검증 ===')
    const allTables = [
      'users', 'accounts', 'sessions', 'verification_tokens',
      'developers', 'companies', 'properties', 'property_images',
      'property_inquiries', 'investments', 'tags', 'posts', 'post_tags',
      'videos', 'favorites', 'view_history',
    ]
    for (const t of allTables) {
      const { count, error } = await newSupabase.from(t).select('*', { count: 'exact', head: true })
      if (error) log('❌', `${t}: ${error.message}`)
      else log('📊', `${t}: ${count}건`)
    }

  } catch (err) {
    log('🚨', `실패: ${err.message}`)
    console.error(err)
  } finally {
    await neonPool.end()
    console.log('\n🏁 마이그레이션 종료')
  }
}

main()
