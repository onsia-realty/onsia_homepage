/**
 * Neon SubscriptionImage → Supabase site.subscription_images
 * - camelCase → snake_case 변환
 * - 카테고리 enum 그대로 (이미 대문자)
 * - subscriptionId가 site.subscriptions.id에 존재하는 것만 INSERT
 */

import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

const NEON_URL = process.env.NEON_DATABASE_URL
const SUPA_URL = process.env.DIRECT_URL

if (!NEON_URL || !SUPA_URL) {
  console.error('NEON_DATABASE_URL 또는 DIRECT_URL 없음')
  process.exit(1)
}

const neon = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } })
const supa = new Pool({ connectionString: SUPA_URL })

async function main() {
  // 기존 site.subscription_images 카운트
  const { rows: [{ c: existing }] } = await supa.query('SELECT COUNT(*)::int AS c FROM site.subscription_images')
  console.log(`기존 site.subscription_images: ${existing}건`)
  if (existing > 0) {
    console.log('⚠️ 이미 데이터 존재. 중단. (필요 시 TRUNCATE 후 재실행)')
    await neon.end(); await supa.end()
    return
  }

  // site.subscriptions 의 id 집합 (FK 검증용)
  const { rows: subRows } = await supa.query('SELECT id FROM site.subscriptions')
  const subIds = new Set(subRows.map(r => r.id))
  console.log(`site.subscriptions: ${subIds.size}건 (FK 매칭 대상)`)

  // Neon에서 모든 SubscriptionImage 가져오기
  const { rows: images } = await neon.query(`
    SELECT id, "subscriptionId", category, url, "originalUrl", alt, "order", "createdAt"
    FROM "SubscriptionImage"
    ORDER BY "createdAt"
  `)
  console.log(`Neon SubscriptionImage: ${images.length}건`)

  // FK 매칭
  const valid = images.filter(r => subIds.has(r.subscriptionId))
  const orphans = images.length - valid.length
  console.log(`✅ FK 매칭: ${valid.length}건  / ⚠️ orphan(없는 subscription_id): ${orphans}건`)

  // batch insert
  const BATCH = 200
  let inserted = 0
  for (let i = 0; i < valid.length; i += BATCH) {
    const batch = valid.slice(i, i + BATCH)
    const values = []
    const params = []
    let p = 1
    for (const r of batch) {
      values.push(`($${p++}, $${p++}, $${p++}::site.subscription_image_category, $${p++}, $${p++}, $${p++}, $${p++}, $${p++})`)
      params.push(r.id, r.subscriptionId, r.category, r.url, r.originalUrl, r.alt, r.order, r.createdAt)
    }
    const sql = `
      INSERT INTO site.subscription_images
        (id, subscription_id, category, url, original_url, alt, sort_order, created_at)
      VALUES ${values.join(',')}
      ON CONFLICT (id) DO NOTHING
    `
    const res = await supa.query(sql, params)
    inserted += res.rowCount
    process.stdout.write(`\r진행: ${Math.min(i + BATCH, valid.length)}/${valid.length} (insert ${inserted})`)
  }
  console.log('')

  // 검증
  const { rows: [{ c: finalCount }] } = await supa.query('SELECT COUNT(*)::int AS c FROM site.subscription_images')
  console.log(`\n✅ 최종 site.subscription_images: ${finalCount}건 (목표: ${valid.length})`)

  await neon.end(); await supa.end()
}

main().catch(e => { console.error(e); process.exit(1) })
