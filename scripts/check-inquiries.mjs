import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const serviceKey = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_CRM_ANON_KEY

console.log('URL:', url ? 'SET' : 'MISSING')
console.log('Service Key:', serviceKey ? 'SET' : 'MISSING')
console.log('Anon Key:', anonKey ? 'SET' : 'MISSING')

const supabase = createClient(url, serviceKey, { db: { schema: 'landing' } })

// 1. 관심고객 전체 조회
const { data: inquiries, error } = await supabase
  .from('inquiries')
  .select('*')
  .order('created_at', { ascending: false })

if (error) {
  console.error('ERROR:', error)
  process.exit(1)
}

console.log('\n=== 관심고객 등록 현황 ===')
console.log('총 건수:', inquiries.length)

for (let i = 0; i < inquiries.length; i++) {
  const inq = inquiries[i]
  console.log(`\n[${i + 1}] ${inq.created_at}`)
  console.log(`  이름: ${inq.name} | 연락처: ${inq.phone}`)
  console.log(`  page_id: ${inq.page_id} | agent: ${inq.agent_code || '없음'}`)
  console.log(`  상태: ${inq.status} | CRM동기화: ${inq.synced_to_crm}`)
}

// 2. urbanhomes page 확인
const { data: page } = await supabase
  .from('pages')
  .select('id, slug, project_name')
  .eq('slug', 'urbanhomes')
  .single()

console.log('\n=== urbanhomes 페이지 ===')
console.log(page ? `id: ${page.id} | name: ${page.project_name}` : 'NOT FOUND')

// 3. RLS 테스트 - anon key로 insert
console.log('\n=== RLS 테스트 (anon key insert) ===')
const anonClient = createClient(url, anonKey, { db: { schema: 'landing' } })

if (page) {
  const { data: testResult, error: testError } = await anonClient
    .from('inquiries')
    .insert({
      page_id: page.id,
      name: 'RLS_TEST',
      phone: '000-0000-0000'
    })
    .select()

  if (testError) {
    console.log('anon key INSERT 실패 (RLS 차단):', testError.message)
    console.log('>> 이것이 관심고객 등록 안 되는 원인!')
  } else {
    console.log('anon key INSERT 성공 - RLS 문제 아님')
    // 테스트 데이터 삭제
    if (testResult && testResult[0]) {
      await supabase.from('inquiries').delete().eq('id', testResult[0].id)
      console.log('테스트 데이터 삭제 완료')
    }
  }
}

// 4. 솔라피 테스트
console.log('\n=== 솔라피 환경변수 ===')
console.log('API_KEY:', process.env.SOLAPI_API_KEY ? 'SET' : 'MISSING')
console.log('API_SECRET:', process.env.SOLAPI_API_SECRET ? 'SET' : 'MISSING')
console.log('SMS_SENDER:', process.env.SMS_SENDER_NUMBER || 'MISSING')
console.log('ADMIN_PHONE:', process.env.ADMIN_PHONE || 'MISSING')
