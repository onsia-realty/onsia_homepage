import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_CRM_URL,
  process.env.SUPABASE_CRM_SERVICE_ROLE_KEY,
  { db: { schema: 'landing' } }
)

// 최근 관심고객 조회
const { data, error } = await supabase
  .from('inquiries')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(5)

console.log('=== 최근 관심고객 등록 ===')
if (error) {
  console.error('ERROR:', error)
} else {
  data.forEach((inq, i) => {
    console.log(`[${i+1}] ${inq.created_at}`)
    console.log(`  이름: ${inq.name} | 연락처: ${inq.phone}`)
    console.log(`  agent: ${inq.agent_code || '없음'} | 상태: ${inq.status}`)
  })
}

// 솔라피 SMS 발송 테스트 (청약홈 이름으로)
console.log('\n=== 솔라피 SMS 직접 발송 테스트 ===')
try {
  const { SolapiMessageService } = await import('solapi')
  const messageService = new SolapiMessageService(
    process.env.SOLAPI_API_KEY,
    process.env.SOLAPI_API_SECRET
  )

  // 발신번호 확인
  console.log('발신번호:', process.env.SMS_SENDER_NUMBER)
  console.log('수신번호:', process.env.ADMIN_PHONE)

  const result = await messageService.sendOne({
    to: process.env.ADMIN_PHONE.replace(/-/g, ''),
    from: process.env.SMS_SENDER_NUMBER.replace(/-/g, ''),
    text: '[온시아] 문의 접수\n왕십리역 어반홈스\n이름: 청약홈\n연락처: 테스트'
  })
  console.log('SMS 결과:', JSON.stringify(result, null, 2))
} catch (err) {
  console.error('SMS 실패:', err.message || err)
}
