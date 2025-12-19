/**
 * 실거래가 통계 API
 *
 * GET /api/real-price/stats?sido=서울특별시&sigungu=관악구&propertyType=아파트&months=6
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRealPriceStats, formatPrice } from '@/lib/real-estate-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const sido = searchParams.get('sido');
  const sigungu = searchParams.get('sigungu');
  const propertyType = searchParams.get('propertyType') || '아파트';
  const months = parseInt(searchParams.get('months') || '6', 10);

  if (!sido || !sigungu) {
    return NextResponse.json({
      success: false,
      error: 'sido와 sigungu 파라미터가 필요합니다.',
    }, { status: 400 });
  }

  try {
    const stats = await getRealPriceStats(sido, sigungu, propertyType, months);

    return NextResponse.json({
      success: true,
      data: {
        sido,
        sigungu,
        propertyType,
        months,
        stats: {
          ...stats,
          avgPriceFormatted: formatPrice(stats.avgPrice),
          avgPricePerPyeongFormatted: formatPrice(stats.avgPricePerPyeong),
          maxPriceFormatted: formatPrice(stats.maxPrice),
          minPriceFormatted: formatPrice(stats.minPrice),
        },
      },
    });
  } catch (error) {
    console.error('실거래가 통계 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '실거래가 통계 조회 중 오류가 발생했습니다.',
    }, { status: 500 });
  }
}
