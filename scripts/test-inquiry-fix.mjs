import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.NEXT_PUBLIC_SUPABASE_CRM_URL
const serviceKey = process.env.SUPABASE_CRM_SERVICE_ROLE_KEY

const supabase = createClient(url, serviceKey, { db: { schema: 'landing' } })

// service_role로 insert 테스트
const { data: page } = await supabase
  .from('pages')
  .select('id')
  .eq('slug', 'urbanhomes')
  .single()

console.log('=== service_role INSERT 테스트 ===')
const { data: testResult, error: testError } = await supabase
  .from('inquiries')
  .insert({
    page_id: page.id,
    name: 'SERVICE_ROLE_TEST',
    phone: '000-0000-0000'
  })
  .select()

if (testError) {
  console.log('service_role INSERT 실패:', testError.message)
} else {
  console.log('service_role INSERT 성공!')
  // 삭제
  if (testResult && testResult[0]) {
    await supabase.from('inquiries').delete().eq('id', testResult[0].id)
    console.log('테스트 데이터 삭제 완료')
  }
}

// 솔라피 SMS 테스트
console.log('\n=== 솔라피 SMS 발송 테스트 ===')
try {
  const { SolapiMessageService } = await import('solapi')
  const messageService = new SolapiMessageService(
    process.env.SOLAPI_API_KEY,
    process.env.SOLAPI_API_SECRET
  )

  const result = await messageService.sendOne({
    to: process.env.ADMIN_PHONE,
    from: process.env.SMS_SENDER_NUMBER,
    text: '[온시아] 테스트 - 솔라피 연결 확인 메시지입니다.'
  })
  console.log('SMS 발송 성공:', JSON.stringify(result, null, 2))
} catch (err) {
  console.log('SMS 발송 실패:', err.message || err)
}
