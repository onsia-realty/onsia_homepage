import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 백운호수 푸르지오 매물 찾기
  const property = await prisma.property.findFirst({
    where: { title: { contains: '백운호수' } },
    include: { images: true }
  });

  if (!property) {
    console.log('❌ 백운호수 푸르지오 매물을 찾을 수 없습니다.');
    return;
  }

  console.log('✅ 매물 찾음:', property.title);

  // 매물 정보 업데이트
  // 119타입 평균 16억, 99타입 평균 13.5억 → 대표값으로 16억 사용
  // 계약금 5%
  await prisma.property.update({
    where: { id: property.id },
    data: {
      basePrice: BigInt(1600000000), // 16억 (119타입 기준)
      pricePerPyeong: BigInt(44400000), // 약 4,440만원/평 (16억 / 36평)
      contractDeposit: BigInt(80000000), // 계약금 5% = 8천만원
      completionDate: new Date('2027-06-30'), // 추정 (2027년 상반기)
      moveInDate: new Date('2027-09-01'), // 추정 (준공 후 3개월)
    }
  });

  console.log('✅ 매물 정보 업데이트 완료');
  console.log('   분양가: 16억원 (119타입 기준)');
  console.log('   평단가: 약 4,440만원/평');
  console.log('   계약금: 8천만원 (5%)');

  // 이미지 추가
  if (property.images.length === 0) {
    await prisma.propertyImage.create({
      data: {
        url: '/푸르지오.png',
        alt: '백운호수 푸르지오 숲속의 아침 조감도',
        order: 0,
        type: 'EXTERIOR',
        propertyId: property.id
      }
    });
    console.log('✅ 이미지 추가 완료: /푸르지오.png');
  } else {
    console.log('⏭️ 이미지 이미 존재함');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
