/**
 * site 스키마의 컬럼명 확인 (snake_case vs camelCase)
 * + 누락된 SubscriptionImage 마이그레이션 plan용 정보
 */

import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

const supa = new Pool({ connectionString: process.env.DIRECT_URL })

async function cols(schema, table) {
  const { rows } = await supa.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position`,
    [schema, table]
  )
  return rows.map(r => r.column_name)
}

async function main() {
  const samples = [
    'users', 'properties', 'property_images', 'subscriptions',
    'subscription_housing_types', 'auction_items', 'videos',
    'developers', 'companies', 'property_inquiries', 'auction_item_images'
  ]

  for (const t of samples) {
    const c = await cols('site', t)
    if (c.length === 0) {
      console.log(`❌ site.${t}: 없음`)
      continue
    }
    const hasSnake = c.some(x => x.includes('_'))
    const hasCamel = c.some(x => /[a-z][A-Z]/.test(x))
    const tag = hasCamel ? 'camelCase' : (hasSnake ? 'snake_case' : 'lowercase')
    console.log(`\n📋 site.${t} [${tag}] (${c.length}컬럼):`)
    console.log('   ' + c.slice(0, 10).join(', ') + (c.length > 10 ? ', ...' : ''))
  }

  // public.User 충돌 확인
  console.log('\n=== public.User 컬럼 ===')
  const pubUserCols = await cols('public', 'User')
  console.log(pubUserCols.join(', ') || '(없음)')

  await supa.end()
}

main().catch(e => { console.error(e); process.exit(1) })
