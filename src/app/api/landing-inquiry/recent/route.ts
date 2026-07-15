import { NextRequest, NextResponse } from 'next/server'
import { createLandingAdminClient } from '@/lib/supabase-landing'

// 랜딩 페이지 최근 접수 내역 조회 (이름 마스킹) — 실시간 접수 현황 티커용
// GET /api/landing-inquiry/recent?page_id=xxx&limit=5 → { items: [{ name, phone, at }] }
export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get('page_id')
  if (!pageId) return NextResponse.json({ error: 'page_id required' }, { status: 400 })
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 5, 10)
  try {
    const admin = createLandingAdminClient()
    const { data, error } = await admin
      .from('inquiries')
      .select('name, created_at')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    const mask = (n: string) => { const s = (n || '').trim(); return s.length <= 1 ? s + '*' : s[0] + '*'.repeat(Math.max(1, s.length - 1)) }
    const items = (data || []).map((r: { name: string; created_at: string }) => ({ name: mask(r.name), phone: '010-****-****', at: r.created_at }))
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=120' } })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
