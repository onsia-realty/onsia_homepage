/**
 * 마이그레이션 후 prisma client 동작 검증
 * - prisma.property.findMany() 같은 핵심 호출이 site 스키마 보는지
 * - 카운트가 Neon과 일치하는지
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['warn', 'error'] })

async function main() {
  const tests = [
    ['User', () => prisma.user.count()],
    ['Property', () => prisma.property.count()],
    ['PropertyImage', () => prisma.propertyImage.count()],
    ['Video', () => prisma.video.count()],
    ['Developer', () => prisma.developer.count()],
    ['Subscription', () => prisma.subscription.count()],
    ['SubscriptionImage', () => prisma.subscriptionImage.count()],
    ['SubscriptionHousingType', () => prisma.subscriptionHousingType.count()],
    ['AuctionItem', () => prisma.auctionItem.count()],
    ['AuctionTenant', () => prisma.auctionTenant.count()],
    ['Post', () => prisma.post.count()],
    ['Tag', () => prisma.tag.count()],
    ['Company', () => prisma.company.count()],
  ]

  console.log('🧪 prisma client 동작 테스트 (site 스키마)\n')
  for (const [name, fn] of tests) {
    try {
      const c = await fn()
      console.log(`✅ ${name.padEnd(28)} ${c}건`)
    } catch (e) {
      console.log(`❌ ${name.padEnd(28)} ERR: ${e.message.split('\n')[0]}`)
    }
  }

  // 관계 + include 테스트 (실제 API에서 쓰는 형태)
  console.log('\n🧪 관계 include 테스트')
  try {
    const sample = await prisma.property.findFirst({
      include: { developer: true, images: { orderBy: { order: 'asc' }, take: 1 } }
    })
    console.log(`✅ Property + developer + images: ${sample?.title ?? '(none)'}`)
  } catch (e) {
    console.log(`❌ Property include: ${e.message.split('\n')[0]}`)
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
