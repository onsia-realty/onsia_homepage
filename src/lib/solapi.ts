import { SolapiMessageService } from 'solapi'

const messageService = new SolapiMessageService(
  (process.env.SOLAPI_API_KEY || '').trim().replace(/[\r\n]/g, ''),
  (process.env.SOLAPI_API_SECRET || '').trim().replace(/[\r\n]/g, '')
)

const SENDER = (process.env.SMS_SENDER_NUMBER || '').trim().replace(/[\r\n]/g, '')
const ADMIN = (process.env.ADMIN_PHONE || '').trim().replace(/[\r\n]/g, '')

export async function notifyAdmin(inquiry: {
  name: string
  phone: string
  projectName: string
  agentName?: string
}) {
  const agentInfo = inquiry.agentName ? ` (담당: ${inquiry.agentName})` : ''
  const text = `[온시아] 문의 접수${agentInfo}\n${inquiry.projectName}\n이름: ${inquiry.name}\n연락처: ${inquiry.phone}`

  try {
    await messageService.sendOne({
      to: ADMIN,
      from: SENDER,
      text,
    })
    return { success: true }
  } catch (err) {
    console.error('SMS 발송 실패:', err)
    return { success: false, error: String(err) }
  }
}
