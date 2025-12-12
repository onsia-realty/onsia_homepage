import { Metadata } from 'next';
import SubscriptionListClient from '../SubscriptionListClient';

export const metadata: Metadata = {
  title: '오피스텔 청약 일정 | 도시형생활주택 분양 정보',
  description: '전국 오피스텔 및 도시형생활주택 청약 일정을 한눈에 확인하세요. 청약홈 공공데이터 API를 통한 실시간 오피스텔 분양 정보, 청약 접수일, 당첨 발표일 안내.',
  keywords: ['오피스텔 청약', '도시형생활주택', '오피스텔 분양', '청약 일정', '오피스텔 청약 접수', '분양 정보', '청약홈'],
  openGraph: {
    title: '오피스텔 청약 일정 | ONSIA',
    description: '전국 오피스텔 및 도시형생활주택 청약 일정을 한눈에 확인하세요.',
    url: 'https://www.onsia.city/subscriptions/officetel',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/subscriptions/officetel',
  },
};

export default function OfficetelSubscriptionsPage() {
  return (
    <SubscriptionListClient
      defaultType="officetel"
      title="오피스텔 청약"
      subtitle="OFFICETEL"
      description="전국 오피스텔 및 도시형생활주택 청약 일정을 확인하세요"
      colorTheme="purple"
    />
  );
}
