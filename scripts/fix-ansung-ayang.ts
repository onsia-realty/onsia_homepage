import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAnsungAyang() {
  // 금성백조 예미지 매물 찾기
  const property = await prisma.property.findFirst({
    where: { title: { contains: '금성백조' } }
  });

  if (!property) {
    console.log('❌ 금성백조 예미지 매물을 찾을 수 없음');
    return;
  }

  console.log('현재 매물:', property.title);
  console.log('현재 위치:', property.city, property.district);

  // 안성 아양 금성백조 예미지로 정보 업데이트
  await prisma.property.update({
    where: { id: property.id },
    data: {
      title: '안성 아양 금성백조 예미지',
      city: '경기도',
      district: '안성시',
      address: '경기도 안성시 옥산동 아양택지개발지구 B2블록',
      totalUnits: 657,
      basePrice: BigInt(382400000), // 3억8,240만원 (최저가)
      pricePerPyeong: BigInt(13040000), // 평당 1,304만원
      moveInDate: new Date('2028-06-01'),
      constructor: '금성백조건설',
      keyFeature: '아양택지지구 마지막 분양, 분양가상한제, 트리플학세권',
      description: '경기도 안성시 아양택지개발지구 B2블록에 위치한 657가구 아파트. 분양가상한제 적용으로 전용 84㎡ 3.8~4.4억원대. 아양지구 마지막 분양 단지로 희소성 보유. 백성초, 안성중(2027년 이전 예정), 고등학교 예정부지 도보권 트리플 학세권.'
    }
  });

  console.log('✅ 안성 아양 금성백조 예미지로 업데이트 완료');
  console.log('');
  console.log('업데이트된 정보:');
  console.log('- 위치: 경기도 안성시 아양택지개발지구 B2블록');
  console.log('- 세대수: 657가구');
  console.log('- 분양가: 3억8,240만원~4억4,330만원 (84㎡)');
  console.log('- 평당가: 1,304만원');
  console.log('- 입주예정: 2028년 6월');
  console.log('- 시공사: 금성백조건설');
}

fixAnsungAyang().catch(console.error).finally(() => prisma.$disconnect());
