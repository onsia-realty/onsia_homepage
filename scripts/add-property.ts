import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. 시행사 미정 등록 (없으면)
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
    console.log('시행사 등록:', developer.name);
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

  // 3. 왕십리역 어반홈스 매물 등록
  const property = await prisma.property.create({
    data: {
      title: '왕십리역 어반홈스',
      slug: 'wangsimni-urban-homes',
      description: `서울 성동구 왕십리광역중심 일반상업지역에 위치한 초역세권 프리미엄 오피스텔·근린생활시설 복합단지입니다. GTX-C, 동북선 등 광역 교통망 확장과 성동구청·경찰서 이전 예정에 따른 비즈니스타운 조성으로 높은 미래가치를 보유한 입지입니다.

[입지 프리미엄]
• GTX-C, 동북선 예정
• 왕십리 광역중심 지구단위계획 변경
• 성동구청·경찰서 이전 → Business-Town 조성
• 한양대병원, 건대병원, 국립중앙의료원 의료클러스터
• 대학가 배후 수요 + 직주근접 업무수요 동시 확보`,

      // 위치 정보
      city: '서울특별시',
      district: '성동구',
      address: '도선동 114·115·116·117번지',
      locationDesc: '왕십리역 도보권, 성동구청·경찰서 이전 예정 비즈니스타운 중심, 한양대병원·건국대병원 등 대형 의료 인프라와 대학가 배후수요 확보',

      // 건물 정보
      buildingType: 'OFFICETEL',
      constructor: '대건산업건설',
      keyFeature: '초역세권, GTX-C 예정, 성동 비즈니스타운',

      // 단지 정보
      totalUnits: 90, // A동 45실 + B동 45실 (오피스텔42+근생3)
      availableUnits: 90,
      totalBuildingCount: 2,
      parkingSpaces: 73, // A동 37 + B동 36
      pyeongTypes: JSON.stringify(['29㎡', '33㎡', '35㎡', '36㎡', '38㎡']),
      facilities: JSON.stringify(['커뮤니티', '스마트싱스', '기계식주차', '근린생활시설']),

      // 가격 정보 (추후 입력 - 임시값)
      basePrice: BigInt(300000000), // 3억 (임시)
      pricePerPyeong: BigInt(25000000), // 2500만원/평 (임시)
      contractDeposit: BigInt(30000000), // 3천만원 (임시)
      interimPayments: JSON.stringify({ payments: [] }),

      // 투자 정보
      investmentGrade: 'A',
      profitRate: null,

      // 일정 (추후 입력 - 임시값)
      completionDate: new Date('2027-06-30'),
      moveInDate: new Date('2027-09-01'),

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
  console.log('   시공사:', property.constructor);
  console.log('   위치:', property.city, property.district);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
