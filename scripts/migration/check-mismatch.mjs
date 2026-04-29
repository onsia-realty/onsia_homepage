/**
 * prisma schema의 각 model에 정의된 컬럼 vs site DB의 실제 컬럼 비교
 * - 모델 필드 중 DB에 없는 것 (매핑 누락)
 * - DB 컬럼 중 모델에 없는 것 (참고용)
 */

import 'dotenv/config'
import fs from 'fs'
import pg from 'pg'

const { Pool } = pg
const supa = new Pool({ connectionString: process.env.DIRECT_URL })

const MODEL_TO_TABLE = {
  User: 'users', Account: 'accounts', Session: 'sessions', VerificationToken: 'verification_tokens',
  Post: 'posts', Tag: 'tags', PostTag: 'post_tags', Video: 'videos',
  Company: 'companies', Developer: 'developers',
  Property: 'properties', PropertyImage: 'property_images', PropertyInquiry: 'property_inquiries',
  Investment: 'investments',
  AuctionItem: 'auction_items', AuctionBid: 'auction_bids', AuctionRegister: 'auction_registers',
  AuctionTenant: 'auction_tenants', AuctionImage: 'auction_item_images',
  Subscription: 'subscriptions', SubscriptionImage: 'subscription_images',
  SubscriptionHousingType: 'subscription_housing_types',
  Favorite: 'favorites', ViewHistory: 'view_history',
}

function camelToSnake(s) { return s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase() }

// schema에서 model 필드 추출
function parseModels(schemaText) {
  const result = {}
  const lines = schemaText.split('\n')
  let cur = null
  let bodyFields = []
  for (const line of lines) {
    const m = line.match(/^model\s+(\w+)\s*\{/)
    if (m) { cur = m[1]; bodyFields = []; continue }
    if (line.match(/^\}/) && cur) { result[cur] = bodyFields; cur = null; continue }
    if (cur) {
      const f = line.match(/^\s+(\w+)\s+(\w+)(\?|\[\])?(.*)$/)
      if (f) {
        const [, fieldName, type, modifier, rest] = f
        const isList = modifier === '[]'
        const isRelation = /^[A-Z]/.test(type) && (isList || rest.includes('@relation'))
        const mapMatch = rest.match(/@map\("([^"]+)"\)/)
        bodyFields.push({
          name: fieldName,
          type,
          isRelation,
          mapped: mapMatch ? mapMatch[1] : null,
          line: line.trim()
        })
      }
    }
  }
  return result
}

async function main() {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8')
  const models = parseModels(schema)

  let totalIssues = 0

  for (const [model, table] of Object.entries(MODEL_TO_TABLE)) {
    const fields = models[model] || []
    const { rows } = await supa.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema='site' AND table_name=$1`,
      [table]
    )
    const dbCols = new Set(rows.map(r => r.column_name))

    const issues = []
    for (const f of fields) {
      if (f.isRelation) continue
      const expected = f.mapped || (camelToSnake(f.name))
      // prisma scalar의 경우 mapping된 컬럼이 DB에 있어야 함
      if (!dbCols.has(expected)) {
        issues.push(`  ❌ ${model}.${f.name} → "${expected}" (DB에 없음)`)
      }
    }

    if (issues.length) {
      console.log(`\n[${model} ↔ site.${table}]`)
      issues.forEach(s => console.log(s))
      totalIssues += issues.length

      // DB에는 있지만 모델에 매핑 안 된 컬럼
      const mappedSet = new Set(fields.filter(f => !f.isRelation).map(f => f.mapped || camelToSnake(f.name)))
      const orphan = [...dbCols].filter(c => !mappedSet.has(c))
      if (orphan.length) {
        console.log(`  📌 모델에 없는 DB 컬럼: ${orphan.join(', ')}`)
      }
    }
  }

  console.log(`\n총 mismatch: ${totalIssues}건`)
  await supa.end()
}

main().catch(e => { console.error(e); process.exit(1) })
