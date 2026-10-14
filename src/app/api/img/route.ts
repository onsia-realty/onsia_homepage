import { NextResponse } from 'next/server';
import { lookup } from 'node:dns/promises';
import { isCachedThumbnailUrl } from '@/lib/subscriptionThumbnail';

// 동일 출처 이미지 프록시: /api/img?u=<원격 이미지 URL>
// 허용 대상은 DB에 캐시된 청약 썸네일 URL뿐 (핫링크 차단·mixed content 회피). SSRF 방지: http(s) + 사설/로컬 IP 차단
const MAX_BYTES = 8 * 1024 * 1024;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

// localhost / 사설·링크로컬·루프백 IPv4 / IPv6 로컬 대역
const isBlockedHost = (h: string) =>
  /^(localhost|.*\.local|.*\.internal)$/i.test(h) ||
  /^(0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h) ||
  /^(::1|::|fc|fd|fe80|::ffff:)/i.test(h.replace(/^\[|\]$/g, ''));

export async function GET(request: Request) {
  const u = new URL(request.url).searchParams.get('u') || '';
  let target: URL;
  try { target = new URL(u); } catch { return new NextResponse('bad url', { status: 400 }); }
  if (!/^https?:$/.test(target.protocol) || isBlockedHost(target.hostname)) return new NextResponse('forbidden', { status: 403 });
  try {
    const { address } = await lookup(target.hostname);
    if (isBlockedHost(address)) return new NextResponse('forbidden', { status: 403 });
  } catch { return new NextResponse('not found', { status: 404 }); }
  if (!(await isCachedThumbnailUrl(target.href))) return new NextResponse('forbidden', { status: 403 });

  try {
    const res = await fetch(target, { headers: { 'user-agent': UA, accept: 'image/*,*/*;q=0.8', referer: target.origin + '/' }, signal: AbortSignal.timeout(10000) });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.startsWith('image/')) return new NextResponse('upstream error', { status: 502 });
    if (Number(res.headers.get('content-length') || 0) > MAX_BYTES) return new NextResponse('too large', { status: 413 });
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) return new NextResponse('too large', { status: 413 });
    return new NextResponse(buf, {
      headers: {
        'content-type': type,
        'cache-control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('upstream error', { status: 502 });
  }
}
