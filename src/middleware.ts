import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { EN_TO_KO_SLUG, KO_TO_EN_SLUG, LANDING_DOMAINS, SLUG_TO_DOMAIN } from '@/lib/landing-slugs';

// 로그인 필요한 상세 페이지 경로 패턴
const protectedPaths = [
  '/subscription/[^/]+$',  // /subscription/123 (상세) - /subscription, /subscription/map 제외
  '/properties/[^/]+$',    // /properties/123 (상세)
  '/auctions/[^/]+$',      // /auctions/123 (상세)
];

// 예외 경로 (상세가 아닌 페이지)
const excludedPaths = [
  '/subscription/map',
  '/subscription$',
  '/properties$',
  '/auctions$',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // 한글 URL 비교를 위해 디코딩 (Next.js가 인코딩된 채 넘기는 경우 대응)
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    // malformed URI는 그대로 사용
  }

  // ============================================================
  // 0) 독립 랜딩 도메인 (야목역서희스타힐스.xyz 등)
  //    도메인 루트가 곧 랜딩 — 영문 slug로 internal rewrite (주소창 유지)
  // ============================================================
  const host = (request.headers.get('host') || '').toLowerCase().split(':')[0];
  const apexHost = host.replace(/^www\./, '');
  const domainSlug = LANDING_DOMAINS[apexHost];

  // ============================================================
  // localhost 개발 프리뷰: 랜딩 슬러그를 prod 도메인으로 301하지 않고 직접 렌더
  // (host가 localhost/127.0.0.1일 때만 동작 → 운영 환경엔 영향 0)
  // ============================================================
  if (host === 'localhost' || host === '127.0.0.1') {
    for (const [koSlug, enSlug] of Object.entries(KO_TO_EN_SLUG)) {
      if (decodedPath === `/${koSlug}` || decodedPath.startsWith(`/${koSlug}/`)) {
        const url = request.nextUrl.clone();
        url.pathname = decodedPath.replace(`/${koSlug}`, `/${enSlug}`);
        return NextResponse.rewrite(url);
      }
    }
    for (const enSlug of Object.keys(EN_TO_KO_SLUG)) {
      if (decodedPath === `/${enSlug}` || decodedPath.startsWith(`/${enSlug}/`)) {
        return NextResponse.next();
      }
    }
  }
  if (domainSlug) {
    const search = request.nextUrl.search;
    // www → apex 301
    if (host !== apexHost) {
      return NextResponse.redirect(`https://${apexHost}${pathname}${search}`, 301);
    }
    // /yamok-grandhill, /야목역서희스타힐스 prefix로 들어온 경우 루트로 301 (중복 URL 방지)
    const koSlug = EN_TO_KO_SLUG[domainSlug];
    for (const prefix of [`/${domainSlug}`, `/${koSlug}`]) {
      if (decodedPath === prefix || decodedPath.startsWith(`${prefix}/`)) {
        const rest = decodedPath.slice(prefix.length) || '/';
        return NextResponse.redirect(`https://${apexHost}${encodeURI(rest)}${search}`, 301);
      }
    }
    // 루트(/) → 랜딩, 하위 경로(/business 등) → 카테고리 sub-page
    const url = request.nextUrl.clone();
    url.pathname = decodedPath === '/' ? `/${domainSlug}` : `/${domainSlug}${decodedPath}`;
    return NextResponse.rewrite(url);
  }

  // ============================================================
  // 0.5) 메인 도메인(onsia.city)에서 전용 도메인 보유 슬러그 접속
  //      → 전용 랜딩 도메인으로 301 (중복 콘텐츠 제거, SEO 단일화)
  //      예) onsia.city/야목역서희스타힐스?a=kim → 야목역서희스타힐스.xyz/?a=kim
  //      (직원 링크의 ?a= 쿼리는 그대로 보존 → 실적 추적 유지)
  // ============================================================
  for (const [slug, domain] of Object.entries(SLUG_TO_DOMAIN)) {
    const koSlug = EN_TO_KO_SLUG[slug];
    for (const prefix of [`/${slug}`, `/${koSlug}`]) {
      if (decodedPath === prefix || decodedPath.startsWith(`${prefix}/`)) {
        const rest = decodedPath.slice(prefix.length) || '/';
        return NextResponse.redirect(
          `https://${domain}${encodeURI(rest)}${request.nextUrl.search}`,
          301
        );
      }
    }
  }

  // ============================================================
  // 1) 랜딩 페이지: 한글 URL → 영문 slug로 internal rewrite
  //    (URL은 한글 그대로 유지, 코드 내부는 영문 slug로 동작)
  // ============================================================
  for (const [koSlug, enSlug] of Object.entries(KO_TO_EN_SLUG)) {
    if (decodedPath === `/${koSlug}` || decodedPath.startsWith(`/${koSlug}/`)) {
      const url = request.nextUrl.clone();
      url.pathname = decodedPath.replace(`/${koSlug}`, `/${enSlug}`);
      return NextResponse.rewrite(url);
    }
  }

  // ============================================================
  // 2) 랜딩 페이지: 영문 URL → 한글 URL 301 redirect (SEO 권한 이전)
  // ============================================================
  for (const [enSlug, koSlug] of Object.entries(EN_TO_KO_SLUG)) {
    if (decodedPath === `/${enSlug}` || decodedPath.startsWith(`/${enSlug}/`)) {
      const url = request.nextUrl.clone();
      url.pathname = decodedPath.replace(`/${enSlug}`, `/${koSlug}`);
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // ============================================================
  // 3) 인증 체크 (기존 로직)
  // ============================================================
  // 예외 경로 체크 (목록, 지도 등)
  for (const excluded of excludedPaths) {
    if (new RegExp(excluded).test(pathname)) {
      return NextResponse.next();
    }
  }

  // 상세 페이지인지 체크
  let isProtected = false;
  for (const pattern of protectedPaths) {
    if (new RegExp(pattern).test(pathname)) {
      isProtected = true;
      break;
    }
  }

  if (!isProtected) {
    return NextResponse.next();
  }

  // 로그인 체크
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 정적 파일, _next, API 제외하고 모든 페이지에 적용
    // (랜딩 한글 URL 라우팅 + 인증 체크를 한 곳에서 처리)
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)',
  ],
};
