import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 수집된 17개 현장 데이터
const propertyData = [
  {
    titleContains: '검단 동부센트레빌',
    data: {
      totalUnits: 1534,
      basePrice: BigInt(500000000), // 5억원대 (84㎡ 기준)
      pricePerPyeong: BigInt(16000000), // 분양가상한제 적용 추정
      moveInDate: new Date('2027-06-01'),
      constructor: '동부건설',
      keyFeature: '검단신도시 분양가상한제 적용, GTX-D 호재',
      description: '인천 검단신도시에 위치한 1,534세대 대단지 아파트. 분양가상한제 적용으로 합리적인 가격에 공급. GTX-D 노선 예정으로 서울 접근성 개선 기대.'
    }
  },
  {
    titleContains: '과천 렉서',
    data: {
      totalUnits: 228, // 오피스텔 136실 + 생활숙박시설 92실
      moveInDate: new Date('2025-02-01'),
      keyFeature: '과천지식정보타운 역세권 오피스텔',
      description: '과천지식정보타운 내 오피스텔 136실과 생활숙박시설 92실로 구성. 2025년 2월 입주 예정으로 즉시 투자 가능한 물건.'
    }
  },
  {
    titleContains: '광명 퍼스트 스위첸',
    data: {
      totalUnits: 275,
      moveInDate: new Date('2024-05-01'), // 즉시입주 (2024.05 준공완료)
      constructor: '대우건설',
      keyFeature: '광명역세권 즉시입주 가능',
      description: '광명역세권에 위치한 275실 규모 오피스텔. 2024년 5월 준공 완료로 즉시 입주 가능. KTX 광명역 도보권으로 서울 접근성 탁월.'
    }
  },
  {
    titleContains: '구리 중흥S클래스',
    data: {
      totalUnits: 1096, // 전체 1,096세대 (일반분양 639세대)
      basePrice: BigInt(950000000), // 9.5억 (84㎡ 기준)
      moveInDate: new Date('2029-02-01'),
      constructor: '중흥건설',
      keyFeature: '구리갈매역세권 1,096세대 대단지',
      description: '구리시 갈매역세권에 들어서는 1,096세대 대단지. 일반분양 639세대 공급. 8호선 연장선 갈매역 도보권으로 서울 강남까지 30분대 접근 가능.'
    }
  },
  {
    titleContains: '금성백조',
    data: {
      totalUnits: 894,
      basePrice: BigInt(340000000), // 3.4억~ (99㎡ 기준)
      pricePerPyeong: BigInt(9700000), // 평당 970만원
      moveInDate: new Date('2023-11-01'), // 준공 완료
      constructor: '금성백조',
      keyFeature: '대구 테크노폴리스 중심, 분양가상한제 적용',
      description: '대구 테크노폴리스 RC블록 최중심지에 위치한 894세대 아파트. 35층 랜드마크 단지로 분양가상한제 적용 평당 970만원대의 합리적 가격.'
    }
  },
  {
    titleContains: '김포 오퍼스',
    data: {
      totalUnits: 1029,
      pricePerPyeong: BigInt(20710000), // 평당 2,071만원
      moveInDate: new Date('2028-08-01'),
      constructor: '대우건설',
      keyFeature: '김포한강신도시 1,029세대, 한강조망',
      description: '김포한강신도시에 들어서는 1,029세대 대단지 푸르지오. 한강 조망권 확보 및 GTX-D 호재로 투자가치 상승 기대.'
    }
  },
  {
    titleContains: '신길 AK푸르지오',
    data: {
      totalUnits: 296,
      basePrice: BigInt(840000000), // 8.4~8.9억 (49㎡ 기준)
      moveInDate: new Date('2024-01-01'), // 즉시입주
      constructor: '대우건설',
      keyFeature: '신길역 역세권 도시형생활주택 즉시입주',
      description: '서울 영등포구 신길역 역세권에 위치한 296세대 도시형생활주택. 즉시입주 가능하며, 전용 49㎡ 기준 8.4~8.9억원대로 서울 역세권 투자 적합.'
    }
  },
  {
    titleContains: '운정 아이파크',
    data: {
      totalUnits: 3250,
      basePrice: BigInt(560000000), // 5.6~6.6억 (84㎡ 기준)
      moveInDate: new Date('2028-12-01'),
      constructor: '현대산업개발',
      keyFeature: 'GTX-A 운정역세권 3,250세대 메가단지',
      description: '파주 운정신도시에 들어서는 3,250세대 메가단지 아이파크. GTX-A 운정역 도보권으로 서울 강남까지 30분대 출퇴근 가능. 84㎡ 기준 5.6~6.6억원대.'
    }
  },
  {
    titleContains: '이안 힐스',
    data: {
      totalUnits: 459,
      keyFeature: '동작구 민간임대 10년 후 분양전환',
      description: '서울 동작구에 위치한 459가구 민간임대아파트. 10년 후 분양전환 조건으로 장기적 투자 관점에서 검토 필요. 서울 주요 업무지구 접근성 우수.'
    }
  },
  {
    titleContains: '이천 롯데캐슬',
    data: {
      totalUnits: 801,
      moveInDate: new Date('2027-09-01'),
      constructor: '롯데건설',
      keyFeature: '이천역세권 801세대 롯데캐슬',
      description: '경기도 이천시에 들어서는 801세대 롯데캐슬. 2027년 9월 입주 예정으로 경강선 이천역 인접하여 판교역까지 20분대 접근 가능.'
    }
  },
  {
    titleContains: '인천 학익',
    data: {
      totalUnits: 1065,
      pricePerPyeong: BigInt(14000000), // 평당 1,400만원대
      keyFeature: '인천 학익동 1,065가구 대단지',
      description: '인천 미추홀구 학익동에 위치한 1,065가구 대단지. 평당 1,400만원대의 합리적 분양가로 인천 도심 내 가성비 투자처.'
    }
  },
  {
    titleContains: '천안 휴먼빌',
    data: {
      totalUnits: 1541,
      basePrice: BigInt(450000000), // 4.5~5.5억 (84㎡ 기준)
      pricePerPyeong: BigInt(15870000), // 평당 1,587만원
      constructor: '금호건설',
      keyFeature: '천안아산역세권 1,541가구 금호건설',
      description: '충남 천안시에 들어서는 1,541가구 대단지 금호건설 휴먼빌. 천안아산역 KTX 이용 가능, 84㎡ 기준 4.5~5.5억원대로 수도권 대비 가성비 투자.'
    }
  },
  {
    titleContains: '천왕역 모아엘가',
    data: {
      totalUnits: 440,
      moveInDate: new Date('2025-07-01'),
      constructor: '모아건설',
      keyFeature: '서울 7호선 천왕역 초역세권',
      description: '서울 구로구 천왕역 초역세권에 위치한 440세대 아파트. 7호선 이용 강남까지 40분대 출퇴근 가능. 2025년 7월 입주 예정.'
    }
  },
  {
    titleContains: '청량리 범양레우스',
    data: {
      totalUnits: 105,
      pricePerPyeong: BigInt(50000000), // 평당 5,000만원 (오피스텔)
      moveInDate: new Date('2024-07-01'), // 공사지연 (원래 2024.04)
      constructor: '범양건영',
      keyFeature: '청량리역 11개 노선 환승, 전세대 복층',
      description: '동대문구 청량리역 인근 105세대 아파텔. 11개 노선 환승 가능한 초역세권. 전 세대 복층형 설계, 풀옵션 제공. 공사 지연으로 입주 일정 확인 필요.'
    }
  },
  {
    titleContains: '탑석 푸르지오',
    data: {
      totalUnits: 935,
      pricePerPyeong: BigInt(21000000), // 평당 2,100만원대
      moveInDate: new Date('2029-03-01'),
      constructor: '대우건설',
      keyFeature: '7호선 탑석역 역세권, 935세대',
      description: '의정부시 용현동에 들어서는 935세대 푸르지오. 2027년 개통 예정 7호선 탑석역 도보권. 서울 도봉산역까지 2정거장, 강남까지 40분대 접근.'
    }
  },
  {
    titleContains: '회룡역 힐스테이트',
    data: {
      totalUnits: 1816, // 전체 1,816세대 (일반분양 674세대)
      basePrice: BigInt(570000000), // 5.7~8.3억
      pricePerPyeong: BigInt(24170000), // 평당 2,417만원
      moveInDate: new Date('2026-06-01'),
      constructor: '현대건설',
      keyFeature: '1호선+의정부경전철 더블역세권 1,816세대',
      description: '의정부 호원동에 들어서는 1,816세대 힐스테이트. 1호선+의정부경전철 회룡역 더블역세권. GTX-C 의정부역 환승 가능. 59㎡ 5.7억~, 84㎡ 8.3억대.'
    }
  },
  {
    titleContains: '효성 해링턴',
    data: {
      totalUnits: 359,
      moveInDate: new Date('2028-06-01'), // 2025.12 분양 예정 기준 추정
      constructor: '효성중공업',
      keyFeature: '과천지식정보타운역 직결, 대형평형 중심',
      description: '과천지식정보타운 상업5블록에 들어서는 359실 오피스텔. 4호선 과천정보타운역 지하보도 직결 예정. 전용 76~125㎡ 중대형 위주 구성.'
    }
  }
];

async function updatePropertyData() {
  console.log('=== 17개 현장 데이터 업데이트 시작 ===\n');

  let successCount = 0;
  let failCount = 0;

  for (const item of propertyData) {
    try {
      const property = await prisma.property.findFirst({
        where: { title: { contains: item.titleContains } }
      });

      if (!property) {
        console.log(`❌ [${item.titleContains}] 매물을 찾을 수 없음`);
        failCount++;
        continue;
      }

      await prisma.property.update({
        where: { id: property.id },
        data: item.data
      });

      console.log(`✅ [${property.title}] 업데이트 완료`);
      successCount++;
    } catch (error) {
      console.log(`❌ [${item.titleContains}] 업데이트 실패:`, error);
      failCount++;
    }
  }

  console.log('\n=== 업데이트 완료 ===');
  console.log(`성공: ${successCount}개`);
  console.log(`실패: ${failCount}개`);
}

updatePropertyData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
