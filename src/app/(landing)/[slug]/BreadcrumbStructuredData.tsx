// 랜딩 페이지 BreadcrumbList JSON-LD
// 검색 결과에서 사이트 카테고리 대신 단지명이 노출되도록 페이지별 빵부스러기 주입.
// 야목은 YamokStructuredData에 통합되어 있으므로 이 컴포넌트를 사용하지 않음.

interface Props {
  /** 검색 결과에 표시될 단지명 (예: "왕십리역 어반홈스") */
  projectName: string
  /** 한글 canonical URL (예: "https://www.onsia.city/왕십리역어반홈스") */
  pageUrl: string
}

export default function BreadcrumbStructuredData({ projectName, pageUrl }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://www.onsia.city',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: projectName,
        item: pageUrl,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
