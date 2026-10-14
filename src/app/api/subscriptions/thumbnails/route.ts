import { NextResponse } from 'next/server';
import { getThumbnails } from '@/lib/subscriptionThumbnail';

// GET /api/subscriptions/thumbnails?ids=a,b,c[&force=1] → { data: {id: imageUrl|null}, meta: {id: {source, page}} }
// force=1: '없음'으로 캐시된 단지도 재시도 (사전 해석 스크립트용)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = [...new Set((searchParams.get('ids') || '').split(',').map(s => s.trim()).filter(s => /^\d{6,}$/.test(s)))].slice(0, 100);
  if (!ids.length) return NextResponse.json({ data: {}, meta: {} });
  try {
    const thumbs = await getThumbnails(ids, 6, searchParams.get('force') === '1');
    const data: Record<string, string | null> = {};
    const meta: Record<string, { source: string; page: string | null } | null> = {};
    for (const id of ids) {
      const t = thumbs[id];
      data[id] = t?.url ?? null;
      meta[id] = t ? { source: t.source, page: t.page } : null;
    }
    return NextResponse.json({ data, meta });
  } catch (error) {
    console.error('청약 썸네일 조회 실패:', error);
    return NextResponse.json({ error: '썸네일을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
