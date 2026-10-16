import { NextRequest, NextResponse } from 'next/server'
import { submitLandingInquiry, getLandingPageBySlug } from '@/lib/supabase-landing'
import { notifyAdmin } from '@/lib/solapi'

// 동의 문구 버전 — ConsentCheckboxes.tsx 문구 변경 시 함께 올릴 것
const CONSENT_VERSION = '2026-10-17'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      page_id, slug, name, phone, message, agent_code, agent_name, utm_source, utm_medium, utm_campaign,
      consent_privacy, consent_third_party, consent_marketing, consent_marketing_night, page_url,
    } = body

    if (!page_id || !name || !phone) {
      return NextResponse.json({ success: false, error: '필수 항목 누락' }, { status: 400 })
    }
    if (consent_privacy !== true || consent_third_party !== true) {
      return NextResponse.json({ success: false, error: '필수 동의 항목 미동의' }, { status: 400 })
    }

    const h = request.headers
    // DB 저장
    const result = await submitLandingInquiry({
      page_id,
      name,
      phone,
      message,
      agent_code,
      utm_source,
      utm_medium,
      utm_campaign,
      consent_privacy: true,
      consent_third_party: true,
      consent_marketing: consent_marketing === true,
      consent_marketing_night: consent_marketing === true && consent_marketing_night === true,
      consented_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,
      ip: (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || undefined,
      user_agent: h.get('user-agent') || undefined,
      page_url: typeof page_url === 'string' ? page_url.slice(0, 2000) : h.get('referer') || undefined,
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    // SMS 알림
    let projectName = '랜딩페이지'
    if (slug) {
      const page = await getLandingPageBySlug(slug)
      projectName = page?.project_name || slug
    }
    try {
      const smsResult = await notifyAdmin({ name, phone, projectName, agentName: agent_name, slug, agentCode: agent_code, marketingConsent: consent_marketing === true })
      console.log('SMS 발송 결과:', smsResult)
    } catch (err) {
      console.error('SMS 발송 실패:', err)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 })
  }
}
