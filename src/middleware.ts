import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { EN_TO_KO_SLUG, KO_TO_EN_SLUG } from '@/lib/landing-slugs';

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
