import { PrismaClient, BuildingType, PropertyStatus } from '@prisma/client';

const prisma = new PrismaClient();

// 상가114에서 스크래핑한 현장 5개
const properties = [
  {
    title: '운정 아이파크 포레스트',
    city: '경기도',
    district: '파주시',
    address: '파주시 운정신도시',
    totalUnits: 3250,
    buildingType: BuildingType.APARTMENT,
    completionDate: new Date('2026-12-01'),
    basePrice: BigInt(500000000), // 5억
    contractDeposit: BigInt(50000000), // 5천만
    constructor: 'HDC현대산업개발',
    keyFeature: '3,250세대 대단지, GTX-A 운정역 인접',
    description: '파주 운정신도시 내 위치한 3,250세대 대단지 아파트. GTX-A 운정역 인접으로 강남 접근성 우수.',
  },
  {
    title: '과천 렉서 오피스텔',
    city: '경기도',
    district: '과천시',
    address: '과천시 중앙동',
    totalUnits: 500,
    buildingType: BuildingType.OFFICETEL,
    completionDate: new Date('2026-06-01'),
    basePrice: BigInt(400000000), // 4억
    contractDeposit: BigInt(40000000), // 4천만
    constructor: '미정',
    keyFeature: '과천 정부종합청사역 도보권, 투자가치 높음',
    description: '과천시 중심부 위치한 오피스텔. 정부종합청사역 도보권으로 교통 편리.',
  },
  {
    title: '효성 해링턴 스퀘어 과천',
    city: '경기도',
    district: '과천시',
    address: '과천시 별양동',
    totalUnits: 1200,
    buildingType: BuildingType.APARTMENT,
    completionDate: new Date('2027-03-01'),
    basePrice: BigInt(800000000), // 8억
    contractDeposit: BigInt(80000000), // 8천만
    constructor: '효성중공업',
    keyFeature: '과천 재개발, 효성 브랜드, 강남 20분대',
    description: '과천시 별양동 재개발 아파트. 효성 해링턴 브랜드, 강남 접근성 우수.',
  },
  {
    title: '천안 휴먼빌 퍼스트시티',
    city: '충청남도',
    district: '천안시',
    address: '천안시 서북구',
    totalUnits: 2800,
    buildingType: BuildingType.APARTMENT,
    completionDate: new Date('2026-09-01'),
    basePrice: BigInt(350000000), // 3.5억
    contractDeposit: BigInt(35000000), // 3.5천만
    constructor: '휴먼빌',
    keyFeature: '2,800세대 대단지, KTX천안아산역 인접',
    description: '천안시 서북구 대단지 아파트. KTX 천안아산역 접근성 우수.',
  },
  {
    title: '구리 중흥S클래스 힐더포레',
    city: '경기도',
    district: '구리시',
    address: '구리시 수택동',
    totalUnits: 1500,
    buildingType: BuildingType.APARTMENT,
    completionDate: new Date('2027-06-01'),
    basePrice: BigInt(650000000), // 6.5억
    contractDeposit: BigInt(65000000), // 6.5천만
    constructor: '중흥건설',
    keyFeature: '중흥S클래스 브랜드, 강변역 10분, 자연환경 우수',
    description: '구리시 수택동 아파트. 중흥S클래스 브랜드, 한강 조망 가능.',
  },
];

async function main() {
  console.log('🚀 5개 매물 등록 시작...\n');

  // 기본 Developer 확인 또는 생성
  let developer = await prisma.developer.findFirst();
  if (!developer) {
    developer = await prisma.developer.create({
      data: {
        name: '온시아 부동산',
        description: '분양권 전문 중개',
      },
    });
    console.log('✅ Developer 생성:', developer.name);
  }

  // 기본 User 확인 또는 생성
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@onsia.city',
        name: '관리자',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin User 생성:', user.email);
  }

  // 매물 등록
  for (const prop of properties) {
    const slug = prop.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9가-힣-]/g, '');

    // 중복 체크
    const existing = await prisma.property.findUnique({
      where: { slug },
    });

    if (existing) {
      console.log(`⏭️ 이미 존재: ${prop.title}`);
      continue;
    }

    const created = await prisma.property.create({
      data: {
        title: prop.title,
        slug,
        description: prop.description,
        address: prop.address,
        district: prop.district,
        city: prop.city,
        totalUnits: prop.totalUnits,
        availableUnits: Math.floor(prop.totalUnits * 0.3), // 30% 잔여
        buildingType: prop.buildingType,
        completionDate: prop.completionDate,
        moveInDate: new Date(prop.completionDate.getTime() + 90 * 24 * 60 * 60 * 1000), // 준공 + 3개월
        basePrice: prop.basePrice,
        contractDeposit: prop.contractDeposit,
        interimPayments: JSON.stringify([]),
        constructor: prop.constructor,
        keyFeature: prop.keyFeature,
        facilities: JSON.stringify(['피트니스', '독서실', '커뮤니티센터']),
        status: PropertyStatus.AVAILABLE,
        featured: true, // 메인에 노출
        developerId: developer.id,
        authorId: user.id,
      },
    });

    console.log(`✅ 등록 완료: ${created.title} (${created.city} ${created.district})`);
  }

  console.log('\n🎉 5개 매물 등록 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 에러 발생:', e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
