/**
 * 야목역 gallery 에서 일부 이미지 숨김 (DB 배열에서 제거)
 * - info03.png (공급안내)
 * - apply.png (모집공고)
 * - ssp_guide.png (청약안내)
 *
 * 파일 자체는 보존 (필요시 다시 살릴 수 있게)
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const c = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_CRM_URL,
  process.env.SUPABASE_CRM_SERVICE_ROLE_KEY,
  { db: { schema: 'landing' }, auth: { autoRefreshToken: false, persistSession: false } }
)

const HIDE = [
  '/uploads/landing/yamok/info03.png',
  '/uploads/landing/yamok/apply.png',
  '/uploads/landing/yamok/ssp_guide.png',
]

const { data: page } = await c.from('pages').select('gallery').eq('slug', 'yamok-grandhill').single()
console.log('전:', page.gallery.length, '장')

const filtered = page.gallery.filter(u => !HIDE.includes(u))
console.log('후:', filtered.length, '장 (제외:', page.gallery.length - filtered.length, '장)')

const { error } = await c.from('pages').update({ gallery: filtered }).eq('slug', 'yamok-grandhill')
if (error) { console.error('❌', error.message); process.exit(1) }

console.log('✅ 완료')
console.log('   숨김 파일:', HIDE.map(u => u.split('/').pop()).join(', '))
console.log('   파일 자체는 public/uploads/landing/yamok/ 에 보존됨 (필요시 복원 가능)')
