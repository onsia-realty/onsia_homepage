import { NextResponse } from 'next/server';
import { getAPTSubscriptions, getOfficetelSubscriptions, getSubscriptionStatus } from '@/lib/cheongyakApi';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // APT와 오피스텔 데이터에서 검색
    const [aptResult, officetelResult] = await Promise.all([
      getAPTSubscriptions({ perPage: 100 }),
      getOfficetelSubscriptions({ perPage: 100 }),
    ]);

    const allData = [...aptResult.data, ...officetelResult.data];

    // HOUSE_MANAGE_NO로 검색
    const subscription = allData.find(item => item.HOUSE_MANAGE_NO === id);

    if (!subscription) {
      return NextResponse.json(
        { error: '청약 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 상태 정보 추가
    const statusInfo = getSubscriptionStatus(subscription);

    return NextResponse.json({
      ...subscription,
      ...statusInfo,
    });
  } catch (error) {
    console.error('청약 상세 정보 조회 실패:', error);
    return NextResponse.json(
      { error: '청약 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
