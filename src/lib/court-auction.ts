/**
 * 대법원 법원경매정보 URL 생성 유틸리티
 */

// 법원 코드 맵핑
export const COURT_CODES: Record<string, string> = {
  '서울중앙지방법원': '1110',
  '서울동부지방법원': '1111',
  '서울서부지방법원': '1112',
  '서울남부지방법원': '1113',
  '서울북부지방법원': '1114',
  '의정부지방법원': '1130',
  '인천지방법원': '1310',
  '춘천지방법원': '1510',
  '수원지방법원': '1710',
  '성남지원': '1711',
  '여주지원': '1712',
  '평택지원': '1713',
  '안산지원': '1714',
  '안양지원': '1715',
  '부산지방법원': '2110',
  '부산동부지원': '2111',
  '부산서부지원': '2112',
  '울산지방법원': '2310',
  '창원지방법원': '2510',
  '대구지방법원': '2710',
  '광주지방법원': '3110',
  '전주지방법원': '3310',
  '제주지방법원': '3510',
  '대전지방법원': '3710',
  '청주지방법원': '3910',
};

// 법원코드로 법원명 찾기
export const COURT_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(COURT_CODES).map(([name, code]) => [code, name])
);

// 사건번호 파싱
export interface ParsedCaseNumber {
  year: string;
  type: string;
  typeCode: string;
  number: string;
  saession: number;
  full: string;
}

export function parseCaseNumber(caseNumber: string): ParsedCaseNumber | null {
  // 2024타경85191 또는 2025타경32633 형식
  const match = caseNumber.match(/(\d{4})(\D+)(\d+)/);
  if (!match) return null;

  const type = match[2];
  let saession = 3; // 기본값: 타경

  if (type === '타경') saession = 3;
  else if (type === '경') saession = 2;
  else if (type === '카경') saession = 4;

  return {
    year: match[1],
    type: type,
    typeCode: type.charAt(0),
    number: match[3],
    saession,
    full: caseNumber,
  };
}

// 대법원 기본 URL
const COURT_AUCTION_BASE = 'https://www.courtauction.go.kr';

/**
 * 사건 상세 페이지 URL 생성
 */
export function getCourtDetailUrl(courtCode: string, caseNumber: string): string {
  const parsed = parseCaseNumber(caseNumber);
  if (!parsed) return COURT_AUCTION_BASE;

  const params = new URLSearchParams({
    jiwonCd: courtCode,
    saession: String(parsed.saession),
    srnoChamCdNm: parsed.typeCode,
    dession: parsed.year,
    saession3: parsed.number,
  });

  return `${COURT_AUCTION_BASE}/RetrieveRealEstDetailInqSaList.laf?${params}`;
}

/**
 * 기일내역 페이지 URL 생성
 */
export function getCourtScheduleUrl(courtCode: string, caseNumber: string): string {
  const parsed = parseCaseNumber(caseNumber);
  if (!parsed) return COURT_AUCTION_BASE;

  const params = new URLSearchParams({
    jiwonCd: courtCode,
    saession: String(parsed.saession),
    srnoChamCdNm: parsed.typeCode,
    dession: parsed.year,
    saession3: parsed.number,
  });

  return `${COURT_AUCTION_BASE}/RetrieveSaleSchdInqSaleList.laf?${params}`;
}

/**
 * 물건 검색 URL 생성
 */
export function getCourtSearchUrl(courtName?: string, options?: {
  itemType?: string;
  startDate?: string;
  endDate?: string;
}): string {
  const params = new URLSearchParams();

  if (courtName) params.set('jiwonNm', courtName);
  if (options?.itemType) params.set('realVowel', options.itemType);
  if (options?.startDate) params.set('termStartDt', options.startDate);
  if (options?.endDate) params.set('termEndDt', options.endDate);

  return `${COURT_AUCTION_BASE}/RetrieveRealEstSrchList.laf?${params}`;
}

/**
 * 대법원 경매정보 관련 자료 링크 생성
 */
export interface CourtAuctionLinks {
  // 사건 관련
  caseDetail: string;      // 사건내역
  schedule: string;        // 기일내역
  documents: string;       // 문건/송달
  // 물건 관련
  survey: string;          // 현황조사서
  appraisal: string;       // 감정평가서
  saleStatement: string;   // 매각물건명세서
  // 검색
  search: string;          // 물건검색
  nearbySearch: string;    // 인근검색
}

export function generateCourtLinks(
  courtCode: string | null,
  courtName: string | null,
  caseNumber: string
): CourtAuctionLinks {
  const code = courtCode || (courtName ? COURT_CODES[courtName] : null) || '';
  const parsed = parseCaseNumber(caseNumber);

  const baseParams = parsed ? new URLSearchParams({
    jiwonCd: code,
    saession: String(parsed.saession),
    srnoChamCdNm: parsed.typeCode,
    dession: parsed.year,
    saession3: parsed.number,
  }).toString() : '';

  return {
    caseDetail: baseParams
      ? `${COURT_AUCTION_BASE}/RetrieveRealEstCaramInf.laf?${baseParams}`
      : COURT_AUCTION_BASE,
    schedule: baseParams
      ? `${COURT_AUCTION_BASE}/RetrieveSaleSchdInqSaleList.laf?${baseParams}`
      : COURT_AUCTION_BASE,
    documents: baseParams
      ? `${COURT_AUCTION_BASE}/RetrieveSendOfcDcmtInqList.laf?${baseParams}`
      : COURT_AUCTION_BASE,
    survey: baseParams
      ? `${COURT_AUCTION_BASE}/RetrieveRealEstStsInvstInqList.laf?${baseParams}`
      : COURT_AUCTION_BASE,
    appraisal: baseParams
      ? `${COURT_AUCTION_BASE}/RetrieveRealEstApslJdgmInqList.laf?${baseParams}`
      : COURT_AUCTION_BASE,
    saleStatement: baseParams
      ? `${COURT_AUCTION_BASE}/RetrieveRealEstSaleStmtInqList.laf?${baseParams}`
      : COURT_AUCTION_BASE,
    search: courtName
      ? getCourtSearchUrl(courtName)
      : COURT_AUCTION_BASE,
    nearbySearch: COURT_AUCTION_BASE,
  };
}

/**
 * 물건 종류 코드
 */
export const ITEM_TYPE_CODES: Record<string, string> = {
  APARTMENT: 'A',    // 아파트
  VILLA: 'B',        // 빌라/연립
  OFFICETEL: 'D',    // 오피스텔
  HOUSE: 'C',        // 단독주택
  COMMERCIAL: 'E',   // 상가
  LAND: 'F',         // 토지
  FACTORY: 'G',      // 공장
  BUILDING: 'H',     // 건물
};
