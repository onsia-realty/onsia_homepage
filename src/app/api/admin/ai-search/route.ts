import { NextRequest, NextResponse } from 'next/server';

// AI 검색 결과 타입
interface SearchResult {
  title: string;
  city: string;
  district: string;
  address: string;
  basePrice: string;
  contractDeposit: string;
  completionDate: string;
  totalUnits: string;
  buildingType: string;
  constructor: string;
  keyFeature: string;
  locationDesc: string;
  pricePerPyeong: string;
  pyeongTypes: string;
  facilities: string;
  investmentGrade: string;
  description: string;
  sources: string[];
}

// 텍스트에서 정보 추출하는 함수
function extractPropertyInfo(searchResults: string, propertyName: string): Partial<SearchResult> {
  const result: Partial<SearchResult> = {
    title: propertyName,
    sources: [],
  };

  // 가격 패턴 추출 (억, 원)
  const pricePatterns = [
    /분양가[:\s]*([0-9,.]+)\s*억/gi,
    /분양가[:\s]*([0-9,]+)\s*만원/gi,
    /([0-9,.]+)\s*억\s*원?[^\d]*분양/gi,
  ];

  for (const pattern of pricePatterns) {
    const match = pattern.exec(searchResults);
    if (match) {
      result.basePrice = match[1].replace(/,/g, '');
      break;
    }
  }

  // 계약금 패턴
  const depositPatterns = [
    /계약금[:\s]*([0-9,.]+)\s*[%억만]/gi,
    /계약금[:\s]*([0-9,]+)/gi,
  ];

  for (const pattern of depositPatterns) {
    const match = pattern.exec(searchResults);
    if (match) {
      result.contractDeposit = match[1].replace(/,/g, '');
      break;
    }
  }

  // 세대수 패턴
  const unitsPatterns = [
    /총\s*([0-9,]+)\s*세대/gi,
    /([0-9,]+)\s*세대\s*규모/gi,
    /([0-9,]+)\s*실\s*규모/gi,
  ];

  for (const pattern of unitsPatterns) {
    const match = pattern.exec(searchResults);
    if (match) {
      result.totalUnits = match[1].replace(/,/g, '');
      break;
    }
  }

  // 준공/입주 예정일 패턴
  const datePatterns = [
    /준공[^\d]*(\d{4})[년.]\s*(\d{1,2})?[월]?/gi,
    /입주[^\d]*(\d{4})[년.]\s*(\d{1,2})?[월]?/gi,
    /(\d{4})[년.]\s*(\d{1,2})?[월]?\s*준공/gi,
  ];

  for (const pattern of datePatterns) {
    const match = pattern.exec(searchResults);
    if (match) {
      const year = match[1];
      const month = match[2] || '12';
      result.completionDate = `${year}-${month.padStart(2, '0')}-01`;
      break;
    }
  }

  // 시공사 패턴
  const constructorPatterns = [
    /시공[사:]?\s*[:\s]*([가-힣]+(?:건설|산업|종합|E&C)?)/gi,
    /(현대건설|삼성물산|대우건설|GS건설|포스코건설|SK에코플랜트|롯데건설|HDC현대산업개발)/gi,
  ];

  for (const pattern of constructorPatterns) {
    const match = pattern.exec(searchResults);
    if (match) {
      result.constructor = match[1];
      break;
    }
  }

  // 위치 패턴 (시/도, 구/군)
  const locationPatterns = [
    /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)[도시]?\s*([가-힣]+[시군구])/gi,
  ];

  for (const pattern of locationPatterns) {
    const match = pattern.exec(searchResults);
    if (match) {
      result.city = match[1] + (match[1].length === 2 ? '도' : '');
      result.district = match[2];
      break;
    }
  }

  // 평형 패턴
  const pyeongPatterns = [
    /(\d+[AB]?(?:㎡|평)?(?:,\s*\d+[AB]?(?:㎡|평)?)+)/gi,
    /전용\s*(\d+)(?:~(\d+))?(?:㎡|평)/gi,
  ];

  for (const pattern of pyeongPatterns) {
    const match = pattern.exec(searchResults);
    if (match) {
      result.pyeongTypes = match[0];
      break;
    }
  }

  // 건물 유형 추정
  if (searchResults.includes('오피스텔')) {
    result.buildingType = 'OFFICETEL';
  } else if (searchResults.includes('아파트')) {
    result.buildingType = 'APARTMENT';
  } else if (searchResults.includes('빌라') || searchResults.includes('연립')) {
    result.buildingType = 'VILLA';
  } else if (searchResults.includes('상가') || searchResults.includes('지식산업')) {
    result.buildingType = 'COMMERCIAL';
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyName } = body;

    if (!propertyName) {
      return NextResponse.json(
        { error: '현장명을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 검색 쿼리 구성
    const searchQueries = [
      `${propertyName} 분양가 계약금`,
      `${propertyName} 위치 세대수 준공`,
      `${propertyName} 시공사 평형`,
    ];

    // 실제로는 여기서 웹 검색 API를 호출해야 함
    // 현재는 Claude의 WebSearch 도구를 직접 사용할 수 없으므로
    // 대신 프론트엔드에서 수동 입력하거나,
    // 외부 검색 API (Serper, Google Custom Search 등)를 연동해야 함

    // 임시 응답 - 검색 쿼리만 반환
    return NextResponse.json({
      success: true,
      message: 'AI 검색 기능은 외부 검색 API 연동이 필요합니다.',
      searchQueries,
      tip: '현재는 Claude에게 직접 "' + propertyName + ' 분양 정보 검색해줘"라고 요청하세요.',
      // 나중에 Serper API 등 연동 시 실제 결과 반환
      result: null,
    });

  } catch (error) {
    console.error('AI search error:', error);
    return NextResponse.json(
      { error: 'AI 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
