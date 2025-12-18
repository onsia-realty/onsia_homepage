/**
 * 대법원 경매정보 크롤러 서비스
 *
 * 대법원 courtauction.go.kr에서 경매 정보를 가져오는 서비스
 * 브라우저에서 직접 호출하면 CORS 에러가 발생하므로 API Route를 통해 호출
 */

import { parseCaseNumber, COURT_CODES } from './court-auction';

// 대법원 기본 URL
const COURT_AUCTION_BASE = 'https://www.courtauction.go.kr';

// 크롤링 옵션
export interface CrawlOptions {
  timeout?: number;
  retries?: number;
  delay?: number;
}

// 사건 기본 정보
export interface CaseInfo {
  caseNumber: string;
  courtName: string;
  caseType: string;
  creditor: string;
  debtor: string;
  status: string;
  registrationDate?: string;
}

// 기일 내역
export interface ScheduleInfo {
  round: number;
  saleDate: string;
  saleTime: string;
  location: string;
  minimumPrice: string;
  result?: string;
  bidCount?: number;
  winningBid?: string;
}

// 물건 정보
export interface PropertyInfo {
  itemNumber: string;
  address: string;
  usage: string;
  area: string;
  appraisalPrice: string;
  remarks?: string;
}

// 감정평가 정보
export interface AppraisalInfo {
  itemNumber: string;
  appraisalDate: string;
  appraiser: string;
  totalPrice: string;
  landPrice?: string;
  buildingPrice?: string;
  details?: string[];
}

// 임차인 정보
export interface TenantInfo {
  name: string;
  occupiedPart: string;
  moveInDate?: string;
  fixedDate?: string;
  deposit?: string;
  hasPriority: boolean;
  bidRequest: boolean;
}

// 크롤링 결과
export interface CrawlResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
  fetchedAt: string;
}

/**
 * 대법원 API 엔드포인트 생성
 */
export function getCourtEndpoint(
  endpoint: string,
  courtCode: string,
  caseNumber: string
): string {
  const parsed = parseCaseNumber(caseNumber);
  if (!parsed) return '';

  const params = new URLSearchParams({
    jiwonCd: courtCode,
    saession: String(parsed.saession),
    srnoChamCdNm: parsed.typeCode,
    dession: parsed.year,
    saession3: parsed.number,
  });

  return `${COURT_AUCTION_BASE}/${endpoint}?${params}`;
}

/**
 * 사건내역 URL
 */
export function getCaseDetailUrl(courtCode: string, caseNumber: string): string {
  return getCourtEndpoint('RetrieveRealEstCaramInf.laf', courtCode, caseNumber);
}

/**
 * 기일내역 URL
 */
export function getScheduleUrl(courtCode: string, caseNumber: string): string {
  return getCourtEndpoint('RetrieveSaleSchdInqSaleList.laf', courtCode, caseNumber);
}

/**
 * 물건목록 URL
 */
export function getPropertyListUrl(courtCode: string, caseNumber: string): string {
  return getCourtEndpoint('RetrieveRealEstDetailInqSaList.laf', courtCode, caseNumber);
}

/**
 * 현황조사서 URL
 */
export function getSurveyUrl(courtCode: string, caseNumber: string): string {
  return getCourtEndpoint('RetrieveRealEstStsInvstInqList.laf', courtCode, caseNumber);
}

/**
 * 감정평가서 URL
 */
export function getAppraisalUrl(courtCode: string, caseNumber: string): string {
  return getCourtEndpoint('RetrieveRealEstApslJdgmInqList.laf', courtCode, caseNumber);
}

/**
 * 매각물건명세서 URL
 */
export function getSaleStatementUrl(courtCode: string, caseNumber: string): string {
  return getCourtEndpoint('RetrieveRealEstSaleStmtInqList.laf', courtCode, caseNumber);
}

/**
 * 문건/송달 URL
 */
export function getDocumentsUrl(courtCode: string, caseNumber: string): string {
  return getCourtEndpoint('RetrieveSendOfcDcmtInqList.laf', courtCode, caseNumber);
}

/**
 * 법원명으로 법원코드 찾기
 */
export function getCourtCode(courtName: string): string | null {
  return COURT_CODES[courtName] || null;
}

/**
 * 크롤링 데이터 타입
 */
export type CourtDataType =
  | 'caseDetail'    // 사건내역
  | 'schedule'      // 기일내역
  | 'property'      // 물건목록
  | 'survey'        // 현황조사서
  | 'appraisal'     // 감정평가서
  | 'saleStatement' // 매각물건명세서
  | 'documents';    // 문건/송달

/**
 * 데이터 타입별 URL 생성
 */
export function getUrlByType(
  type: CourtDataType,
  courtCode: string,
  caseNumber: string
): string {
  switch (type) {
    case 'caseDetail':
      return getCaseDetailUrl(courtCode, caseNumber);
    case 'schedule':
      return getScheduleUrl(courtCode, caseNumber);
    case 'property':
      return getPropertyListUrl(courtCode, caseNumber);
    case 'survey':
      return getSurveyUrl(courtCode, caseNumber);
    case 'appraisal':
      return getAppraisalUrl(courtCode, caseNumber);
    case 'saleStatement':
      return getSaleStatementUrl(courtCode, caseNumber);
    case 'documents':
      return getDocumentsUrl(courtCode, caseNumber);
    default:
      return '';
  }
}

/**
 * 데이터 타입 한글명
 */
export const DATA_TYPE_LABELS: Record<CourtDataType, string> = {
  caseDetail: '사건내역',
  schedule: '기일내역',
  property: '물건목록',
  survey: '현황조사서',
  appraisal: '감정평가서',
  saleStatement: '매각물건명세서',
  documents: '문건/송달',
};

/**
 * 캐시 키 생성
 */
export function getCacheKey(
  type: CourtDataType,
  courtCode: string,
  caseNumber: string
): string {
  return `court_${type}_${courtCode}_${caseNumber}`;
}

/**
 * 대법원 데이터 fetch를 위한 헤더
 * 서버사이드에서만 사용 (API Route)
 */
export function getCourtHeaders(): HeadersInit {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };
}

/**
 * HTML에서 테이블 데이터 추출 (간단한 파서)
 * 실제 구현시 cheerio 등 HTML 파서 라이브러리 사용 권장
 */
export function extractTableData(html: string): string[][] {
  const rows: string[][] = [];

  // 간단한 테이블 추출 로직
  // 실제로는 cheerio나 jsdom 사용
  const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi);
  if (!tableMatch) return rows;

  // 첫 번째 테이블 처리
  const tableHtml = tableMatch[0];
  const rowMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);

  if (rowMatches) {
    for (const row of rowMatches) {
      const cells: string[] = [];
      const cellMatches = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi);

      if (cellMatches) {
        for (const cell of cellMatches) {
          // HTML 태그 제거하고 텍스트만 추출
          const text = cell
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          cells.push(text);
        }
      }

      if (cells.length > 0) {
        rows.push(cells);
      }
    }
  }

  return rows;
}

/**
 * 금액 문자열 파싱 (예: "1,234,567,890원" → "1234567890")
 */
export function parsePrice(priceStr: string): string {
  return priceStr.replace(/[^0-9]/g, '');
}

/**
 * 날짜 문자열 정규화 (예: "2024.12.18" → "2024-12-18")
 */
export function normalizeDate(dateStr: string): string {
  return dateStr.replace(/\./g, '-').trim();
}
