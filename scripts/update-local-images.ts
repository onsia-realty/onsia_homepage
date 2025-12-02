import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🖼️ 로컬 이미지로 업데이트 시작...\n');

  // 1. 천안 휴먼빌 퍼스트시티
  const cheonan = await prisma.property.findFirst({
    where: { title: { contains: '천안' } }
  });

  if (cheonan) {
    await prisma.propertyImage.deleteMany({ where: { propertyId: cheonan.id } });
    await prisma.propertyImage.create({
      data: {
        propertyId: cheonan.id,
        url: '/천안휴먼빌 퍼스트시티',
        alt: '천안 휴먼빌 퍼스트시티 조감도',
        order: 0,
        type: 'EXTERIOR'
      }
    });
    console.log('✅ 천안 휴먼빌 퍼스트시티 이미지 업데이트 완료!');
  }

  // 2. 해링턴 스퀘어 과천
  const harington = await prisma.property.findFirst({
    where: { title: { contains: '해링턴' } }
  });

  if (harington) {
    await prisma.propertyImage.deleteMany({ where: { propertyId: harington.id } });
    await prisma.propertyImage.create({
      data: {
        propertyId: harington.id,
        url: '/해링턴 스퀘어 과천.png',
        alt: '해링턴 스퀘어 과천 조감도',
        order: 0,
        type: 'EXTERIOR'
      }
    });
    console.log('✅ 해링턴 스퀘어 과천 이미지 업데이트 완료!');
  }

  // 3. 과천 렉서 오피스텔
  const lexer = await prisma.property.findFirst({
    where: { title: { contains: '렉서' } }
  });

  if (lexer) {
    await prisma.propertyImage.deleteMany({ where: { propertyId: lexer.id } });
    await prisma.propertyImage.create({
      data: {
        propertyId: lexer.id,
        url: '/과천 렉서 오피스텔.jpg',
        alt: '과천 렉서 오피스텔 조감도',
        order: 0,
        type: 'EXTERIOR'
      }
    });
    console.log('✅ 과천 렉서 오피스텔 이미지 업데이트 완료!');
  }

  console.log('\n🎉 로컬 이미지 업데이트 완료!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
