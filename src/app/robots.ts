import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { LANDING_DOMAINS } from '@/lib/landing-slugs';

export default async function robots(): Promise<MetadataRoute.Robots> {
  // 접속 도메인 기준 baseUrl 결정 (전용 랜딩 도메인 → 자기 도메인 / 그 외 → onsia.city)
  const host = ((await headers()).get('host') || '').toLowerCase().split(':')[0];
  const apex = host.replace(/^www\./, '');
  const isLandingDomain = apex in LANDING_DOMAINS;
  const baseUrl = isLandingDomain ? `https://${apex}` : 'https://www.onsia.city';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/og-'],
      },
      {
        userAgent: 'Yeti',  // 네이버
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Daumoa',  // 다음
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
