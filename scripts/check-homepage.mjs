#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const subscriptions = await prisma.subscription.findMany({
    select: {
      houseManageNo: true,
      houseName: true,
      homepage: true,
    }
  });

  console.log('📋 청약 데이터 홈페이지 URL 확인\n');
  subscriptions.forEach(sub => {
    console.log(`${sub.houseName} (${sub.houseManageNo})`);
    console.log(`  Homepage: ${sub.homepage || '없음'}\n`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
