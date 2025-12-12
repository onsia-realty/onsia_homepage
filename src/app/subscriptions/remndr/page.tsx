import { Metadata } from 'next';
import SubscriptionListClient from '../SubscriptionListClient';

export const metadata: Metadata = {
  title: '무순위/잔여세대 청약 일정 | 줍줍 청약 정보',
  description: '전국 무순위 및 잔여세대 청약 일정을 한눈에 확인하세요. 청약홈 공공데이터 API를 통한 실시간 무순위 청약 정보, 줍줍 청약, 잔여세대 분양 안내.',
  keywords: ['무순위 청약', '잔여세대', '줍줍 청약', '무순위 분양', '잔여세대 청약', '청약 정보', '청약홈'],
  openGraph: {
    title: '무순위/잔여세대 청약 일정 | ONSIA',
    description: '전국 무순위 및 잔여세대 청약 일정을 한눈에 확인하세요. 줍줍 청약 정보.',
    url: 'https://www.onsia.city/subscriptions/remndr',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/subscriptions/remndr',
  },
};

export default function RemndrSubscriptionsPage() {
  return (
    <SubscriptionListClient
      defaultType="remndr"
      title="무순위/잔여세대 청약"
      subtitle="REMNDR"
      description="무순위 및 잔여세대 청약 일정을 확인하세요"
      colorTheme="green"
    />
  );
}
