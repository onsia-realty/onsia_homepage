import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.video.findMany({ take: 5 });
  console.log('Videos in DB:', videos.length);
  videos.forEach(v => console.log('- ' + v.title + ' | ' + v.thumbnail));
}

main().finally(() => prisma.$disconnect());
