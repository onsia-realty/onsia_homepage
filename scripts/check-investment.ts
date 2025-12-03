import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkInvestment() {
  const props = await prisma.property.findMany({
    select: { title: true, investmentGrade: true, loanRatio: true },
    take: 15
  });

  console.log('=== 투자등급 및 중도금 대출 비율 확인 ===\n');
  props.forEach(p => {
    console.log(`${p.title}`);
    console.log(`  - 투자등급: ${p.investmentGrade || '없음'}`);
    console.log(`  - 중도금 대출: ${p.loanRatio || '없음'}`);
    console.log('');
  });
}

checkInvestment().catch(console.error).finally(() => prisma.$disconnect());
