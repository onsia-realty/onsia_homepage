import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // keyFeatures가 null인 현장 찾기
  const props = await prisma.property.findMany({
    where: { keyFeatures: null },
    select: { id: true, title: true, slug: true }
  });

  console.log('keyFeatures가 없는 현장:', props.length);
  props.forEach(p => console.log(`  ${p.slug} - ${p.title}`));

  // 각 현장별로 업데이트
  for (const p of props) {
    let keyFeature = '';
    let keyFeatures: string[] = [];

    if (p.title.includes('신광교')) {
      keyFeature = '삼성전자 배후수요, 계약금 5%';
      keyFeatures = [
        '삼성 반도체 배후수요 지식산업센터',
        '계약금 5% 중도금 무이자',
        '계약시 축하금 3% 지급',
        '헬스장, 회의실, 골프장 커뮤니티 완비'
      ];
    } else if (p.title.includes('경남아너스빌') || p.title.includes('용인')) {
      keyFeature = '용인 반도체클러스터 수혜';
      keyFeatures = [
        '용인 반도체클러스터 수혜 예정',
        '경강선 연장 수혜 기대',
        '경남아너스빌 브랜드',
        '용인시 신규 분양 기회'
      ];
    } else if (p.title.includes('부발') || p.title.includes('에피트')) {
      keyFeature = '부발역세권, SK하이닉스 수혜';
      keyFeatures = [
        '경강선 부발역 초역세권',
        'SK하이닉스 배후수요 풍부',
        '에피트 브랜드 프리미엄',
        '이천시 역세권 희소가치'
      ];
    }

    if (keyFeatures.length > 0) {
      await prisma.property.update({
        where: { id: p.id },
        data: {
          keyFeature,
          keyFeatures: JSON.stringify(keyFeatures)
        }
      });
      console.log(`✅ ${p.title} 업데이트 완료`);
    }
  }

  await prisma.$disconnect();
}

main();
