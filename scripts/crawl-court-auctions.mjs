/**
 * 대법원 경매정보 크롤러 (Playwright MCP 사용)
 *
 * 이 스크립트는 courtauction.go.kr에서 경매 데이터를 크롤링하여
 * Supabase에 저장합니다.
 *
 * 사용법: Claude Code에서 Playwright MCP로 실행
 *
 * 주요 기능:
 * - 법원별 경매 목록 수집
 * - 물건 상세 정보 추출
 * - Supabase 저장
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Supabase 클라이언트
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 법원 코드 매핑
const COURT_CODES = {
  '서울중앙지방법원': { code: '01', name: '서울중앙지방법원' },
  '서울동부지방법원': { code: '02', name: '서울동부지방법원' },
  '서울서부지방법원': { code: '03', name: '서울서부지방법원' },
  '서울남부지방법원': { code: '04', name: '서울남부지방법원' },
  '서울북부지방법원': { code: '05', name: '서울북부지방법원' },
};

// 물건종류 코드
const PROPERTY_TYPES = {
  '아파트': '01',
  '오피스텔': '02',
  '다세대': '03',
  '단독주택': '04',
  '근린시설': '05',
  '토지': '06',
  '상가': '07',
};

/**
 * 가격 문자열을 숫자로 변환
 * @param {string} priceStr - "363,000,000원" 형식
 * @returns {number}
 */
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
}

/**
 * 면적 문자열을 숫자로 변환
 * @param {string} areaStr - "29.97㎡" 형식
 * @returns {number}
 */
function parseArea(areaStr) {
  if (!areaStr) return 0;
  const match = areaStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * 날짜 문자열을 ISO 형식으로 변환
 * @param {string} dateStr - "2025.12.18" 형식
 * @returns {string|null}
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
}

/**
 * 크롤링한 데이터를 Supabase에 저장
 * @param {Object} auctionData - 경매 데이터
 */
async function saveToSupabase(auctionData) {
  console.log('Saving to Supabase:', auctionData.case_number);

  // 기존 데이터 확인
  const { data: existing } = await supabase
    .from('auctions')
    .select('id')
    .eq('case_number', auctionData.case_number)
    .single();

  if (existing) {
    // 업데이트
    const { error } = await supabase
      .from('auctions')
      .update({
        ...auctionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (error) {
      console.error('Update error:', error);
    } else {
      console.log('Updated:', auctionData.case_number);
    }
    return existing.id;
  } else {
    // 새로 삽입
    const { data, error } = await supabase
      .from('auctions')
      .insert(auctionData)
      .select('id')
      .single();

    if (error) {
      console.error('Insert error:', error);
      return null;
    }
    console.log('Inserted:', auctionData.case_number);
    return data?.id;
  }
}

/**
 * 경매 일정 히스토리 저장
 * @param {number} auctionId - 경매 ID
 * @param {Array} schedules - 일정 배열
 */
async function saveSchedules(auctionId, schedules) {
  if (!auctionId || !schedules?.length) return;

  // 기존 일정 삭제
  await supabase
    .from('auction_schedules')
    .delete()
    .eq('auction_id', auctionId);

  // 새 일정 삽입
  const schedulesToInsert = schedules.map((s, idx) => ({
    auction_id: auctionId,
    attempt_number: idx + 1,
    sale_date: parseDate(s.date),
    minimum_price: parsePrice(s.price),
    result: s.result || null
  }));

  const { error } = await supabase
    .from('auction_schedules')
    .insert(schedulesToInsert);

  if (error) {
    console.error('Schedule insert error:', error);
  }
}

/**
 * 경매 이미지 저장
 * @param {number} auctionId - 경매 ID
 * @param {Array} images - 이미지 URL 배열
 */
async function saveImages(auctionId, images) {
  if (!auctionId || !images?.length) return;

  // 기존 이미지 삭제
  await supabase
    .from('auction_images')
    .delete()
    .eq('auction_id', auctionId);

  // 새 이미지 삽입
  const imagesToInsert = images.map((url, idx) => ({
    auction_id: auctionId,
    image_url: url,
    image_order: idx + 1
  }));

  const { error } = await supabase
    .from('auction_images')
    .insert(imagesToInsert);

  if (error) {
    console.error('Image insert error:', error);
  }
}

// 크롤링 결과를 저장할 전역 변수
const crawledData = [];

/**
 * 목록에서 추출한 기본 정보를 저장
 */
function addListItem(item) {
  crawledData.push(item);
  console.log(`Added item ${crawledData.length}:`, item.case_number);
}

/**
 * 상세 페이지에서 추출한 정보로 업데이트
 */
function updateItemDetail(caseNumber, detail) {
  const item = crawledData.find(d => d.case_number === caseNumber);
  if (item) {
    Object.assign(item, detail);
    console.log('Updated detail for:', caseNumber);
  }
}

/**
 * 모든 데이터를 Supabase에 저장
 */
async function saveAllToSupabase() {
  console.log(`\nSaving ${crawledData.length} items to Supabase...`);

  for (const item of crawledData) {
    const auctionId = await saveToSupabase({
      case_number: item.case_number,
      court_name: item.court_name || '서울중앙지방법원',
      property_type: item.property_type,
      address: item.address,
      detail_address: item.detail_address,
      appraisal_value: item.appraisal_value,
      minimum_price: item.minimum_price,
      sale_date: item.sale_date,
      deposit: item.deposit || Math.round(item.minimum_price * 0.1),
      area_sqm: item.area_sqm,
      land_area_sqm: item.land_area_sqm,
      floor_info: item.floor_info,
      status: 'pending',
      bid_count: item.bid_count || 1,
      note: item.note,
      creditor: item.creditor,
      debtor: item.debtor,
      disposal_date: item.disposal_date
    });

    if (auctionId && item.schedules?.length) {
      await saveSchedules(auctionId, item.schedules);
    }

    if (auctionId && item.images?.length) {
      await saveImages(auctionId, item.images);
    }
  }

  console.log('All data saved to Supabase!');
}

// Export for use with Playwright MCP
export {
  crawledData,
  addListItem,
  updateItemDetail,
  saveAllToSupabase,
  saveToSupabase,
  parsePrice,
  parseArea,
  parseDate,
  COURT_CODES,
  PROPERTY_TYPES
};

// CLI 실행시 안내
console.log(`
===========================================
대법원 경매정보 크롤러
===========================================

이 스크립트는 Playwright MCP와 함께 사용됩니다.

Claude Code에서 다음 단계로 크롤링을 수행하세요:

1. browser_navigate로 courtauction.go.kr 접속
2. browser_click으로 물건상세검색 클릭
3. browser_snapshot으로 검색폼 확인
4. browser_fill_form으로 검색조건 입력
5. browser_click으로 검색 실행
6. browser_snapshot으로 결과 목록 확인
7. 각 물건 상세 페이지 크롤링
8. saveAllToSupabase() 호출

===========================================
`);
