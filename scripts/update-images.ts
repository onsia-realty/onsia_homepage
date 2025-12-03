import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImages() {
  // 금성백조 예미지 대구 아양
  const daegu = await prisma.property.findFirst({
    where: { title: { contains: '금성백조' } },
    include: { images: true }
  });
  
  // 신길 AK푸르지오
  const singil = await prisma.property.findFirst({
    where: { title: { contains: '신길' } },
    include: { images: true }
  });
  
  // 청량리 범양레우스
  const cheongnyangni = await prisma.property.findFirst({
    where: { title: { contains: '청량리' } },
    include: { images: true }
  });

  console.log('찾은 매물:');
  console.log('- 금성백조:', daegu?.title, '(이미지:', daegu?.images.length, '개)');
  console.log('- 신길:', singil?.title, '(이미지:', singil?.images.length, '개)');
  console.log('- 청량리:', cheongnyangni?.title, '(이미지:', cheongnyangni?.images.length, '개)');

  // 이미지 URL 업데이트
  if (daegu?.images[0]) {
    await prisma.propertyImage.update({
      where: { id: daegu.images[0].id },
      data: { url: '/onsia_realty_Hyper-realistic_aerial_drone_photography_of_a_ri_b465d22a-9caa-48e8-b411-371f0e9d00b5_0.png' }
    });
    console.log('✅ 금성백조 이미지 업데이트 완료');
  }

  if (singil?.images[0]) {
    await prisma.propertyImage.update({
      where: { id: singil.images[0].id },
      data: { url: '/onsia_realty_Hyper-realistic_aerial_drone_photography_of_AK_P_1b42d444-a616-432c-b9eb-41ab83b206d7_0.png' }
    });
    console.log('✅ 신길 AK푸르지오 이미지 업데이트 완료');
  }

  if (cheongnyangni?.images[0]) {
    await prisma.propertyImage.update({
      where: { id: cheongnyangni.images[0].id },
      data: { url: '/onsia_realty_Hyper-realistic_aerial_drone_photography_of_prem_27af0e8f-ca27-4eb6-8ee2-935532500aa2_0.png' }
    });
    console.log('✅ 청량리 이미지 업데이트 완료');
  }
}

updateImages().catch(console.error).finally(() => prisma.$disconnect());
