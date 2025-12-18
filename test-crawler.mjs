/**
 * 크롤러 테스트 스크립트
 *
 * 실행: node test-crawler.mjs
 */

// API 테스트 (서버가 실행 중이어야 함)
const API_BASE = 'http://localhost:3000/api';
const API_KEY = 'dev-crawler-key';

async function testCrawlerAPI() {
  console.log('🔍 크롤러 API 테스트 시작...\n');

  // 테스트 사건 정보
  const testCase = {
    courtCode: '1710',  // 수원지방법원
    caseNumber: '2024타경85191',
  };

  // 1. GET 테스트 (크롤링만, 저장 안함)
  console.log('📡 GET /api/crawler - 크롤링 미리보기');
  console.log(`   사건번호: ${testCase.caseNumber}`);

  try {
    const getUrl = `${API_BASE}/crawler?courtCode=${testCase.courtCode}&caseNumber=${testCase.caseNumber}`;
    const getResponse = await fetch(getUrl);
    const getData = await getResponse.json();

    if (getData.success) {
      console.log('✅ 크롤링 성공!');
      console.log(`   - 법원: ${getData.data?.caseDetail?.courtName || 'N/A'}`);
      console.log(`   - 물건수: ${getData.data?.properties?.length || 0}건`);
      console.log(`   - 기일수: ${getData.data?.schedules?.length || 0}건`);
      console.log(`   - 권리수: ${getData.data?.rights?.length || 0}건`);
      console.log(`   - 이미지: ${getData.data?.images?.length || 0}개`);
    } else {
      console.log('❌ 크롤링 실패:', getData.error);
    }
  } catch (error) {
    console.log('❌ GET 요청 실패:', error.message);
    console.log('   (서버가 실행 중인지 확인하세요: npm run dev)');
  }

  console.log('');

  // 2. POST 테스트 (크롤링 + 저장) - 인증 필요
  console.log('📡 POST /api/crawler - 크롤링 + 저장');

  try {
    const postResponse = await fetch(`${API_BASE}/crawler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(testCase),
    });

    const postData = await postResponse.json();

    if (postData.success) {
      console.log('✅ 저장 성공!');
      console.log(`   - Auction ID: ${postData.auctionId}`);
      console.log(`   - 저장 시간: ${postData.savedAt}`);
    } else {
      console.log('❌ 저장 실패:', postData.error);
    }
  } catch (error) {
    console.log('❌ POST 요청 실패:', error.message);
  }

  console.log('\n✨ 테스트 완료!');
}

// 직접 크롤링 테스트 (API 없이)
async function testDirectCrawl() {
  console.log('🔍 직접 크롤링 테스트 (fetch 테스트)...\n');

  const courtCode = '1710';
  const caseNumber = '2024타경85191';

  // 사건번호 파싱
  const match = caseNumber.match(/(\d{4})(\D+)(\d+)/);
  if (!match) {
    console.log('❌ 사건번호 파싱 실패');
    return;
  }

  const params = new URLSearchParams({
    jiwonCd: courtCode,
    saession: '3',
    srnoChamCdNm: match[2].charAt(0),
    dession: match[1],
    saession3: match[3],
  });

  const url = `https://www.courtauction.go.kr/RetrieveRealEstDetailInqSaList.laf?${params}`;

  console.log('📍 URL:', url);
  console.log('');

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
    });

    console.log('📡 HTTP Status:', response.status);
    console.log('📡 Content-Type:', response.headers.get('content-type'));

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('euc-kr');
      const html = decoder.decode(buffer);

      console.log('📄 HTML 길이:', html.length, '자');
      console.log('');

      // 간단한 내용 확인
      if (html.includes('사건번호') || html.includes('물건')) {
        console.log('✅ 유효한 경매 페이지 확인됨');

        // 주소 추출 시도
        const addressMatch = html.match(/소재지[^<]*<[^>]*>([^<]+)/);
        if (addressMatch) {
          console.log('   - 주소:', addressMatch[1].trim());
        }
      } else if (html.includes('조회결과가 없습니다')) {
        console.log('⚠️ 해당 사건이 없습니다');
      } else {
        console.log('⚠️ 예상치 못한 응답');
      }
    } else {
      console.log('❌ HTTP 요청 실패');
    }
  } catch (error) {
    console.log('❌ 에러:', error.message);
  }

  console.log('\n✨ 직접 크롤링 테스트 완료!');
}

// 메인
console.log('═'.repeat(50));
console.log(' 대법원 경매 크롤러 테스트');
console.log('═'.repeat(50));
console.log('');

// 인자에 따라 테스트 선택
const arg = process.argv[2];

if (arg === 'direct') {
  testDirectCrawl();
} else if (arg === 'api') {
  testCrawlerAPI();
} else {
  // 기본: 직접 크롤링 테스트
  testDirectCrawl();
  console.log('\n' + '─'.repeat(50) + '\n');
  console.log('💡 API 테스트를 하려면: node test-crawler.mjs api');
  console.log('   (npm run dev로 서버 실행 필요)');
}
