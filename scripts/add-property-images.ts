import { PrismaClient, ImageType } from '@prisma/client';

const prisma = new PrismaClient();

// 기존에 적용됐던 현장별 원본 이미지 매핑
const propertyImages: Record<string, { url: string; alt: string }> = {
  // === 기존 8개 현장 ===
  '클라우드시티': {
    url: '/property-1-gwanggyo-cloud-new.png',
    alt: '신광교 클라우드시티 조감도'
  },
  '경남아너스빌': {
    url: '/property-2-yongin-honors-new.png',
    alt: '용인 경남아너스빌 조감도'
  },
  '부발역': {
    url: '/property-3-bubal-station.png',
    alt: '이천 부발역 에피트 조감도'
  },
  '운정': {
    url: 'https://stqnq5ux4599.edge.naverncp.com/data2/content/image/2025/11/24/.cache/512/20251124500431.png',
    alt: '운정 아이파크 포레스트 조감도'
  },
  '렉서': {
    url: 'https://e-model.co.kr/wp-content/uploads/2023/04/과천-렉서-메인.jpg',
    alt: '과천 렉서 오피스텔 조감도'
  },
  '해링턴': {
    url: 'https://img.hankyung.com/photo/202511/01.42483959.1.jpg',
    alt: '해링턴 스퀘어 과천 조감도'
  },
  '천안': {
    url: '/천안휴먼빌.jpg',
    alt: '천안 휴먼빌 퍼스트시티 조감도'
  },
  '중흥': {
    url: 'https://cdn.apnews.kr/news/photo/202512/3043122_72504_136.jpg',
    alt: '중흥S-클래스 힐더포레 조감도'
  },
  // === 신규 12개 현장 ===
  '검단 동부센트레빌': {
    url: 'https://img.hankyung.com/photo/202508/AA.41449293.1.jpg',
    alt: '검단 동부센트레빌 에듀시티 조감도'
  },
  '힐스테이트': {
    url: 'https://img1.newsis.com/2025/07/16/NISI20250716_0001894502_web.jpg',
    alt: '회룡역 힐스테이트 조감도'
  },
  '씨엘로네': {
    url: '/properties/cheongnyangni-ciellone.png',
    alt: '청량리 범양레우스 씨엘로네 조감도'
  },
  '예미지': {
    url: '/properties/daegu-yemiji.png',
    alt: '금성백조 예미지 대구 아양 조감도'
  },
  '이천 롯데캐슬': {
    url: 'https://lottecastle.co.kr/files/etc/2020/10/202010160931502410.jpg',
    alt: '이천 롯데캐슬 센트럴 페라즈 스카이 조감도'
  },
  '탑석 푸르지오': {
    url: 'https://img.hankyung.com/photo/202509/AA.41667544.1.jpg',
    alt: '탑석 푸르지오 파크7 조감도'
  },
  '루미엘': {
    url: 'https://image.ajunews.com/content/image/2025/09/11/20250911111606696975.jpg',
    alt: '인천 학익 루미엘 조감도'
  },
  '스위첸': {
    url: 'https://img.hankyung.com/photo/202506/AA.40967400.1.jpg',
    alt: '김포 오퍼스 한강 스위첸 조감도'
  },
  '이안 힐스': {
    url: 'https://i3n.news1.kr/system/photos/2025/5/29/7315660/high.jpg',
    alt: '이안 힐스 더원 동작 조감도'
  },
  'AK푸르지오': {
    url: '/properties/singil-ak-prugio.png',
    alt: '신길 AK푸르지오 조감도'
  },
  '모아엘가': {
    url: 'https://wimg.heraldcorp.com/news/cms/2025/07/01/news-p.v1.20250701.b1dc55dba0504e7bbb4aad8c954e50da_P2.jpg',
    alt: '천왕역 모아엘가트레뷰 조감도'
  },
  '광명 퍼스트': {
    url: 'https://cfnimage.commutil.kr/phpwas/restmb_allidxmake.php?pp=002&idx=999&simg=20210726083147074410583674372175114235199.jpg&nmt=18',
    alt: '광명 퍼스트 스위첸 조감도'
  },
};

async function main() {
  console.log('🖼️ 현장별 원본 이미지 적용 시작...\n');

  // 모든 매물 가져오기
  const properties = await prisma.property.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`총 ${properties.length}개 매물 발견\n`);

  for (const property of properties) {
    // 현장명에 맞는 이미지 찾기
    let matchedImage: { url: string; alt: string } | null = null;
    let matchedKeyword = '';

    for (const [keyword, imageData] of Object.entries(propertyImages)) {
      if (property.title.includes(keyword)) {
        matchedImage = imageData;
        matchedKeyword = keyword;
        break;
      }
    }

    if (matchedImage) {
      // 기존 이미지 삭제
      await prisma.propertyImage.deleteMany({
        where: { propertyId: property.id }
      });

      // 새 이미지 추가
      await prisma.propertyImage.create({
        data: {
          url: matchedImage.url,
          alt: matchedImage.alt,
          order: 0,
          type: ImageType.EXTERIOR,
          propertyId: property.id,
        }
      });
      console.log(`✅ ${property.title} → ${matchedImage.url.substring(0, 50)}...`);
    } else {
      console.log(`⚠️ ${property.title}: 이미지 매핑 없음`);
    }
  }

  // 최종 확인
  console.log('\n=== 최종 이미지 현황 ===\n');
  const allProperties = await prisma.property.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  allProperties.forEach(p => {
    const img = p.images.length > 0 ? p.images[0].url.substring(0, 60) + '...' : '(없음)';
    console.log(`[${p.featured ? '추천' : '일반'}] ${p.title}`);
    console.log(`   └─ ${img}\n`);
  });

  console.log('🎉 현장별 원본 이미지 적용 완료!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
