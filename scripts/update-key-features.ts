import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 각 현장별 고유 특장점 데이터
const propertyFeatures: Record<string, { keyFeature: string; keyFeatures: string[] }> = {
  // 검단 동부센트레빌 에듀시티
  "검단 동부센트레빌 에듀시티": {
    keyFeature: "분양가상한제 적용, GTX-D 호재",
    keyFeatures: [
      "분양가상한제 적용으로 시세 대비 합리적 가격",
      "GTX-D 노선 수혜로 서울 접근성 대폭 향상",
      "검단신도시 중심 1,534세대 대단지",
      "초·중·고 학세권 도보 통학 가능"
    ]
  },

  // 과천 렉서 오피스텔
  "과천 렉서 오피스텔": {
    keyFeature: "과천지식정보타운 역세권",
    keyFeatures: [
      "4호선 과천지식정보타운역 도보 5분 역세권",
      "삼성전자 등 대기업 배후수요 풍부",
      "정부과천청사역 더블역세권 효과",
      "오피스텔 136실 + 생활숙박시설 92실 복합구성"
    ]
  },

  // 광명 퍼스트 스위첸
  "광명 퍼스트 스위첸": {
    keyFeature: "광명역세권 즉시입주",
    keyFeatures: [
      "2024년 5월 준공, 즉시입주 가능",
      "KTX 광명역세권 프리미엄",
      "275실 규모 대우건설 브랜드",
      "광명시흥 테크노밸리 산업단지 배후수요"
    ]
  },

  // 구리 중흥S클래스 힐더포레
  "구리 중흥S클래스 힐더포레": {
    keyFeature: "8호선 연장 수혜, 1,096세대",
    keyFeatures: [
      "8호선 연장 구리역 예정, 강남 직결",
      "갈매역세권 1,096세대 대단지",
      "일반분양 639세대 공급",
      "구리시 최대 규모 신규 단지"
    ]
  },

  // 김포 오퍼스 한강 스위첸
  "김포 오퍼스 한강 스위첸": {
    keyFeature: "한강조망, GTX-D 수혜",
    keyFeatures: [
      "한강 조망권 프리미엄 세대",
      "GTX-D 노선 수혜 예정",
      "김포한강신도시 1,029세대 대단지",
      "대우건설 푸르지오 브랜드"
    ]
  },

  // 신길 AK푸르지오
  "신길 AK푸르지오": {
    keyFeature: "서울 신길역 역세권 즉시입주",
    keyFeatures: [
      "7호선 신길역 도보 5분 역세권",
      "서울 영등포구 핵심 입지",
      "즉시입주 가능, 전매제한 없음",
      "296세대 도시형생활주택"
    ]
  },

  // 안성 아양 금성백조 예미지
  "안성 아양 금성백조 예미지": {
    keyFeature: "분양가상한제, 트리플학세권",
    keyFeatures: [
      "아양택지지구 마지막 분양단지",
      "분양가상한제 적용으로 합리적 가격",
      "초·중·고 트리플학세권",
      "657가구 중규모 커뮤니티"
    ]
  },

  // 운정 아이파크 포레스트
  "운정 아이파크 포레스트": {
    keyFeature: "GTX-A 운정역세권 메가단지",
    keyFeatures: [
      "GTX-A 운정역 도보권, 서울역 20분대",
      "3,250세대 파주 최대 메가단지",
      "현대산업개발 아이파크 브랜드",
      "운정신도시 중심 생활인프라"
    ]
  },

  // 이안 힐스 더원 동작
  "이안 힐스 더원 동작": {
    keyFeature: "서울 동작구, 10년 후 분양전환",
    keyFeatures: [
      "서울 동작구 핵심 입지",
      "10년 후 분양전환 민간임대",
      "459가구 중규모 단지",
      "7호선 역세권 출퇴근 편리"
    ]
  },

  // 이천 롯데캐슬
  "이천 롯데캐슬": {
    keyFeature: "경강선 이천역세권, 롯데캐슬",
    keyFeatures: [
      "경강선 이천역 도보권 역세권",
      "롯데건설 프리미엄 브랜드",
      "801세대 대단지 규모",
      "2027년 9월 입주예정"
    ]
  },

  // 인천 학익 루미엘
  "인천 학익 루미엘": {
    keyFeature: "평당 1,400만원대 가성비",
    keyFeatures: [
      "평당 1,400만원대 합리적 분양가",
      "인천 미추홀구 학익동 대단지",
      "1,065가구 규모의 랜드마크",
      "인천시청 배후수요 풍부"
    ]
  },

  // 천안 휴먼빌 퍼스트시티
  "천안 휴먼빌 퍼스트시티": {
    keyFeature: "천안아산역 KTX, 금호건설",
    keyFeatures: [
      "천안아산역 KTX 이용 서울 40분대",
      "금호건설 휴먼빌 브랜드",
      "1,541가구 초대형 단지",
      "천안시 핵심 신규 분양단지"
    ]
  },

  // 천왕역 모아엘가트레뷰
  "천왕역 모아엘가트레뷰": {
    keyFeature: "서울 7호선 천왕역 초역세권",
    keyFeatures: [
      "7호선 천왕역 초역세권 도보 3분",
      "강남까지 40분대 출퇴근",
      "서울 구로구 희소가치",
      "440세대 서울 분양 기회"
    ]
  },

  // 청량리 범양레우스 씨엘로네
  "청량리 범양레우스 씨엘로네": {
    keyFeature: "11개 노선 환승, 전세대 복층",
    keyFeatures: [
      "청량리역 11개 노선 환승 초역세권",
      "전 세대 복층 구조 특화설계",
      "GTX-B·C 노선 수혜 예정",
      "105세대 소규모 프리미엄"
    ]
  },

  // 탑석 푸르지오
  "탑석 푸르지오": {
    keyFeature: "7호선 탑석역 도보권",
    keyFeatures: [
      "2027년 7호선 탑석역 개통 예정",
      "대우건설 푸르지오 브랜드",
      "935세대 대단지 규모",
      "의정부시 신규 역세권 프리미엄"
    ]
  },

  // 회룡역 힐스테이트
  "회룡역 힐스테이트": {
    keyFeature: "더블역세권 1,816세대 힐스테이트",
    keyFeatures: [
      "1호선+의정부경전철 더블역세권",
      "현대건설 힐스테이트 브랜드",
      "1,816세대 의정부 최대급",
      "회룡역 도보 5분 출퇴근 편리"
    ]
  },

  // 효성 해링턴 스퀘어 과천
  "효성 해링턴 스퀘어 과천": {
    keyFeature: "과천역 지하보도 직결",
    keyFeatures: [
      "4호선 과천지식정보타운역 지하보도 직결",
      "효성중공업 해링턴 브랜드",
      "대형평형 중심 359실 구성",
      "과천 지식정보타운 프리미엄"
    ]
  }
};

async function main() {
  console.log('=== 현장별 특장점 데이터 업데이트 ===\n');

  const properties = await prisma.property.findMany({
    select: { id: true, title: true }
  });

  let updated = 0;
  let notFound = 0;

  for (const property of properties) {
    const features = propertyFeatures[property.title];

    if (features) {
      await prisma.property.update({
        where: { id: property.id },
        data: {
          keyFeature: features.keyFeature,
          keyFeatures: JSON.stringify(features.keyFeatures)
        }
      });
      console.log(`✅ ${property.title}`);
      console.log(`   특장점: ${features.keyFeature}`);
      console.log(`   상세: ${features.keyFeatures.length}개 항목`);
      updated++;
    } else {
      console.log(`❌ ${property.title} - 특장점 데이터 없음`);
      notFound++;
    }
  }

  console.log(`\n=== 결과 ===`);
  console.log(`업데이트: ${updated}개`);
  console.log(`미매칭: ${notFound}개`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
