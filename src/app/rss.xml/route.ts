import { prisma } from '@/lib/prisma';
import { getAPTSubscriptions, getOfficetelSubscriptions } from '@/lib/cheongyakApi';

export async function GET() {
  const baseUrl = 'https://www.onsia.city';

  // 매물 목록 조회
  const properties = await prisma.property.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: {
      id: true,
      title: true,
      description: true,
      city: true,
      district: true,
      createdAt: true,
    }
  });

  // 청약 정보 조회
  let subscriptions: Array<{
    HOUSE_MANAGE_NO: string;
    HOUSE_NM: string;
    SUBSCRPT_AREA_CODE_NM: string;
    TOT_SUPLY_HSHLDCO: number;
    RCRIT_PBLANC_DE: string;
    RCEPT_BGNDE: string;
    RCEPT_ENDDE: string;
  }> = [];

  try {
    const [aptResult, officetelResult] = await Promise.all([
      getAPTSubscriptions({ perPage: 50 }),
      getOfficetelSubscriptions({ perPage: 50 }),
    ]);
    subscriptions = [...aptResult.data, ...officetelResult.data]
      .sort((a, b) => new Date(b.RCRIT_PBLANC_DE || '').getTime() - new Date(a.RCRIT_PBLANC_DE || '').getTime())
      .slice(0, 50);
  } catch (error) {
    console.error('RSS: Failed to fetch subscriptions', error);
  }

  // 매물 RSS 아이템
  const propertyItems = properties.map(property => `
    <item>
      <title><![CDATA[[분양권] ${property.title}]]></title>
      <link>${baseUrl}/properties/${property.id}</link>
      <guid>${baseUrl}/properties/${property.id}</guid>
      <description><![CDATA[${property.city} ${property.district} - ${property.description?.slice(0, 200) || '분양권 투자 매물'}]]></description>
      <pubDate>${new Date(property.createdAt).toUTCString()}</pubDate>
      <category>분양권</category>
    </item>`).join('');

  // 청약 RSS 아이템
  const subscriptionItems = subscriptions.map(sub => `
    <item>
      <title><![CDATA[[청약] ${sub.HOUSE_NM}]]></title>
      <link>${baseUrl}/subscriptions/${sub.HOUSE_MANAGE_NO}</link>
      <guid>${baseUrl}/subscriptions/${sub.HOUSE_MANAGE_NO}</guid>
      <description><![CDATA[${sub.SUBSCRPT_AREA_CODE_NM} ${sub.HOUSE_NM} - ${sub.TOT_SUPLY_HSHLDCO}세대, 청약접수: ${sub.RCEPT_BGNDE} ~ ${sub.RCEPT_ENDDE}]]></description>
      <pubDate>${sub.RCRIT_PBLANC_DE ? new Date(sub.RCRIT_PBLANC_DE).toUTCString() : new Date().toUTCString()}</pubDate>
      <category>청약</category>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ONSIA - 분양권 투자 &amp; 청약 정보</title>
    <link>${baseUrl}</link>
    <description>프리미엄 분양권 투자 매물과 전국 청약 정보를 제공하는 ONSIA입니다.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${subscriptionItems}
    ${propertyItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
