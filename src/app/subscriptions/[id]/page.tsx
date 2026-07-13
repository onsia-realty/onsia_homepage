import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { getAPTSubscriptions, getOfficetelSubscriptions, getSubscriptionStatus, type CheongyakProperty } from '@/lib/cheongyakApi';
import { getCoordinatesFromAddress, getCoordinatesFromKeyword, getDefaultCoordinatesForRegion } from '@/lib/geocoding';
import SubscriptionDetailClient from './SubscriptionDetailClient';

const prisma = new PrismaClient();

interface Props {
  params: Promise<{ id: string }>;
}

type SubscriptionWithStatus = CheongyakProperty & { status: string; statusText: string; dDay: number | null };

async function getSubscription(id: string): Promise<SubscriptionWithStatus | null> {
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

/**
 * 지도 좌표 해석 (우선순위):
 * 1. DB 크롤링 좌표 (Subscription.latitude/longitude) — 가장 정확
 * 2. 주소 지오코딩 (카카오 주소 검색)
 * 3. 주택명 키워드 검색
 * 4. 지역 기본 좌표
 * 5. null → 지도 섹션 숨김
 */
async function resolveCoords(sub: SubscriptionWithStatus): Promise<{ lat: number; lng: number } | null> {
  // 1. DB 크롤링 좌표
  try {
    const db = await prisma.subscription.findUnique({
      where: { houseManageNo: sub.HOUSE_MANAGE_NO },
      select: { latitude: true, longitude: true },
    });
    if (db?.latitude && db?.longitude) {
      return { lat: db.latitude, lng: db.longitude };
    }
  } catch {
    // DB 미존재/조회 실패 → 지오코딩으로 폴백
  }

  // 2. 주소 지오코딩
  if (sub.HSSPLY_ADRES) {
    const g = await getCoordinatesFromAddress(sub.HSSPLY_ADRES);
    if (g) return { lat: g.lat, lng: g.lng };
  }

  // 3. 주택명 키워드 검색
  if (sub.HOUSE_NM) {
    const k = await getCoordinatesFromKeyword(`${sub.HOUSE_NM} 아파트`);
    if (k) return { lat: k.lat, lng: k.lng };
  }

  // 4. 지역 기본 좌표
  if (sub.SUBSCRPT_AREA_CODE_NM) {
    return getDefaultCoordinatesForRegion(sub.SUBSCRPT_AREA_CODE_NM);
  }

  // 5. 좌표 없음
  return null;
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

  const coords = await resolveCoords(subscription);

  return <SubscriptionDetailClient subscription={subscription} coords={coords} />;
}
