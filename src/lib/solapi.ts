import { SolapiMessageService } from 'solapi'

const messageService = new SolapiMessageService(
  (process.env.SOLAPI_API_KEY || '').trim().replace(/[\r\n]/g, ''),
  (process.env.SOLAPI_API_SECRET || '').trim().replace(/[\r\n]/g, '')
)

const SENDER = (process.env.SMS_SENDER_NUMBER || '').trim().replace(/[\r\n]/g, '')
const ADMIN = (process.env.ADMIN_PHONE || '').trim().replace(/[\r\n]/g, '')

/**
 * 직원(agent) 페이지 접수 알림을 받을 휴대폰 번호. (slug:agent_code 키)
 * 키가 없는 직원 페이지와 메인 페이지는 기존대로 ADMIN_PHONE 으로 간다.
 */
const AGENT_PHONES: Record<string, string> = {
  'yamok-grandhill:ys': '010-3878-3119', // 윤상
}

export async function notifyAdmin(inquiry: {
  name: string
  phone: string
  projectName: string
  agentName?: string
  slug?: string
  agentCode?: string
  marketingConsent?: boolean
}) {
  const agentInfo = inquiry.agentName ? ` (담당: ${inquiry.agentName})` : ''
  // 광고수신 표기는 동의 3분리 적용 현장(marketingConsent 전달 시)에만 — 기존 현장 SMS 문구는 그대로
  const marketingInfo = inquiry.marketingConsent === undefined ? '' : `\n광고수신 ${inquiry.marketingConsent ? 'O' : 'X'}`
  const text = `[온시아] 문의 접수${agentInfo}\n${inquiry.projectName}\n이름: ${inquiry.name}\n연락처: ${inquiry.phone}${marketingInfo}`

  const to =
    (inquiry.slug && inquiry.agentCode
      ? AGENT_PHONES[`${inquiry.slug}:${inquiry.agentCode}`]
      : undefined) || ADMIN

  try {
    await messageService.sendOne({
      to,
      from: SENDER,
      text,
    })
    return { success: true, to }
  } catch (err) {
    console.error('SMS 발송 실패:', err)
    return { success: false, error: String(err) }
  }
}
