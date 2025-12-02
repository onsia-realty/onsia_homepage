import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 모든 시행사 조회
  const all = await prisma.developer.findMany();
  console.log('현재 시행사 목록:');
  all.forEach(d => console.log(`  - [${d.id}] ${d.name}`));

  // 깨진 데이터 삭제 (물음표 포함)
  for (const dev of all) {
    if (dev.name.includes('�') || dev.name.includes('?')) {
      console.log(`삭제: ${dev.id}`);
      await prisma.developer.delete({ where: { id: dev.id } });
    }
  }

  // 시행사 미정 있는지 확인
  const existing = await prisma.developer.findFirst({
    where: { name: '시행사 미정' }
  });

  if (!existing) {
    const created = await prisma.developer.create({
      data: { name: '시행사 미정', description: '추후 입력' }
    });
    console.log('생성됨:', created.name);
  } else {
    console.log('이미 존재:', existing.name);
  }

  // 최종 목록
  const final = await prisma.developer.findMany();
  console.log('\n최종 시행사 목록:');
  final.forEach(d => console.log(`  - ${d.name}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
