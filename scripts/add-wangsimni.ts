import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. 먼저 기본 User와 Developer 확인/생성
  let user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'admin@onsia.city',
        name: '관리자',
        role: 'ADMIN',
      },
    });
  }

  // Developer 확인/생성
  let developer = await prisma.developer.findFirst({ where: { name: '코오롱글로벌' } });
  if (!developer) {
    developer = await prisma.developer.create({
      data: {
        name: '코오롱글로벌',
        description: '국내 대표 건설사',
      },
    });
  }

  // 2. 왕십리역 어반홈스 등록
  const wangsimni = await prisma.property.create({
    data: {
      title: '왕십리역 어반홈스',
      slug: 'wangsimni-urban-homes',
      description: '왕십리역 역세권 프리미엄 주거시설',
      address: '서울특별시 성동구 왕십리로 88',
      district: '성동구',
      city: '서울특별시',
      totalUnits: 350,
      availableUnits: 50,
      buildingType: 'OFFICETEL',
      completionDate: new Date('2027-06-01'),
      basePrice: BigInt(550000000), // 5.5억
      pricePerPyeong: BigInt(35000000), // 3500만원/평
      contractDeposit: BigInt(55000000), // 계약금 10%
      interimPayments: JSON.stringify([
        { name: '1차 중도금', amount: 110000000, date: '2025-06-01' },
        { name: '2차 중도금', amount: 110000000, date: '2025-12-01' },
        { name: '3차 중도금', amount: 110000000, date: '2026-06-01' },
      ]),
      constructor: '코오롱글로벌',
      keyFeature: '왕십리역 도보 3분, 역세권 프리미엄',
      keyFeatures: JSON.stringify([
        '왕십리역 도보 3분',
        '한양대 인접',
        '성수동 생활권',
        '뚝섬역 접근성',
      ]),
      loanRatio: '60% 무이자',
      investmentGrade: 'A',
      totalBuildingCount: 2,
      parkingSpaces: 400,
      facilities: JSON.stringify(['피트니스', '라운지', '스터디룸', '카페']),
      status: 'AVAILABLE',
      featured: true,
      developerId: developer.id,
      authorId: user.id,
      createdAt: new Date('2024-01-03'), // 3번째로 표시되도록
    },
  });

  console.log('왕십리역 어반홈스 등록 완료:', wangsimni.id);

  // 3. 이미지 추가
  await prisma.propertyImage.create({
    data: {
      url: '/properties/wangsimni-1.jpg',
      alt: '왕십리역 어반홈스 외관',
      order: 0,
      type: 'EXTERIOR',
      propertyId: wangsimni.id,
    },
  });

  // 4. 경남 아너스빌, 신광교클라우드시티 순서 조정
  // featured = true로 하고 createdAt으로 순서 조정

  // 경남 아너스빌 찾기
  const anorsville = await prisma.property.findFirst({
    where: { title: { contains: '아너스빌' } },
  });

  if (anorsville) {
    await prisma.property.update({
      where: { id: anorsville.id },
      data: {
        featured: true,
        createdAt: new Date('2024-01-01'), // 가장 먼저
      },
    });
    console.log('경남 아너스빌 순서 조정 완료');
  }

  // 신광교클라우드시티 찾기
  const singwangyo = await prisma.property.findFirst({
    where: { title: { contains: '신광교' } },
  });

  if (singwangyo) {
    await prisma.property.update({
      where: { id: singwangyo.id },
      data: {
        featured: true,
        createdAt: new Date('2024-01-02'), // 두번째
      },
    });
    console.log('신광교클라우드시티 순서 조정 완료');
  }

  // 5. 현재 featured 매물들 확인
  const featuredProperties = await prisma.property.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'asc' },
    select: { title: true, createdAt: true },
  });

  console.log('\nFeatured 매물 순서:');
  featuredProperties.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title} (${p.createdAt.toISOString()})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
