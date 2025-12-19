#!/usr/bin/env node
/**
 * 실거래가 API 테스트 스크립트
 */

import { config } from 'dotenv';
config();

const BASE_URL = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev';
const API_KEY = process.env.DATA_GO_KR_API_KEY || '';

console.log('API_KEY:', API_KEY ? API_KEY.substring(0, 20) + '...' : '없음');

// 법정동 코드 매핑
const lawdCdMap = {
  '이천시': '41500',
  '용인시 처인구': '41465',
  '성남시 분당구': '41135',
};

function extractLawdCd(address) {
  for (const [name, code] of Object.entries(lawdCdMap)) {
    if (address.includes(name)) {
      return code;
    }
  }
  return null;
}

async function getApartmentRealPrice(lawdCd, dealYmd) {
  const url = new URL(`${BASE_URL}/getRTMSDataSvcAptTradeDev`);
  url.searchParams.append('serviceKey', decodeURIComponent(API_KEY));
  url.searchParams.append('LAWD_CD', lawdCd);
  url.searchParams.append('DEAL_YMD', dealYmd);
  url.searchParams.append('numOfRows', '10');
  url.searchParams.append('pageNo', '1');

  console.log(`   🔗 API URL: ${url.toString().substring(0, 100)}...`);

  try {
    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();

    // 성공 코드: '00' 또는 '000' (API마다 다를 수 있음)
    if (!data.response.header.resultCode.startsWith('00')) {
      console.error('   ❌ API 에러:', data.response.header.resultMsg);
      console.log(`   📦 전체 응답:`, JSON.stringify(data, null, 2).substring(0, 500));
      return [];
    }

    const items = data.response.body?.items?.item;
    if (!items) {
      console.log(`   ⚠️  body.items가 없음`);
      return [];
    }

    return Array.isArray(items) ? items : [items];
  } catch (error) {
    console.error('조회 실패:', error);
    return [];
  }
}

async function main() {
  console.log('\n📊 실거래가 API 테스트\n');

  // 테스트 주소
  const testAddresses = [
    '경기도 이천시 중리동',
    '경기도 용인시 처인구 양지면',
    '경기도 성남시 분당구',
  ];

  // 현재 년월 (YYYYMM)
  const now = new Date();
  const dealYmd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

  console.log(`조회 기간: ${dealYmd}\n`);

  for (const address of testAddresses) {
    console.log(`\n🏠 주소: ${address}`);

    const lawdCd = extractLawdCd(address);
    console.log(`   법정동코드: ${lawdCd}`);

    if (!lawdCd) {
      console.log('   ❌ 법정동 코드를 찾을 수 없습니다.');
      continue;
    }

    try {
      const data = await getApartmentRealPrice(lawdCd, dealYmd);
      console.log(`   📈 실거래 건수: ${data.length}개`);

      if (data.length > 0) {
        console.log(`   📋 첫 번째 데이터:`);
        const first = data[0];
        console.log(JSON.stringify(first, null, 2));
      }
    } catch (error) {
      console.error(`   ❌ API 조회 실패:`, error.message);
    }

    // API 부하 방지
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✅ 테스트 완료\n');
}

main().catch(console.error);
