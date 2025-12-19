/**
 * 실거래가 조회 API
 *
 * GET /api/real-price?sido=서울특별시&sigungu=관악구&propertyType=아파트&months=6
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecentTransactions, formatPrice, sqmToPyeong } from '@/lib/real-estate-api';
import { getSidoList, getSigunguList } from '@/lib/lawd-codes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // 지역 목록 조회
  if (searchParams.get('list') === 'sido') {
    return NextResponse.json({
      success: true,
      data: getSidoList(),
    });
  }

  // 시/군/구 목록 조회
  const sidoForList = searchParams.get('list');
  if (sidoForList && sidoForList !== 'sido') {
    return NextResponse.json({
      success: true,
      data: getSigunguList(sidoForList),
    });
  }

  // 실거래가 조회
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
    const transactions = await getRecentTransactions(sido, sigungu, propertyType, months);

    // 응답 데이터 포맷팅
    const formattedTransactions = transactions.map(t => ({
      ...t,
      priceFormatted: formatPrice(t.price),
      pyeong: sqmToPyeong(t.area),
      pricePerPyeongFormatted: formatPrice(t.pricePerPyeong),
    }));

    return NextResponse.json({
      success: true,
      data: {
        sido,
        sigungu,
        propertyType,
        months,
        totalCount: transactions.length,
        transactions: formattedTransactions,
      },
    });
  } catch (error) {
    console.error('실거래가 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '실거래가 조회 중 오류가 발생했습니다.',
    }, { status: 500 });
  }
}
