import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.auctionItem.count();
    console.log('Total auction items:', count);
    
    const items = await prisma.auctionItem.findMany({ take: 2 });
    console.log('Items found:', items.length);
    items.forEach(item => {
      console.log('-', item.caseNumber, item.address);
    });
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
