/**
 * 대법원 경매정보 크롤러 서비스
 *
 * 대법원 courtauction.go.kr에서 경매 물건 정보를 크롤링
 * 서버사이드에서만 사용 (CORS 문제로 브라우저에서 직접 호출 불가)
 */

import * as cheerio from 'cheerio';
import { parseCaseNumber, COURT_CODES, COURT_NAMES } from '../court-auction';

// 대법원 기본 URL
const COURT_BASE_URL = 'https://www.courtauction.go.kr';

// 크롤링 결과 타입
export interface CrawlResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
  fetchedAt: string;
}

// 사건 기본 정보
export interface CaseDetailData {
  caseNumber: string;
  courtCode: string;
  courtName: string;
  caseType: string;
  status: string;
  creditor?: string;
  debtor?: string;
  claimAmount?: number;
  registrationDate?: string;
}

// 물건 정보
export interface PropertyData {
  itemNumber: number;
  propertyType: string;
  address: string;
  addressRoad?: string;
  landArea?: number;
  buildingArea?: number;
  exclusiveArea?: number;
  appraisalPrice?: number;
  minimumPrice?: number;
  remarks?: string;
}

// 기일 내역
export interface ScheduleData {
  round: number;
  saleDate: string;
  saleTime?: string;
  location?: string;
  minimumPrice?: number;
  result?: string;
  bidCount?: number;
  winningBid?: number;
}

// 권리 분석 정보
export interface RightsData {
  registerType: string;
  registerNo?: string;
  receiptDate?: string;
  purpose?: string;
  rightHolder?: string;
  claimAmount?: number;
  isReference: boolean;
  willExpire: boolean;
  note?: string;
}

// 임차인 정보
export interface TenantData {
  name?: string;
  occupiedPart: string;
  moveInDate?: string;
  fixedDate?: string;
  deposit?: number;
  monthlyRent?: number;
  hasPriority: boolean;
  bidRequest: boolean;
}

// 전체 크롤링 결과
export interface AuctionCrawlData {
  caseDetail: CaseDetailData;
  properties: PropertyData[];
  schedules: ScheduleData[];
  rights: RightsData[];
  tenants: TenantData[];
  images: string[];
}

/**
 * HTTP 요청 헤더 (대법원 사이트용)
 */
function getHeaders(): HeadersInit {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  };
}

/**
 * URL 파라미터 생성
 */
function buildParams(courtCode: string, caseNumber: string): URLSearchParams | null {
  const parsed = parseCaseNumber(caseNumber);
  if (!parsed) return null;

  return new URLSearchParams({
    jiwonCd: courtCode,
    saession: String(parsed.saession),
    srnoChamCdNm: parsed.typeCode,
    dession: parsed.year,
    saession3: parsed.number,
  });
}

/**
 * 페이지 fetch (EUC-KR 인코딩 처리)
 */
async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  // ArrayBuffer로 받아서 EUC-KR 디코딩
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder('euc-kr');
  return decoder.decode(buffer);
}

/**
 * 금액 문자열 파싱 (예: "1,234,567,890원" → 1234567890)
 */
function parsePrice(priceStr: string): number | undefined {
  if (!priceStr) return undefined;
  const cleaned = priceStr.replace(/[^0-9]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? undefined : num;
}

/**
 * 면적 문자열 파싱 (예: "84.95㎡" → 84.95)
 */
function parseArea(areaStr: string): number | undefined {
  if (!areaStr) return undefined;
  const match = areaStr.match(/[\d,.]+/);
  if (!match) return undefined;
  const num = parseFloat(match[0].replace(/,/g, ''));
  return isNaN(num) ? undefined : num;
}

/**
 * 날짜 문자열 정규화 (예: "2024.12.18" → "2024-12-18")
 */
function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.replace(/\./g, '-').trim();
}

/**
 * 사건 상세 정보 크롤링
 */
export async function crawlCaseDetail(
  courtCode: string,
  caseNumber: string
): Promise<CrawlResult<CaseDetailData>> {
  const params = buildParams(courtCode, caseNumber);
  if (!params) {
    return {
      success: false,
      error: '잘못된 사건번호 형식',
      source: '',
      fetchedAt: new Date().toISOString(),
    };
  }

  const url = `${COURT_BASE_URL}/RetrieveRealEstCaramInf.laf?${params}`;

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    // 테이블에서 데이터 추출
    const data: CaseDetailData = {
      caseNumber,
      courtCode,
      courtName: COURT_NAMES[courtCode] || '',
      caseType: '',
      status: 'ACTIVE',
    };

    // 사건정보 테이블 파싱
    $('table.Ltbl_list tr').each((_, row) => {
      const cells = $(row).find('td, th');
      const label = $(cells[0]).text().trim();
      const value = $(cells[1]).text().trim();

      switch (label) {
        case '사건번호':
          // 이미 있음
          break;
        case '채권자':
          data.creditor = value;
          break;
        case '채무자':
          data.debtor = value;
          break;
        case '청구금액':
          data.claimAmount = parsePrice(value);
          break;
        case '사건접수':
        case '접수일':
          data.registrationDate = normalizeDate(value);
          break;
        case '진행상태':
          data.status = value.includes('진행') ? 'ACTIVE' :
                        value.includes('낙찰') ? 'SOLD' :
                        value.includes('취하') ? 'CANCELED' : 'ACTIVE';
          break;
      }
    });

    return {
      success: true,
      data,
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '크롤링 실패',
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 물건 목록 크롤링
 */
export async function crawlPropertyList(
  courtCode: string,
  caseNumber: string
): Promise<CrawlResult<PropertyData[]>> {
  const params = buildParams(courtCode, caseNumber);
  if (!params) {
    return {
      success: false,
      error: '잘못된 사건번호 형식',
      source: '',
      fetchedAt: new Date().toISOString(),
    };
  }

  const url = `${COURT_BASE_URL}/RetrieveRealEstDetailInqSaList.laf?${params}`;

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    const properties: PropertyData[] = [];

    // 물건 테이블 파싱
    $('table.Ltbl_list tbody tr').each((index, row) => {
      const cells = $(row).find('td');
      if (cells.length < 5) return;

      const property: PropertyData = {
        itemNumber: index + 1,
        propertyType: $(cells[1]).text().trim() || '기타',
        address: $(cells[2]).text().trim(),
        landArea: parseArea($(cells[3]).text()),
        buildingArea: parseArea($(cells[4]).text()),
        appraisalPrice: parsePrice($(cells[5]).text()),
        minimumPrice: parsePrice($(cells[6]).text()),
        remarks: $(cells[7]).text().trim() || undefined,
      };

      if (property.address) {
        properties.push(property);
      }
    });

    return {
      success: true,
      data: properties,
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '크롤링 실패',
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 기일 내역 크롤링
 */
export async function crawlSchedule(
  courtCode: string,
  caseNumber: string
): Promise<CrawlResult<ScheduleData[]>> {
  const params = buildParams(courtCode, caseNumber);
  if (!params) {
    return {
      success: false,
      error: '잘못된 사건번호 형식',
      source: '',
      fetchedAt: new Date().toISOString(),
    };
  }

  const url = `${COURT_BASE_URL}/RetrieveSaleSchdInqSaleList.laf?${params}`;

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    const schedules: ScheduleData[] = [];

    // 기일 테이블 파싱
    $('table.Ltbl_list tbody tr').each((index, row) => {
      const cells = $(row).find('td');
      if (cells.length < 4) return;

      const dateTimeText = $(cells[0]).text().trim();
      const [date, time] = dateTimeText.split(/\s+/);

      const schedule: ScheduleData = {
        round: index + 1,
        saleDate: normalizeDate(date || ''),
        saleTime: time,
        location: $(cells[1]).text().trim() || undefined,
        minimumPrice: parsePrice($(cells[2]).text()),
        result: $(cells[3]).text().trim() || undefined,
      };

      // 결과에서 낙찰가/유찰 추출
      const resultText = schedule.result || '';
      if (resultText.includes('낙찰')) {
        const bidMatch = resultText.match(/낙찰.*?([\d,]+)/);
        if (bidMatch) {
          schedule.winningBid = parsePrice(bidMatch[1]);
        }
      }

      if (schedule.saleDate) {
        schedules.push(schedule);
      }
    });

    return {
      success: true,
      data: schedules,
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '크롤링 실패',
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 권리분석 (매각물건명세서) 크롤링
 */
export async function crawlRights(
  courtCode: string,
  caseNumber: string
): Promise<CrawlResult<RightsData[]>> {
  const params = buildParams(courtCode, caseNumber);
  if (!params) {
    return {
      success: false,
      error: '잘못된 사건번호 형식',
      source: '',
      fetchedAt: new Date().toISOString(),
    };
  }

  const url = `${COURT_BASE_URL}/RetrieveRealEstSaleStmtInqList.laf?${params}`;

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    const rights: RightsData[] = [];

    // 권리 테이블 파싱
    $('table.Ltbl_list tbody tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length < 5) return;

      const right: RightsData = {
        registerType: $(cells[0]).text().trim(),
        registerNo: $(cells[1]).text().trim() || undefined,
        receiptDate: normalizeDate($(cells[2]).text()),
        purpose: $(cells[3]).text().trim() || undefined,
        rightHolder: $(cells[4]).text().trim() || undefined,
        claimAmount: parsePrice($(cells[5]).text()),
        isReference: $(cells[6]).text().includes('인수') || false,
        willExpire: $(cells[6]).text().includes('소멸') || false,
        note: $(cells[7]).text().trim() || undefined,
      };

      if (right.registerType) {
        rights.push(right);
      }
    });

    return {
      success: true,
      data: rights,
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '크롤링 실패',
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 현황조사서에서 임차인 정보 크롤링
 */
export async function crawlTenants(
  courtCode: string,
  caseNumber: string
): Promise<CrawlResult<TenantData[]>> {
  const params = buildParams(courtCode, caseNumber);
  if (!params) {
    return {
      success: false,
      error: '잘못된 사건번호 형식',
      source: '',
      fetchedAt: new Date().toISOString(),
    };
  }

  const url = `${COURT_BASE_URL}/RetrieveRealEstStsInvstInqList.laf?${params}`;

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    const tenants: TenantData[] = [];

    // 임차인 테이블 파싱 (현황조사서 내)
    $('table').each((_, table) => {
      const tableText = $(table).text();
      if (!tableText.includes('임차인') && !tableText.includes('점유자')) return;

      $(table).find('tbody tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length < 4) return;

        const tenant: TenantData = {
          name: $(cells[0]).text().trim() || undefined,
          occupiedPart: $(cells[1]).text().trim(),
          moveInDate: normalizeDate($(cells[2]).text()),
          fixedDate: normalizeDate($(cells[3]).text()),
          deposit: parsePrice($(cells[4]).text()),
          hasPriority: $(cells[5]).text().includes('대항') || false,
          bidRequest: $(cells[6]).text().includes('배당') || false,
        };

        if (tenant.occupiedPart) {
          tenants.push(tenant);
        }
      });
    });

    return {
      success: true,
      data: tenants,
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '크롤링 실패',
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 이미지 URL 추출
 */
export async function crawlImages(
  courtCode: string,
  caseNumber: string
): Promise<CrawlResult<string[]>> {
  const params = buildParams(courtCode, caseNumber);
  if (!params) {
    return {
      success: false,
      error: '잘못된 사건번호 형식',
      source: '',
      fetchedAt: new Date().toISOString(),
    };
  }

  // 물건 상세 페이지에서 이미지 추출
  const url = `${COURT_BASE_URL}/RetrieveRealEstDetailInqSaList.laf?${params}`;

  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);

    const images: string[] = [];

    // 이미지 태그에서 src 추출
    $('img').each((_, img) => {
      const src = $(img).attr('src');
      if (src && (src.includes('photo') || src.includes('image') || src.includes('Picture'))) {
        // 상대 URL을 절대 URL로 변환
        const fullUrl = src.startsWith('http') ? src : `${COURT_BASE_URL}${src}`;
        if (!images.includes(fullUrl)) {
          images.push(fullUrl);
        }
      }
    });

    return {
      success: true,
      data: images,
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '크롤링 실패',
      source: url,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 전체 경매 정보 크롤링
 */
export async function crawlAuction(
  courtCode: string,
  caseNumber: string
): Promise<CrawlResult<AuctionCrawlData>> {
  try {
    // 병렬로 모든 데이터 크롤링
    const [
      caseDetailResult,
      propertiesResult,
      schedulesResult,
      rightsResult,
      tenantsResult,
      imagesResult,
    ] = await Promise.all([
      crawlCaseDetail(courtCode, caseNumber),
      crawlPropertyList(courtCode, caseNumber),
      crawlSchedule(courtCode, caseNumber),
      crawlRights(courtCode, caseNumber),
      crawlTenants(courtCode, caseNumber),
      crawlImages(courtCode, caseNumber),
    ]);

    // 사건 상세는 필수
    if (!caseDetailResult.success || !caseDetailResult.data) {
      return {
        success: false,
        error: caseDetailResult.error || '사건 정보 크롤링 실패',
        source: caseDetailResult.source,
        fetchedAt: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: {
        caseDetail: caseDetailResult.data,
        properties: propertiesResult.data || [],
        schedules: schedulesResult.data || [],
        rights: rightsResult.data || [],
        tenants: tenantsResult.data || [],
        images: imagesResult.data || [],
      },
      source: caseDetailResult.source,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '크롤링 실패',
      source: '',
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * 법원코드 찾기 헬퍼
 */
export function findCourtCode(courtName: string): string | null {
  return COURT_CODES[courtName] || null;
}

/**
 * 법원명 찾기 헬퍼
 */
export function findCourtName(courtCode: string): string | null {
  return COURT_NAMES[courtCode] || null;
}
