import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '분양권 매물 - 전국 분양권 거래 정보 | 온시아(ONSIA)',
  description: '전국 분양권 매물 정보를 한눈에! 프리미엄, 계약금, 입주 예정일 등 분양권 거래에 필요한 모든 정보를 온시아에서 확인하세요.',
  keywords: ['온시아', '분양권', '분양권 매물', '분양권 거래', '분양권 프리미엄', '분양권 전매', '아파트 분양권', '분양권 매매'],
  openGraph: {
    title: '분양권 매물 - 전국 분양권 거래 정보 | 온시아(ONSIA)',
    description: '전국 분양권 매물 정보를 한눈에! 프리미엄, 계약금 등 분양권 거래 정보.',
    url: 'https://www.onsia.city/properties',
    siteName: '온시아(ONSIA)',
    locale: 'ko_KR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.onsia.city/properties',
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
