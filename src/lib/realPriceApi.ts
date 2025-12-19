// 국토교통부 아파트 실거래가 API 클라이언트

const BASE_URL = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev';
const API_KEY = process.env.DATA_GO_KR_API_KEY || '';

export interface RealPriceData {
  aptNm: string;              // 아파트 이름
  dealAmount: string;         // 거래금액 (예: "7,000")
  dealYear: number;           // 거래년도
  dealMonth: number;          // 거래월
  dealDay: number;            // 거래일
  buildYear: number;          // 건축년도
  excluUseAr: number;         // 전용면적 (㎡)
  floor: number;              // 층
  umdNm: string;              // 법정동 이름
  jibun: string;              // 지번
  sggCd: number;              // 시군구 코드
  aptDong?: string;           // 아파트 동
  dealingGbn?: string;        // 거래구분
  estateAgentSggNm?: string;  // 중개사 소재지
  rgstDate?: string;          // 등기일자
}

export interface RealPriceResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: RealPriceData[] | RealPriceData;
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

/**
 * 아파트 실거래가 조회
 * @param params.lawdCd 지역코드 (5자리, 예: 41135)
 * @param params.dealYmd 계약월 (6자리, 예: 202511)
 * @param params.numOfRows 한 페이지 결과 수 (기본 100)
 */
export async function getApartmentRealPrice(params: {
  lawdCd: string;
  dealYmd: string;
  numOfRows?: number;
}): Promise<RealPriceData[]> {
  const { lawdCd, dealYmd, numOfRows = 100 } = params;

  const url = new URL(`${BASE_URL}/getRTMSDataSvcAptTradeDev`);
  url.searchParams.append('serviceKey', decodeURIComponent(API_KEY));
  url.searchParams.append('LAWD_CD', lawdCd);
  url.searchParams.append('DEAL_YMD', dealYmd);
  url.searchParams.append('numOfRows', numOfRows.toString());
  url.searchParams.append('pageNo', '1');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`실거래가 API 오류: ${response.status}`);
    }

    const data: RealPriceResponse = await response.json();

    // 성공 코드: '00' 또는 '000' (API마다 다를 수 있음)
    if (!data.response.header.resultCode.startsWith('00')) {
      console.error('실거래가 API 에러:', data.response.header.resultMsg);
      return [];
    }

    const items = data.response.body?.items?.item;
    if (!items) return [];

    // 단일 아이템이면 배열로 변환
    return Array.isArray(items) ? items : [items];
  } catch (error) {
    console.error('실거래가 조회 실패:', error);
    return [];
  }
}

/**
 * 주소에서 지역코드 추출
 * @param address "경기도 용인시 처인구 양지면" → "41"
 */
export function extractRegionCode(address: string): string | null {
  // 시도 코드 매핑
  const sidoCodes: Record<string, string> = {
    '서울': '11',
    '부산': '26',
    '대구': '27',
    '인천': '28',
    '광주': '29',
    '대전': '30',
    '울산': '31',
    '세종': '36',
    '경기': '41',
    '강원': '42',
    '충북': '43',
    '충남': '44',
    '전북': '45',
    '전남': '46',
    '경북': '47',
    '경남': '48',
    '제주': '50',
  };

  for (const [name, code] of Object.entries(sidoCodes)) {
    if (address.includes(name)) {
      return code;
    }
  }

  return null;
}

/**
 * 시군구 코드 추출 (전체 5자리)
 * 실제로는 행정동 코드 DB가 필요하지만, 간단히 처리
 */
export function extractLawdCd(address: string): string | null {
  // 주요 지역 코드 매핑 (예시)
  const lawdCdMap: Record<string, string> = {
    // 서울
    '강남구': '11680',
    '서초구': '11650',
    '송파구': '11710',
    '강동구': '11740',

    // 경기
    '용인시 처인구': '41465',
    '용인시 기흥구': '41463',
    '용인시 수지구': '41461',
    '성남시 분당구': '41135',
    '성남시 수정구': '41131',
    '성남시 중원구': '41133',
    '이천시': '41500',
    '광명시': '41210',

    // 인천
    '서구': '28260',

    // 부산
    '남구': '26290',

    // 대전
    '서구': '30170',
  };

  for (const [name, code] of Object.entries(lawdCdMap)) {
    if (address.includes(name)) {
      return code;
    }
  }

  // 매칭 안 되면 시도 코드만 반환 (부정확하지만 폴백)
  const sidoCode = extractRegionCode(address);
  return sidoCode ? `${sidoCode}000` : null;
}

/**
 * 거래금액 문자열을 숫자로 변환
 * "82,000" → 82000 (만원)
 */
export function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/,/g, '').trim());
}

/**
 * 전용면적을 평수로 변환
 * "84.98" → 25.7평
 */
export function sqmToPyeong(sqm: string | number): number {
  const sqmNum = typeof sqm === 'string' ? parseFloat(sqm) : sqm;
  return sqmNum / 3.3058;
}

/**
 * 평당가 계산
 * @param price 거래금액 (만원)
 * @param area 전용면적 (㎡)
 */
export function calculatePricePerPyeong(price: number, area: number): number {
  const pyeong = sqmToPyeong(area);
  return Math.round(price / pyeong);
}

/**
 * 최근 N개월 실거래가 조회
 */
export async function getRecentRealPrices(
  lawdCd: string,
  months: number = 6
): Promise<RealPriceData[]> {
  const now = new Date();
  const allData: RealPriceData[] = [];

  for (let i = 0; i < months; i++) {
    const targetDate = new Date(now);
    targetDate.setMonth(targetDate.getMonth() - i);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dealYmd = `${year}${month}`;

    const data = await getApartmentRealPrice({ lawdCd, dealYmd });
    allData.push(...data);

    // API 부하 방지
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return allData;
}
