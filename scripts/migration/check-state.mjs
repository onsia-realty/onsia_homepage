/**
 * Neon vs Supabase site 스키마 현황 비교
 * - Neon: 모든 테이블 카운트
 * - Supabase site: 존재하는 테이블 + 카운트
 * - public 스키마와 이름 충돌 가능성 검사
 */

import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

const NEON_URL = process.env.NEON_DATABASE_URL
const SUPABASE_URL = process.env.DIRECT_URL

if (!NEON_URL || !SUPABASE_URL) {
  console.error('NEON_DATABASE_URL 또는 DIRECT_URL 없음')
  process.exit(1)
}

const neon = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } })
const supa = new Pool({ connectionString: SUPABASE_URL })

async function listTables(pool, schema) {
  const { rows } = await pool.query(
    `SELECT tablename FROM pg_tables WHERE schemaname=$1 ORDER BY tablename`,
    [schema]
  )
  return rows.map(r => r.tablename)
}

async function count(pool, schema, table) {
  try {
    const { rows } = await pool.query(`SELECT COUNT(*)::int AS c FROM "${schema}"."${table}"`)
    return rows[0].c
  } catch (e) {
    return `ERR: ${e.message}`
  }
}

async function main() {
  console.log('\n=== Neon (public) ===')
  const neonTables = await listTables(neon, 'public')
  const neonCounts = {}
  for (const t of neonTables) {
    neonCounts[t] = await count(neon, 'public', t)
  }

  console.log('\n=== Supabase site ===')
  const supaSiteTables = await listTables(supa, 'site')
  const supaSiteCounts = {}
  for (const t of supaSiteTables) {
    supaSiteCounts[t] = await count(supa, 'site', t)
  }

  console.log('\n=== Supabase public (충돌 검사) ===')
  const supaPubTables = await listTables(supa, 'public')

  // 비교 테이블 (Neon naming = PascalCase, supabase site는 snake_case일 수도)
  console.log('\n📊 비교표:')
  console.log('Neon table'.padEnd(30) + 'Neon'.padEnd(10) + 'site (snake_case)'.padEnd(35) + 'site count')
  console.log('-'.repeat(95))

  const toSnake = (s) => s.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()

  for (const t of neonTables) {
    const snake = toSnake(t)
    const snakePlural = snake.endsWith('s') ? snake : snake + 's'
    const siteCount =
      supaSiteCounts[snake] ?? supaSiteCounts[snakePlural] ?? supaSiteCounts[t] ?? '-'
    const matched = (snake in supaSiteCounts) ? snake : (snakePlural in supaSiteCounts ? snakePlural : (t in supaSiteCounts ? t : '(없음)'))
    console.log(t.padEnd(30) + String(neonCounts[t]).padEnd(10) + matched.padEnd(35) + String(siteCount))
  }

  console.log('\n📋 site에만 있는 테이블 (Neon에 없음):')
  for (const t of supaSiteTables) {
    const pascal = t.replace(/_([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase())
    const pascalSing = pascal.endsWith('s') ? pascal.slice(0, -1) : pascal
    if (!neonTables.includes(pascal) && !neonTables.includes(pascalSing) && !neonTables.includes(t)) {
      console.log(`  - site.${t}: ${supaSiteCounts[t]}`)
    }
  }

  console.log('\n⚠️ public 스키마에 동일 이름 테이블 (충돌 가능성):')
  for (const t of neonTables) {
    if (supaPubTables.includes(t)) {
      const c = await count(supa, 'public', t)
      console.log(`  - public.${t}: ${c}건 (충돌!)`)
    }
    const lower = t.toLowerCase()
    if (supaPubTables.includes(lower) && lower !== t) {
      const c = await count(supa, 'public', lower)
      console.log(`  - public.${lower}: ${c}건 (소문자 매칭)`)
    }
  }

  await neon.end()
  await supa.end()
}

main().catch(e => { console.error(e); process.exit(1) })
