import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateLoanRatio() {
  // 모든 매물에 기본 중도금 대출 비율 설정
  const result = await prisma.property.updateMany({
    where: {
      loanRatio: null
    },
    data: {
      loanRatio: '60% 무이자'
    }
  });

  console.log(`✅ ${result.count}개 매물에 중도금 대출 비율 설정 완료`);
}

updateLoanRatio().catch(console.error).finally(() => prisma.$disconnect());
