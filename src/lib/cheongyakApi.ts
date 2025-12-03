// 청약홈 공공데이터 API 클라이언트

const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1';
const API_KEY = process.env.CHEONGYAK_API_KEY || '';

export interface CheongyakProperty {
  HOUSE_MANAGE_NO: string;        // 주택관리번호
  PBLANC_NO: string;              // 공고번호
  HOUSE_NM: string;               // 주택명
  HOUSE_SECD: string;             // 주택구분코드
  HOUSE_SECD_NM: string;          // 주택구분명 (APT, 오피스텔 등)
  HOUSE_DTL_SECD: string;         // 주택상세구분코드
  HOUSE_DTL_SECD_NM: string;      // 주택상세구분명 (민영, 국민 등)
  HSSPLY_ADRES: string;           // 공급위치
  HSSPLY_ZIP: string;             // 우편번호
  TOT_SUPLY_HSHLDCO: number;      // 총공급세대수
  RCRIT_PBLANC_DE: string;        // 모집공고일
  RCEPT_BGNDE: string;            // 청약접수시작일
  RCEPT_ENDDE: string;            // 청약접수종료일
  SPSPLY_RCEPT_BGNDE: string | null;  // 특별공급접수시작일
  SPSPLY_RCEPT_ENDDE: string | null;  // 특별공급접수종료일
  GNRL_RNK1_CRSPAREA_RCPTDE: string | null;  // 1순위 해당지역 접수일
  GNRL_RNK1_CRSPAREA_ENDDE: string | null;   // 1순위 해당지역 마감일
  GNRL_RNK2_CRSPAREA_RCPTDE: string | null;  // 2순위 해당지역 접수일
  GNRL_RNK2_CRSPAREA_ENDDE: string | null;   // 2순위 해당지역 마감일
  PRZWNER_PRESNATN_DE: string;    // 당첨자발표일
  CNTRCT_CNCLS_BGNDE: string;     // 계약시작일
  CNTRCT_CNCLS_ENDDE: string;     // 계약종료일
  MVN_PREARNGE_YM: string;        // 입주예정월
  SUBSCRPT_AREA_CODE: string;     // 공급지역코드
  SUBSCRPT_AREA_CODE_NM: string;  // 공급지역명
  HMPG_ADRES: string;             // 홈페이지주소
  CNSTRCT_ENTRPS_NM: string;      // 시공사
  BSNS_MBY_NM: string;            // 사업주체
  MDHS_TELNO: string;             // 문의전화
  PBLANC_URL: string;             // 공고상세URL
}

export interface CheongyakApiResponse {
  currentCount: number;
  data: CheongyakProperty[];
  matchCount: number;
  page: number;
  perPage: number;
  totalCount: number;
}

// APT 분양정보 조회
export async function getAPTSubscriptions(params: {
  page?: number;
  perPage?: number;
  region?: string;
}): Promise<CheongyakApiResponse> {
  const { page = 1, perPage = 20, region } = params;

  const url = new URL(`${BASE_URL}/getAPTLttotPblancDetail`);
  url.searchParams.append('serviceKey', API_KEY);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('perPage', perPage.toString());

  if (region) {
    url.searchParams.append('cond[SUBSCRPT_AREA_CODE_NM::EQ]', region);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store' // 캐시 비활성화 (실시간 데이터)
  });

  if (!response.ok) {
    throw new Error(`청약홈 API 오류: ${response.status}`);
  }

  return response.json();
}

// 오피스텔/도시형 분양정보 조회
export async function getOfficetelSubscriptions(params: {
  page?: number;
  perPage?: number;
  region?: string;
}): Promise<CheongyakApiResponse> {
  const { page = 1, perPage = 20, region } = params;

  const url = new URL(`${BASE_URL}/getUrbtyOfctlLttotPblancDetail`);
  url.searchParams.append('serviceKey', API_KEY);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('perPage', perPage.toString());

  if (region) {
    url.searchParams.append('cond[SUBSCRPT_AREA_CODE_NM::EQ]', region);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store' // 캐시 비활성화 (실시간 데이터)
  });

  if (!response.ok) {
    throw new Error(`청약홈 API 오류: ${response.status}`);
  }

  return response.json();
}

// 무순위/잔여세대 분양정보 조회
export async function getRemndrSubscriptions(params: {
  page?: number;
  perPage?: number;
  region?: string;
}): Promise<CheongyakApiResponse> {
  const { page = 1, perPage = 20, region } = params;

  const url = new URL(`${BASE_URL}/getRemndrLttotPblancDetail`);
  url.searchParams.append('serviceKey', API_KEY);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('perPage', perPage.toString());

  if (region) {
    url.searchParams.append('cond[SUBSCRPT_AREA_CODE_NM::EQ]', region);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store' // 캐시 비활성화 (실시간 데이터)
  });

  if (!response.ok) {
    throw new Error(`청약홈 API 오류: ${response.status}`);
  }

  return response.json();
}

// 통합 조회 (APT + 오피스텔 + 잔여세대)
export async function getAllSubscriptions(params: {
  page?: number;
  perPage?: number;
  region?: string;
  type?: 'all' | 'apt' | 'officetel' | 'remndr';
}): Promise<{
  data: CheongyakProperty[];
  totalCount: number;
}> {
  const { type = 'all' } = params;

  try {
    if (type === 'apt') {
      const result = await getAPTSubscriptions(params);
      return { data: result.data, totalCount: result.totalCount };
    }

    if (type === 'officetel') {
      const result = await getOfficetelSubscriptions(params);
      return { data: result.data, totalCount: result.totalCount };
    }

    if (type === 'remndr') {
      const result = await getRemndrSubscriptions(params);
      return { data: result.data, totalCount: result.totalCount };
    }

    // 전체 조회 시 병렬로 가져오기
    const [aptResult, officetelResult] = await Promise.all([
      getAPTSubscriptions(params),
      getOfficetelSubscriptions(params),
    ]);

    const allData = [...aptResult.data, ...officetelResult.data];

    // 청약접수일 기준 정렬
    allData.sort((a, b) => {
      const dateA = new Date(a.RCEPT_BGNDE || '9999-12-31');
      const dateB = new Date(b.RCEPT_BGNDE || '9999-12-31');
      return dateA.getTime() - dateB.getTime();
    });

    return {
      data: allData,
      totalCount: aptResult.totalCount + officetelResult.totalCount,
    };
  } catch (error) {
    console.error('청약홈 API 조회 실패:', error);
    return { data: [], totalCount: 0 };
  }
}

// 청약 상태 계산
export function getSubscriptionStatus(property: CheongyakProperty): {
  status: 'upcoming' | 'open' | 'closed';
  statusText: string;
  dDay: number | null;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = property.RCEPT_BGNDE ? new Date(property.RCEPT_BGNDE) : null;
  const endDate = property.RCEPT_ENDDE ? new Date(property.RCEPT_ENDDE) : null;

  if (!startDate || !endDate) {
    return { status: 'upcoming', statusText: '일정 미정', dDay: null };
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (today < startDate) {
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { status: 'upcoming', statusText: '접수예정', dDay: diffDays };
  }

  if (today >= startDate && today <= endDate) {
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { status: 'open', statusText: '접수중', dDay: diffDays };
  }

  return { status: 'closed', statusText: '접수마감', dDay: null };
}

// 지역 코드 목록
export const REGION_CODES = [
  { code: '110', name: '서울' },
  { code: '410', name: '경기' },
  { code: '280', name: '인천' },
  { code: '300', name: '대전' },
  { code: '360', name: '세종' },
  { code: '440', name: '충남' },
  { code: '430', name: '충북' },
  { code: '420', name: '강원' },
  { code: '260', name: '부산' },
  { code: '310', name: '울산' },
  { code: '270', name: '대구' },
  { code: '480', name: '경남' },
  { code: '470', name: '경북' },
  { code: '240', name: '광주' },
  { code: '460', name: '전남' },
  { code: '450', name: '전북' },
  { code: '500', name: '제주' },
];
