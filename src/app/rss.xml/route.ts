import { getAPTSubscriptions, getOfficetelSubscriptions } from '@/lib/cheongyakApi';

// 분양권 매물 상세(/properties/[id])는 로그인 필수라 피드에서 제외 — 청약 정보만 노출
export async function GET() {
  const baseUrl = 'https://www.onsia.co.kr';

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
    <title>온시아 ONSIA | 부동산 IT 전문기업</title>
    <link>${baseUrl}</link>
    <description>부동산 IT 전문기업 온시아 — 전국 아파트·오피스텔 청약 일정과 분양 정보</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${subscriptionItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
