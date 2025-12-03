import { PrismaClient, BuildingType, PropertyStatus } from '@prisma/client';

const prisma = new PrismaClient();

// 상가114 기반 12개 추가 매물 데이터
const newProperties = [
  {
    title: '검단 동부센트레빌 에듀시티',
    description: '인천 서구 검단신도시 중심부에 위치한 대단지 아파트. 우수한 교육환경과 편리한 교통망을 갖춘 미래가치 높은 단지입니다.',
    address: '인천 서구 당하동 693-4',
    district: '서구',
    city: '인천',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 1200,
    basePrice: BigInt(450000000),
    pricePerPyeong: BigInt(18000000),
    contractDeposit: BigInt(45000000),
    completionDate: new Date('2027-06-01'),
    moveInDate: new Date('2027-08-01'),
    status: PropertyStatus.AVAILABLE,
    featured: false,
    constructor: '동부건설',
    keyFeature: '검단신도시 중심',
    developerName: '동부건설',
  },
  {
    title: '회룡역 힐스테이트',
    description: '의정부 회룡역 도보 3분 거리 초역세권 아파트. 매일 계약이 나오는 인기 현장으로 수수료 인상 조건입니다.',
    address: '경기 의정부시 호원동 314-7',
    district: '호원동',
    city: '의정부시',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 850,
    basePrice: BigInt(520000000),
    pricePerPyeong: BigInt(21000000),
    contractDeposit: BigInt(52000000),
    completionDate: new Date('2027-03-01'),
    moveInDate: new Date('2027-05-01'),
    status: PropertyStatus.AVAILABLE,
    featured: true,
    constructor: '현대건설',
    keyFeature: '회룡역 도보 3분',
    developerName: '현대건설',
  },
  {
    title: '청량리 범양레우스 씨엘로네',
    description: '서울 동대문구 청량리역 인근 프리미엄 아파트. 경력무관 조건으로 신입도 가능한 현장입니다.',
    address: '서울 동대문구 사가정로5길 22 (전농동)',
    district: '전농동',
    city: '서울',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 650,
    basePrice: BigInt(780000000),
    pricePerPyeong: BigInt(32000000),
    contractDeposit: BigInt(78000000),
    completionDate: new Date('2027-09-01'),
    moveInDate: new Date('2027-11-01'),
    status: PropertyStatus.AVAILABLE,
    featured: true,
    constructor: '범양건영',
    keyFeature: '청량리역 인근',
    developerName: '범양건영',
  },
  {
    title: '금성백조 예미지 대구 아양',
    description: '대구 아양지구 리버뷰 영구조망 아파트. 워킹 계약률 80% 이상으로 검증된 인기 현장입니다.',
    address: '대구 동구 아양지구',
    district: '아양동',
    city: '대구',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 980,
    basePrice: BigInt(380000000),
    pricePerPyeong: BigInt(15000000),
    contractDeposit: BigInt(38000000),
    completionDate: new Date('2027-04-01'),
    moveInDate: new Date('2027-06-01'),
    status: PropertyStatus.AVAILABLE,
    featured: false,
    constructor: '금성백조',
    keyFeature: '리버뷰 영구조망',
    developerName: '금성백조주택',
  },
  {
    title: '이천 롯데캐슬',
    description: '이천시 안흥동 롯데캐슬 아파트. 선착순 팀광고비 50% 지원 조건의 매력적인 현장입니다.',
    address: '이천시 안흥동 284-2번지',
    district: '안흥동',
    city: '이천시',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 750,
    basePrice: BigInt(420000000),
    pricePerPyeong: BigInt(17000000),
    contractDeposit: BigInt(42000000),
    completionDate: new Date('2027-07-01'),
    moveInDate: new Date('2027-09-01'),
    status: PropertyStatus.AVAILABLE,
    featured: false,
    constructor: '롯데건설',
    keyFeature: '광고비 50% 지원',
    developerName: '롯데건설',
  },
  {
    title: '탑석 푸르지오',
    description: '의정부 탑석역 인근 대우건설 푸르지오. 파격조건으로 초보/경력무관 현장입니다.',
    address: '경기 의정부시 시민로 442 (용현동)',
    district: '용현동',
    city: '의정부시',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 920,
    basePrice: BigInt(480000000),
    pricePerPyeong: BigInt(19500000),
    contractDeposit: BigInt(48000000),
    completionDate: new Date('2027-05-01'),
    moveInDate: new Date('2027-07-01'),
    status: PropertyStatus.AVAILABLE,
    featured: false,
    constructor: '대우건설',
    keyFeature: '파격 조건',
    developerName: '대우건설',
  },
  {
    title: '인천 학익 루미엘',
    description: '인천 미추홀구 학익동 루미엘 아파트. 계약 잘나오는 현장으로 수수료 500만원 조건입니다.',
    address: '인천 미추홀구 숙골로 6 (도화동)',
    district: '도화동',
    city: '인천',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 680,
    basePrice: BigInt(410000000),
    pricePerPyeong: BigInt(16500000),
    contractDeposit: BigInt(41000000),
    completionDate: new Date('2027-08-01'),
    moveInDate: new Date('2027-10-01'),
    status: PropertyStatus.AVAILABLE,
    featured: false,
    constructor: '루미건설',
    keyFeature: '계약 잘 나오는 현장',
    developerName: '루미건설',
  },
  {
    title: '김포 오퍼스 한강 스위첸',
    description: '김포시 고촌읍 한강변 스위첸 아파트. 파격지원 경력무관 조건의 프리미엄 현장입니다.',
    address: '김포시 고촌읍 향산리',
    district: '고촌읍',
    city: '김포시',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 1100,
    basePrice: BigInt(550000000),
    pricePerPyeong: BigInt(22000000),
    contractDeposit: BigInt(55000000),
    completionDate: new Date('2027-02-01'),
    moveInDate: new Date('2027-04-01'),
    status: PropertyStatus.AVAILABLE,
    featured: true,
    constructor: 'KCC건설',
    keyFeature: '한강변 프리미엄',
    developerName: 'KCC건설',
  },
  {
    title: '이안 힐스 더원 동작',
    description: '서울 동작구 상도동 이안 힐스 더원 아파트. 서울 핵심지역 분양으로 미래가치가 높습니다.',
    address: '상도동 211-386번지 일원',
    district: '상도동',
    city: '서울',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 450,
    basePrice: BigInt(850000000),
    pricePerPyeong: BigInt(35000000),
    contractDeposit: BigInt(85000000),
    completionDate: new Date('2027-10-01'),
    moveInDate: new Date('2027-12-01'),
    status: PropertyStatus.AVAILABLE,
    featured: true,
    constructor: '이안건설',
    keyFeature: '서울 핵심지역',
    developerName: '이안건설',
  },
  {
    title: '신길 AK푸르지오',
    description: '서울 영등포구 신길동 AK푸르지오. 토허제 제외 지역으로 팀수수료 7000만원의 파격 조건입니다.',
    address: '서울 영등포구 가마산로 483',
    district: '신길동',
    city: '서울',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 580,
    basePrice: BigInt(920000000),
    pricePerPyeong: BigInt(38000000),
    contractDeposit: BigInt(92000000),
    completionDate: new Date('2027-06-01'),
    moveInDate: new Date('2027-08-01'),
    status: PropertyStatus.AVAILABLE,
    featured: true,
    constructor: '대우건설',
    keyFeature: '토허제 제외',
    developerName: '대우건설',
  },
  {
    title: '천왕역 모아엘가트레뷰',
    description: '서울 구로구 오류동 천왕역 초역세권 모아엘가트레뷰. 서울 토허제 미지정 지역입니다.',
    address: '서울 구로구 오리로 1165 (오류동)',
    district: '오류동',
    city: '서울',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 520,
    basePrice: BigInt(680000000),
    pricePerPyeong: BigInt(28000000),
    contractDeposit: BigInt(68000000),
    completionDate: new Date('2027-04-01'),
    moveInDate: new Date('2027-06-01'),
    status: PropertyStatus.AVAILABLE,
    featured: false,
    constructor: '모아건설',
    keyFeature: '천왕역 초역세권',
    developerName: '모아건설',
  },
  {
    title: '광명 퍼스트 스위첸',
    description: '경기 광명시 광명역 인근 KCC 스위첸. 경력무관 조건으로 GTX-B 호재 지역입니다.',
    address: '경기 광명시 광명로 834',
    district: '광명동',
    city: '광명시',
    buildingType: BuildingType.APARTMENT,
    totalUnits: 890,
    basePrice: BigInt(620000000),
    pricePerPyeong: BigInt(25000000),
    contractDeposit: BigInt(62000000),
    completionDate: new Date('2027-09-01'),
    moveInDate: new Date('2027-11-01'),
    status: PropertyStatus.AVAILABLE,
    featured: false,
    constructor: 'KCC건설',
    keyFeature: 'GTX-B 호재',
    developerName: 'KCC건설',
  },
];

async function main() {
  console.log('🏗️ 12개 신규 매물 추가 시작...\n');

  // 기본 유저 찾기 (author 필수)
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    // admin 유저 없으면 생성
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@onsia.city',
        name: 'Admin',
        role: 'ADMIN',
      }
    });
    console.log('✅ Admin 유저 생성');
  }

  for (const prop of newProperties) {
    // 개발사 찾기 또는 생성
    let developer = await prisma.developer.findFirst({
      where: { name: prop.developerName }
    });

    if (!developer) {
      developer = await prisma.developer.create({
        data: {
          name: prop.developerName,
          description: `${prop.developerName} - 대한민국 대표 건설사`,
        }
      });
      console.log(`✅ 개발사 생성: ${prop.developerName}`);
    }

    // slug 생성
    const slug = prop.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-가-힣]/g, '')
      + '-' + Date.now();

    // 매물 생성
    await prisma.property.create({
      data: {
        title: prop.title,
        slug: slug,
        description: prop.description,
        address: prop.address,
        district: prop.district,
        city: prop.city,
        buildingType: prop.buildingType,
        totalUnits: prop.totalUnits,
        basePrice: prop.basePrice,
        pricePerPyeong: prop.pricePerPyeong,
        contractDeposit: prop.contractDeposit,
        interimPayments: '[]',
        facilities: '[]',
        completionDate: prop.completionDate,
        moveInDate: prop.moveInDate,
        status: prop.status,
        featured: prop.featured,
        constructor: prop.constructor,
        keyFeature: prop.keyFeature,
        developerId: developer.id,
        authorId: adminUser.id,
      }
    });

    console.log(`✅ 매물 생성: ${prop.title} (featured: ${prop.featured})`);

    // 중복 slug 방지를 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  // 최종 확인
  const totalCount = await prisma.property.count();
  const featuredCount = await prisma.property.count({ where: { featured: true } });

  console.log(`\n📊 최종 현황:`);
  console.log(`   - 총 매물: ${totalCount}개`);
  console.log(`   - 추천 매물: ${featuredCount}개`);
  console.log('\n🎉 12개 신규 매물 추가 완료!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
