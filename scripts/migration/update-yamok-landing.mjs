/**
 * 야목역 row 업데이트
 * - 전화번호: 1551-2148 → 1668-5257 (ONSIA 대표번호 통일)
 * - 모든 이미지를 우리 서버 (/uploads/landing/yamok/) 경로로 교체
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const SUPABASE_KEY = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'landing' },
  auth: { autoRefreshToken: false, persistSession: false }
})

const BASE = '/uploads/landing/yamok'

const HERO = `${BASE}/hero.jpg`

const GALLERY = [
  `${BASE}/business.png`,
  `${BASE}/premium.png`,
  `${BASE}/brand.jpg`,
  `${BASE}/location.png`,
  `${BASE}/schedule.png`,
  `${BASE}/info03.png`,
  `${BASE}/apply.png`,
  `${BASE}/ssp_guide.png`,
  `${BASE}/cpx_layout.png`,
  `${BASE}/no_layout.png`,
  `${BASE}/unitplan_59a.png`,
  `${BASE}/unitplan_59b.png`,
  `${BASE}/unitplan_59c.png`,
  `${BASE}/unitplan_84a.png`,
  `${BASE}/unitplan_84b.png`,
  `${BASE}/interior.png`,
  `${BASE}/option.png`,
]

const UPDATE = {
  phone_number: '1668-5257',
  hero_image: HERO,
  og_image: HERO,
  logo_image: `${BASE}/logo.png`,
  gallery: GALLERY,
}

async function main() {
  console.log('=== 야목역 row 업데이트 ===\n')
  console.log('변경 항목:')
  console.log('  phone_number: 1551-2148 → 1668-5257')
  console.log(`  hero_image: ${HERO}`)
  console.log(`  logo_image: ${BASE}/logo.png`)
  console.log(`  gallery: ${GALLERY.length}장 (모두 우리 서버)\n`)

  const { error } = await supabase
    .from('pages')
    .update(UPDATE)
    .eq('slug', 'yamok-grandhill')

  if (error) {
    console.error('❌ 업데이트 실패:', error.message)
    process.exit(1)
  }

  const { data: verify } = await supabase
    .from('pages')
    .select('slug, phone_number, hero_image, logo_image, gallery')
    .eq('slug', 'yamok-grandhill')
    .single()

  console.log('✅ 업데이트 완료')
  console.log(`  phone: ${verify.phone_number}`)
  console.log(`  hero:  ${verify.hero_image}`)
  console.log(`  logo:  ${verify.logo_image}`)
  console.log(`  gallery: ${verify.gallery.length}장`)
}

main().catch(e => { console.error(e); process.exit(1) })
