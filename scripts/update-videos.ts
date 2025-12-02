import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎬 영상 데이터 업데이트 시작 (미드저니 이미지 적용)...\n');

  // 기존 영상 삭제
  await prisma.video.deleteMany({});
  console.log('✅ 기존 영상 데이터 삭제 완료');

  // 새 영상 데이터 추가 (미드저니 이미지로 업데이트)
  const newVideos = [
    {
      youtubeId: 'placeholder_1',
      title: '2025 분양권 시장 완전 분석 - 손피거래 트렌드와 투자전략',
      description: '뜨거워진 분양권 시장의 현황을 분석합니다. 손피거래 성행 현상과 청약 경쟁률 급등 원인, 그리고 투자자가 주의해야 할 점을 설명합니다.',
      thumbnail: '/onsia_realty_Aerial_view_of_Seoul_skyline_at_golden_hour_mode_c4b72185-d966-432e-ab5d-7833192165b0_0.png',
      publishedAt: new Date('2025-11-28'),
      duration: '18:32',
      category: '분양권분석',
      tags: JSON.stringify(['분양권', '손피거래', '투자전략']),
      viewCount: 185000,
    },
    {
      youtubeId: 'placeholder_2',
      title: '서울 재개발 핫플레이스 - 노량진·영등포 고밀개발 분석',
      description: '한강벨트 부촌으로 떠오르는 노량진 재개발과 용적률 400% 영등포 고밀개발. 어디가 유망할지 전문가 시각으로 분석합니다.',
      thumbnail: '/onsia_realty_Split_view_transformation_of_Seoul_urban_redevel_3d247222-30af-4289-9169-11abfe42aa44_0.png',
      publishedAt: new Date('2025-11-25'),
      duration: '22:15',
      category: '재개발',
      tags: JSON.stringify(['재개발', '노량진', '영등포', '서울']),
      viewCount: 142000,
    },
    {
      youtubeId: 'placeholder_3',
      title: '지방 미분양 2만가구 시대 - 위기인가 기회인가?',
      description: '역대 최대 수준의 지방 미분양 사태. 투자자 관점에서 봐야 할 지역별 차별화 전략과 저가 매수 타이밍을 분석합니다.',
      thumbnail: '/onsia_realty_Birds_eye_view_of_brand_new_apartment_complex_in_e4e77112-fb09-4a5b-8b9e-805b46750665_0.png',
      publishedAt: new Date('2025-11-20'),
      duration: '15:48',
      category: '시장분석',
      tags: JSON.stringify(['미분양', '지방', '투자기회']),
      viewCount: 98000,
    }
  ];

  for (const video of newVideos) {
    await prisma.video.create({ data: video });
    console.log(`✅ 추가됨: ${video.title}`);
  }

  console.log('\n🎉 미드저니 이미지로 영상 썸네일 업데이트 완료!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
