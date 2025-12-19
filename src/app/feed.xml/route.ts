export async function GET() {
  const baseUrl = 'https://www.onsia.city';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ONSIA - 부동산 AI 플랫폼</title>
    <link>${baseUrl}</link>
    <description>AI 기반 부동산 정보 플랫폼. 분양권, 경매, 청약 정보를 한눈에 확인하세요.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>분양권 매물 정보</title>
      <link>${baseUrl}/properties</link>
      <description>온시아가 엄선한 프리미엄 분양권 매물을 확인하세요.</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/properties</guid>
    </item>
    <item>
      <title>청약 정보</title>
      <link>${baseUrl}/subscriptions</link>
      <description>전국 청약 매물 정보를 실시간으로 확인하세요.</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/subscriptions</guid>
    </item>
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
