import { Metadata } from 'next';
import SubscriptionListClient from '../SubscriptionListClient';

export const metadata: Metadata = {
  title: '아파트 청약 일정 | 전국 APT 분양 정보',
  description: '전국 아파트 청약 일정을 한눈에 확인하세요. 청약홈 공공데이터 API를 통한 실시간 APT 분양 정보, 청약 접수일, 당첨 발표일 안내.',
  keywords: ['아파트 청약', 'APT 청약', '아파트 분양', '청약 일정', '아파트 청약 접수', '분양 정보', '청약홈'],
  openGraph: {
    title: '아파트 청약 일정 | ONSIA',
    description: '전국 아파트 청약 일정을 한눈에 확인하세요. 실시간 APT 분양 정보 제공.',
    url: 'https://www.onsia.city/subscriptions/apt',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/subscriptions/apt',
  },
};

export default function APTSubscriptionsPage() {
  return (
    <SubscriptionListClient
      defaultType="apt"
      title="아파트 청약"
      subtitle="APT"
      description="전국 아파트 청약 일정을 확인하세요"
      colorTheme="blue"
    />
  );
}
