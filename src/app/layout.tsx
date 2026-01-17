import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingContact } from "@/components/FloatingContact";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import SessionProvider from "@/components/auth/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ONSIA - 부동산 AI 플랫폼",
    template: "%s | ONSIA",
  },
  description: "AI 기반 부동산 정보 플랫폼. 분양권, 경매, 청약 정보를 한눈에 확인하세요.",
  keywords: ["부동산", "분양권", "경매", "청약", "아파트 분양", "온시아", "부동산 AI", "법원경매"],
  authors: [{ name: "ONSIA" }],
  creator: "ONSIA",
  publisher: "ONSIA",
  metadataBase: new URL("https://www.onsia.city"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.onsia.city",
    siteName: "ONSIA",
    title: "ONSIA - 부동산 AI 플랫폼",
    description: "AI 기반 부동산 정보 플랫폼. 분양권, 경매, 청약 정보를 한눈에 확인하세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ONSIA - 부동산 AI 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONSIA - 부동산 AI 플랫폼",
    description: "온시아 공인중개사가 엄선한 프리미엄 분양권 매물 정보",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "9lrEwNdce4bdybKgjFlxhkeKjV5UQ_4HgCnpNEoxFa8",
    other: {
      "naver-site-verification": "747b33e6d2c3b922c544372795143926dfc0ad82",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.onsia.city/#organization",
      "name": "ONSIA 온시아",
      "url": "https://www.onsia.city",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.onsia.city/logo.png",
        "width": 512,
        "height": 512
      },
      "description": "AI 기반 부동산 정보 플랫폼. 분양권, 경매, 청약 정보 제공",
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+82-2-0000-0000",
        "contactType": "customer service",
        "areaServed": "KR",
        "availableLanguage": "Korean"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.onsia.city/#website",
      "url": "https://www.onsia.city",
      "name": "ONSIA - 부동산 AI 플랫폼",
      "description": "AI 기반 부동산 정보 플랫폼. 분양권, 경매, 청약 정보를 한눈에 확인하세요.",
      "publisher": {
        "@id": "https://www.onsia.city/#organization"
      },
      "inLanguage": "ko-KR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.onsia.city/subscription?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "RealEstateAgent",
      "@id": "https://www.onsia.city/#business",
      "name": "온시아 공인중개사",
      "url": "https://www.onsia.city",
      "image": "https://www.onsia.city/og-image.png",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "서울",
        "addressRegion": "서울특별시",
        "addressCountry": "KR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 37.5665,
        "longitude": 126.9780
      },
      "areaServed": {
        "@type": "Country",
        "name": "대한민국"
      },
      "serviceType": ["분양권 거래", "부동산 경매", "청약 정보", "AI 시세분석"]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
{process.env.NODE_ENV === 'production' && (
          <AnalyticsTracker
            config={{
              apiEndpoint: process.env.NEXT_PUBLIC_TRACKER_API || 'https://tracker-1jtn6j9qy-realtors77-7871s-projects.vercel.app/api/analytics',
              siteSlug: 'onsia-main',
              trackClicks: true,
              trackScroll: true,
              trackMouse: true,
              debugMode: false,
            }}
          />
        )}
        <SessionProvider>
          {children}
          <FloatingContact />
        </SessionProvider>
      </body>
    </html>
  );
}
