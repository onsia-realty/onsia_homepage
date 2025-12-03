import { NextResponse } from 'next/server';
import { getAllSubscriptions, getSubscriptionStatus, type CheongyakProperty } from '@/lib/cheongyakApi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '12');
    const region = searchParams.get('region') || undefined;
    const type = (searchParams.get('type') as 'all' | 'apt' | 'officetel' | 'remndr') || 'all';
    const status = searchParams.get('status') || undefined; // upcoming, open, closed

    const result = await getAllSubscriptions({ page, perPage: 100, region, type });

    // 상태 정보 추가 및 필터링
    let processedData = result.data.map((item: CheongyakProperty) => ({
      ...item,
      ...getSubscriptionStatus(item),
    }));

    // 상태 필터링
    if (status) {
      processedData = processedData.filter(item => item.status === status);
    }

    // 페이지네이션 적용
    const startIndex = (page - 1) * perPage;
    const paginatedData = processedData.slice(startIndex, startIndex + perPage);

    // 통계 계산
    const stats = {
      total: processedData.length,
      upcoming: processedData.filter(item => item.status === 'upcoming').length,
      open: processedData.filter(item => item.status === 'open').length,
      closed: processedData.filter(item => item.status === 'closed').length,
    };

    return NextResponse.json({
      data: paginatedData,
      stats,
      pagination: {
        page,
        perPage,
        total: status ? processedData.length : result.totalCount,
        totalPages: Math.ceil((status ? processedData.length : result.totalCount) / perPage),
      },
    });
  } catch (error) {
    console.error('청약 정보 조회 실패:', error);
    return NextResponse.json(
      { error: '청약 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
