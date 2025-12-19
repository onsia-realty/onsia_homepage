import { NextRequest, NextResponse } from 'next/server';
import {
  getRecentRealPrices,
  extractLawdCd,
  parsePrice,
  calculatePricePerPyeong,
  RealPriceData,
} from '@/lib/realPriceApi';

// 실거래가 데이터를 통일된 형식으로 변환
interface ProcessedTransaction {
  buildingName: string;
  dong: string;
  area: number;
  price: number;
  pricePerPyeong: number;
  dealDate: string;
  buildYear: string;
  floor: string;
}

// 주소에서 시도, 시군구 추출
function parseAddress(address: string): { sido: string; sigungu: string } | null {
  if (!address) return null;

  // 패턴: "경기도 용인시 처인구 양지면 양지리"
  const patterns = [
    // 경기도 패턴
    /^(경기도?)\s+(\S+시)/,
    // 서울 패턴
    /^(서울특별시|서울)\s+(\S+구)/,
    // 광역시 패턴
    /^(\S+광역시)\s+(\S+구)/,
    // 기타 시도 패턴
    /^(\S+도)\s+(\S+[시군구])/,
  ];

  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      return { sido: match[1], sigungu: match[2] };
    }
  }

  return null;
}

// RealPriceData를 ProcessedTransaction으로 변환
function convertRealPriceData(data: RealPriceData[]): ProcessedTransaction[] {
  return data.map(item => ({
    buildingName: item.aptNm,
    dong: item.umdNm,
    area: item.excluUseAr,
    price: parsePrice(item.dealAmount),
    pricePerPyeong: calculatePricePerPyeong(parsePrice(item.dealAmount), item.excluUseAr),
    dealDate: `${item.dealYear}${String(item.dealMonth).padStart(2, '0')}${String(item.dealDay).padStart(2, '0')}`,
    buildYear: String(item.buildYear),
    floor: String(item.floor),
  }));
}

// 단지별로 그룹화하여 평균 시세 계산
function groupByComplex(transactions: ProcessedTransaction[]): {
  name: string;
  dong: string;
  avgPrice: number;
  avgPricePerPyeong: number;
  avgArea: number;
  recentDate: string;
  count: number;
  buildYear: string;
}[] {
  const grouped = transactions.reduce((acc, t) => {
    const key = t.buildingName;
    if (!acc[key]) {
      acc[key] = {
        name: t.buildingName,
        dong: t.dong,
        prices: [],
        pricesPerPyeong: [],
        areas: [],
        dates: [],
        buildYear: t.buildYear,
      };
    }
    acc[key].prices.push(t.price);
    acc[key].pricesPerPyeong.push(t.pricePerPyeong);
    acc[key].areas.push(t.area);
    acc[key].dates.push(t.dealDate);
    return acc;
  }, {} as Record<string, {
    name: string;
    dong: string;
    prices: number[];
    pricesPerPyeong: number[];
    areas: number[];
    dates: string[];
    buildYear: string;
  }>);

  return Object.values(grouped).map(g => ({
    name: g.name,
    dong: g.dong,
    avgPrice: Math.round(g.prices.reduce((a, b) => a + b, 0) / g.prices.length),
    avgPricePerPyeong: Math.round(g.pricesPerPyeong.reduce((a, b) => a + b, 0) / g.pricesPerPyeong.length),
    avgArea: Math.round(g.areas.reduce((a, b) => a + b, 0) / g.areas.length * 10) / 10,
    recentDate: g.dates.sort().reverse()[0],
    count: g.prices.length,
    buildYear: g.buildYear,
  })).sort((a, b) => b.count - a.count); // 거래건수 많은 순으로 정렬
}

// 분양가 대비 시세차 계산
function calculatePriceDiff(
  subscriptionPricePerPyeong: number,
  complexes: ReturnType<typeof groupByComplex>
) {
  return complexes.map(c => ({
    ...c,
    priceDiff: c.avgPricePerPyeong - subscriptionPricePerPyeong,
    priceDiffPercent: subscriptionPricePerPyeong > 0
      ? Math.round((c.avgPricePerPyeong - subscriptionPricePerPyeong) / subscriptionPricePerPyeong * 1000) / 10
      : 0,
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  // 분양 단지 주소 (필수)
  const address = searchParams.get('address') || '';
  // 분양 평당가 (만원 단위)
  const subscriptionPricePerPyeong = parseInt(searchParams.get('pricePerPyeong') || '0', 10);

  if (!address) {
    return NextResponse.json(
      { success: false, error: '주소 정보가 필요합니다.' },
      { status: 400 }
    );
  }

  // 주소 파싱
  const location = parseAddress(address);
  if (!location) {
    return NextResponse.json({
      success: false,
      error: '주소를 파싱할 수 없습니다.',
      data: {
        id,
        address,
        complexes: [],
        summary: {
          totalCount: 0,
          avgPricePerPyeong: 0,
        },
      },
    });
  }

  try {
    // 주소에서 법정동 코드 추출
    const lawdCd = extractLawdCd(address);

    if (!lawdCd) {
      return NextResponse.json({
        success: false,
        error: '지역 코드를 찾을 수 없습니다.',
        data: {
          id,
          address,
          complexes: [],
          summary: {
            totalCount: 0,
            avgPricePerPyeong: 0,
          },
        },
      });
    }

    // 최근 6개월 실거래가 조회
    const realPriceData = await getRecentRealPrices(lawdCd, 6);

    // ProcessedTransaction 형식으로 변환
    const transactions = convertRealPriceData(realPriceData);

    if (transactions.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          id,
          address,
          location,
          complexes: [],
          summary: {
            totalCount: 0,
            avgPricePerPyeong: 0,
          },
          message: '해당 지역의 실거래 데이터가 없습니다.',
        },
      });
    }

    // 단지별 그룹화
    const complexes = groupByComplex(transactions);

    // 분양가 대비 시세차 계산
    const complexesWithDiff = subscriptionPricePerPyeong > 0
      ? calculatePriceDiff(subscriptionPricePerPyeong, complexes)
      : complexes.map(c => ({
          ...c,
          priceDiff: 0,
          priceDiffPercent: 0,
        }));

    // 전체 평균 평당가
    const avgPricePerPyeong = complexes.length > 0
      ? Math.round(complexes.reduce((sum, c) => sum + c.avgPricePerPyeong * c.count, 0) /
          complexes.reduce((sum, c) => sum + c.count, 0))
      : 0;

    // 지역 평균 대비 분양가 차이
    const marketDiffPercent = avgPricePerPyeong > 0 && subscriptionPricePerPyeong > 0
      ? Math.round((subscriptionPricePerPyeong - avgPricePerPyeong) / avgPricePerPyeong * 1000) / 10
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        id,
        address,
        location,
        subscriptionPricePerPyeong,
        complexes: complexesWithDiff.slice(0, 10), // 상위 10개 단지
        summary: {
          totalCount: transactions.length,
          complexCount: complexes.length,
          avgPricePerPyeong,
          marketDiffPercent, // 양수: 분양가가 시세보다 높음, 음수: 분양가가 시세보다 낮음
          marketDiffText: marketDiffPercent > 0
            ? `분양가가 주변 시세보다 ${Math.abs(marketDiffPercent)}% 높음`
            : marketDiffPercent < 0
              ? `분양가가 주변 시세보다 ${Math.abs(marketDiffPercent)}% 낮음 (시세차익 기대)`
              : '주변 시세와 유사',
        },
      },
    });
  } catch (error) {
    console.error('경쟁단지 시세비교 조회 실패:', error);
    return NextResponse.json(
      { success: false, error: '시세 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
