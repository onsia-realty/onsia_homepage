import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 왕십리역 어반홈스 매물 찾기
  const property = await prisma.property.findFirst({
    where: {
      OR: [
        { title: { contains: '왕십리' } },
        { slug: 'wangsimni-urban-homes' }
      ]
    },
    include: { images: true }
  });

  if (!property) {
    console.log('❌ 왕십리역 어반홈스 매물을 찾을 수 없습니다.');
    return;
  }

  console.log('✅ 매물 찾음:', property.title);
  console.log('   현재 이미지 수:', property.images.length);

  // 기존 이미지 삭제
  if (property.images.length > 0) {
    await prisma.propertyImage.deleteMany({
      where: { propertyId: property.id }
    });
    console.log('   기존 이미지 삭제됨');
  }

  // 새 이미지 추가
  const newImage = await prisma.propertyImage.create({
    data: {
      url: '/unnamed.jpg',
      alt: '왕십리역 어반홈스 조감도',
      order: 0,
      type: 'EXTERIOR',
      propertyId: property.id
    }
  });

  console.log('✅ 이미지 추가 완료:', newImage.url);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
