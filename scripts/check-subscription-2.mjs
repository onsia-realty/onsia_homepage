#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const subscription = await prisma.subscription.findUnique({
    where: { houseManageNo: '2025000581' },
    select: {
      houseManageNo: true,
      houseName: true,
      address: true,
      avgPricePerPyeong: true,
    },
  });

  console.log(JSON.stringify(subscription, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
