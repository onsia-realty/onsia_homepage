import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. 시행사 미정 확인/생성
  let developer = await prisma.developer.findFirst({
    where: { name: '시행사 미정' }
  });

  if (!developer) {
    developer = await prisma.developer.create({
      data: {
        name: '시행사 미정',
        description: '시행사 미정 (추후 입력)',
      }
    });
  }

  // 2. 관리자 계정 확인
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@onsia.city' }
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@onsia.city',
        name: '관리자',
        role: 'ADMIN',
      }
    });
  }

  // 3. 백운호수 푸르지오 매물 등록
  const property = await prisma.property.create({
    data: {
      title: '백운호수 푸르지오 숲속의 아침',
      slug: 'baekun-prugio-forest',
      description: `경기도 의왕시 학의동 백운호수 인근에 위치한 대규모 브랜드 오피스텔 단지로, 총 842실 규모의 대단지 프리미엄 주거복합 프로젝트입니다. 자연환경·광역교통·생활인프라를 동시에 갖춘 수도권 남부 핵심 주거입지입니다.

[입지 프리미엄]
• 강남 20분대, 판교 15분대, 안양 10분대
• 백운호수 + 숲세권 + 롯데프리미엄아울렛 도보권
• GTX-C 노선 예정, 평촌선 계획
• 청계IC, 과천봉담도시고속화도로 인접
• 백운산, 모락산, 바라산 숲세권 힐링 주거벨트`,

      // 위치 정보
      city: '경기도',
      district: '의왕시 학의동',
      address: '학의동 654번지 일원',
      locationDesc: '백운호수 생활권, 강남 20분대·판교 15분대·안양 10분대 접근, 롯데프리미엄아울렛 도보권, GTX-C 예정',

      // 건물 정보
      buildingType: 'OFFICETEL',
      constructor: '대우건설(푸르지오)', // 푸르지오 브랜드
      keyFeature: '백운호수 숲세권, GTX-C 예정, 842실 대단지',

      // 단지 정보
      totalUnits: 842,
      availableUnits: 842,
      totalBuildingCount: 2, // 1단지, 2단지
      parkingSpaces: null, // 자료 미기재
      pyeongTypes: JSON.stringify(['99㎡(30평)', '119㎡(36평)']),
      facilities: JSON.stringify(['커뮤니티시설', '피트니스', '스카이라운지', '게스트하우스']),

      // 가격 정보 (추후 입력 - 임시값)
      basePrice: BigInt(0), // 추후 입력
      pricePerPyeong: null,
      contractDeposit: BigInt(0), // 추후 입력
      interimPayments: JSON.stringify({ payments: [] }),

      // 투자 정보
      investmentGrade: 'A',
      profitRate: null,

      // 일정 (임시 - 추후 수정)
      completionDate: new Date('2026-12-31'),
      moveInDate: new Date('2027-03-01'),

      // 상태
      status: 'AVAILABLE',
      featured: true,
      isPremium: true,

      // 관계
      developerId: developer.id,
      authorId: admin.id,
    },
    include: {
      developer: true,
    }
  });

  console.log('✅ 매물 등록 완료:', property.title);
  console.log('   ID:', property.id);
  console.log('   위치:', property.city, property.district);
  console.log('   총 세대수:', property.totalUnits);
  console.log('   특장점:', property.keyFeature);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
