import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const props = await prisma.property.findMany({
    select: { title: true, keyFeature: true, keyFeatures: true }
  });

  console.log('=== 특장점 데이터 확인 ===\n');

  props.forEach(p => {
    const hasFeatures = p.keyFeatures ? '✅' : '❌';
    console.log(`${hasFeatures} ${p.title}`);
    console.log(`   keyFeature: ${p.keyFeature || '없음'}`);
    if (p.keyFeatures) {
      const features = JSON.parse(p.keyFeatures);
      console.log(`   keyFeatures: ${features.length}개`);
    }
    console.log('');
  });

  await prisma.$disconnect();
}

main();
