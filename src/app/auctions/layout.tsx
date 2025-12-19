import type { Metadata } from 'next';
import Script from 'next/script';

const auctionsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": "https://www.onsia.city"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "경매정보",
          "item": "https://www.onsia.city/auctions"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://www.onsia.city/auctions#webpage",
      "url": "https://www.onsia.city/auctions",
      "name": "경매정보 - 부동산 법원경매 물건",
      "isPartOf": {
        "@id": "https://www.onsia.city/#website"
      },
      "about": {
        "@type": "Thing",
        "name": "부동산 법원경매"
      },
      "description": "전국 법원경매 부동산 물건 정보. 아파트, 다세대, 오피스텔 경매 물건.",
      "inLanguage": "ko-KR"
    },
    {
      "@type": "ItemList",
      "name": "경매 물건 목록",
      "description": "전국 법원경매 부동산 물건 목록",
      "url": "https://www.onsia.city/auctions",
      "itemListOrder": "https://schema.org/ItemListOrderDescending"
    }
  ]
};

export const metadata: Metadata = {
  title: '경매정보 - 부동산 법원경매 물건 | ONSIA',
  description: '전국 법원경매 부동산 물건 정보! 아파트, 다세대, 오피스텔 경매 물건을 한눈에. 감정가, 최저가, 경매일정, 입찰가이드까지 제공. 수익률 높은 경매 투자 시작하세요.',
  keywords: ['법원경매', '부동산 경매', '경매 물건', '아파트 경매', '경매 투자', '감정가', '낙찰가', '경매 일정', '경매 입찰'],
  openGraph: {
    title: '경매정보 - 부동산 법원경매 물건 | ONSIA',
    description: '전국 법원경매 부동산 물건 정보! 감정가, 최저가, 경매일정과 입찰가이드.',
    url: 'https://www.onsia.city/auctions',
    siteName: 'ONSIA - 온시아 부동산',
    images: [
      {
        url: 'https://www.onsia.city/og-auctions.png',
        width: 1200,
        height: 630,
        alt: 'ONSIA 경매정보',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '경매정보 - 부동산 법원경매 물건 | ONSIA',
    description: '전국 법원경매 부동산 물건 정보! 감정가, 최저가, 경매일정.',
    images: ['https://www.onsia.city/og-auctions.png'],
  },
  alternates: {
    canonical: 'https://www.onsia.city/auctions',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function AuctionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="auctions-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(auctionsJsonLd) }}
      />
      {children}
    </>
  );
}
