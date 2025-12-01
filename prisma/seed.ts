import { PrismaClient, PostCategory, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 생성 시작...');

  // 관리자 사용자 생성
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@onsia.com' },
    update: {},
    create: {
      email: 'admin@onsia.com',
      name: '온시아 관리자',
      role: 'ADMIN'
    }
  });

  console.log('👤 관리자 사용자 생성 완료:', adminUser.email);

  // 회사 정보 생성
  const companyInfo = await prisma.company.upsert({
    where: { id: 'onsia-company' },
    update: {},
    create: {
      id: 'onsia-company',
      name: '온시아',
      description: 'AI 바이브 코딩 전문가와 함께하는 부동산 혁신 플랫폼',
      mission: 'AI와 블록체인 기술로 부동산 시장의 투명성과 효율성을 높인다',
      vision: '모든 사람이 스마트한 부동산 투자를 할 수 있는 세상을 만든다',
      patents: JSON.stringify([
        {
          title: '블록체인 기반 부동산 거래 시스템',
          number: 'KR10-2024-0001234',
          date: '2024-01-15',
          description: '스마트 계약을 활용한 안전하고 투명한 부동산 거래 플랫폼'
        },
        {
          title: 'AI 부동산 가격 예측 알고리즘',
          number: 'KR10-2024-0002345',
          date: '2024-02-20',
          description: '머신러닝을 활용한 정확한 부동산 시세 분석 시스템'
        },
        {
          title: '분산 원장 기반 소유권 관리 시스템',
          number: 'KR10-2024-0003456', 
          date: '2024-03-10',
          description: '블록체인 기술을 활용한 부동산 소유권 추적 및 관리'
        }
      ]),
      achievements: JSON.stringify([
        { title: '특허 등록', count: 3, description: '블록체인 부동산 관련 특허' },
        { title: '거래 완료', count: 500, description: '플랫폼을 통한 성공적인 거래' },
        { title: '고객 만족도', count: 98, description: '평균 고객 만족도 (%)', unit: '%' }
      ]),
      teamMembers: JSON.stringify([
        {
          name: '김온시아',
          role: 'CEO & AI 바이브 코딩 전문가',
          description: '공인중개사 자격을 보유한 AI 개발 전문가',
          image: '/team/ceo.jpg'
        }
      ])
    }
  });

  console.log('🏢 회사 정보 생성 완료');

  // 샘플 게시글 생성
  const samplePosts = [
    {
      title: '2024년 부동산 시장 전망과 AI 분석',
      slug: '2024-real-estate-market-ai-analysis',
      content: `<h2>AI가 예측하는 2024년 부동산 시장</h2>
      <p>최신 AI 기술을 활용하여 2024년 부동산 시장의 트렌드를 분석해보겠습니다...</p>
      <h3>주요 예측 포인트</h3>
      <ul>
        <li>수도권 아파트 가격 안정세</li>
        <li>지방 중소도시 상승 전망</li>
        <li>상업용 부동산 회복 신호</li>
      </ul>`,
      excerpt: 'AI 기술로 분석한 2024년 부동산 시장의 핵심 트렌드와 투자 포인트를 살펴보세요.',
      category: PostCategory.MARKET_ANALYSIS,
      seoTitle: '2024년 부동산 시장 전망 - AI 분석 리포트',
      seoDescription: 'AI 기술을 활용한 2024년 부동산 시장 분석과 투자 전략을 제공합니다.'
    },
    {
      title: '블록체인이 바꾸는 부동산 거래의 미래',
      slug: 'blockchain-future-real-estate-transactions',
      content: `<h2>블록체인 혁신이 가져올 변화</h2>
      <p>우리의 특허 기술인 블록체인 부동산 거래 시스템이 어떻게 업계를 변화시킬지 알아보겠습니다...</p>
      <h3>핵심 기술 특징</h3>
      <ul>
        <li>스마트 계약 자동 실행</li>
        <li>투명한 거래 기록</li>
        <li>중개 수수료 절감</li>
      </ul>`,
      excerpt: '특허받은 블록체인 기술로 부동산 거래가 어떻게 혁신되는지 확인해보세요.',
      category: PostCategory.BLOCKCHAIN,
      seoTitle: '블록체인 부동산 거래 혁신 - 특허 기술 소개',
      seoDescription: '블록체인 기술을 활용한 안전하고 투명한 부동산 거래의 미래를 제시합니다.'
    }
  ];

  for (const post of samplePosts) {
    const createdPost = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: adminUser.id,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date()
      }
    });
    console.log(`📝 게시글 생성: ${createdPost.title}`);
  }

  // 샘플 영상 데이터 생성
  const sampleVideos = [
    {
      youtubeId: 'dQw4w9WgXcQ',
      title: 'AI가 분석하는 2024 부동산 시장 전망',
      description: '최신 AI 기술을 활용하여 부동산 시장의 미래를 예측하고 투자 포인트를 제시합니다.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '15:42',
      publishedAt: new Date('2024-03-15'),
      category: 'AI_TECH',
      tags: JSON.stringify(['부동산', 'AI', '시장분석', '투자']),
      viewCount: 125000,
      seoTitle: 'AI 부동산 시장 분석 - 2024년 전망',
      seoDescription: 'AI 기술로 분석한 부동산 시장 트렌드와 투자 가이드'
    },
    {
      youtubeId: 'jNQXAC9IVRw',
      title: '블록체인 부동산 투자의 모든 것',
      description: '블록체인 기술이 부동산 투자에 미치는 영향과 우리의 특허 기술을 소개합니다.',
      thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
      duration: '12:33',
      publishedAt: new Date('2024-03-10'),
      category: PostCategory.BLOCKCHAIN,
      tags: JSON.stringify(['블록체인', '부동산', '투자', '특허기술']),
      viewCount: 87000,
      seoTitle: '블록체인 부동산 투자 완벽 가이드',
      seoDescription: '블록체인 기술을 활용한 새로운 부동산 투자 방법을 알아보세요'
    }
  ];

  for (const video of sampleVideos) {
    const createdVideo = await prisma.video.upsert({
      where: { youtubeId: video.youtubeId },
      update: {},
      create: video
    });
    console.log(`🎥 영상 생성: ${createdVideo.title}`);
  }

  // 태그 생성
  const tags = ['부동산', 'AI', '블록체인', '투자', '시장분석', '특허기술', '스마트계약'];
  
  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        color: '#3B82F6' // 기본 블루 색상
      }
    });
  }

  console.log('🏷️ 태그 생성 완료');

  // 건설사 데이터 생성
  const developers = [
    {
      name: '대우건설',
      description: '대한민국 대표 건설사로 프리미엄 주거 브랜드를 선도합니다',
      logoUrl: '/developers/daewoo.png',
      website: 'https://www.daewooenc.com',
      totalProjects: 150,
      rating: 4.8
    },
    {
      name: '경남기업',
      description: '아너스빌 브랜드로 유명한 믿을 수 있는 건설사',
      logoUrl: '/developers/kyungnam.png',
      website: 'https://www.kyungnam.co.kr',
      totalProjects: 85,
      rating: 4.6
    },
    {
      name: '대방건설',
      description: '합리적인 가격의 고품질 주거 공간을 제공합니다',
      logoUrl: '/developers/daebang.png',
      website: 'https://www.daebang.co.kr',
      totalProjects: 120,
      rating: 4.5
    }
  ];

  const createdDevelopers: any[] = [];
  for (const dev of developers) {
    const developer = await prisma.developer.upsert({
      where: { name: dev.name },
      update: {},
      create: dev
    });
    createdDevelopers.push(developer);
    console.log(`🏗️ 건설사 생성: ${developer.name}`);
  }

  // 매물 데이터 생성
  const properties = [
    {
      title: '신광교 클라우드시티',
      slug: 'sin-gwang-gyo-cloud-city',
      description: '수원 광교 신도시 호수공원 인근에 위치한 프리미엄 아파트로, 신분당선 광교역 도보 10분 거리의 우수한 접근성과 높은 투자가치를 자랑합니다.',
      address: '경기 수원시 영통구 광교호수공원로 154',
      district: '영통구',
      city: '수원시',
      zipCode: '16514',
      totalUnits: 842,
      availableUnits: 156,
      buildingType: 'APARTMENT' as const,
      completionDate: new Date('2028-03-31'),
      moveInDate: new Date('2028-05-31'),
      basePrice: BigInt(1350000000),
      pricePerPyeong: BigInt(4500000),
      contractDeposit: BigInt(135000000),
      interimPayments: JSON.stringify({
        payments: [
          { step: '1차 중도금', rate: 10, amount: 135000000, date: '2024-12' },
          { step: '2차 중도금', rate: 10, amount: 135000000, date: '2025-04' },
          { step: '3차 중도금', rate: 10, amount: 135000000, date: '2025-08' }
        ]
      }),
      rightsFee: BigInt(50000000),
      profitRate: 18.5,
      investmentGrade: 'A+',
      constructor: '현대엔지니어링',
      keyFeature: '계약금 0원',
      totalBuildingCount: 5,
      parkingSpaces: 920,
      facilities: JSON.stringify(['피트니스센터', '대형 회의실', '숙면실', '커뮤니티센터']),
      status: 'AVAILABLE' as const,
      featured: true,
      // 신규 추가 필드
      youtubeVideoId: 'dQw4w9WgXcQ',
      locationDesc: '신분당선 광교역 도보 10분, 광교호수공원 인접, 경기대학교 근처 학군 우수',
      pyeongTypes: JSON.stringify(['59A', '84B', '114C']),
      isPremium: true,
      developerId: createdDevelopers[0].id,
      authorId: adminUser.id
    },
    {
      title: '용인 경남아너스빌',
      slug: 'yongin-kyungnam-honors-ville',
      description: '용인 기흥구 중동에 위치한 경남기업의 아너스빌 브랜드 아파트입니다. 삼성전자 기흥캠퍼스와 인접하여 안정적인 배후수요를 확보하고 있습니다.',
      address: '경기 용인시 기흥구 중동 1234번지',
      district: '기흥구',
      city: '용인시',
      zipCode: '17086',
      totalUnits: 1248,
      availableUnits: 324,
      buildingType: 'APARTMENT' as const,
      completionDate: new Date('2028-03-31'),
      moveInDate: new Date('2028-05-31'),
      basePrice: BigInt(890000000),
      pricePerPyeong: BigInt(3200000),
      contractDeposit: BigInt(89000000),
      interimPayments: JSON.stringify({
        payments: [
          { step: '1차 중도금', rate: 10, amount: 89000000, date: '2024-11' },
          { step: '2차 중도금', rate: 10, amount: 89000000, date: '2025-03' },
          { step: '3차 중도금', rate: 10, amount: 89000000, date: '2025-09' }
        ]
      }),
      rightsFee: BigInt(35000000),
      profitRate: 22.3,
      investmentGrade: 'A',
      constructor: 'SM건설',
      keyFeature: '6500세대 대단지 아파트',
      totalBuildingCount: 12,
      parkingSpaces: 1450,
      facilities: JSON.stringify(['휘트니스클럽', '지하주차장', '어린이놀이터', '작은도서관']),
      status: 'AVAILABLE' as const,
      featured: true,
      // 신규 추가 필드
      youtubeVideoId: 'jNQXAC9IVRw',
      locationDesc: '삼성전자 기흥캠퍼스 10분, GTX-A 구성역 예정, 용인세브란스병원 인접',
      pyeongTypes: JSON.stringify(['59A', '74B', '84C', '101D']),
      isPremium: false,
      developerId: createdDevelopers[1].id,
      authorId: adminUser.id
    },
    {
      title: '이천 부발역 에피트',
      slug: 'icheon-bubal-epit',
      description: '이천 부발역 도보 5분 거리에 위치한 역세권 아파트입니다. SK하이닉스 이천캠퍼스와 가까워 안정적인 수요층을 확보하고 있습니다.',
      address: '경기 이천시 부발읍 부발리 567번지',
      district: '부발읍',
      city: '이천시',
      zipCode: '17417',
      totalUnits: 687,
      availableUnits: 89,
      buildingType: 'APARTMENT' as const,
      completionDate: new Date('2028-03-31'),
      moveInDate: new Date('2028-05-31'),
      basePrice: BigInt(1180000000),
      pricePerPyeong: BigInt(4100000),
      contractDeposit: BigInt(118000000),
      interimPayments: JSON.stringify({
        payments: [
          { step: '1차 중도금', rate: 10, amount: 118000000, date: '2024-09' },
          { step: '2차 중도금', rate: 10, amount: 118000000, date: '2024-12' },
          { step: '3차 중도금', rate: 10, amount: 118000000, date: '2025-05' }
        ]
      }),
      rightsFee: BigInt(28000000),
      profitRate: 15.7,
      investmentGrade: 'B+',
      constructor: '한라건설',
      keyFeature: '계약금 0원',
      totalBuildingCount: 7,
      parkingSpaces: 820,
      facilities: JSON.stringify(['피트니스센터', '지하주차장', '어린이공원', '게스트하우스']),
      status: 'AVAILABLE' as const,
      featured: true,
      // 신규 추가 필드
      locationDesc: '부발역 도보 5분, SK하이닉스 이천캠퍼스 15분, 이천IC 10분 접근성',
      pyeongTypes: JSON.stringify(['59A', '84B']),
      isPremium: false,
      developerId: createdDevelopers[2].id,
      authorId: adminUser.id
    }
  ];

  for (const prop of properties) {
    const property = await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {
        featured: prop.featured,
        facilities: prop.facilities
      },
      create: prop
    });
    console.log(`🏘️ 매물 생성: ${property.title}`);
  }

  console.log('✅ 시드 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });