import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getLandingPages } from '@/lib/supabase-landing';
import { CATEGORIES } from '@/app/(landing)/[slug]/[category]/page';
import { toKoreanSlug, LANDING_DOMAINS, SLUG_TO_DOMAIN } from '@/lib/landing-slugs';

// 사이트맵 전용 청약 API 호출 (캐시 허용)
async function fetchSubscriptionsForSitemap() {
  const API_KEY = process.env.CHEONGYAK_API_KEY || process.env.DATA_GO_KR_API_KEY || '';
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
  // ============================================================
  // 전용 랜딩 도메인(야목역서희스타힐스.xyz 등)으로 접속 시
  //  → 해당 랜딩 URL만 담은 사이트맵 (도메인 단위 색인용)
  //  도메인 루트(/) = 랜딩, 하위(/business 등) = 카테고리 sub-page
  // ============================================================
  const host = ((await headers()).get('host') || '').toLowerCase().split(':')[0];
  const apex = host.replace(/^www\./, '');
  const landingSlug = LANDING_DOMAINS[apex];
  if (landingSlug) {
    const base = `https://${apex}`;
    const now = new Date();
    const entries: MetadataRoute.Sitemap = [
      { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ];
    const cats = CATEGORIES[landingSlug];
    if (cats) {
      Object.keys(cats).forEach((category) => {
        entries.push({
          url: `${base}/${category}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.85,
        });
      });
    }
    return entries;
  }

  const baseUrl = 'https://www.onsia.city';

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // 분양 페이지
    {
      url: `${baseUrl}/subscription`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/subscription/map`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // 분양권 매물
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // 경매
    {
      url: `${baseUrl}/auctions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // AI 부동산시세
    {
      url: `${baseUrl}/market`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // 회사소개
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // 분양 홈페이지 목록
    {
      url: `${baseUrl}/homepage`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // 동적 랜딩페이지 (분양 현장별 메인 + 카테고리 sub-page)
  let landingPages: MetadataRoute.Sitemap = [];
  try {
    const pages = await getLandingPages();
    pages.forEach((p) => {
      // 전용 도메인 보유 슬러그(야목 등)는 onsia.city에서 xyz로 301 → onsia 사이트맵에서 제외
      // (리다이렉트 URL을 사이트맵에 넣지 않음 / 색인 권한을 xyz 사이트맵으로 단일화)
      if (SLUG_TO_DOMAIN[p.slug]) return;
      // 한글 slug는 sitemap 표준(RFC 3986)에 맞춰 percent-encoding
      // (네이버 Yeti가 비표준 URL을 늦게 색인하는 문제 대응)
      const publicSlug = encodeURIComponent(toKoreanSlug(p.slug));
      landingPages.push({
        url: `${baseUrl}/${publicSlug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.95,
      });
      const cats = CATEGORIES[p.slug];
      if (cats) {
        Object.keys(cats).forEach((category) => {
          landingPages.push({
            url: `${baseUrl}/${publicSlug}/${category}`,
            lastModified: new Date(p.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.85,
          });
        });
      }
    });
  } catch (error) {
    console.error('Sitemap: Failed to fetch landing pages', error);
  }

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
      url: `${baseUrl}/subscription/${sub.HOUSE_MANAGE_NO}`,
      lastModified: sub.RCRIT_PBLANC_DE ? new Date(sub.RCRIT_PBLANC_DE) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch subscriptions', error);
  }

  return [...staticPages, ...landingPages, ...propertyPages, ...subscriptionPages];
}
