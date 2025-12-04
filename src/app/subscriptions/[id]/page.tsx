import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAPTSubscriptions, getOfficetelSubscriptions, getSubscriptionStatus, type CheongyakProperty } from '@/lib/cheongyakApi';
import SubscriptionDetailClient from './SubscriptionDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getSubscription(id: string): Promise<(CheongyakProperty & { status: string; statusText: string; dDay: number | null }) | null> {
  try {
    const [aptResult, officetelResult] = await Promise.all([
      getAPTSubscriptions({ perPage: 100 }),
      getOfficetelSubscriptions({ perPage: 100 }),
    ]);

    const allData = [...aptResult.data, ...officetelResult.data];
    const subscription = allData.find(item => item.HOUSE_MANAGE_NO === id);

    if (!subscription) return null;

    const statusInfo = getSubscriptionStatus(subscription);
    return { ...subscription, ...statusInfo };
  } catch (error) {
    console.error('청약 정보 조회 실패:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const subscription = await getSubscription(id);

  if (!subscription) {
    return {
      title: '청약 정보를 찾을 수 없습니다 | ONSIA',
    };
  }

  const title = `${subscription.HOUSE_NM} 청약 정보 | ONSIA`;
  const description = `${subscription.SUBSCRPT_AREA_CODE_NM} ${subscription.HOUSE_NM} - ${subscription.TOT_SUPLY_HSHLDCO}세대, ${subscription.statusText}. 청약접수: ${subscription.RCEPT_BGNDE} ~ ${subscription.RCEPT_ENDDE}`;

  return {
    title,
    description,
    keywords: [
      subscription.HOUSE_NM,
      '청약',
      subscription.SUBSCRPT_AREA_CODE_NM,
      subscription.HOUSE_SECD_NM,
      '분양',
      subscription.CNSTRCT_ENTRPS_NM,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'ONSIA',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function SubscriptionDetailPage({ params }: Props) {
  const { id } = await params;
  const subscription = await getSubscription(id);

  if (!subscription) {
    notFound();
  }

  return <SubscriptionDetailClient subscription={subscription} />;
}
