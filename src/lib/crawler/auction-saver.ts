/**
 * 크롤링 데이터를 Supabase에 저장하는 서비스
 */

import { createServerSupabaseClient } from '../supabase';
import type {
  AuctionCrawlData,
  CaseDetailData,
  PropertyData,
  ScheduleData,
  RightsData,
  TenantData,
} from './court-crawler-service';

// 저장 결과
export interface SaveResult {
  success: boolean;
  auctionId?: string;
  error?: string;
  savedAt: string;
}

/**
 * 주소에서 시도/시군구/동 추출
 */
function parseAddress(address: string): {
  sido: string | null;
  sigungu: string | null;
  dong: string | null;
} {
  const result = { sido: null as string | null, sigungu: null as string | null, dong: null as string | null };

  if (!address) return result;

  // 시도 추출 (서울, 경기, 부산 등)
  const sidoPatterns = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ];

  for (const sido of sidoPatterns) {
    if (address.includes(sido)) {
      result.sido = sido.length === 2 ? `${sido}도` : sido;
      if (['서울', '부산', '대구', '인천', '광주', '대전', '울산'].includes(sido)) {
        result.sido = `${sido}특별시`;
        if (sido === '서울') result.sido = '서울특별시';
        else if (['부산', '대구', '인천', '광주', '대전', '울산'].includes(sido)) {
          result.sido = `${sido}광역시`;
        }
      }
      break;
    }
  }

  // 시군구 추출
  const sigunguMatch = address.match(/([\uAC00-\uD7AF]+[시군구])\s/);
  if (sigunguMatch) {
    result.sigungu = sigunguMatch[1];
  }

  // 동/읍/면 추출
  const dongMatch = address.match(/([\uAC00-\uD7AF]+[동읍면])\s/);
  if (dongMatch) {
    result.dong = dongMatch[1];
  }

  return result;
}

/**
 * 물건 종류 정규화
 */
function normalizePropertyType(type: string): string {
  const typeMap: Record<string, string> = {
    '아파트': '아파트',
    '빌라': '다세대',
    '연립': '다세대',
    '다세대': '다세대',
    '다가구': '다가구',
    '단독': '단독주택',
    '단독주택': '단독주택',
    '오피스텔': '오피스텔',
    '상가': '상가',
    '근린상가': '상가',
    '근린시설': '상가',
    '토지': '토지',
    '대지': '토지',
    '공장': '공장',
    '창고': '창고',
    '사무실': '사무실',
  };

  for (const [key, value] of Object.entries(typeMap)) {
    if (type.includes(key)) {
      return value;
    }
  }

  return type || '기타';
}

/**
 * 크롤링 데이터를 Supabase에 저장
 */
export async function saveAuctionData(
  crawlData: AuctionCrawlData
): Promise<SaveResult> {
  const supabase = createServerSupabaseClient();

  try {
    const { caseDetail, properties, schedules, rights, tenants, images } = crawlData;

    // 첫 번째 물건 정보 (메인 정보로 사용)
    const mainProperty = properties[0];

    // 주소 파싱
    const addressInfo = parseAddress(mainProperty?.address || '');

    // 최근 기일에서 최저가 및 매각기일 추출
    const latestSchedule = schedules.sort((a, b) =>
      new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
    )[0];

    // 유찰 횟수 계산
    const failedCount = schedules.filter(s =>
      s.result?.includes('유찰') || s.result?.includes('취소')
    ).length;

    // 1. auctions 테이블에 저장
    const auctionData = {
      court_code: caseDetail.courtCode,
      court_name: caseDetail.courtName,
      case_number: caseDetail.caseNumber,
      case_year: parseInt(caseDetail.caseNumber.match(/\d{4}/)?.[0] || '0'),
      item_number: 1,
      property_type: normalizePropertyType(mainProperty?.propertyType || ''),
      address: mainProperty?.address || '',
      address_road: mainProperty?.addressRoad || null,
      sido: addressInfo.sido,
      sigungu: addressInfo.sigungu,
      dong: addressInfo.dong,
      land_area: mainProperty?.landArea || null,
      building_area: mainProperty?.buildingArea || null,
      exclusive_area: mainProperty?.exclusiveArea || null,
      appraisal_price: mainProperty?.appraisalPrice || null,
      minimum_price: latestSchedule?.minimumPrice || mainProperty?.minimumPrice || null,
      deposit_amount: latestSchedule?.minimumPrice
        ? Math.floor(latestSchedule.minimumPrice * 0.1)
        : null,
      bid_count: failedCount,
      case_receipt_date: caseDetail.registrationDate || null,
      sale_date: latestSchedule?.saleDate
        ? `${latestSchedule.saleDate}T${latestSchedule.saleTime || '10:00'}:00`
        : null,
      sale_place: latestSchedule?.location || null,
      status: caseDetail.status === 'SOLD' ? 'SOLD' :
              caseDetail.status === 'CANCELED' ? 'CANCELED' : 'ACTIVE',
      claim_amount: caseDetail.claimAmount || null,
      note: mainProperty?.remarks || null,
      images: images,
      crawled_at: new Date().toISOString(),
    };

    // upsert (case_number 기준)
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .upsert(auctionData, {
        onConflict: 'court_code,case_number',
      })
      .select('id')
      .single();

    if (auctionError) {
      throw new Error(`auction 저장 실패: ${auctionError.message}`);
    }

    const auctionId = auction.id;

    // 2. auction_schedules 저장
    if (schedules.length > 0) {
      const scheduleData = schedules.map((s, idx) => ({
        auction_id: auctionId,
        schedule_date: s.saleDate ? `${s.saleDate}T${s.saleTime || '10:00'}:00` : null,
        schedule_type: `${idx + 1}차 매각기일`,
        schedule_place: s.location || null,
        minimum_price: s.minimumPrice || null,
        result: s.result || null,
        sold_price: s.winningBid || null,
      }));

      // 기존 스케줄 삭제 후 새로 저장
      await supabase
        .from('auction_schedules')
        .delete()
        .eq('auction_id', auctionId);

      const { error: scheduleError } = await supabase
        .from('auction_schedules')
        .insert(scheduleData);

      if (scheduleError) {
        console.error('schedule 저장 실패:', scheduleError.message);
      }
    }

    // 3. auction_rights 저장
    if (rights.length > 0) {
      const rightsData = rights.map(r => ({
        auction_id: auctionId,
        register_type: r.registerType,
        register_no: r.registerNo || null,
        receipt_date: r.receiptDate || null,
        purpose: r.purpose || null,
        right_holder: r.rightHolder || null,
        claim_amount: r.claimAmount || null,
        is_reference: r.isReference,
        will_expire: r.willExpire,
        note: r.note || null,
      }));

      // 기존 권리 삭제 후 새로 저장
      await supabase
        .from('auction_rights')
        .delete()
        .eq('auction_id', auctionId);

      const { error: rightsError } = await supabase
        .from('auction_rights')
        .insert(rightsData);

      if (rightsError) {
        console.error('rights 저장 실패:', rightsError.message);
      }
    }

    // 4. auction_analysis 저장 (임차인 정보 포함)
    const analysisData = {
      auction_id: auctionId,
      reference_date: new Date().toISOString().split('T')[0],
      has_risk: rights.some(r => r.isReference) || tenants.some(t => t.hasPriority),
      risk_note: rights.some(r => r.isReference)
        ? '인수되는 권리가 있습니다.'
        : null,
      tenant_info: tenants.length > 0 ? { tenants } : null,
      total_claim: caseDetail.claimAmount || null,
      updated_at: new Date().toISOString(),
    };

    // upsert (auction_id 기준)
    const { error: analysisError } = await supabase
      .from('auction_analysis')
      .upsert(analysisData, {
        onConflict: 'auction_id',
      });

    if (analysisError) {
      console.error('analysis 저장 실패:', analysisError.message);
    }

    return {
      success: true,
      auctionId,
      savedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장 실패',
      savedAt: new Date().toISOString(),
    };
  }
}

/**
 * 여러 경매 데이터 일괄 저장
 */
export async function saveMultipleAuctions(
  crawlDataList: AuctionCrawlData[]
): Promise<{
  total: number;
  success: number;
  failed: number;
  results: SaveResult[];
}> {
  const results: SaveResult[] = [];

  for (const crawlData of crawlDataList) {
    const result = await saveAuctionData(crawlData);
    results.push(result);

    // Rate limiting (대법원 사이트 부담 줄이기)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return {
    total: crawlDataList.length,
    success: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  };
}

/**
 * 단일 사건 크롤링 후 저장
 */
export async function crawlAndSave(
  courtCode: string,
  caseNumber: string
): Promise<SaveResult> {
  // 동적 import로 순환 의존성 방지
  const { crawlAuction } = await import('./court-crawler-service');

  const crawlResult = await crawlAuction(courtCode, caseNumber);

  if (!crawlResult.success || !crawlResult.data) {
    return {
      success: false,
      error: crawlResult.error || '크롤링 실패',
      savedAt: new Date().toISOString(),
    };
  }

  return saveAuctionData(crawlResult.data);
}
