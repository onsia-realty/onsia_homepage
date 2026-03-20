import { NextRequest, NextResponse } from 'next/server'
import { submitLandingInquiry, getLandingPageBySlug } from '@/lib/supabase-landing'
import { notifyAdmin } from '@/lib/solapi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page_id, slug, name, phone, agent_code, agent_name, utm_source, utm_medium, utm_campaign } = body

    if (!page_id || !name || !phone) {
      return NextResponse.json({ success: false, error: '필수 항목 누락' }, { status: 400 })
    }

    // DB 저장
    const result = await submitLandingInquiry({
      page_id,
      name,
      phone,
      agent_code,
      utm_source,
      utm_medium,
      utm_campaign,
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
      const smsResult = await notifyAdmin({ name, phone, projectName, agentName: agent_name })
      console.log('SMS 발송 결과:', smsResult)
    } catch (err) {
      console.error('SMS 발송 실패:', err)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 })
  }
}
