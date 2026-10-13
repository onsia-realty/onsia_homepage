import type { Metadata } from 'next';
import OnsiaHome from '@/components/onsia-home/OnsiaHome';

const HOME_DESC = 'AI 영상·쇼츠 제작, AI 홍보·온라인 마케팅, 홈페이지·랜딩 제작, 1군 브랜드 분양현장 대행, 공인중개사 사무소 운영까지. 부동산을 가장 잘 아는 IT 기업, 온시아.';

export const metadata: Metadata = {
  title: { absolute: '온시아 ONSIA | 부동산 IT 전문기업' },
  description: HOME_DESC,
  alternates: { canonical: 'https://www.onsia.co.kr/' },
  openGraph: { title: '온시아 ONSIA | 부동산 IT 전문기업', description: HOME_DESC, url: 'https://www.onsia.co.kr/' },
  twitter: { title: '온시아 ONSIA | 부동산 IT 전문기업', description: '부동산을 가장 잘 아는 IT 기업, 온시아.' },
};

// 홈 전용 BreadcrumbList (네이버/구글 검색 결과에 사이트 카테고리 노출용)
// 랜딩 페이지는 자체 빵부스러기를 별도 주입하므로 여기 들어가지 않음.
const homeBreadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://www.onsia.co.kr/#breadcrumb',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '온시아', item: 'https://www.onsia.co.kr/' },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbJsonLd) }}
      />
      <OnsiaHome />
    </>
  );
}
