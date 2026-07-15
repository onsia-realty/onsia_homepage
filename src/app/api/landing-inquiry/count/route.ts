import { NextRequest, NextResponse } from 'next/server'
import { createLandingAdminClient } from '@/lib/supabase-landing'

// 랜딩 페이지 문의(관심고객) 등록 건수 카운트 — 소셜프루프 카운터용
// GET /api/landing-inquiry/count?page_id=xxx → { count }
export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get('page_id')
  if (!pageId) {
    return NextResponse.json({ error: 'page_id required' }, { status: 400 })
  }

  try {
    const admin = createLandingAdminClient()
    const { count, error } = await admin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('page_id', pageId)

    if (error) throw error

    return NextResponse.json(
      { count: count ?? 0 },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    )
  } catch (e) {
    console.error('landing-inquiry count error:', e)
    // 폴백: 카운터는 부가 요소이므로 실패해도 0으로 응답 (FAB는 baseline 표시 유지)
    return NextResponse.json({ count: 0 }, { status: 200 })
  }
}
