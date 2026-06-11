'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { isLandingContext } from '@/lib/landing-slugs';

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  const pathname = usePathname();
  const host = typeof window !== 'undefined' ? window.location.hostname : '';

  // 랜딩 페이지(전용 도메인 또는 onsia.city/<랜딩 슬러그>)는 로그인 세션 불필요.
  // NextAuth Provider는 DOM을 렌더링하지 않으므로 조건부 미장착해도 hydration 영향 없음.
  // → 랜딩에서 /api/auth/session 불필요 호출 제거 (500 에러 + 로딩 스피너 멈춤 현상 해소)
  if (isLandingContext(host, pathname)) {
    return <>{children}</>;
  }

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
