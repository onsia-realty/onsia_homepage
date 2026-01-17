import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 필요한 상세 페이지 경로 패턴
const protectedPaths = [
  '/mypage',               // 마이페이지
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
    '/mypage/:path*',
    '/subscription/:path*',
    '/properties/:path*',
    '/auctions/:path*',
  ],
};
