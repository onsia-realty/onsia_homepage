import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// 사이트맵 전용 청약 API 호출 (캐시 허용)
async function fetchSubscriptionsForSitemap() {
  const API_KEY = process.env.CHEONGYAK_API_KEY || '';
  const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1';

  try {
    const [aptRes, officetelRes] = await Promise.all([
      fetch(`${BASE_URL}/getAPTLttotPblancDetail?page=1&perPage=100`, {
        headers: { 'Authorization': `Infuser ${API_KEY}` },
        next: { revalidate: 3600 } // 1시간 캐시
      }),
      fetch(`${BASE_URL}/getUrbtyOfctlLttotPblancDetail?page=1&perPage=100`, {
        headers: { 'Authorization': `Infuser ${API_KEY}` },
        next: { revalidate: 3600 }
      })
    ]);

    const [aptData, officetelData] = await Promise.all([
      aptRes.json(),
      officetelRes.json()
    ]);

    return [...(aptData.data || []), ...(officetelData.data || [])];
  } catch (error) {
    console.error('Sitemap: Failed to fetch subscriptions', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.onsia.city';

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subscriptions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subscriptions/apt`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/subscriptions/officetel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/subscriptions/remndr`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 동적 매물 페이지
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'AVAILABLE' },
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    propertyPages = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.id}`,
      lastModified: property.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch properties', error);
  }

  // 동적 청약 페이지
  let subscriptionPages: MetadataRoute.Sitemap = [];
  try {
    const allSubscriptions = await fetchSubscriptionsForSitemap();

    subscriptionPages = allSubscriptions.map((sub: { HOUSE_MANAGE_NO: string; RCRIT_PBLANC_DE?: string }) => ({
      url: `${baseUrl}/subscriptions/${sub.HOUSE_MANAGE_NO}`,
      lastModified: sub.RCRIT_PBLANC_DE ? new Date(sub.RCRIT_PBLANC_DE) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch subscriptions', error);
  }

  return [...staticPages, ...propertyPages, ...subscriptionPages];
}
