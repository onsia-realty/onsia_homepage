import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingContact } from "@/components/FloatingContact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ONSIA - 분양권 투자 플랫폼",
  description: "온시아 공인중개사가 엄선한 프리미엄 분양권 매물 정보",
  verification: {
    google: "9lrEwNdce4bdybKgjFlxhkeKjV5UQ_4HgCnpNEoxFa8",
    other: {
      "naver-site-verification": "ec355c26115ad7c0838324e1f82379469a3194ad",
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
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
