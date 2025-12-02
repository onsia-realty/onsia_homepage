import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 매물별 이미지 매핑
  const imageMapping = [
    { titleKeyword: '클라우드시티', imageUrl: '/property-1-gwanggyo-cloud-new.png', alt: '신광교 클라우드시티 조감도' },
    { titleKeyword: '경남아너스빌', imageUrl: '/property-2-yongin-honors-new.png', alt: '용인 경남아너스빌 조감도' },
    { titleKeyword: '부발역', imageUrl: '/property-3-bubal-station.png', alt: '이천 부발역 에피트 조감도' },
  ];

  for (const mapping of imageMapping) {
    const property = await prisma.property.findFirst({
      where: { title: { contains: mapping.titleKeyword } },
      include: { images: true }
    });

    if (!property) {
      console.log(`❌ ${mapping.titleKeyword} 매물을 찾을 수 없습니다.`);
      continue;
    }

    // 기존 이미지가 없으면 추가
    if (property.images.length === 0) {
      await prisma.propertyImage.create({
        data: {
          url: mapping.imageUrl,
          alt: mapping.alt,
          order: 0,
          type: 'EXTERIOR',
          propertyId: property.id
        }
      });
      console.log(`✅ ${property.title} -> ${mapping.imageUrl} 추가됨`);
    } else {
      console.log(`⏭️ ${property.title} -> 이미 이미지 있음: ${property.images[0].url}`);
    }
  }

  // 최종 확인
  console.log('\n=== 최종 이미지 현황 ===\n');
  const allProperties = await prisma.property.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  allProperties.forEach(p => {
    const img = p.images.length > 0 ? p.images[0].url : '(없음)';
    console.log(`[${p.featured ? '추천' : '일반'}] ${p.title} -> ${img}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
