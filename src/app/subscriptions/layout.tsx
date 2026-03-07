import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '청약 일정 - 전국 아파트 청약 캘린더 | 온시아(ONSIA)',
  description: '전국 아파트, 오피스텔, 무순위/잔여세대 청약 일정을 캘린더로 한눈에! 공고일, 특별공급, 1순위, 당첨자 발표일까지 온시아에서 확인하세요.',
  keywords: ['온시아', '청약 일정', '청약 캘린더', '아파트 청약', '오피스텔 청약', '무순위 청약', '잔여세대', '줍줍', '청약홈'],
  openGraph: {
    title: '청약 일정 - 전국 아파트 청약 캘린더 | 온시아(ONSIA)',
    description: '전국 아파트, 오피스텔, 무순위 청약 일정을 캘린더로 한눈에!',
    url: 'https://www.onsia.city/subscriptions',
    siteName: '온시아(ONSIA)',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.onsia.city/subscriptions',
  },
};

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
