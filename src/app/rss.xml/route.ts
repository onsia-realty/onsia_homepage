import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = 'https://www.onsia.city';

  // 매물 목록 조회
  const properties = await prisma.property.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      description: true,
      city: true,
      district: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  const rssItems = properties.map(property => `
    <item>
      <title><![CDATA[${property.title}]]></title>
      <link>${baseUrl}/properties/${property.id}</link>
      <guid>${baseUrl}/properties/${property.id}</guid>
      <description><![CDATA[${property.city} ${property.district} - ${property.description?.slice(0, 200) || '분양권 투자 매물'}]]></description>
      <pubDate>${new Date(property.createdAt).toUTCString()}</pubDate>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ONSIA - 분양권 투자 플랫폼</title>
    <link>${baseUrl}</link>
    <description>프리미엄 분양권 투자 매물 정보를 제공하는 ONSIA입니다.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
