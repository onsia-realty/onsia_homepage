import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  const properties = await prisma.property.findMany({
    where: {
      title: {
        notIn: ['용인 경남아너스빌', '신광교 클라우드시티', '이천 부발역 에피트']
      }
    },
    orderBy: { title: 'asc' }
  });

  console.log('=== 정보 확인이 필요한 17개 현장 ===\n');

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const basePrice = p.basePrice ? (Number(p.basePrice) / 100000000).toFixed(1) + '억' : '❌ 없음';
    const pricePerPyeong = p.pricePerPyeong ? (Number(p.pricePerPyeong) / 10000).toFixed(0) + '만원' : '❌ 없음';
    let moveIn = '❌ 없음';
    if (p.moveInDate) {
      try {
        const d = new Date(p.moveInDate);
        if (!isNaN(d.getTime())) moveIn = d.toISOString().slice(0,7);
      } catch {}
    }
    const desc = p.description ? p.description.slice(0,50) + '...' : '❌ 없음';

    console.log('[' + (i+1) + '] ' + p.title);
    console.log('    위치: ' + p.city + ' ' + p.district);
    console.log('    분양가: ' + basePrice);
    console.log('    평당가: ' + pricePerPyeong);
    console.log('    세대수: ' + (p.totalUnits || '❌ 없음'));
    console.log('    입주예정: ' + moveIn);
    console.log('    시공사: ' + (p.constructor || '❌ 없음'));
    console.log('    핵심특징: ' + (p.keyFeature || '❌ 없음'));
    console.log('    설명: ' + desc);
    console.log('');
  }

  console.log('총 ' + properties.length + '개 현장');
}

checkData().catch(console.error).finally(() => prisma.$disconnect());
