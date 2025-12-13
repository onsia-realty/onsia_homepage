import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingContact } from "@/components/FloatingContact";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

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
    default: "ONSIA - 분양권 투자 플랫폼",
    template: "%s | ONSIA",
  },
  description: "온시아 공인중개사가 엄선한 프리미엄 분양권 매물 정보. 수도권 분양권, 청약 정보를 한눈에 확인하세요.",
  keywords: ["분양권", "분양권 투자", "청약", "아파트 분양", "수도권 분양", "온시아", "부동산 투자"],
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
    title: "ONSIA - 분양권 투자 플랫폼",
    description: "온시아 공인중개사가 엄선한 프리미엄 분양권 매물 정보. 수도권 분양권, 청약 정보를 한눈에 확인하세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ONSIA - 분양권 투자 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONSIA - 분양권 투자 플랫폼",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
