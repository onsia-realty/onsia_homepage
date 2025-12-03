import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const images = await prisma.propertyImage.findMany({
    include: { property: { select: { title: true } } },
    orderBy: { property: { title: 'asc' } }
  });

  console.log('=== 등록된 이미지 URL 및 파일 존재 여부 ===\n');
  
  let missing = 0;
  let exists = 0;
  
  for (const img of images) {
    const url = img.url;
    if (url.startsWith('/properties/') || url.startsWith('/')) {
      const filePath = path.join('public', url);
      const fileExists = fs.existsSync(filePath);
      const status = fileExists ? '✅' : '❌';
      if (fileExists) exists++; else missing++;
      console.log(status + ' ' + img.property.title);
      console.log('   URL: ' + url);
      console.log('   파일: ' + (fileExists ? '존재함' : '없음!'));
    } else {
      console.log('🌐 ' + img.property.title);
      console.log('   URL: ' + url + ' (외부 URL)');
    }
    console.log('');
  }
  
  console.log('---');
  console.log('파일 존재: ' + exists + '개');
  console.log('파일 없음: ' + missing + '개');
}

main().catch(console.error).finally(() => prisma.$disconnect());
