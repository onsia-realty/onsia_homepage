import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const items = await prisma.auctionItem.findMany({
      select: {
        caseNumber: true,
        address: true,
        status: true,
        images: {
          select: { url: true, imageType: true }
        }
      }
    });

    console.log('Found', items.length, 'auction items in Prisma DB:\n');

    items.forEach(item => {
      console.log('Case:', item.caseNumber);
      console.log('Address:', item.address);
      console.log('Status:', item.status);
      console.log('Images count:', item.images?.length || 0);
      if (item.images?.length > 0) {
        item.images.forEach((img, i) => {
          console.log('  Image', i+1 + ':', img.imageType, '-', img.url?.substring(0, 100));
        });
      }
      console.log('---');
    });
  } catch (e) {
    console.log('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
